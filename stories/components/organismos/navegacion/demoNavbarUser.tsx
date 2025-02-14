// Demo de componente Navbar mostrando datos de usuario
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  ToggleButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Icono } from '@/components/Icono'
import Grid from '@mui/material/Grid'
import Image from 'next/image'
import { FC, useState } from 'react'
import entelimg from '../../../assets/entel.png'
import susimg from '../../../assets/sus.png'
import boliviaimg from '../../../assets/bolivia.png'
import hechoimg from '../../../assets/hechoenbolivia.png'
interface DemoNavbarUserType {
  nombres: string
  primerApellido: string
  segundoApellido?: string
  rol?: string
  entidad?: string
  sistema: string
  buscador?: boolean
}
export const DemoNavbarUser: FC<DemoNavbarUserType> = ({
  nombres,
  primerApellido,
  segundoApellido = '',
  rol = '',
  entidad = '',
  sistema = 'Frontend base',
  buscador = false,
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
                src={
                  sistema == 'Entel S.A.'
                    ? entelimg
                    : sistema == 'Gob.bo'
                      ? boliviaimg
                      : sistema == 'Consume lo Nuestro'
                        ? hechoimg
                        : susimg
                }
                alt={'sistema-logo'}
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
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {`${sistema}`}
              </Typography>
            </Grid>
          </Box>
        </Grid>
        {buscador && !xs && (
          <Grid
            container={!xs}
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'center'}
          >
            <TextField
              size="small"
              placeholder="Buscar"
              variant="outlined"
              sx={{ width: '100%' }}
              InputProps={{
                style: { fontSize: '0.82rem', borderRadius: '10px' },
                endAdornment: (
                  <IconButton
                    id={'demo-search'}
                    size="small"
                    color={'inherit'}
                    sx={{ mr: 0 }}
                  >
                    <Icono color={'action'}>search</Icono>
                  </IconButton>
                ),
              }}
            />
          </Grid>
        )}

        <Grid
          container={!xs}
          alignItems={'center'}
          flexDirection={'row'}
          justifyContent={'flex-end'}
          textAlign={'right'}
        >
          {!xs && (
            <div>
              <Typography
                fontSize={'0.80rem'}
                color={'text.primary'}
                noWrap
                sx={{
                  fontWeight: '600',
                }}
              >{`${nombres} ${primerApellido}`}</Typography>
              <Typography
                fontSize={'0.80rem'}
                color={'text.secondary'}
                noWrap
                sx={{ fontWeight: '600' }}
              >{`${rol ?? ''} ${rol && entidad ? '•' : ''} ${entidad ?? ''}`}</Typography>
            </div>
          )}
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
        </Grid>

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
            <Box display={'flex'} flexDirection={'column'} alignItems={'start'}>
              <Typography
                variant={'body2'}
                color="text.primary"
                fontWeight={'500'}
              >
                {`${nombres} ${primerApellido} ${segundoApellido ?? ''}`}
              </Typography>
              <Typography variant={'caption'} color="text.secondary">
                {`${rol ?? entidad}`}
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem sx={{ mb: 1, mt: 0.5 }}>
            <Icono color={'inherit'} fontSize={'small'}>
              settings
            </Icono>
            <Box width={'15px'} />
            <Box display={'flex'} flexDirection={'column'} alignItems={'start'}>
              <Typography
                variant={'body2'}
                color="text.primary"
                fontWeight={'500'}
              >
                Ajustes
              </Typography>
            </Box>
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
  )
}
