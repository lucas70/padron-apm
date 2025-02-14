import {
  Box,
  Grid,
  Link,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Icono } from '@/components/Icono'
import { FacebookSVG, InstagramSVG, TikTokSVG } from './SvgIcons'

const FooterExample = () => {
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.only('sm'))
  const xs = useMediaQuery(theme.breakpoints.only('xs'))
  return (
    <Grid
      container
      spacing={xs || sm ? 5 : 2}
      paddingY={4}
      bgcolor={theme.palette.background.paper}
    >
      <Grid item xs={12} sm={6} md={3}>
        <Box
          display={'flex'}
          flexDirection={'column'}
          gap={2}
          alignItems={xs || sm ? 'center' : 'normal'}
        >
          <Typography
            variant="body1"
            fontWeight={'bold'}
            color={theme.palette.text.primary}
          >
            Información
          </Typography>
          <Box
            display={'flex'}
            flexDirection={'column'}
            gap={2}
            alignItems={xs || sm ? 'center' : 'normal'}
          >
            <Typography variant="body2">
              <Link
                sx={{
                  textDecoration: 'none',
                }}
                color={theme.palette.text.secondary}
                href="https://www.agetic.gob.bo/"
              >
                Acerca de AGETIC
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link
                sx={{
                  textDecoration: 'none',
                }}
                color={theme.palette.text.secondary}
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              >
                Normativas
              </Link>
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Box
          display={'flex'}
          flexDirection={'column'}
          gap={2}
          alignItems={xs || sm ? 'center' : 'normal'}
        >
          <Typography
            variant="body1"
            fontWeight={'bold'}
            color={theme.palette.text.primary}
          >
            Contacto
          </Typography>
          <Box
            display={'flex'}
            flexDirection={'column'}
            gap={2}
            alignItems={xs || sm ? 'center' : 'normal'}
          >
            <Box display={'flex'} flexDirection={'row'} gap={1}>
              <Icono fontSize="small">location_on</Icono>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Pedro Salazar 631 esquina, La Paz
              </Typography>
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={1}>
              <Icono fontSize="small">mail</Icono>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                contacto@agetic.gob.bo
              </Typography>
            </Box>
            <Box display={'flex'} flexDirection={'row'} gap={1}>
              <Icono fontSize="small">call</Icono>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                22184026
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sm={12} md={3}>
        <Box
          display={'flex'}
          flexDirection={'column'}
          gap={2}
          alignItems={xs || sm ? 'center' : 'normal'}
        >
          <Typography
            variant="body1"
            fontWeight={'bold'}
            color={theme.palette.text.primary}
          >
            Sitios de interés
          </Typography>
          <Box
            display={'flex'}
            flexDirection={'column'}
            gap={2}
            alignItems={xs || sm ? 'center' : 'normal'}
          >
            <Typography variant="body2">
              <Link
                sx={{
                  textDecoration: 'none',
                }}
                color={theme.palette.text.secondary}
                href="https://www.gob.bo/ciudadania"
              >
                Ciudadanía Digital
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link
                sx={{
                  textDecoration: 'none',
                }}
                color={theme.palette.text.secondary}
                href="https://www.gob.bo/"
              >
                Gob.bo
              </Link>
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sm={12} md={3}>
        <Box
          display={'flex'}
          flexDirection={'column'}
          gap={2}
          alignItems={xs || sm ? 'center' : 'normal'}
        >
          <Typography
            variant="body1"
            fontWeight={'bold'}
            color={theme.palette.text.primary}
          >
            Síguenos
          </Typography>
          <Box
            display={'flex'}
            flexDirection={'row'}
            gap={3}
            alignContent={'center'}
          >
            <Link
              color={theme.palette.text.primary}
              href="https://www.facebook.com/AgeticBoliviaOficial/"
            >
              <FacebookSVG color={theme.palette.text.primary} />
            </Link>
            <Link
              color={theme.palette.text.primary}
              href="https://www.instagram.com/ageticbolivia/"
            >
              <InstagramSVG color={theme.palette.text.primary} />
            </Link>
            <Link
              color={theme.palette.text.primary}
              href="https://www.tiktok.com/@ageticbolivia"
            >
              <TikTokSVG color={theme.palette.text.primary} />
              {/* <SvgIcon component={FacebookSVG}/>  */}
            </Link>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}

export default FooterExample
