import { Box, Grid, useMediaQuery, useTheme } from '@mui/material'

import { ReactNode, useState } from 'react'

import TableLanding from './TableLanding'
import { NavbarSample } from './NavbarSample'
import { ColumnaType } from '@/types'
import { MensajeType } from '@/context/SideBarProvider'
import {
  CustomDrawer,
  SidebarModuloType,
} from '@/components/sidebar/CustomDrawer'

interface TableLandingProps {
  columnas?: Array<ColumnaType>
  solicitudesData?: Array<any>
  titulo?: string
  modulosProp?: Array<any>
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

const BackOfficeSample = ({
  columnas,
  solicitudesData,
  titulo,
  modulosProp,
  mensajeProp,
  imagenProp,
  textoNav,
  textoBar1,
  textoBar2,
  editAccion,
  showAccion,
  deleteAccion,
}: TableLandingProps) => {
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.only('sm'))
  const xs = useMediaQuery(theme.breakpoints.only('xs'))
  const md = useMediaQuery(theme.breakpoints.only('md'))

  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false)
  const [modulos, setModulos] = useState<SidebarModuloType[]>(
    modulosProp
      ? modulosProp
      : [
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
                  descripcion:
                    'Vista de bienvenida con características del sistema',
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
                  descripcion:
                    'Información del perfil de usuario que inicio sesión',
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
                  icono: 'local_library',
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
                  icono: 'local_grocery_store',
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
        ]
  )
  const mensajes: MensajeType[] = mensajeProp
    ? [mensajeProp]
    : [{ id: '/admin/productos', valor: '44' }]

  const checkContentBadge = (id: string): ReactNode => {
    const mensaje = mensajes.find((mensaje) => mensaje.id === id)
    return mensaje ? mensaje.valor : null
  }
  const openSideMenu = () => {
    setSideMenuOpen(true)
  }
  const closeSideMenu = () => {
    setSideMenuOpen(false)
  }
  // useEffect(() => {
  //   if (sm || xs || md) {
  //     closeSideMenu()
  //   } else {
  //     openSideMenu()
  //   }
  //
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [sm, xs, md])

  return (
    <Box bgcolor={theme.palette.background.paper}>
      <NavbarSample
        sideMenuOpen={sideMenuOpen}
        closeSideMenu={closeSideMenu}
        openSideMenu={openSideMenu}
        imagenProp={imagenProp}
        textoNav={textoNav}
        textoBar1={textoBar1}
        textoBar2={textoBar2}
      />
      <Box component="main" bgcolor={theme.palette.background.paper}>
        <Box
          paddingX={sm || xs ? 2 : 6}
          mt={7}
          bgcolor={theme.palette.background.paper}
        >
          <Box paddingY={4}>
            <CustomDrawer
              open={sideMenuOpen}
              variant={sm || xs || md ? 'temporary' : 'persistent'}
              onClose={closeSideMenu}
              sx={{
                width: 0,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                  width: 220,
                  boxSizing: 'border-box',
                },
                transition: 'all 0.2s ease-out',
              }}
              rutaActual={mensajes[0].id ?? '/admin/productos'}
              modulos={modulos}
              setModulos={setModulos}
              navigateTo={() => {}}
              badgeVariant={'neutro'}
              checkContentBadge={checkContentBadge}
            />
            <Box>
              <Box
                component="main"
                sx={{
                  width:
                    sm || xs || md ? '100%' : sideMenuOpen ? '80%' : '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  ml: sm || xs || md ? '0%' : sideMenuOpen ? '200px' : '0%',
                  transition: 'all 0.2s ease-out !important',
                }}
              >
                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justifyContent="initial"
                  justifyItems={'center'}
                  style={{ minHeight: '80vh' }}
                >
                  <div
                    style={{
                      width: xs || sm ? '90%' : '95%',
                    }}
                  >
                    <TableLanding
                      columnas={columnas}
                      solicitudesData={solicitudesData}
                      titulo={titulo}
                      editAccion={editAccion}
                      showAccion={showAccion}
                      deleteAccion={deleteAccion}
                    />
                  </div>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default BackOfficeSample
