'use client'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Constantes } from '@/config/Constantes'
import { useEffect } from 'react'
import { imprimir } from '@/utils/imprimir'
import { Grid, useMediaQuery, useTheme } from '@mui/material'
import Divider from '@mui/material/Divider'
import LoginContainer from '@/app/login/ui/LoginContainer'
import { useAlerts } from '@/hooks'
import { useFullScreenLoading } from '@/context/FullScreenLoadingProvider'
import { delay, InterpreteMensajes } from '@/utils'
import { Servicios } from '@/services'

export default function LoginPage() {
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.only('sm'))
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  const { Alerta } = useAlerts()
  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

  const obtenerEstado = async () => {
    try {
      mostrarFullScreen()
      await delay(1000)
      const respuesta = await Servicios.get({
        url: `${Constantes.baseUrl}/estado`,
        body: {},
        headers: {
          accept: 'application/json',
        },
      })
      imprimir(`Se obtuvo el estado 🙌`, respuesta)
    } catch (e) {
      imprimir(`Error al obtener estado`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      ocultarFullScreen()
    }
  }

  useEffect(() => {
    obtenerEstado().then(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid container justifyContent="space-evenly" alignItems={'center'}>
      <Grid item xl={6} md={5} xs={12}>
        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          minHeight={sm || xs ? '30vh' : '80vh'}
          color={'primary'}
        >
          <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <Typography
              variant={'h4'}
              component="h1"
              fontWeight={'500'}
              align={sm || xs ? 'center' : 'left'}
            >
              ATENCION A ACTORES PRODUCTIVOS MINEROS (SI-APM)
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        xl={0}
        md={0}
        xs={0}
        sx={{
          display: {
            sm: 'none',
            xs: 'none',
            md: 'block',
            xl: 'block',
          },
        }}
      >
        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          minHeight={'80vh'}
        >
          <Divider
            variant={'middle'}
            sx={{ marginTop: '60px', marginBottom: '60px' }}
            orientation="vertical"
            flexItem
          />
        </Box>
      </Grid>
      <Grid item xl={4} md={5} xs={12}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Box
            display={'flex'}
            justifyContent={'space-around'}
            alignItems={'center'}
            color={'primary'}
          >
            <LoginContainer />
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}
