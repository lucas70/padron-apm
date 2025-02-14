import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Button, Fade, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'

import { CrearCuentaType } from '../types/nuevaPassPeticionTypes'
import { useAlerts } from '@/hooks'
import { delay, InterpreteMensajes } from '@/utils'
import { Servicios } from '@/services'
import { Constantes } from '@/config/Constantes'
import { imprimir } from '@/utils/imprimir'
import { Icono } from '@/components/Icono'
import { FormInputText } from 'src/components/form'
import { isValidEmail } from '@/utils/validations'
import { NivelSeguridadPass } from '@/components/utils/NivelSeguridadPass'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { useRouter } from 'next/navigation'
import { useFullScreenLoading } from '@/context/FullScreenLoadingProvider'

const RegistroContainer = () => {
  const [indicadorCarga, setIndicadorCarga] = useState<boolean>(false)

  const [indicadorCreacionCuenta, setIndicadorCreacionCuenta] =
    useState<boolean>(false)

  const router = useRouter()

  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()

  const { handleSubmit, control, reset, watch } = useForm<CrearCuentaType>({
    defaultValues: {},
  })

  const newPassword1Watch = watch('newPassword1')

  const guardarActualizarCuenta = async (data: CrearCuentaType) => {
    await guardarActualizarCuentaPeticion(data)
  }

  const guardarActualizarCuentaPeticion = async (cuenta: CrearCuentaType) => {
    try {
      setIndicadorCarga(true)
      await delay(1000)
      const respuesta = await Servicios.peticion({
        url: `${Constantes.baseUrl}/usuarios/crear-cuenta`,
        method: 'post',
        body: { ...cuenta, contrasenaNueva: cuenta.newPassword1 },
      })
      setIndicadorCreacionCuenta(true)
      imprimir(InterpreteMensajes(respuesta))
    } catch (e) {
      imprimir(`Error al crear o actualizar cuenta: `, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setIndicadorCarga(false)
    }
  }
  const redireccionarInicio = async () => {
    mostrarFullScreen()
    await delay(500)
    router.replace('/login')
    ocultarFullScreen()
  }

  return (
    <Box>
      {indicadorCreacionCuenta && (
        <Fade in={indicadorCreacionCuenta} timeout={500}>
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <Icono fontSize={'large'} color={'success'}>
              check_circle
            </Icono>
            <Box height={'15px'} />
            <Typography sx={{ fontWeight: '600' }} variant={'subtitle2'}>
              ¡Tu cuenta ha sido registrada!
            </Typography>
            <Box height={'15px'} />
            <Typography variant="body2" color="text.secondary">
              Para activar tu cuenta, ingresa al enlace enviado a tu correo
            </Typography>
            <Box height={'15px'} />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              onClick={() => {
                reset()
                setIndicadorCreacionCuenta(false)
                //mostrarLogin()
                router.replace('/login')
              }}
            >
              <Typography sx={{ fontWeight: '600' }}>Entendido</Typography>
            </Button>
          </Box>
        </Fade>
      )}
      {!indicadorCreacionCuenta && (
        <form onSubmit={handleSubmit(guardarActualizarCuenta)}>
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <Icono fontSize={'large'}> person_add</Icono>
            <Box height={'10px'} />
            <Typography sx={{ fontWeight: 'medium' }} variant={'subtitle2'}>
              Formulario de Registro
            </Typography>
          </Box>
          <Box height={'20px'} />
          <Typography variant="body2" color="text.secondary">
            Por favor, ingresa tus datos para registrar tu cuenta.
          </Typography>
          <Box height={'20px'} />
          <Grid>
            <Typography sx={{ fontWeight: '600' }} variant={'subtitle2'}>
              Datos de usuario
            </Typography>
            <Box height={'20px'} />
            <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
              <Grid item xs={12} sm={12} md={12}>
                <FormInputText
                  id={'nombres'}
                  control={control}
                  name="nombres"
                  type={'text'}
                  label="Nombre de usuario"
                  disabled={indicadorCarga}
                  rules={{ required: 'Este campo es requerido' }}
                />
              </Grid>
            </Grid>
            <Box height={'10px'} />
            <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
              <Grid item xs={12} sm={12} md={12}>
                <FormInputText
                  id={'correoElectronico'}
                  control={control}
                  name="correoElectronico"
                  label="Correo electrónico"
                  disabled={indicadorCarga}
                  rules={{
                    required: 'Este campo es requerido',
                    validate: (value) => {
                      if (!isValidEmail(value)) return 'No es un correo válido'
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Box height={'10px'} />
            <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
              <Grid item xs={12} sm={12} md={12}>
                <FormInputText
                  id={'newPassword1'}
                  control={control}
                  name="newPassword1"
                  label="Contraseña"
                  disabled={indicadorCarga}
                  type={'password'}
                  rules={{ required: 'Este campo es requerido' }}
                />
              </Grid>

              {watch('newPassword1') && (
                <Grid item xs={12} sm={12} md={12}>
                  <NivelSeguridadPass pass={newPassword1Watch} />
                </Grid>
              )}
              <Grid item xs={12} sm={12} md={12}>
                <FormInputText
                  id={'newPassword2'}
                  control={control}
                  name="newPassword2"
                  label="Repita su contraseña"
                  disabled={indicadorCarga}
                  type={'password'}
                  rules={{
                    required: 'Este campo es requerido',
                    validate: (value: string) => {
                      if (value != newPassword1Watch)
                        return 'La contraseña no coincide'
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Box height={'20px'} />
          <ProgresoLineal mostrar={indicadorCarga} />
          <Box height={'5px'} />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={indicadorCarga}
          >
            <Typography sx={{ fontWeight: '600' }}>Crear cuenta</Typography>
          </Button>
          <Box height={'10px'} />
          <Button
            type="button"
            variant="outlined"
            disabled={indicadorCarga}
            onClick={redireccionarInicio}
            fullWidth
          >
            <Typography sx={{ fontWeight: '400' }}>Cancelar</Typography>
          </Button>
        </form>
      )}
    </Box>
  )
}
export default RegistroContainer
