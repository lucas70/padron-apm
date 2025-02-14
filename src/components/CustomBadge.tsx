import { useTheme, SxProps } from '@mui/material'
import Badge from '@mui/material/Badge'
import { ReactNode } from 'react'

interface BadgeVariantParams {
  content: ReactNode
  variante?: string
  sx?: SxProps
}

const CustomBadge = ({
  content,
  variante = 'primary',
  sx,
}: BadgeVariantParams) => {
  const { palette } = useTheme()
  const variantesConfig = {
    primary: {
      ...sx,
      background: palette.primary.main,
      color: palette.primary.contrastText,
    },
    secondary: {
      ...sx,
      background: palette.secondary.main,
      color: palette.primary.contrastText,
    },
    neutro: {
      ...sx,
      background: palette.grey[500],
      color: palette.primary.contrastText,
    },
    opacity: {
      ...sx,
      background: palette.primary.main,
      color: palette.primary.contrastText,
      opacity: 0.7,
    },
    outline: {
      ...sx,
      border: '1px solid',
      borderColor: palette.primary.main,
      color: palette.primary.main,
    },
    gradient: {
      ...sx,
      backgroundImage: `linear-gradient(to bottom, ${palette.primary.main}, ${palette.info.main})`,
      color: palette.getContrastText(palette.primary.main),
      opacity: 0.7,
    },
    error: {
      ...sx,
      background: palette.error.main,
      color: palette.error.contrastText,
      opacity: 0.7,
    },
    success: {
      ...sx,
      background: palette.success.main,
      color: palette.error.contrastText,
      opacity: 0.7,
    },
    alert: {
      ...sx,
      background: palette.warning.main,
      color: palette.primary.contrastText,
      opacity: 0.7,
    },
  }
  const configVariante =
    variante && variantesConfig[variante as keyof typeof variantesConfig]
      ? variantesConfig[variante as keyof typeof variantesConfig]
      : variantesConfig['primary']

  return (
    <Badge
      badgeContent={content}
      sx={{
        '& .MuiBadge-badge': {
          ...configVariante,
        },
      }}
    />
  )
}

export default CustomBadge
