import { Box, Grid } from '@mui/material'

import { useForm } from 'react-hook-form'
import { useDebouncedCallback } from 'use-debounce'
import { useEffect } from 'react'
import { FormInputText } from 'src/components/form'

export interface FiltroType {
  buscar: string
}

export interface FiltroApmType {
  buscarApm: string
  accionCorrecta: (filtros: FiltroType) => void
  accionCerrar: () => void
}

export const FiltroApm = ({ buscarApm, accionCorrecta }: FiltroApmType) => {
  const { control, watch } = useForm<FiltroType>({
    defaultValues: {
      buscar: buscarApm,
    },
  })

  const buscarFiltro: string | undefined = watch('buscar')

  useEffect(() => {
    actualizacionFiltros({
      buscar: buscarFiltro,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buscarFiltro])

  const debounced = useDebouncedCallback((filtros: FiltroType) => {
    accionCorrecta(filtros)
  }, 1000)

  const actualizacionFiltros = (filtros: FiltroType) => {
    debounced(filtros)
  }

  return (
    <Box sx={{ pl: 1, pr: 1, pt: 1 }}>
      <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
        <Grid item xs={12} sm={12} md={6}>
          <FormInputText
            id={'filtroRol'}
            name={'buscar'}
            control={control}
            label={'Buscar APM'}
            bgcolor={'background.paper'}
            clearable
          />
        </Grid>
      </Grid>
    </Box>
  )
}
