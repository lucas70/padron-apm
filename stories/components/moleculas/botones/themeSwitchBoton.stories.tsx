// import React from 'react'

import { Meta, StoryFn } from '@storybook/react'
import ThemeSwitcherButton from '@/components/botones/ThemeSwitcherButton'

export default {
  title: 'Moléculas/Botones/ThemeSwitchButton',
  component: ThemeSwitcherButton,
  argTypes: {
    accion: {
      type: 'function',
      control: () => {},
    },
  },
  parameters: {
    docs: {
      description: {
        component: `Componente de botón de cambio de tema en React que utiliza íconos de luz y oscuridad de Material UI. El botón cambia entre los modos de tema claro y oscuro y muestra un mensaje emergente que indica el modo actual y el modo al que cambiará si se hace clic en el botón. El componente utiliza el contexto del tema proporcionado por el componente ThemeContext para cambiar el tema.`,
      },
    },
  },
} as Meta<typeof ThemeSwitcherButton>

const Template1: StoryFn<typeof ThemeSwitcherButton> = () => {
  return <ThemeSwitcherButton />
}

export const Default = Template1.bind({})
Default.storyName = 'Switch boton tema'
