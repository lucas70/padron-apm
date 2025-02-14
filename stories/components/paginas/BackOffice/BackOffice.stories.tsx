import { Meta, StoryFn } from '@storybook/react'
import BackOfficeStory from './BackOfficeSample'
import {
  alpha,
  createTheme,
  getContrastRatio,
  Theme,
  ThemeProvider,
  useTheme,
} from '@mui/material/styles'

import hospital from '../../../assets/hospital.png'
import queso from '../../../assets/queso.png'
import { ColumnaType } from '@/types'
import { MensajeType } from '@/context/SideBarProvider'

interface Palette {
  primary?: {
    main: string
    light?: string
    dark?: string
    contrastText?: string
  }
  secondary?: {
    main: string
    light?: string
    dark?: string
    contrastText?: string
  }
  text?: {
    primary?: string
    secondary?: string
    disabled?: string
  }
  background?: {
    paper?: string
    default?: string
  }
}

interface ThemeVariant {
  palette: Palette
  cardStyle?: {
    border?: string
    backgroundColor?: string
  }
  drawerStyle?: {
    paper?: {
      backgroundColor?: string
    }
    color?: string
  }
  appBarStyle?: {
    backgroundColor?: string
  }
  iconStyle?: {
    color?: string
  }
  tableHeadStyle?: {
    backgroundColor?: string
  }
  tableBodyStyle?: {
    backgroundColor?: string
  }
}

interface ThemeType {
  palette: Palette
  themeVariant?: ThemeVariant
  columnas?: Array<ColumnaType>
  solicitudesData?: Array<any>
  titulo?: string
  modulos?: Array<any>
  mensajeProp?: MensajeType
  imagenProp?: any
  textoNav?: string
  textoBar1?: string
  textoBar2?: string
  textFooter?: string
  editAccion?: boolean
  showAccion?: boolean
  deleteAccion?: boolean
}

export default {
  title: 'Páginas/BackOffice/Back Office',
  component: BackOfficeStory,
  parameters: {
    docs: {
      description: {
        component:
          'La plantilla `Back Office` ofrece una estructura estándar compuesta por componentes desarrollados, que incluyen, `navbar`,`footer`, sidebar`,`customDataTable` y una estructura básica para el landing page',
      },
    },
  },
  argTypes: {
    themeVariant: { control: 'object' },
  },
} as Meta<typeof BackOfficeStory>

