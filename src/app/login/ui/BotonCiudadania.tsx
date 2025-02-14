import Image from 'next/image'
import { Box, Button, ButtonProps, useTheme } from '@mui/material'
import { FC, MouseEventHandler, PropsWithChildren } from 'react'
import { styled } from '@mui/system'

import { useThemeContext } from '@/themes/ThemeRegistry'

export interface BotonCiudadaniaType {
  altText: string
  disabled?: boolean | undefined
  accion: MouseEventHandler<any> | undefined
  fullWidth?: boolean
}

const ColorButton = styled(Button)<ButtonProps>(({}) => {
  const { themeMode } = useThemeContext()
  return {
    backgroundColor: themeMode == 'light' ? '#fff' : '#2a2928',
    borderColor: '#949493',
    '&:hover': {
      backgroundColor: themeMode == 'light' ? '#e9e9e9' : '#3f3e3d',
      borderColor: themeMode == 'light' ? '#696968' : '#fff',
    },
  }
})

export const BotonCiudadania: FC<PropsWithChildren<BotonCiudadaniaType>> = ({
  disabled,
  accion,
  children,
  altText,
  fullWidth,
}) => {
  const { palette } = useTheme()
  const { themeMode } = useThemeContext()
  return (
    <ColorButton
      type="button"
      sx={{ borderRadius: 2 }}
      variant="outlined"
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={accion}
    >
      <Image
        src={`/logo_ciudadania_redondo.png`}
        alt={altText}
        width="35"
        height="35"
        style={{
          maxWidth: '100%',
          height: 'auto',
          // border: '1px solid #a9a8a8',
          borderRadius: 20,
        }}
      />
      <Box
        sx={{
          px: 0,
          color: themeMode == 'light' ? palette.grey[800] : '#fff',
        }}
      >
        {children}
      </Box>
    </ColorButton>
  )
}
