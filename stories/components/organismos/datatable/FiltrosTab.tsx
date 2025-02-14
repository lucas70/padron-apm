import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { FC, ReactNode, SyntheticEvent } from 'react'
import { Box, Grid, SelectChangeEvent, Typography } from '@mui/material'
import { FormInputDropdown } from '@/components/form'
import { useForm } from 'react-hook-form'
import { useMediaQuery, useTheme } from '@mui/material'
interface selectType {
  seleccion: number
}
interface TabFiltrosType {
  titulo: string
  pestanas: Array<string>
  pestanaActiva: number
  acciones?: ReactNode
  labelSelect?: string
  accion: (nuevoValor: number) => void
}
export const FiltrosTab: FC<TabFiltrosType> = ({
  acciones,
  titulo,
  pestanas,
  pestanaActiva,
  labelSelect = 'Opciones:',
  accion,
}) => {
  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))
  const handleTabChange = (event: SyntheticEvent, nuevoValor: number) => {
    accion(nuevoValor)
  }
  const { control } = useForm<selectType>({
    defaultValues: {
      seleccion: pestanaActiva,
    },
    values: {
      seleccion: pestanaActiva,
    },
  })
  const handleSelectChange = (event: SelectChangeEvent) => {
    accion(parseInt(event.target.value))
  }
  return (
    <Box>
      <Grid container direction="row" justifyContent="space-between">
        <Grid item xs={acciones ? 8 : 12} md={6}>
          <Typography variant={'h5'} sx={{ fontWeight: '600'}}>
            {`${titulo}`}
          </Typography>
        </Grid>
        {acciones && (
          <Grid
            item
            xs={4}
            md={6}
            display={'flex'}
            justifyContent={'flex-end'}
            alignItems={'center'}
          >
            {acciones}
          </Grid>
        )}
      </Grid>
      {xs ? (
        <FormInputDropdown
          id="seleccionTabs"
          name="seleccion"
          label={labelSelect}
          control={control}
          onChange={handleSelectChange}
          options={pestanas.map((pestana, indice) => ({
            key: indice.toString(),
            value: indice.toString(),
            label: pestana,
          }))}
        />
      ) : (
        <Tabs
          sx={{
            pt: 1,
            minWidth: 300,
          }}
          value={pestanaActiva}
          onChange={handleTabChange}
          variant="scrollable"
        >
          {pestanas.map((pestana, indice) => (
            <Tab key={indice} label={pestana} />
          ))}
        </Tabs>
      )}
    </Box>
  )
}
