import { Meta, StoryFn } from '@storybook/react'

import BadgeVariant from '@/components/CustomBadge'

import { ReactNode, useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { MensajeType } from '@/context/SideBarProvider'
import {
  CustomDrawer,
  SidebarModuloType,
} from '@/components/sidebar/CustomDrawer'

export default {
  title: 'Moléculas/Elementos/BadgeSidebar',
  component: BadgeVariant,
  parameters: {
    docs: {
      description: {
        component:
          'El componente BadgeSidebar es una envoltura del componente Badge del framework MUI (Material-UI), diseñado específicamente para mostrar un contador de elementos en el Sidebar. Las opciones de personalización incluyen varias variantes predefinidas, como "primary", "secondary", "neutro", "opacity", "outline", "gradient", "error", "success" y "alert". Este componente se utiliza para proporcionar una indicación visual en el sidebar de un ítem específico. Se utiliza junto con una función que recibe un identificador id y un contenido valor, los cuales se utilizan para agregar un mensaje al Sidebar. Esta función se invoca mediante el uso del contexto useSidebar en un módulo determinado.',
      },
    },
  },
} as Meta<typeof BadgeVariant>

// replica del componente
const Template: StoryFn<typeof BadgeVariant> = (args) => {
  const [mensajes, setMensajes] = useState<MensajeType[]>([
    { id: '/admin/usuarios', valor: args.content },
  ])
  const [modulos, setModulos] = useState<SidebarModuloType[]>([
    {
      estado: 'ACTIVO',
      id: '1',
      label: 'Principal',
      nombre: 'Principal',
      open: true,
      propiedades: { orden: 1, descripcion: 'Sección principal' },
      showed: false,
      subModulo: [
        {
          estado: 'ACTIVO',
          id: '2',
          label: 'Inicio',
          nombre: 'inicio',
          propiedades: {
            icono: 'home',
            orden: 1,
            descripcion: 'Vista de bienvenida con características del sistema',
          },
          url: '/admin/home',
        },
        {
          estado: 'ACTIVO',
          id: '3',
          label: 'Perfil',
          nombre: 'perfil',
          propiedades: {
            icono: 'person',
            orden: 2,
            descripcion: 'Información del perfil de usuario que inicio sesión',
          },
          url: '/admin/perfil',
        },
      ],
      url: '/principal',
    },
    {
      estado: 'ACTIVO',
      id: '4',
      label: 'Configuración',
      nombre: 'configuraciones',
      open: true,
      propiedades: { orden: 2, descripcion: 'Sección de configuraciones' },
      showed: false,
      subModulo: [
        {
          estado: 'ACTIVO',
          id: '5',
          label: 'Usuarios',
          nombre: 'usuarios',
          propiedades: {
            icono: 'manage_accounts',
            orden: 1,
            descripcion: 'Control de usuarios del sistema',
          },
          url: '/admin/usuarios',
        },
        {
          estado: 'ACTIVO',
          id: '6',
          label: 'Parámetros',
          nombre: 'parametros',
          propiedades: {
            icono: 'tune',
            orden: 2,
            descripcion: 'Parámetros generales del sistema',
          },
          url: '/admin/parametros',
        },
      ],
      url: '/configuraciones',
    },
  ])

  const mostrarMensaje = (id: string): ReactNode => {
    return mensajes.find((mensaje) => mensaje.id === id)?.valor
  }
  useEffect(() => {
    setMensajes([{ id: '/admin/usuarios', valor: args.content }])
  }, [args.content])

  return (
    <Box style={{ height: '60vh' }}>
      <CustomDrawer
        variant={'permanent'}
        open={true}
        onClose={() => {}}
        sx={{
          width: 0,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 220,
            boxSizing: 'border-box',
          },
          transition: 'all 0.2s ease-out',
        }}
        rutaActual={'/admin/usuarios'}
        modulos={modulos}
        setModulos={setModulos}
        navigateTo={() => {}}
        badgeVariant={args.variante || ''}
        checkContentBadge={mostrarMensaje}
      />
    </Box>
  )
}

export const PorDefecto = Template.bind({})
PorDefecto.storyName = 'Por defecto'
PorDefecto.args = {
  content: '44',
  variante: 'primary',
}
export const Secondary = Template.bind({})
Secondary.storyName = 'Grey'
Secondary.args = {
  content: '44',
  variante: 'secondary',
}
export const Neutro = Template.bind({})
Neutro.storyName = 'Neutro Color'
Neutro.args = {
  content: '44',
  variante: 'neutro',
}
export const Opacity = Template.bind({})
Opacity.storyName = 'Opacity Color'
Opacity.args = {
  content: '44',
  variante: 'opacity',
}
export const Outline = Template.bind({})
Outline.storyName = 'Outline Border'
Outline.args = {
  content: '44',
  variante: 'outline',
}
export const Gradient = Template.bind({})
Gradient.storyName = 'Gradient Color'
Gradient.args = {
  content: '44',
  variante: 'gradient',
}
export const Error = Template.bind({})
Error.storyName = 'Error Color'
Error.args = {
  content: '44',
  variante: 'error',
}
export const Success = Template.bind({})
Success.storyName = 'Success Color'
Success.args = {
  content: '44',
  variante: 'success',
}
export const Alert = Template.bind({})
Alert.storyName = 'Alert Color'
Alert.args = {
  content: '44',
  variante: 'alert',
}
