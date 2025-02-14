import { Backdrop, Box, CircularProgress, Typography } from '@mui/material'

interface BackdropParams {
  cargando: boolean
  color:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning'
  titulo: string
  size?: number
}

export const BackdropVista = ({
  cargando,
  color,
  titulo,
  size,
}: BackdropParams) => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={cargando}
    >
      <Box>
        <Box textAlign={'center'}>
          <CircularProgress size={size} color={color} />
        </Box>
        <Typography>{titulo}</Typography>
      </Box>
    </Backdrop>
  )
}
