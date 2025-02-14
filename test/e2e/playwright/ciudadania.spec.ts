import { expect, test } from '@playwright/test'
import { numeroAleatorio } from './utils/generador'
import { imprimir } from '@/utils/imprimir'
import { delay } from '@/utils'

interface CiudadanosPruebaType {
  ci: string
  nombre: string
  apellido_paterno: string
  apellido_materno: string
  telefono: string
  email: string
  fecha_nacimiento: string
}

test('Ciudadanía - Inicio de sesión', async ({ page, isMobile }) => {
  const fs = require('fs')

  const ciudadanos: Array<CiudadanosPruebaType> = JSON.parse(
    fs.readFileSync(process.env.PATH_CIUDADANOS)
  )

  const indice = Math.floor(Math.random() * ciudadanos.length)

  // Asegura que el número siempre tenga 6 dígitos
  const numero6Digitos = String(numeroAleatorio(100000, 999999))
  if (ciudadanos.length == 0) {
    return
  }

  const algunCiudadano = ciudadanos[indice]

  imprimir(algunCiudadano)

  await page.goto('/login')
  await page.getByRole('button', { name: 'Ingresa con Ciudadanía' }).click()
  await page.locator('#username').fill(algunCiudadano.ci)
  await page.locator('#password').fill('Agepic135')

  await Promise.all([
    await delay(500), // TODO: eliminar delay cuando el proveedor de identidad no tenga rate limit
    await page.getByRole('button', { name: 'Continuar' }).click(),
    await delay(500),
  ])

  await delay(500)
  const segundoFactor = await page
    .getByRole('heading', { name: 'Verificación' })
    .isVisible()

  if (segundoFactor) {
    await page.locator('#code').fill(`${numero6Digitos}`)
    await page.getByRole('button', { name: 'Continuar' }).click()
  }

  await delay(500)
  const autorizar = await page
    .getByRole('heading', { name: 'Autorización' })
    .isVisible()

  if (autorizar) {
    await page.getByRole('button', { name: 'Continuar' }).click()
  }

  // en caso de ser móvil
  if (isMobile) await page.getByRole('button', { name: 'menu' }).click()

  /* await page
    .getByRole('button', {
      name: 'Perfil',
      exact: true,
    })
    .click() */
  await page.click("[id='/admin/perfil']")
  const locator = page.getByText(`CI ${algunCiudadano.ci}`)
  await expect(locator).toContainText(`CI ${algunCiudadano.ci}`)
  if (isMobile) {
    await page.getByRole('banner').getByRole('button').nth(2).click()
  } else {
    await page.getByRole('banner').getByRole('button').nth(3).click()
    //await page.getByRole('button', { name: `${algunCiudadano.nombre}` }).click()
  }
  await page.getByText('Cerrar sesión').click()
  await page.getByRole('button', { name: 'Aceptar' }).click()
  await delay(500)
})
