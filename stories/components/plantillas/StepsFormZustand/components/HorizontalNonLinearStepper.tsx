import { ReactNode, useRef, useState } from 'react'
import { delay } from '@/utils'
import { imprimir } from '@/utils/imprimir'

import {
  Alert,
  Box,
  Button,
  Card,
  Fade,
  Grid,
  LinearProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import { Form1Ref, Form2Ref, Form3Ref } from './stepContainer'
import ContenedorPasoFinal from './stepContainer/ContenedorPasoFinal'
import ContenedorPasoInicial from './stepContainer/ContenedorPasoInicial'
import ContenedorPasoVerificacion from './stepContainer/ContenedorPasoVerificacion'
import Form1 from './stepContainer/Form1'
import Form2 from './stepContainer/Form2'
import Form3 from './stepContainer/Form3'
import { useFormStepStore } from './StepsForm-store'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'

interface PasoType {
  textoTitulo?: string
  descripcion: boolean
  textoDescripcion?: string
  componente: ReactNode
  anterior: boolean
  textoBoton: string
  accionSiguiente: () => Promise<void> | undefined
  accionAnterior: () => Promise<void> | undefined
}

export const HorizontalNonLinearStepper = () => {
  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  const formData = useFormStepStore((state) => state.formData)

  const [pasoActivo, setPasoActivo] = useState(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [todosPasosCompletados, setTodosPasosCompletados] = useState(false)

  const refForm1 = useRef<Form1Ref>()
  const refForm2 = useRef<Form2Ref>()
  const refForm3 = useRef<Form3Ref>()

  const accionSiguiente = async () => {
    if (pasoActivo + 1 < pasos.length) {
      const nuevoPasoActivo = pasoActivo + 1
      imprimir(`nuevoPasoActivo: ${nuevoPasoActivo}`)
      setLoading(true)
      await delay(1000)
      setPasoActivo(nuevoPasoActivo)
      setLoading(false)
      if (xs) window.scrollTo(0, 0)
    }
  }

  const accionAnterior = async () => {
    setLoading(true)
    await delay(1000)
    setPasoActivo((prevActiveStep) => prevActiveStep - 1)
    setLoading(false)
    if (xs) window.scrollTo(0, 0)
  }

  const finConfig = async () => {
    try {
      setLoading(true)
      await delay(300)
      imprimir('DATA:', formData)
    } catch (e) {
      imprimir(`Error: ${e}`)
    } finally {
      setLoading(false)
    }
  }

  const pasos: Array<PasoType> = [
    {
      descripcion: false,
      componente: <ContenedorPasoInicial />,
      anterior: false,
      textoBoton: 'Empezar',
      accionAnterior: accionAnterior,
      accionSiguiente: async () => {
        await accionSiguiente()
      },
    },
    {
      textoTitulo: 'Registro de datos personales',
      descripcion: true,
      textoDescripcion:
        'Este formulario te permite ingresar tus datos personales para fines de identificación y contacto. Proporciona tu nombre completo, incluyendo primer, segundo apellido y cualquier otro dato relevante.',
      componente: <Form1 ref={refForm1} accionSiguiente={accionSiguiente} />,
      anterior: true,
      textoBoton: 'Siguiente',
      accionAnterior: async () => {
        await accionAnterior()
      },
      accionSiguiente: () => {
        return refForm1.current?.validar()
      },
    },
    {
      textoTitulo: 'Registro de información de contacto',
      descripcion: true,
      textoDescripcion:
        'Completa este formulario con tus datos de contacto, como tu número de teléfono celular, dirección de correo electrónico y número de cédula de identidad (CI). Esta información será utilizada para comunicaciones y verificaciones.',
      componente: <Form2 ref={refForm2} accionSiguiente={accionSiguiente} />,
      anterior: true,
      textoBoton: 'Siguiente',
      accionAnterior: async () => {
        await accionAnterior()
      },
      accionSiguiente: () => {
        return refForm2.current?.validar()
      },
    },
    {
      textoTitulo: 'Registro de detalles de dirección',
      descripcion: true,
      textoDescripcion:
        'Ingresa los detalles de tu dirección residencial en este formulario, incluyendo nombre de la calle, zona, código postal y cualquier otra información pertinente. Esta información es crucial para fines de envío y localización.',
      componente: <Form3 ref={refForm3} accionSiguiente={accionSiguiente} />,
      anterior: true,
      textoBoton: 'Siguiente',
      accionAnterior: async () => {
        await accionAnterior()
      },
      accionSiguiente: () => {
        return refForm3.current?.validar()
      },
    },
    {
      textoTitulo: 'Verificacion de datos',
      descripcion: false,
      componente: <ContenedorPasoVerificacion />,
      anterior: true,
      textoBoton: 'Terminar',

      accionAnterior: async () => {
        await accionAnterior()
      },

      accionSiguiente: async () => {
        await finConfig().then(() => {
          accionSiguiente()
          setTodosPasosCompletados(true)
        })
      },
    },
    {
      textoTitulo: '¡Terminaste!',
      descripcion: false,
      componente: <ContenedorPasoFinal />,
      anterior: false,
      textoBoton: 'Finalizar',
      accionAnterior: accionAnterior,
      accionSiguiente: async () => {
        await accionSiguiente()
        window.location.reload()
      },
    },
  ]

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      maxWidth={xs ? '100%' : '600px'}
    >
      <Card
        sx={{
          borderRadius: 4,
          px: 4,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflowY: 'auto',
        }}
      >
        <Box py={4}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Fade in={!loading} timeout={500}>
              <Box width={'100%'}>
                <Typography variant="h6" textAlign={'center'}>
                  {pasos[pasoActivo].textoTitulo}
                </Typography>
                {pasos[pasoActivo].descripcion && (
                  <Box mt={2}>
                    <Alert variant="outlined" severity="info">
                      {pasos[pasoActivo].textoDescripcion}
                    </Alert>
                  </Box>
                )}
                <Box py={4} width={'100%'}>
                  {pasos[pasoActivo].componente}
                </Box>
              </Box>
            </Fade>
          </Grid>

          <>
            {!loading && !todosPasosCompletados && (
              <>
                <Box>
                  <LinearProgress
                    sx={{ borderRadius: '2px' }}
                    variant="determinate"
                    value={((pasoActivo + 1) * 100) / (pasos.length - 1)}
                  />
                  <Typography variant="body2" mt={2} textAlign={'center'}>
                    Paso {pasoActivo + 1} de {pasos.length - 1}
                  </Typography>
                </Box>
              </>
            )}

            <Box borderRadius={2}>
              <ProgresoLineal mostrar={loading} />
            </Box>
            {loading && (
              <Typography
                variant="body2"
                mt={2}
                textAlign={'center'}
                color={'secondary.light'}
              >
                Paso {pasoActivo + 1} de {pasos.length - 1}
              </Typography>
            )}

            <Box
              pt={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {pasos[pasoActivo].anterior && (
                <Button
                  type="button"
                  variant="outlined"
                  disabled={pasoActivo === 0 || loading}
                  onClick={pasos[pasoActivo].accionAnterior}
                >
                  <Typography
                    sx={{ fontWeight: 'medium', textTransform: 'none' }}
                  >
                    Anterior
                  </Typography>
                </Button>
              )}
              {pasos[pasoActivo].anterior && <Box sx={{ flex: '1 1 auto' }} />}
              <Button
                variant="contained"
                disabled={loading}
                onClick={async () => {
                  await pasos[pasoActivo]?.accionSiguiente()
                }}
              >
                <Typography
                  sx={{ fontWeight: 'medium', textTransform: 'none' }}
                >
                  {pasos[pasoActivo].textoBoton}
                </Typography>
              </Button>
            </Box>
          </>
        </Box>
      </Card>
    </Grid>
  )
}