export const Template: StoryFn<ThemeType> = (args: ThemeType) => {
  const themeP = useTheme()

  const createCustomTheme = (
    baseTheme: Theme,
    variant?: ThemeVariant | undefined
  ): Theme => {
    if (variant) {
      const {
        cardStyle,
        drawerStyle,
        appBarStyle,
        iconStyle,
        tableHeadStyle,
        tableBodyStyle,
      } = variant
      const themeRet = createTheme({
        ...baseTheme,
        palette: {
          ...baseTheme.palette,
          ...variant.palette,
        },
      })
      if (cardStyle) {
        themeRet.components = {
          MuiCard: {
            styleOverrides: {
              root: {
                border: cardStyle.border,
                boxShadow: 'none',
                backgroundColor: cardStyle.backgroundColor,
              },
            },
          },
        }
      }
      if (drawerStyle) {
        themeRet.components = {
          ...themeRet.components,
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: drawerStyle?.paper?.backgroundColor,
                color: drawerStyle?.color,
              },
            },
          },
        }
      }
      if (appBarStyle) {
        themeRet.components = {
          ...themeRet.components,
          MuiAppBar: {
            defaultProps: {
              elevation: 0,
              variant: 'outlined',
            },
            styleOverrides: {
              colorPrimary: {
                borderTop: 0,
                borderLeft: 0,
                borderRight: 0,
                backgroundColor: appBarStyle?.backgroundColor ?? '#E72929',
                backdropFilter: 'blur(12px)',
              },
            },
          },
        }
      }
      if (iconStyle) {
        themeRet.components = {
          ...themeRet.components,
          MuiIcon: {
            styleOverrides: {
              colorAction: {
                color: iconStyle.color,
              },
            },
          },
        }
      }
      if (tableHeadStyle) {
        themeRet.components = {
          ...themeRet.components,
          MuiTableHead: {
            styleOverrides: {
              root: {
                backgroundColor: tableHeadStyle.backgroundColor,
              },
            },
          },
        }
      }
      if (tableBodyStyle) {
        themeRet.components = {
          ...themeRet.components,
          MuiTableBody: {
            styleOverrides: {
              root: {
                backgroundColor: tableBodyStyle.backgroundColor,
              },
            },
          },
        }
      }
      return themeRet
    } else {
      return createTheme({
        ...baseTheme,
        palette: {
          ...baseTheme.palette,
        },
      })
    }
  }
  const theme = createCustomTheme(themeP, args.themeVariant)
  return (
    <ThemeProvider theme={theme}>
      <BackOfficeStory
        columnas={args.columnas}
        solicitudesData={args.solicitudesData}
        titulo={args.titulo}
        modulosProp={args.modulos}
        mensajeProp={args.mensajeProp}
        imagenProp={args.imagenProp}
        textoNav={args.textoNav}
        textoBar1={args.textoBar1}
        textoBar2={args.textoBar2}
        textFooter={args.textFooter}
        editAccion={args.editAccion}
        showAccion={args.showAccion}
        deleteAccion={args.deleteAccion}
      />
    </ThemeProvider>
  )
}

