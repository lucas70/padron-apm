import { AlertTitle, Box, Button, Grid } from '@mui/material'
import React, { useState } from 'react'
import { useAlerts } from '@/hooks'
import { useRouter } from 'next/navigation'
import { useFullScreenLoading } from '@/context/FullScreenLoadingProvider'
import { useForm } from 'react-hook-form'
import {
  nuevaPassFormType,
  nuevaPassPeticionType,
} from '@/app/login/types/nuevaPassPeticionTypes'
import { delay, encodeBase64, InterpreteMensajes, seguridadPass } from '@/utils'
import { Servicios } from '@/services'
import { imprimir } from '@/utils/imprimir'
import { Constantes } from '@/config/Constantes'
import { Icono } from '@/components/Icono'
import Typography from '@mui/material/Typography'
import { FormInputText } from 'src/components/form'
import { NivelSeguridadPass } from '@/components/utils/NivelSeguridadPass'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'

interface CambioPassParams {
  code: string
}

export const CambioPass = ({ code }: CambioPassParams) => {
  const { Alerta } = useAlerts()
  const [indicadorTareaRealizada, setIndicadorTareaRealizada] =
    useState<boolean>(false)
  const router = useRouter()
  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()
  const [loadingModal, setLoadingModal] = useState<boolean>(false)
  const { handleSubmit, control, watch } = useForm<nuevaPassFormType>({
    defaultValues: {
      newPassword1: '',
      newPassword2: '',
    },
  })

  const validarPass = async ({
    newPassword1,
    newPassword2,
  }: nuevaPassFormType) => {
    if ((await seguridadPass(newPassword1)).score != 4) {
      Alerta({ mensaje: 'La contraseña no es muy segura', variant: 'error' })
      return
    }
    if (newPassword1 != newPassword2) {
      Alerta({
        mensaje: 'La contraseña repetida no coincide',
        variant: 'error',
      })
      return
    }
    await nuevaPassPeticion({
      codigo: code,
      contrasenaNueva: encodeBase64(encodeURI(newPassword1)),
    })
  }

  const nuevaPassPeticion = async (params: nuevaPassPeticionType) => {
    try {
      setLoadingModal(true)
      await delay(1000)
      const respuesta = await Servicios.peticion({
        url: `${Constantes.baseUrl}/usuarios/cuenta/nueva-contrasena`,
        method: 'patch',
        body: params,
      })
      imprimir(InterpreteMensajes(respuesta))
      setIndicadorTareaRealizada(true)
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setLoadingModal(false)
    }
  }

  const redireccionarInicio = async () => {
    mostrarFullScreen()
    await delay(500)
    router.replace('/login')
    ocultarFullScreen()
  }

  const newPassword1Watch = watch('newPassword1')

  return (
    <Box>
      {!indicadorTareaRealizada && (
        <form onSubmit={handleSubmit(validarPass)}>
          <Grid
            container
            direction={'column'}
            justifyContent="space-evenly"
            alignItems={'center'}
          >
            <Icono fontSize={'large'}>password</Icono>
            <Box height={'15px'} />
            <Grid container justifyContent="space-evenly" alignItems={'center'}>
              <AlertTitle>Crea una nueva contraseña</AlertTitle>
            </Grid>
            <Box height={'15px'} />
            <Typography
              variant="body2"
              color="text.secondary"
              align="inherit"
              paddingLeft={2}
            >
              <li>Las contraseñas deben tener 8 caracteres o más.</li>
              <li>
                Las buenas contraseñas son difíciles de adivinar y usan
                palabras, números, símbolos y letras mayúsculas poco comunes.
              </li>
            </Typography>

            <Box height={'20px'} />
            <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
              <Grid item xs={12} sm={12} md={12}>
                <FormInputText
                  id={'newPassword1'}
                  control={control}
                  name="newPassword1"
                  label="Nueva contraseña"
                  disabled={loadingModal}
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
                  label="Repita su nueva contraseña"
                  disabled={loadingModal}
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
            <ProgresoLineal mostrar={loadingModal} />
            <Box height={'15px'} />
            <Grid
              container
              spacing={'10'}
              display={'flex'}
              flexDirection={'column'}
              alignItems={'center'}
            >
              <Grid item sx={{ width: '100%' }}>
                <Button
                  variant={'contained'}
                  disabled={loadingModal}
                  type={'submit'}
                  fullWidth
                >
                  Modificar
                </Button>
              </Grid>
              <Grid item sx={{ width: '100%' }}>
                <Button
                  variant={'outlined'}
                  onClick={redireccionarInicio}
                  disabled={loadingModal}
                  fullWidth
                >
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      )}
      {indicadorTareaRealizada && (
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
          <Icono fontSize={'large'} color={'success'}>
            check_circle
          </Icono>
          <Box height={'20px'} />
          <Typography sx={{ fontWeight: '600' }}>Nueva contraseña</Typography>
          <Box height={'15px'} />
          <Typography variant="body2" color="text.secondary" align="center">
            Recuperaste tu cuenta, inicia sesión con tu nueva contraseña
          </Typography>
          <Box height={'20px'} />
          <Button
            type="button"
            variant="contained"
            onClick={redireccionarInicio}
          >
            <Typography sx={{ fontWeight: '600' }}>Ir al inicio</Typography>
          </Button>
        </Box>
      )}
    </Box>
  )
}
