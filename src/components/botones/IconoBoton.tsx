import { Button } from '@mui/material'
import { IconoTooltip } from './IconoTooltip'
import { OverridableStringUnion } from '@mui/types'
import { ButtonPropsVariantOverrides } from '@mui/material/Button/Button'

interface IconoBotonParams {
  id: string
  variante?: 'icono' | 'boton'
  variant?: OverridableStringUnion<
    'text' | 'outlined' | 'contained',
    ButtonPropsVariantOverrides
  >
  texto: string
  icono: string
  descripcion: string
  accion: () => void
}

export const IconoBoton = ({
  id,
  texto,
  icono,
  variante = 'boton',
  variant = 'contained',
  descripcion,
  accion,
}: IconoBotonParams) => {
  return variante == 'boton' ? (
    <Button
      id={id}
      variant={variant}
      sx={{ ml: 1, mr: 1 }}
      size={'small'}
      onClick={() => {
        accion()
      }}
    >
      {texto}
    </Button>
  ) : (
    <IconoTooltip
      id={id}
      titulo={descripcion}
      accion={() => {
        accion()
      }}
      icono={icono}
      name={texto}
    />
  )
}
