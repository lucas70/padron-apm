'use client'
import { useEffect, useState } from 'react'
import { useFullScreenLoading } from '@/context/FullScreenLoadingProvider'
import { useRouter, useSearchParams } from 'next/navigation'
import { imprimir } from '@/utils/imprimir'
import { useAlerts } from '@/hooks'
import { useForm } from 'react-hook-form'
import { delay, InterpreteMensajes, siteName } from '@/utils'
import { Servicios } from '@/services'
import { Constantes } from '@/config/Constantes'
import { Box, Card, Grid, Typography } from '@mui/material'
import { Icono } from '@/components/Icono'
import Button from '@mui/material/Button'
import { FormInputText } from '@/components/form'
import { isValidEmail } from '@/utils/validations'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { CambioPass } from '@/app/login/ui/CambioPass'

export interface correoRecuperarType {
  correo: string
}

export interface codigoRecuperarType {
  codigo: string
}

export default function RecuperacionPage() {
  const [mensaje, setMensaje] = useState<string>('')
  const [code, setCode] = useState<string | undefined>()

  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

  const [indicadorCarga, setIndicadorCarga] = useState<boolean>(false)

  const [indicadorTareaRealizada, setIndicadorTareaRealizada] =
    useState<boolean>(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const codigoDesbloqueo = searchParams.get('q')

    imprimir(`codigoDesbloqueo`, codigoDesbloqueo)

    if (codigoDesbloqueo)
      validarRecuperarPeticion({ codigo: codigoDesbloqueo ?? '' }).finally()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Hook para mostrar alertas
  const { Alerta } = useAlerts()
  const { handleSubmit, control } = useForm<correoRecuperarType>({})

  const recuperarPeticion = async ({ correo }: correoRecuperarType) => {
    try {
      setIndicadorCarga(true)
      await delay(1000)

      const respuesta = await Servicios.post({
        url: `${Constantes.baseUrl}/usuarios/recuperar`,
        body: {
          correoElectronico: correo,
        },
      })
      setMensaje(InterpreteMensajes(respuesta))
      setIndicadorTareaRealizada(true)
      imprimir(InterpreteMensajes(respuesta))
    } catch (e) {
      setMensaje(InterpreteMensajes(e))
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
      imprimir(`Error al desbloquear usuario: `, e)
    } finally {
      setIndicadorCarga(false)
    }
  }

  const validarRecuperarPeticion = async ({ codigo }: codigoRecuperarType) => {
    try {
      setIndicadorCarga(true)
      await delay(1000)

      const respuesta = await Servicios.post({
        url: `${Constantes.baseUrl}/usuarios/validar-recuperar`,
        body: {
          codigo: codigo,
        },
      })
      setCode(respuesta?.datos?.code)
      setMensaje(InterpreteMensajes(respuesta))
      setIndicadorTareaRealizada(true)
      imprimir(InterpreteMensajes(respuesta))
    } catch (e) {
      setMensaje(InterpreteMensajes(e))
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
      imprimir(`Error al validar código de recuperación: `, e)
      await redireccionarInicio()
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
    <>
      <title>{`Recupera tu cuenta - ${siteName()}`}</title>
      <Grid
        container
        justifyContent="center"
        alignItems={'start'}
        style={{ minHeight: '90vh' }}
      >
        <Card
          sx={{
            borderRadius: 4,
            m: 3,
            p: 3,
            maxWidth: '400px',
          }}
        >
          {!code && (
            <Box>
              {indicadorTareaRealizada && (
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'center'}
                >
                  <Icono fontSize={'large'}> mark_email_unread</Icono>
                  <Box height={'20px'} />
                  <Typography sx={{ fontWeight: '600' }}>
                    ¡Mensaje enviado!
                  </Typography>
                  <Box height={'20px'} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    {mensaje}
                  </Typography>
                  <Box height={'25px'} />
                  <Button
                    type="button"
                    variant="contained"
                    disabled={indicadorCarga}
                    onClick={redireccionarInicio}
                  >
                    <Typography sx={{ fontWeight: '600' }}>
                      Ir al inicio
                    </Typography>
                  </Button>
                </Box>
              )}
              {!indicadorTareaRealizada && (
                <form onSubmit={handleSubmit(recuperarPeticion)}>
                  <Box display={'flex'} flexDirection={'column'}>
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      alignItems={'center'}
                    >
                      <Icono fontSize={'large'}> manage_search</Icono>
                      <Box height={'20px'} />
                      <Typography sx={{ fontWeight: '600' }} variant={'h6'}>
                        Recupera tu cuenta
                      </Typography>
                    </Box>
                    <Box height={'20px'} />
                    <Typography variant="body2" color="text.secondary">
                      Ingresa tu correo electrónico, enviaremos un enlace para
                      que puedas recuperar tu cuenta
                    </Typography>
                    <Box height={'20px'} />
                    <FormInputText
                      id={'correo'}
                      control={control}
                      name="correo"
                      type={'email'}
                      label="Correo"
                      size={'small'}
                      disabled={indicadorCarga}
                      rules={{
                        required: 'Este campo es requerido',
                        validate: (value) => {
                          if (!isValidEmail(value))
                            return 'No es un correo válido'
                        },
                      }}
                    />
                    <Box height={'15px'} />
                    <ProgresoLineal mostrar={indicadorCarga} />
                    <Box height={'15px'} />
                    <Grid
                      container
                      spacing={'10'}
                      display={'flex'}
                      flexDirection={'column'}
                      justifyContent={'center'}
                    >
                      <Grid item>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={indicadorCarga}
                          fullWidth
                        >
                          Enviar enlace
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          type="button"
                          variant="outlined"
                          disabled={indicadorCarga}
                          onClick={redireccionarInicio}
                          fullWidth
                        >
                          Cancelar
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </form>
              )}
            </Box>
          )}
          {code && (
            <Box>
              <CambioPass code={code} />
            </Box>
          )}
        </Card>
      </Grid>
    </>
  )
}
