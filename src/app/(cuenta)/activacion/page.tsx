'use client'
import { useEffect, useState } from 'react'
import { useFullScreenLoading } from '@/context/FullScreenLoadingProvider'
import { useRouter, useSearchParams } from 'next/navigation'
import { imprimir } from '@/utils/imprimir'
import { delay, InterpreteMensajes, siteName } from '@/utils'
import { Servicios } from '@/services'
import { Constantes } from '@/config/Constantes'
import { Box, Card, Grid, Typography } from '@mui/material'
import { Icono } from '@/components/Icono'
import Button from '@mui/material/Button'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'

export default function ActivacionPage() {
  const [error, setError] = useState<boolean>(false)
  const [mensaje, setMensaje] = useState<string>('false')

  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()
  const [loading, setLoading] = useState<boolean>(true)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const codigoActivar = searchParams.get('q')

    imprimir(`codigoActivar`, codigoActivar)

    activarPeticion(codigoActivar ?? '').finally()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activarPeticion = async (codigoActivar: string) => {
    try {
      mostrarFullScreen()
      setLoading(true)
      await delay(1000)

      const respuesta = await Servicios.patch({
        url: `${Constantes.baseUrl}/usuarios/cuenta/activacion`,
        body: {
          codigo: codigoActivar,
        },
      })
      setMensaje(InterpreteMensajes(respuesta))
      imprimir(InterpreteMensajes(respuesta))
    } catch (e) {
      setError(true)
      setMensaje(InterpreteMensajes(e))
      imprimir(`Error al desbloquear usuario: `, e)
    } finally {
      setLoading(false)
      ocultarFullScreen()
    }
  }

  const redireccionarInicio = async () => {
    mostrarFullScreen()
    await delay(1000)
    router.replace('/login')
    ocultarFullScreen()
  }

  return (
    <>
      <title>{`Activación de cuenta - ${siteName()}`}</title>
      <Grid
        container
        justifyContent="center"
        alignItems={'start'}
        mt={3}
        style={{ minHeight: '100vh' }}
      >
        <Card
          sx={{
            borderRadius: 4,
            p: 4,
            maxWidth: '450px',
          }}
        >
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
            {!error && !loading && (
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
              >
                <Icono fontSize={'large'} color={'success'}>
                  check_circle
                </Icono>
                <Box height={'20px'} />
                <Typography sx={{ fontWeight: '600' }} variant={'subtitle2'}>
                  Cuenta Activa
                </Typography>
                <Box height={'20px'} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  {mensaje}
                </Typography>
                <Box height={'20px'} />
              </Box>
            )}
            {error && !loading && (
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
              >
                <Icono fontSize={'large'} color={'error'}>
                  cancel
                </Icono>
                <Box height={'20px'} />
                <Typography sx={{ fontWeight: '600' }} variant={'subtitle2'}>
                  Error al activar cuenta
                </Typography>
                <Box height={'20px'} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  {mensaje}
                </Typography>
                <Box height={'20px'} />
              </Box>
            )}
            {loading && (
              <Box>
                <Typography>procesando..</Typography>
                <Box height={'20px'} />
                <ProgresoLineal mostrar={loading} />
              </Box>
            )}
            {!loading && (
              <Button
                type="submit"
                variant="contained"
                onClick={() => {
                  redireccionarInicio().finally()
                }}
              >
                <Typography>Ir al inicio</Typography>
              </Button>
            )}
          </Box>
        </Card>
      </Grid>
    </>
  )
}
