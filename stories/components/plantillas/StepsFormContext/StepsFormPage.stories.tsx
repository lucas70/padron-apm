import { Meta, StoryFn } from '@storybook/react'
import { Box } from '@mui/material'
import StepsFormPageContext from './page'

export default {
  title: 'Plantillas/Formularios/Formulario con pasos (useContext)',
  component: StepsFormPageContext,
  parameters: {
    docs: {
      description: {
        component: `La plantilla ofrece una solución integral para la creación 
                    de registros que requieren la recopilación de información a 
                    través de múltiples formularios. Estos formularios están 
                    organizados de manera lógica y se conectan a través de un 
                    sistema de pasos, también conocidos como steppers. Cada paso 
                    representa una etapa del proceso de registro`,
      },
    },
  },
} as Meta<typeof StepsFormPageContext>

const Template: StoryFn<typeof StepsFormPageContext> = () => {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, backgroundColor: 'background.default' }}
    >
      <StepsFormPageContext />
    </Box>
  )
}
export const Ejemplo = Template.bind({})
Ejemplo.storyName = 'Ejemplo 1'
Ejemplo.parameters = {
  docs: {
    description: {
      story: 'Ejemplo para Formulario con pasos',
    },
  },
}
