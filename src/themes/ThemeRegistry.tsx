'use client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { lightTheme } from '@/themes/light-theme'
import { useMediaQuery } from '@mui/material'
import { darkTheme } from '@/themes/dark-theme'
import { useDebouncedCallback } from 'use-debounce'
import { guardarCookie, leerCookie } from '@/utils'
import { imprimir } from '@/utils/imprimir'

const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  themeMode: ThemeMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType)
export const useThemeContext = () => useContext(ThemeContext)
export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const isDarkOS = useMediaQuery(DARK_SCHEME_QUERY)

  const isMountRef = useRef(false)

  const [themeMode, setThemeMode] = useState<ThemeMode>(
    isDarkOS ? 'dark' : 'light'
  )

  const debounced = useDebouncedCallback(() => {
    isMountRef.current = true
  }, 500)

  const guardarModoOscuro = () => {
    setThemeMode('dark')
    guardarCookie('themeMode', 'dark')
    imprimir('🌙')
  }

  const guardarModoClaro = () => {
    setThemeMode('light')
    guardarCookie('themeMode', 'light')
    imprimir('☀️')
  }

  const guardarModoAutomatico = () => {
    setThemeMode(isDarkOS ? 'dark' : 'light')
    guardarCookie('themeMode', isDarkOS ? 'dark' : 'light')
    imprimir('isDarkOS: ', isDarkOS ? '🌙' : '☀️')
  }

  const toggleTheme = () => {
    switch (themeMode) {
      case 'light':
        guardarModoOscuro()
        break
      case 'dark':
        guardarModoClaro()
        break
      default:
    }
  }

  useEffect(() => {
    const themeModeSaved = leerCookie('themeMode')
    imprimir('themeMode', themeModeSaved)

    if (!themeModeSaved) {
      guardarModoAutomatico()
      isMountRef.current = false
      return
    }

    switch (themeModeSaved) {
      case 'dark':
        guardarModoOscuro()
        break
      case 'light':
        guardarModoClaro()
        break
      default:
        guardarModoClaro()
        break
    }
    isMountRef.current = false
    return

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isMountRef.current) {
      guardarModoAutomatico()
    }
    debounced()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkOS])

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </ThemeContext.Provider>
  )
}
