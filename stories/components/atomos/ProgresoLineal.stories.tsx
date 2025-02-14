import { Meta, StoryFn } from '@storybook/react'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'

export default {
  title: 'Átomos/Elementos/Progreso Lineal',
  component: ProgresoLineal,
  parameters: {
    docs: {
      description: {
        component: 'Un componente de progreso lineal.',
      },
    },
  },
} as Meta

const Template: StoryFn<typeof ProgresoLineal> = (args) => (
  <ProgresoLineal {...args} />
)

export const Default = Template.bind({})
Default.args = {
  mostrar: true,
}
