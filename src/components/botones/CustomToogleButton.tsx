import { Icono } from '@/components/Icono'
import { ToggleButton } from '@mui/material'

interface BotonFiltroParams {
  id: string
  seleccionado: boolean
  size?: 'small' | 'medium' | 'large'
  icono: string
  cambiar: (mostrar: boolean) => void
}

export const CustomToggleButton = ({
  id,
  seleccionado,
  size = 'small',
  icono,
  cambiar,
}: BotonFiltroParams) => {
  return (
    <ToggleButton
      id={id}
      value="check"
      sx={{
        '&.MuiToggleButton-root': {
          borderRadius: '4px !important',
          border: '0px solid lightgrey !important',
        },
      }}
      size={size}
      selected={seleccionado}
      onChange={() => {
        cambiar(!seleccionado)
      }}
      aria-label="search"
    >
      <Icono>{icono}</Icono>
    </ToggleButton>
  )
}