export const Contenido_1 = Template.bind({})
Contenido_1.storyName = 'Ejemplo - Tienda de quesos'
Contenido_1.args = {
  themeVariant: {
    palette: {
      primary: {
        main: '#4F200D',
        light: alpha('#4F200D', 0.5),
        dark: alpha('#4F200D', 0.9),
        contrastText:
          getContrastRatio(alpha('#4F200D', 0.7), '#fff') > 4.5
            ? '#fff'
            : '#111',
      },
      secondary: {
        main: '#FFBB64',
        light: alpha('#FFBB64', 0.5),
        dark: alpha('#FFBB64', 0.9),
        contrastText:
          getContrastRatio(alpha('#FFBB64', 0.7), '#fff') > 4.5
            ? '#fff'
            : '#111',
      },
      text: {
        primary: '#4F200D',
        secondary: '#4F200D',
        disabled: '#fff',
      },
    },
    tableBodyStyle: {
      // backgroundColor: '#F6F1E9',
    },
    tableHeadStyle: {
      backgroundColor: '#FFEAA7',
    },
    cardStyle: {
      // border: '1px solid #ffecaf',
      backgroundColor: '#fafafa',
    },
    iconStyle: {
      color: '#4F200D',
    },
    drawerStyle: {
      paper: {
        backgroundColor: alpha('#fff', 0.9),
      },
      color: '#4F200D',
    },
    appBarStyle: {
      backgroundColor: alpha('#fff', 0.8),
    },
  },
  columnas: [
    { campo: 'nombre', nombre: 'Nombre del Producto' },
    { campo: 'resumen', nombre: 'Descripción' },
    { campo: 'categoria', nombre: 'Tipo de Queso' },
    { campo: 'fechaPublicacion', nombre: 'Fecha de Ingreso' },
    { campo: 'acciones', nombre: 'Acciones' },
  ],
  solicitudesData: [
    {
      id: '1',
      nombre: 'Queso Gouda',
      categoria: 'Roquefort',
      resumen:
        'Queso semiduro de origen holandés con sabor suave y textura cremosa.',
      fechaPublicacion: '2023-05-30',
    },
    {
      id: '2',
      nombre: 'Queso Cheddar',
      categoria: 'Cheddar',
      resumen:
        'Queso británico de sabor fuerte y característico color amarillo.',
      fechaPublicacion: '2023-06-08',
    },
    {
      id: '3',
      nombre: 'Queso Parmesano',
      categoria: 'Parmesano',
      resumen:
        'Queso italiano de sabor intenso y textura granulada, ideal para rallar.',
      fechaPublicacion: '2023-07-29',
    },
    {
      id: '4',
      nombre: 'Queso Brie',
      categoria: 'Parmesano',
      resumen:
        'Queso francés de corteza blanca y suave textura cremosa en el interior.',
      fechaPublicacion: '2023-07-11',
    },
    {
      id: '5',
      nombre: 'Queso Azul',
      categoria: 'Parmesano',
      resumen:
        'Queso de sabor fuerte y característicos mohos azules, originario de Francia.',
      fechaPublicacion: '2023-06-26',
    },
    {
      id: '6',
      nombre: `Queso Manchego`,
      categoria: 'Manchego',
      resumen:
        'Queso español elaborado con leche de oveja de la región de La Mancha.',
      fechaPublicacion: '2023-01-11',
    },
    {
      id: '7',
      nombre: 'Queso Roquefort',
      categoria: 'Roquefort',
      resumen:
        'Queso francés de pasta azul y sabor intenso, elaborado con leche de oveja.',
      fechaPublicacion: '2023-10-25',
    },
    {
      id: '8',
      nombre: 'Queso Feta',
      categoria: 'Feta',
      resumen:
        'Queso griego de sabor salado y textura crujiente, ideal para ensaladas.',
      fechaPublicacion: '2023-04-05',
    },
    {
      id: '9',
      nombre: 'Queso Gruyere',
      categoria: 'Parmesano',
      resumen:
        'Queso suizo de sabor dulce y textura suave, perfecto para fondues.',
      fechaPublicacion: '2023-08-30',
    },
    {
      id: '10',
      nombre: 'Queso Emmental',
      categoria: 'Parmesano',
      resumen:
        'Queso suizo conocido por sus característicos agujeros y sabor suave.',
      fechaPublicacion: '2023-02-02',
    },
    {
      id: '11',
      nombre: 'Queso Camembert',
      categoria: 'Parmesano',
      resumen:
        'Queso francés similar al Brie pero con un sabor más intenso y terroso.',
      fechaPublicacion: '2023-08-22',
    },
  ],
  titulo: 'Inventario de quesos',
  textoNav: 'Teoría del Queso',
  imagenProp: queso,
  textoBar1: 'Esteban Quito',
  textoBar2: 'Vendedor',
  textFooter: 'Teoría del Queso',
  editAccion: false,
  deleteAccion: false,
}
export const Contenido_2 = Template.bind({})
Contenido_2.storyName = 'Ejemplo - Centro de salud'
Contenido_2.args = {
  themeVariant: {
    palette: {
      primary: {
        main: '#006878',
      },
      secondary: {
        main: '#EAE3D2',
        light: alpha('#EAE3D2', 0.5),
        dark: alpha('#EAE3D2', 0.9),
        contrastText:
          getContrastRatio(alpha('#EAE3D2', 0.7), '#fff') > 4.5
            ? '#fff'
            : '#111',
      },
      text: {
        primary: '#4F200D',
        secondary: '#2C3333',
        disabled: '#fff',
      },
    },
    appBarStyle: {
      backgroundColor: alpha('#fbfcfd', 0.8),
    },
    drawerStyle: {
      paper: {
        backgroundColor: alpha('#fbfcfd', 0.8),
      },
      color: '#fff',
    },
  },
  columnas: [
    { campo: 'nombre', nombre: 'Nombre del Paciente' },
    { campo: 'resumen', nombre: 'Detalle de la Consulta' },
    { campo: 'categoria', nombre: 'Especialidad Médica' },
    { campo: 'fechaPublicacion', nombre: 'Fecha de Reserva' },
    { campo: 'acciones', nombre: 'Acciones' },
  ],
  solicitudesData: [
    {
      id: '1',
      nombre: 'Juan Pérez',
      categoria: 'Cardiología',
      resumen: 'Consulta por dolor en el pecho y dificultad para respirar.',
      fechaPublicacion: '2023-05-30 08:00',
    },
    {
      id: '2',
      nombre: 'María Gómez',
      categoria: 'Dermatología',
      resumen: 'Consulta por erupción cutánea en el rostro.',
      fechaPublicacion: '2023-06-08 10:30',
    },
    {
      id: '3',
      nombre: 'Luis Rodríguez',
      categoria: 'Pediatría',
      resumen: 'Consulta de seguimiento del desarrollo infantil.',
      fechaPublicacion: '2023-07-29 09:15',
    },
    {
      id: '4',
      nombre: 'Ana Martínez',
      categoria: 'Ginecología',
      resumen: 'Consulta por irregularidades menstruales.',
      fechaPublicacion: '2023-07-11 11:45',
    },
    {
      id: '5',
      nombre: 'Carlos Sánchez',
      categoria: 'Oftalmología',
      resumen: 'Consulta por visión borrosa y dolor de cabeza.',
      fechaPublicacion: '2023-06-26 14:00',
    },
    {
      id: '6',
      nombre: 'Laura Fernández',
      categoria: 'Oftalmología',
      resumen: 'Consulta por ansiedad y problemas para conciliar el sueño.',
      fechaPublicacion: '2023-01-11 16:30',
    },
    {
      id: '7',
      nombre: 'Roberto López',
      categoria: 'Oftalmología',
      resumen:
        'Consulta por dolor en la espalda baja y dificultad para moverse.',
      fechaPublicacion: '2023-10-25 15:20',
    },
    {
      id: '8',
      nombre: 'Patricia Ramírez',
      categoria: 'Oftalmología',
      resumen:
        'Consulta por recomendaciones dietéticas para controlar el colesterol.',
      fechaPublicacion: '2023-04-05 13:10',
    },
    {
      id: '9',
      nombre: 'Diego Castro',
      categoria: 'Neurología',
      resumen: 'Consulta por migrañas recurrentes y mareos.',
      fechaPublicacion: '2023-08-30 10:00',
    },
    {
      id: '10',
      nombre: 'Elena Ruiz',
      categoria: 'Neurología',
      resumen: 'Consulta por control de la diabetes tipo 2.',
      fechaPublicacion: '2023-02-02 17:45',
    },
    {
      id: '11',
      nombre: 'Sara Navarro',
      categoria: 'Neurología',
      resumen: 'Consulta por pérdida de audición y zumbidos en los oídos.',
      fechaPublicacion: '2023-08-22 12:20',
    },
  ],
  titulo: 'Fichas de Pacientes',
  modulos: [
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
          label: 'Pacientes',
          nombre: 'pacientes',
          propiedades: {
            icono: 'group',
            orden: 1,
            descripcion: 'Control de pacientes del sistema',
          },
          url: '/admin/pacientes',
        },
        {
          estado: 'ACTIVO',
          id: '6',
          label: 'Consultas',
          nombre: 'consultas',
          propiedades: {
            icono: 'medical_information',
            orden: 2,
            descripcion: 'Consultas',
          },
          url: '/admin/consultas',
        },
        {
          estado: 'ACTIVO',
          id: '6',
          label: 'Personal médico',
          nombre: 'personal _médico',
          propiedades: {
            icono: 'health_and_safety',
            orden: 2,
            descripcion: 'Personal médico',
          },
          url: '/admin/personal _medico',
        },
      ],
      url: '/configuraciones',
    },
  ],
  mensajeProp: { id: '/admin/pacientes', valor: '11' },
  textoNav: 'Centro de Salud',
  imagenProp: hospital,
  textoBar1: 'Armando Lios',
  textoBar2: 'Recepcionista',
  textFooter: 'Centro de Salud',
}
