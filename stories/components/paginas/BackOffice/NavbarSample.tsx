import {
  AppBar,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Box from '@mui/material/Box'

import Image from 'next/image'
import { Icono } from '@/components/Icono'
import { IconoTooltip } from '@/components/botones/IconoTooltip'

interface Props {
  sideMenuOpen: boolean
  closeSideMenu: () => void
  openSideMenu: () => void
  imagenProp?: any
  textoNav?: string
  textoBar1?: string
  textoBar2?: string
}

export const NavbarSample = ({
  sideMenuOpen,
  closeSideMenu,
  openSideMenu,
  imagenProp,
  textoNav,
  textoBar2,
  textoBar1,
}: Props) => {
  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(12px)',
          boxShadow: 0,
          borderBottom: 1,
          borderColor: 'ActiveCaption',
        }}
      >
        <Toolbar>
          <IconButton
            id={'menu-sidebar'}
            size="large"
            aria-label="Menu lateral"
            name={sideMenuOpen ? 'Cerrar menú lateral' : 'Abrir menú lateral'}
            edge="start"
            onClick={() => {
              if (sideMenuOpen) {
                closeSideMenu()
              } else {
                openSideMenu()
              }
            }}
            sx={{ mr: 0 }}
          >
            {sideMenuOpen ? (
              <Icono color={'action'}>menu_open</Icono>
            ) : (
              <Icono color={'action'}>menu</Icono>
            )}
          </IconButton>

          {imagenProp && textoNav ? (
            <Grid
              container
              alignItems={'center'}
              flexDirection={'row'}
              sx={{ flexGrow: 1 }}
            >
              <Box display={'inline-flex'}>
                <Grid
                  container
                  alignItems={'center'}
                  flexDirection={'row'}
                  justifyContent={'flex-start'}
                  onClick={async () => {}}
                  sx={{ cursor: 'pointer' }}
                >
                  <Image
                    src={imagenProp}
                    alt={''}
                    width="30"
                    height="30"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                    }}
                  />
                  <Box sx={{ px: 0.5 }} />
                  <Typography
                    color={'text.primary'}
                    component="div"
                    sx={{ fontWeight: '600' }}
                  >
                    {textoNav}
                  </Typography>
                </Grid>
              </Box>
            </Grid>
          ) : (
            <Box sx={{ flexGrow: 1 }} />
          )}
          {!xs && (
            <Grid
              textAlign={'right'}
              borderRight={1}
              paddingRight={1}
              borderColor={alpha(theme.palette.text.secondary, 0.3)}
            >
              <Typography
                fontSize={'0.80rem'}
                color={'text.primary'}
                sx={{
                  fontWeight: '600',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                noWrap
              >
                {textoBar1}
              </Typography>
              <Typography
                fontSize={'0.80rem'}
                color={'text.secondary'}
                sx={{ fontWeight: '600' }}
                noWrap
              >
                {textoBar2}
              </Typography>
            </Grid>
          )}
          <IconoTooltip
            id={'login'}
            name={'login'}
            titulo={'login'}
            accion={() => {}}
            color={`action`}
            icono={'account_circle'}
          />
        </Toolbar>
      </AppBar>
    </>
  )
}
