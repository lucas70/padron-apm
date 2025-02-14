import { Meta, StoryFn } from '@storybook/react'
import { Box } from '@mui/material'
import {
  createTheme,
  alpha,
  getContrastRatio,
  ThemeProvider,
  useTheme,
} from '@mui/material/styles'
import FormFullScreen from './FormFullScreen'
import queso from '../../../assets/queso.png'

export default {
  title: 'Páginas/Formularios/Formulario a pantalla completa',
  component: FormFullScreen,
  parameters: {
    docs: {
      description: {
        component: `La plantilla ofrece una estructura estándar para un formulario, integrando componentes de Material-UI y componentes desarrollados dentro del sistema.`,
      },
    },
  },
} as Meta<typeof FormFullScreen>

const Template: StoryFn<typeof FormFullScreen> = (args) => {
  const themeP = useTheme()
  const colorMain = '#F86F03'
  const colorContrast = alpha(colorMain, 0.7)
  const theme = createTheme({
    ...themeP,
    palette: {
      ...themeP.palette,
      primary: {
        main: colorMain,
        light: alpha(colorMain, 0.5),
        dark: alpha(colorMain, 0.9),
        contrastText:
          getContrastRatio(colorContrast, '#fff') > 4.5 ? '#111' : '#fff',
      },
    },
  })
  return (
    <ThemeProvider theme={theme}>
      <Box>
        <FormFullScreen
          imagenProp={args.imagenProp}
          textoNav={args.textoNav}
          textoBar1={args.textoBar1}
          textoBar2={args.textoBar2}
          modulosProp={args.modulosProp}
          mensajeProp={args.mensajeProp}
        />
      </Box>
    </ThemeProvider>
  )
}
export const Ejemplo = Template.bind({})
Ejemplo.storyName = 'Ejemplo 1'
Ejemplo.parameters = {
  docs: {
    description: {
      story: 'Ejemplo del formulario a pantalla completa',
    },
  },
}
Ejemplo.args = {
  imagenProp: queso,
  textoNav: 'Tienda Teoría del Queso',
  textoBar1: 'Armando Paredes',
  textoBar2: 'Jefe de almacén',
  mensajeProp: { id: '/admin/productos', valor: '10' },
  modulosProp: [
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
      label: 'Opciones',
      nombre: 'opciones',
      open: true,
      propiedades: { orden: 2, descripcion: 'Sección de opciones' },
      showed: false,
      subModulo: [
        {
          estado: 'ACTIVO',
          id: '5',
          label: 'Productos',
          nombre: 'productos',
          propiedades: {
            icono: 'storefront',
            orden: 1,
            descripcion: 'Control de productos del sistema',
          },
          url: '/admin/productos',
        },
        {
          estado: 'ACTIVO',
          id: '6',
          label: 'Pedidos',
          nombre: 'pedidos',
          propiedades: {
            icono: 'dvr',
            orden: 2,
            descripcion: 'Pedidos',
          },
          url: '/admin/pedidos',
        },
        {
          estado: 'ACTIVO',
          id: '6',
          label: 'Ventas',
          nombre: 'ventas',
          propiedades: {
            icono: 'receipt',
            orden: 2,
            descripcion: 'Ventas realizadas',
          },
          url: '/admin/ventas',
        },
      ],
      url: '/configuraciones',
    },
  ],
}
