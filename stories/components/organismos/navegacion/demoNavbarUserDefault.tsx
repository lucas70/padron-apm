// Demo de componente Navbar por defecto mostrando datos de usuario ficticios
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuItem,
  Radio,
  ToggleButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Icono } from '@/components/Icono'
import { IconoTooltip } from '@/components/botones/IconoTooltip'
import Grid from '@mui/material/Grid'
import Image from 'next/image'
import { Constantes } from '@/config/Constantes'
import { FC, useState } from 'react'
import ThemeSwitcherButton from '@/components/botones/ThemeSwitcherButton'
interface DemoNavbarUserType {
  nombres: string
  primerApellido: string
  segundoApellido?: string
  rol?: string
  entidad?: string
  sistema?: string
  imagen?: string
}
export const DemoNavbarUserDefault: FC<DemoNavbarUserType> = ({
  nombres = '',
  primerApellido = '',
  segundoApellido = '',
  rol = '',
  sistema = 'Frontend base',
  imagen = 'icono',
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const desplegarMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const cerrarMenu = () => {
    setAnchorEl(null)
  }
  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            id={'demo-menu'}
            size="large"
            edge="start"
            color={'inherit'}
            sx={{ mr: 0 }}
          >
            <Icono color={'action'}>menu</Icono>
          </IconButton>
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
                sx={{ width: 'auto', cursor: 'pointer' }}
              >
                <Image
                  src={`${Constantes.sitePath}/${imagen}.png`}
                  alt={'sus-logo'}
                  width="30"
                  height="30"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '5px',
                  }}
                />
                <Box sx={{ px: 0.5 }} />
                <Typography
                  color={'text.primary'}
                  component="div"
                  sx={{
                    fontWeight: '600',
                  }}
                >
                  {`${sistema}`}
                </Typography>
              </Grid>
            </Box>
          </Grid>
          <IconoTooltip
            id={'ayudaUser'}
            name={'Ayuda'}
            titulo={'Ayuda'}
            accion={() => {}}
            color={'action'}
            icono={'help_outline'}
          />
          {!xs && <ThemeSwitcherButton />}
          <ToggleButton
            sx={{
              px: 1.2,
              borderWidth: 0,
              borderRadius: '15px',
            }}
            onClick={desplegarMenu}
            size="small"
            color="primary"
            value={''}
            selected={!!anchorEl}
          >
            <Avatar
              sx={{
                fontSize: '0.82rem',
                width: 30,
                height: 30,
                bgcolor: 'secondary.main',
              }}
            >
              {nombres[0] ?? ''}
              {primerApellido[0] ?? segundoApellido[0] ?? ''}
            </Avatar>
          </ToggleButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={cerrarMenu}
            autoFocus={false}
          >
            <MenuItem sx={{ mb: 1, mt: 0.5 }}>
              <Icono color={'inherit'} fontSize={'small'}>
                person
              </Icono>
              <Box width={'15px'} />
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'start'}
              >
                <Typography
                  variant={'body2'}
                  color="text.primary"
                  fontWeight={'500'}
                >
                  {`${nombres} ${primerApellido} ${segundoApellido ?? ''}`}
                </Typography>
                <Typography variant={'caption'} color="text.secondary">
                  {`${rol}`}
                </Typography>
              </Box>
            </MenuItem>
            <Box>
              <Divider />
              <MenuItem
                sx={{
                  ml: 0,
                  pt: 1.5,
                  '&.MuiButtonBase-root:hover': {
                    bgcolor: 'transparent',
                  },
                }}
              >
                <Icono color={'inherit'} fontSize={'small'}>
                  switch_account
                </Icono>
                <Box width={'15px'} />
                <Typography variant={'body2'} fontWeight={'500'}>
                  Roles
                </Typography>
              </MenuItem>
              <List key={`roles`} sx={{ p: 0, pl: 2 }}>
                <ListItem>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      borderRadius: 1,
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Box width={'20px'} />
                    <FormControlLabel
                      control={
                        <Radio
                          checked={true}
                          color={'success'}
                          size="small"
                          name="radio-buttons"
                        />
                      }
                      componentsProps={{ typography: { variant: 'body2' } }}
                      label={rol}
                    />
                  </Box>
                </ListItem>
                <ListItem>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      borderRadius: 1,
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Box width={'20px'} />
                    <FormControlLabel
                      control={
                        <Radio
                          checked={false}
                          color={'success'}
                          size="small"
                          name="radio-buttons"
                        />
                      }
                      componentsProps={{ typography: { variant: 'body2' } }}
                      label={'Técnico'}
                    />
                  </Box>
                </ListItem>
              </List>
            </Box>

            <Divider />
            <MenuItem sx={{ px: 2.5, py: 1.5, mt: 1 }}>
              <Icono color={'inherit'} fontSize={'small'}>
                dark_mode
              </Icono>

              <Box width={'15px'} />
              <Typography variant={'body2'} fontWeight={'500'}>
                {`Modo oscuro`}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem sx={{ px: 2.5, py: 1.5, mt: 1 }}>
              <Icono color={'error'} fontSize={'small'}>
                logout
              </Icono>
              <Box width={'15px'} />
              <Typography variant={'body2'} fontWeight={'600'} color={'error'}>
                Cerrar sesión
              </Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  )
}
