import { Meta, StoryFn } from '@storybook/react'
import TestLogin from './TestLogin'

import {
  createTheme,
  alpha,
  getContrastRatio,
  ThemeProvider,
} from '@mui/material/styles'
import { LayoutTestLogin } from './ui/LayoutTestLogin'
import { siteName } from '@/utils'

export default {
  title: 'Plantillas/Login/Login',
  component: TestLogin,
  parameters: {
    docs: {
      description: {
        component:
          'La plantilla de `Login` proporciona un estilo renovado que puede adaptarse fácilmente a cualquier sistema de inicio de sesión.',
      },
    },
  },
} as Meta<typeof TestLogin>

const redBase = '#b51e41'
const redMain = alpha(redBase, 0.7)
const maroonBase = '#675456'
const maroonMain = alpha(redBase, 0.7)

const theme = createTheme({
  palette: {
    primary: {
      main: redBase,
      light: alpha(redBase, 0.5),
      dark: alpha(redBase, 0.9),
      contrastText: getContrastRatio(redMain, '#fff') > 4.5 ? '#fff' : '#111',
    },
    secondary: {
      main: maroonBase,
      light: alpha(maroonBase, 0.5),
      dark: alpha(maroonBase, 0.9),
      contrastText:
        getContrastRatio(maroonMain, '#fff') > 4.5 ? '#fff' : '#111',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: '600',
          '&:hover': {
            backgroundColor: '#bc3454',
          },
        },
      },
    },
  },
})
// replica del componente
export const Template: StoryFn<typeof TestLogin> = () => {
  return (
    <LayoutTestLogin title={siteName()}>
      <ThemeProvider theme={theme}>
        <TestLogin />
      </ThemeProvider>
    </LayoutTestLogin>
  )
}
