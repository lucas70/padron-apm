// import React from 'react'

import { Meta, StoryFn } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { CustomSwitch } from '@/components/botones/CustomSwitch'

export default {
  title: 'Moléculas/Botones/CustomSwitch',
  component: CustomSwitch,
  argTypes: {
    accion: {
      type: 'function',
      control: () => {},
    },
  },
  parameters: {
    docs: {
      description: {
        component: `Componente que toma una serie de propiedades: titulo, id, marcado, name, color, desactivado y acción. El componente utiliza un Tooltip para mostar mesajes condicionales con la propiedad "titulo", por defecto el color es "primary", la propiedad marcado es tipo "boolean", se muestra segun una condicion. El componente esta personalizado, referencias: [MUI Material Switch Component - AntSwitch](https://mui.com/material-ui/react-switch/)`,
      },
    },
  },
} as Meta<typeof CustomSwitch>

const Template: StoryFn<typeof CustomSwitch> = (args) => (
  <CustomSwitch {...args} />
)

export const Default = Template.bind({})
Default.storyName = 'CustomSwitch'
Default.args = {
  id: 'idcusswi',
  color: 'primary',
  titulo: 'CustomSwitch',
  accion: action('()=>{console.log("Click en CustomSwitch")}'),
}
export const Warning = Template.bind({})
Warning.storyName = 'CustomSwitch Warning'
Warning.args = {
  id: 'idcusswi',
  color: 'warning',
  marcado: true,
  titulo: 'Warning',
}
export const Success = Template.bind({})
Success.storyName = 'CustomSwitch Success'
Success.args = {
  id: 'idcusswi',
  color: 'success',
  marcado: true,
  titulo: 'Success',
}
export const Primary = Template.bind({})
Primary.storyName = 'CustomSwitch Primary'
Primary.args = {
  id: 'idcusswi',
  color: 'primary',
  marcado: true,
  titulo: 'Primary',
}
export const Error = Template.bind({})
Error.storyName = 'CustomSwitch Error'
Error.args = {
  id: 'idcusswi',
  color: 'error',
  marcado: true,
  titulo: 'Primary',
}
export const CheckedDisabled = Template.bind({})
CheckedDisabled.storyName = 'CustomSwitch Marcado Desactivado'
CheckedDisabled.args = {
  id: 'idcusswi',
  color: 'primary',
  marcado: true,
  desactivado: true,
  titulo: 'Desactivado',
}
export const UncheckedDisabled = Template.bind({})
UncheckedDisabled.storyName = 'CustomSwitch No marcado Desactivado'
UncheckedDisabled.args = {
  id: 'idcusswi',
  color: 'primary',
  marcado: false,
  desactivado: true,
  titulo: 'Desactivado',
}
