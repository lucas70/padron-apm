import { Switch, Tooltip } from '@mui/material'
import { ChangeEventHandler, FC } from 'react'

interface Props {
  titulo: string
  accion: ChangeEventHandler<HTMLInputElement> | undefined
  desactivado?: boolean
  name: string
  id: string
  marcado: boolean
  color?: 'primary' | 'success' | 'warning' | 'error'
}

export const CustomSwitch: FC<Props> = ({
  color = 'primary',
  titulo,
  desactivado = false,
  name,
  id,
  accion,
  marcado,
}) => (
  <Tooltip title={titulo}>
    <Switch
      aria-label="Custom Switch"
      color={color}
      id={id}
      disabled={desactivado}
      name={name}
      checked={marcado}
      onChange={(event) => {
        if (accion) {
          accion(event)
        }
      }}
    />
  </Tooltip>
)
