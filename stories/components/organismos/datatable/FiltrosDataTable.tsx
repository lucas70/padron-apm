import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Grid, Typography } from '@mui/material'

import { useDebouncedCallback } from 'use-debounce'
import {
  FormInputDate,
  FormInputDropdownMultiple,
  FormInputText,
} from '@/components/form'

export interface FiltroType {
  palabraClave: string
  fechaInicial: Date
  fechaFinal: Date
  categorias: string[]
}

export interface FiltrosDatatableType {
  titulo?: string
  categoriasDisponibles: string[]
  filtroFechaInicial?: Date
  filtroFechaFinal?: Date
  filtroCategorias?: string[]
  filtroPalabraClave?: string
  accionCorrecta: (filtros: FiltroType) => void
}

export const FiltrosDatatable = ({
  titulo,
  categoriasDisponibles,
  filtroCategorias,
  filtroFechaInicial,
  filtroFechaFinal,
  filtroPalabraClave,
  accionCorrecta,
}: FiltrosDatatableType) => {
  const { control, watch } = useForm<FiltroType>({
    defaultValues: {
      palabraClave: filtroPalabraClave,
      categorias: filtroCategorias,
      fechaInicial: filtroFechaInicial,
      fechaFinal: filtroFechaFinal,
    },
  })
  const filtroPalabraClaveWatch: string = watch('palabraClave')
  const filtroCategoriasWatch: string[] = watch('categorias')
  const filtroFechaInicialWatch: Date = watch('fechaInicial')
  const filtroFechaFinalWatch: Date = watch('fechaFinal')

  const debounced = useDebouncedCallback(
    (filtros: FiltroType) => {
      accionCorrecta(filtros)
    },

    1000
  )

  const actualizacionFiltros = (filtros: FiltroType) => {
    debounced(filtros)
  }

  useEffect(() => {
    actualizacionFiltros({
      palabraClave: filtroPalabraClaveWatch,
      categorias: filtroCategoriasWatch,
      fechaInicial: filtroFechaInicialWatch,
      fechaFinal: filtroFechaFinalWatch,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filtroPalabraClaveWatch,
    filtroCategoriasWatch,
    filtroFechaInicialWatch,
    filtroFechaFinalWatch,
  ])

  return (
    <Box>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant={'h5'} sx={{ fontWeight: '600', pl: 1 }}>
          {`${titulo}`}
        </Typography>
      </Grid>
      <Box sx={{ pl: 1, pr: 1, pt: 1 }}>
        <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
          <Grid item xs={12} sm={12} md={3}>
            <FormInputText
              id={'palabraClave'}
              control={control}
              name={'palabraClave'}
              label={'Buscar por nombre'}
              bgcolor={'background.paper'}
              clearable
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <FormInputDate
              id={'fechaInicial'}
              control={control}
              name="fechaInicial"
              label="Fecha inicial"
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <FormInputDate
              id={'fechaFinal'}
              name="fechaFinal"
              control={control}
              label="Fecha final"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={3}>
            <FormInputDropdownMultiple
              id={'categoria'}
              control={control}
              name="categorias"
              label="Categorías"
              bgcolor={'background.paper'}
              options={categoriasDisponibles.map((categoria, index) => ({
                key: index.toString(),
                value: categoria,
                label: categoria,
              }))}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
