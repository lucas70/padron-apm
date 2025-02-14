import { expect, test } from '@playwright/test'
import { numeroAleatorio, palabraAleatoria } from './utils/generador'
import { Servicios } from '@/services'

test('Registro y activación de cuenta', async ({ page }) => {
  await page.goto('/login')
  // await page.getByRole('button', { name: 'Registrarse', exact: true }).click()
  await page.getByRole('button', { name: 'Regístrate', exact: true }).click()
  const randomNumber = numeroAleatorio(0, 1000)
  const password = [
    palabraAleatoria(),
    palabraAleatoria(),
    numeroAleatorio(1000, 9999),
  ].join('-')

  //await page.getByRole('tab', { name: 'Regístrate' }).click()
  await page.getByLabel('Nombre de usuario').fill(String(randomNumber))
  await page
    .getByLabel('Correo electrónico')
    .fill(`${password}${randomNumber}@yopmail.com`)
  await page.getByLabel('Contraseña', { exact: true }).fill(String(password))
  await page.getByLabel('Repita su contraseña').fill(String(password))
  await page.getByRole('button', { name: 'Crear cuenta' }).click()

  const response = await page.waitForResponse((response1) =>
    response1.url().includes(`/usuarios/crear-cuenta`)
  )
  const data = await response.json()

  // Obtención de código de activación (solo para test)

  const respuestaCodigo = await Servicios.get({
    url: `${process.env.BASE_SERVER_URL}/usuarios/test/codigo/${data.datos.id}`,
  })

  // Activación de cuenta

  await page.goto(`/activacion?q=${respuestaCodigo.datos.codigoActivacion}`)

  const locator = page.getByText(`Cuenta Activa`)
  await expect(locator).toContainText(`Cuenta Activa`)
})
