import { Box, Grid, Typography } from '@mui/material'
import { Icono } from '@/components/Icono'
import { useFormStepStore } from '../StepsForm-store'

const ContenedorPasoFinal = () => {
  const formData = useFormStepStore((state) => state.formData)

  const opciones: Array<{
    titulo?: string
    icono: string
    descripcion: string
  }> = [
    {
      icono: 'person',
      descripcion: `Gracias por registrarte, ${formData.nombre} ${formData.primerApellido} ${formData.segundoApellido}.`,
    },
    {
      icono: 'check_circle_outline',
      descripcion: `Te informamos que tu registro ha sido exitoso. Tus datos personales y de contacto han sido registrados en nuestro sistema.`,
    },
    {
      icono: 'info',
      descripcion:
        'Si necesitas ayuda o tienes alguna pregunta, no dudes en contactarnos. Estamos aquí para ayudarte.',
    },
  ]

  return (
    <Grid container direction={'column'} alignItems={'center'}>
      <Box>
        {opciones.map((opcion, opcionIndex) => (
          <div key={`opcion-${opcionIndex}`}>
            <Box
              sx={{
                py: 1,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <Icono fontSize={'medium'} color="primary">
                {opcion.icono}
              </Icono>

              <Typography sx={{ pl: 2 }} color="text.secondary">
                {opcion.descripcion}
              </Typography>
            </Box>
          </div>
        ))}
      </Box>
    </Grid>
  )
}

export default ContenedorPasoFinal
