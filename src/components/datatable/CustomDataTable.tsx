import { ReactNode } from 'react'
import { useMediaQuery, useTheme } from '@mui/material'
import { CriterioOrdenType } from '@/components/datatable/ordenTypes'
import { CustomMobileTableMobile } from '@/components/datatable/CustomMobileTableMobile'
import { CustomDesktopDataTable } from '@/components/datatable/CustomDesktopDataTable'

export interface CustomDataTableType {
  titulo?: string
  descripcion?: string
  tituloPersonalizado?: ReactNode
  cabeceraPersonalizada?: ReactNode
  error?: boolean
  cargando?: boolean
  acciones?: Array<ReactNode>
  cambioOrdenCriterios?: (nuevosCriterios: Array<CriterioOrdenType>) => void
  columnas: Array<CriterioOrdenType>
  filtros?: ReactNode
  contenidoTabla: Array<Array<ReactNode>>
  paginacion?: ReactNode
  seleccionable?: boolean
  seleccionados?: (indices: Array<number>) => void
}

export const CustomDataTable = ({
  titulo,
  descripcion,
  tituloPersonalizado,
  cabeceraPersonalizada,
  error = false,
  cargando = false,
  acciones = [],
  columnas,
  cambioOrdenCriterios,
  filtros,
  contenidoTabla,
  paginacion,
  seleccionable,
  seleccionados,
}: CustomDataTableType) => {
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.only('sm'))
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  return sm || xs
    ? CustomMobileTableMobile({
        titulo,
        descripcion,
        tituloPersonalizado,
        cabeceraPersonalizada,
        error,
        cargando,
        acciones,
        columnas,
        cambioOrdenCriterios,
        filtros,
        contenidoTabla,
        paginacion,
        seleccionable,
        seleccionados,
      })
    : CustomDesktopDataTable({
        titulo,
        descripcion,
        tituloPersonalizado,
        cabeceraPersonalizada,
        error,
        cargando,
        acciones,
        columnas,
        cambioOrdenCriterios,
        filtros,
        contenidoTabla,
        paginacion,
        seleccionable,
        seleccionados,
      })
}
