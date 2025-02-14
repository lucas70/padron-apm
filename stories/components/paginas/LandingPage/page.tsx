import Image from 'next/image'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import queso from '../../../assets/queso.png'
import queso1 from '../../../assets/queso-1.jpg'
import queso2 from '../../../assets/queso-2.jpg'
import queso3 from '../../../assets/queso-3.jpg'
import queso4 from '../../../assets/queso-4.jpg'
import queso7 from '../../../assets/queso-7.jpg'
import telefono from '../../../assets/telefono.png'
import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import FooterExample from './FooterExample'

const cardData = [
  {
    titulo: 'Tarjeta 1',
    contenido:
      'Contenido detallado de la tarjeta 1 Contenido detallado de la tarjeta 1 Contenido detallado de la tarjeta 1',
    url: queso1,
  },
  {
    titulo: 'Tarjeta 2',
    contenido: 'Contenido detallado de la tarjeta 2',
    url: queso2,
  },
  {
    titulo: 'Tarjeta 3',
    contenido: 'Contenido detallado de la tarjeta 3',
    url: queso3,
  },
  {
    titulo: 'Tarjeta 4',
    contenido: 'Contenido detallado de la tarjeta 4',
    url: queso4,
  },
]
export const LandingPage = () => {
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.only('sm'))
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  const Map = useMemo(
    () =>
      dynamic(() => import('./mapExample'), {
        ssr: false,
      }),
    []
  )

  return (
    <Box
      paddingX={sm || xs ? 2 : 6}
      mt={5}
      bgcolor={theme.palette.background.paper}
    >
      <Box
        sx={{ backgroundColor: alpha(theme.palette.background.paper, 0.9) }}
        px={2}
      >
        <Grid
          container
          height={sm || xs ? 'auto' : '70vh'}
          spacing={sm || xs ? '5' : 10}
          display={'flex'}
          justifyContent={'space-between'}
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={7}
            //paddingX={4}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'start',
              gap: 2,
              order: { xs: 2, sm: 1, md: 1 },
            }}
          >
            <Typography
              variant={sm || xs ? 'h4' : 'h3'}
              component="h1"
              align={sm || xs ? 'center' : 'left'}
              color={theme.palette.text.primary}
              borderLeft={4}
              borderColor={theme.palette.primary.main}
              paddingLeft={1}
            >
              Teoría del queso
            </Typography>

            <Typography
              variant={'h5'}
              component="h2"
              fontSize="18px"
              fontWeight={300}
              color={theme.palette.text.primary}
              align={sm || xs ? 'center' : 'left'}
              py={1}
            >
              ¡Bienvenido a la Teoría del Queso! 🧀 ¿Estás listo para sumergirte
              en un mundo de sabores, texturas y experiencias culinarias
              extraordinarias?
            </Typography>
            <Typography
              variant={'h6'}
              component="h3"
              color={theme.palette.text.primary}
              align={sm || xs ? 'center' : 'left'}
              py={1}
            >
              ¿Requieres nuestros servicios o necesitas ayuda?
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: xs ? 'column' : 'row',
                gap: xs ? '10px' : '20px',
                width: '100%',
              }}
              justifyContent={sm || xs ? 'center' : 'left'}
              py={1}
            >
              <Button
                variant="contained"
                sx={{
                  width: xs ? '100%' : '250px',
                  height: '50px',
                  color: theme.palette.grey[50],
                }}
              >
                <Image
                  src={telefono}
                  alt={''}
                  width="25"
                  height="25"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    marginRight: 6,
                  }}
                />
                Contáctanos
              </Button>

              <Button
                variant="outlined"
                sx={{ width: xs ? '100%' : '250px', height: '50px' }}
              >
                Más información
              </Button>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={5}
            py={sm || xs ? 2 : 0}
            pr={sm || xs ? 0 : 2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: sm || xs ? 'center' : 'end',
              justifyContent: 'center',
              borderRadius: 10,
              order: { xs: 1, sm: 2, md: 2 },
            }}
          >
            <Image
              src={queso}
              alt={'example'}
              width={sm || xs ? 281 : 420}
              height={sm || xs ? 228 : 428}
              layout={sm ? 'fixed' : 'responsive'}
            />
          </Grid>
        </Grid>

        <Box py={2}>
          <Box
            py={3}
            sx={{ bgcolor: theme.palette.background.paper }}
            boxShadow={'revert'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <Typography
              variant="h5"
              align="center"
              fontSize={sm || xs ? '20px' : 'auto'}
              fontWeight={'bold'}
              color={theme.palette.text.primary}
              borderLeft={4}
              borderColor={theme.palette.primary.main}
              paddingLeft={2}
              paddingY={1}
            >
              ¿Listo para explorar la Teoría del Queso?
            </Typography>
          </Box>

          <Grid container py={2}>
            {cardData.map((card) => (
              <Grid
                key={card.titulo}
                item
                lg={3}
                md={4}
                sm={6}
                xs={12}
                p={xs ? 0 : 2}
                py={2}
              >
                <Card
                  variant="outlined"
                  sx={{ height: '100%', borderRadius: 4 }}
                >
                  <CardMedia>
                    <Image
                      src={card.url}
                      height={200}
                      alt="ImageCard"
                      style={{ objectFit: 'cover', width: '100%' }}
                      layout={xs || sm ? 'responsive' : 'cover'}
                    />
                  </CardMedia>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {card.titulo}
                    </Typography>
                    <Divider />
                    <Typography variant="body2" color="text.secondary" mt={2}>
                      {card.contenido}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Grid container py={sm || xs ? 2 : 0}>
          <Grid
            item
            lg={8}
            md={6}
            sm={12}
            xs={12}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
            mb={sm || xs ? 3 : 1}
          >
            <Typography
              variant="h5"
              align={'left'}
              color={theme.palette.text.primary}
              borderLeft={4}
              borderColor={theme.palette.primary.main}
              pl={2}
            >
              De la vaca al plato: Descubre nuestro queso artesanal
            </Typography>
            <Typography
              variant="body1"
              my={1}
              mt={3}
              color={theme.palette.text.secondary}
              fontWeight={400}
            >
              Sumérgete en un viaje culinario que comienza en los verdes prados
              donde nuestras vacas felices pastan libremente. Con un compromiso
              inquebrantable con la calidad y la tradición, cada bloque de
              nuestro queso artesanal es una obra maestra elaborada con esmero y
              pasión. Desde la leche recién ordeñada hasta tu plato, te
              invitamos a disfrutar de la pureza y autenticidad de nuestro
              queso, una experiencia que deleitará tus sentidos y alimentará tu
              alma.
            </Typography>
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            sm={12}
            xs={12}
            p={sm || xs ? 0 : 4}
            paddingRight={0}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              src={queso7}
              alt={'imagen_subtitulo1'}
              width={681}
              height={528}
              layout="responsive"
              style={{ borderRadius: '20px' }}
            />
          </Grid>
        </Grid>

        <Grid container py={sm || xs ? 2 : 0} mb={4}>
          <Grid
            item
            lg={4}
            md={6}
            sm={12}
            xs={12}
            p={sm || xs ? 0 : 4}
            paddingLeft={0}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              order: { xs: 2, sm: 2, md: 1 },
            }}
          >
            <Image
              src={queso2}
              alt={'imagen_subtitulo1'}
              width={681}
              height={528}
              layout="intrinsic"
              style={{ borderRadius: '20px' }}
            />
          </Grid>
          <Box sx={{ mt: 10 }} />
          <Grid
            item
            lg={8}
            md={6}
            sm={12}
            xs={12}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              order: { xs: 1, sm: 1, md: 2 },
            }}
            mb={sm || xs ? 3 : 1}
          >
            <Typography
              variant="h5"
              align={'left'}
              color={theme.palette.text.primary}
              borderLeft={4}
              borderColor={theme.palette.primary.main}
              pl={2}
            >
              Queso: El mejor amigo del pan
            </Typography>
            <Typography
              variant="body1"
              my={1}
              mt={3}
              color={theme.palette.text.secondary}
              fontWeight={400}
            >
              En cada rebanada de pan, encontrarás a tu fiel compañero: el
              queso. Este dúo dinámico ha conquistado los corazones y paladares
              de generaciones enteras con su combinación irresistible de
              texturas y sabores. Ya sea fundido sobre una tostada crujiente o
              entre dos capas de pan recién horneado, el queso eleva cada bocado
              a nuevas alturas de placer gastronómico. Descubre la magia de esta
              relación eterna y saborea la delicia de tener al mejor amigo del
              pan en cada comida.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        mb={xs || sm ? 0 : 4}
        sx={{
          width: '100%',
          height: xs || sm ? '30vh' : '40vh',
          backgroundImage: `linear-gradient(rgba(4,9,30,0.5),rgba(4,9,30,0.5)),url("https://img.freepik.com/foto-gratis/disparo-enfoque-selectivo-delicioso-plato-queso-sobre-mesa-nueces_181624-34872.jpg?w=740&t=st=1710194735~exp=1710195335~hmac=7d36931e28e1a37ec73b2fc7122b72ac2ad5586ad319b9f3b3f43c4bd4baf169")`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          position: 'relative',
          backgroundAttachment: 'fixed',
        }}
      >
        <Typography
          variant={xs || sm ? 'h6' : 'h5'}
          align={'center'}
          color={theme.palette.grey[50]}
        >
          La edad no importa, a menos que seas un queso ...
        </Typography>
      </Box>
      <Box
        sx={{ backgroundColor: alpha(theme.palette.background.paper, 0.9) }}
        paddingY={xs || sm ? 4 : 5}
      >
        <Grid container>
          <Grid item sm={6} xs={12} sx={{ order: { xs: 2, sm: 2, md: 1 } }}>
            <Box
              p={1}
              borderRadius={2}
              border={1}
              borderColor={'ButtonHighlight'}
            >
              <Map height={xs || sm ? 200 : 290} width={'100%'} />
            </Box>
          </Grid>
          <Grid
            item
            sm={6}
            xs={12}
            p={1}
            sx={{ order: { xs: 1, sm: 1, md: 2 } }}
            mt={xs || sm ? 2 : 0}
          >
            <Box
              display={'flex'}
              flexDirection={'column'}
              alignItems={'center'}
              justifyContent={'center'}
              height={'100%'}
              paddingX={2}
            >
              <Typography
                variant="h5"
                align={'center'}
                color={theme.palette.text.primary}
                fontWeight={'700'}
                borderLeft={4}
                borderColor={theme.palette.primary.main}
                pl={1}
              >
                Visítanos en nuestra sucursal
              </Typography>
              <Typography
                variant="h6"
                align={'center'}
                color={theme.palette.text.primary}
                fontWeight={'500'}
              >
                Nos encontramos en:
              </Typography>
              <Box
                borderRadius={4}
                paddingX={4}
                paddingY={2}
                marginTop={3}
                color={theme.palette.text.primary}
                border={1}
                borderColor={'ButtonHighlight'}
              >
                <Typography variant="body1" mt={1}>
                  <strong>📍Dirección:</strong> Villa Quesa Dilla, calle
                  &quot;Quesor Presa&quot;
                </Typography>
                <Typography variant="body1" mt={1}>
                  <strong>📞 Teléfono: </strong> +5911234567
                </Typography>
                <Typography variant="body1" mt={1}>
                  <strong>📮 Correo: </strong> quesitoproedition@email.com
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {/* footer */}
      <FooterExample />
    </Box>
  )
}
