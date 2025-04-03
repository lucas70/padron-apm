import { Box, Button, Card, Divider } from '@mui/material'
import Typography from '@mui/material/Typography'
import { BotonCiudadania } from './BotonCiudadania'
import { useForm } from 'react-hook-form'
import { LoginType } from '../types/loginTypes'
import { FormInputText } from 'src/components/form'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { useAuth } from '@/context/AuthProvider'
import { Constantes } from '@/config/Constantes'
import { useRouter } from 'next/navigation'
import { useFullScreenLoading } from '@/context/FullScreenLoadingProvider'
import { delay } from '@/utils'

const LoginContainer = () => {
  const router = useRouter()

  const { ingresar, progresoLogin } = useAuth()

  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

  const { handleSubmit, control } = useForm<LoginType>({
    defaultValues: {},
  })

  const iniciarSesion = async ({ usuario, contrasena }: LoginType) => {
    await ingresar({ usuario, contrasena })
  }

  return (
    <Card
      sx={{
        borderRadius: 4,
        p: 3,
        px: 4,
      }}
    >
      <form onSubmit={handleSubmit(iniciarSesion)}>
        <Box
          display={'grid'}
          justifyContent={'center'}
          alignItems={'center'}
          sx={{ borderRadius: 12 }}
        >
          <Typography align={'center'} sx={{ fontWeight: '600' }}>
            Inicio de Sesión
          </Typography>
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography
              fontSize={14}
              variant={'body1'}
              color={'text.secondary'}
            >
              Ingresa tus credenciales para iniciar sesión
            </Typography>
          </Box>
          <FormInputText
            id={'usuario'}
            control={control}
            name="usuario"
            label="Usuario"
            size={'medium'}
            labelVariant={'subtitle1'}
            disabled={progresoLogin}
            rules={{ required: 'Este campo es requerido' }}
          />
          <Box sx={{ mt: 1, mb: 1 }}></Box>
          <FormInputText
            id={'contrasena'}
            control={control}
            name="contrasena"
            label="Contraseña"
            size={'medium'}
            labelVariant={'subtitle1'}
            type={'password'}
            disabled={progresoLogin}
            rules={{
              required: 'Este campo es requerido',
              minLength: {
                value: 3,
                message: 'Mínimo 3 caracteres',
              },
            }}
          />
          <Box sx={{ mt: 0.5, mb: 0.5 }}>
            <ProgresoLineal mostrar={progresoLogin} />
          </Box>
          <Box display="flex" flex="1" justifyContent="start">
            <Button
              onClick={async () => {
                mostrarFullScreen()
                await delay(500)
                router.push('/recuperacion')
                ocultarFullScreen()
              }}
              size={'small'}
              variant={'text'}
              disabled={progresoLogin}
              color={'primary'}
            >
              <Typography fontSize={'small'} sx={{ fontWeight: '600' }}>
                ¿Olvidaste tu contraseña?
              </Typography>
            </Button>
          </Box>
          <Box sx={{ height: 15 }}></Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={progresoLogin}
          >
            <Typography sx={{ fontWeight: '600' }}>Iniciar sesión</Typography>
          </Button>
          <Box sx={{ mt: 3 }}>
            <Typography fontSize={'small'} sx={{ fontWeight: '600' }}>
              <Button
                variant="text"
                sx={{ p: 0 }}
                disabled={progresoLogin}
                onClick={async () => {
                  await router.push('solicitud')
                }}
              >
                Regístra tu cuenta temporal
              </Button>
            </Typography>
          </Box>
          <Box sx={{ pt: 2, pb: 2 }}>
            <Divider>
              <Typography color="text.secondary">O</Typography>
            </Divider>
          </Box>
          <BotonCiudadania
            fullWidth
            disabled={progresoLogin}
            altText={'Ingresar con Ciudadanía'}
            accion={() => {
              window.location.href = `${Constantes.baseUrl}/ciudadania-auth`
            }}
          >
            <Typography sx={{ fontWeight: '600', pl: 1, pr: 1 }}>
              Ingresa con Ciudadanía
            </Typography>
          </BotonCiudadania>
          <Box sx={{ mt: 3 }}>
            <Typography variant="body1" textAlign="center" fontSize={14}>
              ¿No tienes una cuenta?{' '}
              <Button
                variant="text"
                sx={{ p: 0 }}
                disabled={progresoLogin}
                onClick={async () => {
                  await router.push('registro')
                }}
              >
                Regístrate
              </Button>
            </Typography>
          </Box>
        </Box>
      </form>
    </Card>
  )
}

export default LoginContainer
