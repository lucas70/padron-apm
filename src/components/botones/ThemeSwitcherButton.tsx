import { IconButton, IconButtonProps, Tooltip } from '@mui/material'
import { useThemeContext } from '@/themes/ThemeRegistry'
import { Icono } from '@/components/Icono'

interface ThemeSwitcherButtonProps extends IconButtonProps {}

const ThemeSwitcherButton = ({ ...rest }: ThemeSwitcherButtonProps) => {
  const { themeMode, toggleTheme } = useThemeContext()
  return (
    <Tooltip
      title={
        themeMode === 'light' ? `Cambiar a modo oscuro` : `Cambiar a modo claro`
      }
    >
      <IconButton {...rest} onClick={toggleTheme}>
        {themeMode === 'light' ? (
          <Icono color={'action'}>light_mode</Icono>
        ) : (
          <Icono color={'action'}>dark_mode</Icono>
        )}
      </IconButton>
    </Tooltip>
  )
}
export default ThemeSwitcherButton
