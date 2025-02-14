import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
} from '@mui/material'
import { useFormStepStore } from '../StepsForm-store'

const ContenedorPasoFinal = () => {
  const formData = useFormStepStore((state) => state.formData)

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      fontWeight: 400,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
    },
  }))

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }))

  const rows = [
    {
      label: 'Nombre completo:',
      value: `${formData.nombre} ${formData.primerApellido} ${formData.segundoApellido}`,
    },
    { label: 'Nro. de documento de CI:', value: formData.nroDocumento },
    { label: 'Correo electrónico:', value: formData.correo },
    { label: 'Nro. Celular:', value: formData.nroCelular },
    {
      label: 'Nro. Alternativo de Celular:',
      value: formData.nroCelularAlternativo,
    },
    { label: 'Zona:', value: formData.zona },
    { label: 'Calle:', value: formData.calle },
    { label: 'Nro. Domicilio:', value: formData.nroDomicilio },
  ]
  return (
    <Grid container direction={'column'} alignItems={'center'}>
      <Box>
        <Typography variant="body2" pb={4} color={'secondary.light'}>
          Antes de finalizar, te invitamos a revisar cuidadosamente todos los
          datos proporcionados. Una vez que hayas verificado que tus datos son
          correctos, puedes proceder a guardar o registrarte con confianza.
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 'auto' }} aria-label="customized table">
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.label}>
                  <StyledTableCell component="th" scope="row">
                    {row.label}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.value}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Grid>
  )
}

export default ContenedorPasoFinal
