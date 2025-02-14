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

export default function DesbloqueoPage() {
  const [mensaje, setMensaje] = useState<string>('')

  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const codigoDesbloqueo = searchParams.get('q')

    imprimir(`codigoDesbloqueo`, codigoDesbloqueo)

    desbloquearPeticion(codigoDesbloqueo ?? '').finally()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const desbloquearPeticion = async (codigoDesbloqueo: string) => {
    try {
      mostrarFullScreen()
      await delay(1000)

      const respuesta = await Servicios.get({
        url: `${Constantes.baseUrl}/usuarios/cuenta/desbloqueo`,
        params: {
          id: codigoDesbloqueo,
        },
      })
      setMensaje(InterpreteMensajes(respuesta))
      imprimir(InterpreteMensajes(respuesta))
    } catch (e) {
      router.replace('/login')
      setMensaje(InterpreteMensajes(e))
      imprimir(`Error al desbloquear usuario: `, e)
    } finally {
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
      <title>{`Desbloqueo tu cuenta - ${siteName()}`}</title>
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
            <Icono fontSize={'large'}> lock_open</Icono>
            <Box height={'20px'} />
            <Typography sx={{ fontWeight: '600' }} variant={'subtitle2'}>
              Cuenta desbloqueada
            </Typography>
            <Box height={'20px'} />
            <Typography variant="body2" color="text.secondary" align="center">
              {mensaje}
            </Typography>
            <Box height={'20px'} />
            <Button
              type="submit"
              variant="contained"
              onClick={() => {
                redireccionarInicio().finally()
              }}
            >
              <Typography>Ir al inicio</Typography>
            </Button>
          </Box>
        </Card>
      </Grid>
    </>
  )
}
