import { expect, test } from '@playwright/test'

test('Usuarios - crear/editar usuario', async ({ page, isMobile }) => {
  const fs = require('fs')

  const usuariosSegipPrueba: Array<SegipPruebaType> = JSON.parse(
    fs.readFileSync(process.env.PATH_SEGIP)
  )

  const indice = Math.floor(Math.random() * usuariosSegipPrueba.length)

  if (usuariosSegipPrueba.length == 0) {
    return
  }

  const algunUsuario = usuariosSegipPrueba.filter(
    (value) => value.Observacion == null
  )[indice]

  if (!algunUsuario) {
    return
  }

  await page.goto(`/login`)
  await page.locator('#usuario').fill('ADMINISTRADOR-TECNICO')
  await page.locator('#contrasena').fill('123')
  await page.getByRole('button', { name: 'Iniciar sesión' }).click()
  // en caso de ser móvil
  if (isMobile) await page.getByRole('button', { name: 'menu' }).click()
  // await page.getByRole('button', { name: 'Usuarios', exact: true }).click()
  await page.click("[id='/admin/usuarios']")
  await page.locator('#agregarUsuario').click()
  await page.locator('#nroDocumento').click()
  await page.locator('#nroDocumento').fill(algunUsuario.NumeroDocumento)
  await page.locator('#nombre').fill(algunUsuario.Nombres)
  await page.locator('#primerApellido').fill(algunUsuario.PrimerApellido ?? '')
  await page
    .locator('#segundoApellido')
    .fill(algunUsuario.SegundoApellido ?? '')
  await page.locator('#fechaNacimiento').fill(algunUsuario.FechaNacimiento)
  await page.locator('#roles').first().click()
  await page.getByRole('option', { name: 'Usuario' }).click()
  await page.getByRole('option', { name: 'Usuario' }).press('Escape')
  await page
    .locator('#correoElectronico')
    .fill(`agepic-${algunUsuario.NumeroDocumento}@yopmail.com`)
  await page.getByRole('button', { name: 'Guardar' }).click()

  await page.waitForResponse((response) => response.url().includes('/usuarios'))

  await page.locator('#accionFiltrarUsuarioToggle').click()
  await page.locator('#nombre').fill(algunUsuario.NumeroDocumento)
  expect(
    page.getByRole('cell', { name: algunUsuario.NumeroDocumento })
  ).toBeDefined()
})

interface SegipPruebaType {
  ComplementoVisible: number
  NumeroDocumento: string
  Complemento: string
  Nombres: string
  PrimerApellido: string
  SegundoApellido: string
  FechaNacimiento: string
  LugarNacimientoPais: string
  LugarNacimientoDepartamento: string
  LugarNacimientoProvincia: string
  LugarNacimientoLocalidad: string
  Observacion: string
}
