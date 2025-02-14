import { FC, ReactNode } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Box, CardActions, Grid } from '@mui/material'
import { Icono } from '@/components/Icono'

interface CardItemProps {
  id?: string
  titulo: string
  subtitulo?: string
  descripcion: string
  imagen?: string
  acciones?: ReactNode
}

export const CardItem: FC<CardItemProps> = ({
  titulo,
  subtitulo,
  descripcion,
  imagen,
  acciones,
}) => {
  return (
    <Card sx={{ borderRadius: '10px' }}>
      <CardContent>
        <Grid container direction="row" alignItems="center">
          {imagen && (
            <Grid item>
              <Box sx={{ pr: 1 }}>
                <Icono color={'primary'} fontSize={'large'}>
                  book
                </Icono>
              </Box>
            </Grid>
          )}
          <Grid item>
            <Typography fontWeight={'600'} variant="subtitle1">
              {titulo}
            </Typography>
            <Grid>
              <Typography variant="subtitle2" color={'text.secondary'}>
                {subtitulo}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Box height={'10px'} />
        <Grid>
          <Typography variant="body2">{descripcion}</Typography>
        </Grid>
      </CardContent>
      <CardActions>
        {acciones && (
          <Grid container alignItems={'center'} justifyContent="flex-end">
            {acciones}
          </Grid>
        )}
      </CardActions>
    </Card>
  )
}
