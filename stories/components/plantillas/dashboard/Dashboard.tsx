import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
} from '@mui/material'
import ChartPie from './ui/ChartPie'
import ChartBar from './ui/ChartBar'
import { Icono } from '@/components/Icono'

export const Dashboard = () => {
  const theme = useTheme()
  return (
    <Grid container spacing={3} bgcolor={theme.palette.background.default}>
      <Grid item xs={12}>
        <Box height={'5px'} />
        <Typography sx={{ fontSize: 18, fontWeight: '600' }}>
          Dashboard
        </Typography>
        <Box height={'5px'} />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Grid container direction="column" spacing={1} alignItems="center">
              <Grid item>
                <Icono color={'inherit'}>local_grocery_store</Icono>
              </Grid>

              <Grid item>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', fontSize: 25 }}
                >
                  128
                </Typography>
              </Grid>

              <Grid item>
                <Typography variant="body2">Compras en la página</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Grid container direction="column" spacing={1} alignItems="center">
              <Grid item>
                <Icono color={'inherit'}>store</Icono>
              </Grid>

              <Grid item>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', fontSize: 25 }}
                >
                  5
                </Typography>
              </Grid>

              <Grid item>
                <Typography variant="body2">Sucursales abiertas</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Grid container direction="column" spacing={1} alignItems="center">
              <Grid item>
                <Icono color={'inherit'}>people</Icono>
              </Grid>

              <Grid item>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', fontSize: 25 }}
                >
                  1.6m
                </Typography>
              </Grid>

              <Grid item>
                <Typography variant="body2">Usuarios registrados</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Grid container direction="column" spacing={1} alignItems="center">
              <Grid item>
                <Icono color={'inherit'}>assignment_ind</Icono>
              </Grid>

              <Grid item>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', fontSize: 25 }}
                >
                  200
                </Typography>
              </Grid>

              <Grid item>
                <Typography variant="body2">Personal en la empresa</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={7}>
        <Card
          sx={{
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: 17, fontWeight: '600' }}>
              Ventas por período de tiempo
            </Typography>
            <Box alignItems="center">
              <ChartBar />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={5}>
        <Card
          sx={{
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontSize: 17, fontWeight: '600' }}>
              Ventas por área
            </Typography>
            <Box height={'20px'} />
            <Box alignItems="center">
              <ChartPie />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
