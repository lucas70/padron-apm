import type { NextPage } from 'next'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import Image from 'next/image'
import camion from './../../../assets/envio-camion.png'
import { useState } from 'react'
import { Icono } from '@/components/Icono'
import { delay } from '@/utils'
import { useForm } from 'react-hook-form'
import { LoginType } from '@/app/login/types/loginTypes'
import { FormInputText } from '@/components/form'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { BotonCiudadania } from '@/app/login/ui/BotonCiudadania'

const TestLogin: NextPage = () => {
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.only('sm'))
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  const [modalLogin, setModalLogin] = useState(false)
  const cerrarModalLogin = async () => {
    setModalLogin(false)
    await delay(500)
  }
  const { control } = useForm<LoginType>({
    defaultValues: {
      usuario: 'ADMINISTRADOR-TECNICO',
      contrasena: '123',
    },
  })
  const progresoLogin = false

  return (
    <Box>
      <Grid item xl={6} md={5} xs={12}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={sm || xs ? '30vh' : '80vh'}
          color={'primary'}
        >
          <Box
            display="flex"
            flexDirection={'column'}
            border={1}
            borderColor={'ActiveCaption'}
            width={{ xs: '85%', sm: '320px'}}
            borderRadius={3}
            paddingY={4}
            paddingX={xs ? 2 : 5}
          >
            <Grid item xs={12}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection={sm || xs ? 'column' : 'row'}
              >
                <Image
                  src={camion}
                  alt={'login'}
                  width="60"
                  height="60"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />
                <Box width={10}></Box>
                <Typography
                  variant={'h6'}
                  component="h6"
                  fontWeight={'500'}
                  align={sm || xs ? 'center' : 'left'}
                >
                  Sistema de Delivery
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexDirection="column"
                mt={2}
              >
                <Typography
                  variant={'body1'}
                  component="h6"
                  fontWeight={'500'}
                  align="center"
                >
                  Acceso para Administradores
                </Typography>
                <Box width={10}></Box>
                <Typography
                  variant={'body2'}
                  component="h6"
                  fontWeight={'300'}
                  align="center"
                >
                  Al ingresar tendrás acceso a los siguientes módulos
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              display={'flex'}
              mt={3}
              justifyContent={'start'}
              flexDirection={'column'}
            >
              <Box
                display="flex"
                alignItems="start"
                //flexDirection={sm || xs ? 'row' : 'column'}
                flexDirection="row"
              >
                <Icono
                  fontSize={'large'}
                  sx={{ color: theme.palette.secondary.main }}
                >
                  local_shipping
                </Icono>
                <Box width={20}></Box>
                <Box display="flex" flexDirection="column">
                  <Typography variant="h6" fontWeight={'600'} fontSize={15}>
                    Gestión de pedidos
                  </Typography>
                  <Typography variant="body1" fontWeight={300} fontSize={13}>
                    Organización y logística de pedidos
                  </Typography>
                </Box>
              </Box>
              <Box height={20}></Box>
              <Box
                display="flex"
                alignItems="start"
                //flexDirection={sm || xs ? 'row' : 'column'}
                flexDirection="row"
              >
                <Icono
                  fontSize={'large'}
                  sx={{ color: theme.palette.secondary.main }}
                >
                  scale
                </Icono>
                <Box width={20}></Box>
                <Box display="flex" flexDirection="column">
                  <Typography variant="h6" fontWeight={'600'} fontSize={15}>
                    Reglas de pesos
                  </Typography>
                  <Typography variant="body1" fontWeight={300} fontSize={13}>
                    Establecer rangos de peso para transporte
                  </Typography>
                </Box>
              </Box>
              <Box height={20}></Box>
              <Box
                display="flex"
                alignItems="start"
                //flexDirection={sm || xs ? 'row' : 'column'}
                flexDirection="row"
              >
                <Icono
                  fontSize={'large'}
                  sx={{ color: theme.palette.secondary.main }}
                >
                  map
                </Icono>
                <Box width={20}></Box>
                <Box display="flex" flexDirection="column">
                  <Typography variant="h6" fontWeight={'600'} fontSize={15}>
                    Zonas de operación
                  </Typography>
                  <Typography variant="body1" fontWeight={300} fontSize={13}>
                    Definir áreas donde se realizaran las entregas
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={20} paddingX={6}>
              <Box sx={{ height: 30 }}></Box>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: theme.palette.primary.main,
                }}
                onClick={() => setModalLogin(true)}
              >
                <Typography sx={{ fontWeight: '600' }}>
                  Iniciar sesión
                </Typography>
              </Button>
            </Grid>
          </Box>
        </Box>
      </Grid>
      <Dialog
        fullWidth={true}
        open={modalLogin}
        onClose={cerrarModalLogin}
        maxWidth="xs"
        scroll="body"
      >
        <DialogTitle>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            p={0}
          >
            <Box />
            <IconButton onClick={cerrarModalLogin} color={'inherit'}>
              <Icono color={'inherit'}>close</Icono>
            </IconButton>
          </Grid>
        </DialogTitle>
        {/* <LoginContainer /> */}
        <form onSubmit={() => {}}>
          <Box
            display={'grid'}
            justifyContent={'center'}
            alignItems={'center'}
            sx={{ borderRadius: 12 }}
            padding={0}
            mb={2}
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
                onClick={async () => {}}
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

            <Box sx={{ pt: 2, pb: 2 }}>
              <Divider>
                <Typography color="text.secondary">O</Typography>
              </Divider>
            </Box>
            <BotonCiudadania
              fullWidth
              disabled={progresoLogin}
              altText={'Ingresar con Ciudadanía'}
              accion={() => {}}
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
                  onClick={async () => {}}
                >
                  Regístrate
                </Button>
              </Typography>
            </Box>
          </Box>
        </form>
      </Dialog>
    </Box>
  )
}
export default TestLogin
