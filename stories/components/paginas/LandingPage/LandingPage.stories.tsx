import { Meta, StoryFn } from '@storybook/react'
import { LandingPage } from './page'
import { Box } from '@mui/material'
import {
  createTheme,
  alpha,
  getContrastRatio,
  ThemeProvider,
  useTheme,
} from '@mui/material/styles'
import { NavbarLandingPage } from './NavbarLandingPage'
import { FooterLandingPage } from './FooterLandingPage'

export default {
  title: 'Páginas/Landing Page/Landing Page',
  component: LandingPage,
  parameters: {
    docs: {
      description: {
        component: `La plantilla ofrece una estructura estándar compuesta por componentes desarrollados, 
        que incluyen, navbar,footer y una estructura básica para el landing page `,
      },
    },
  },
} as Meta<typeof LandingPage>

const Template: StoryFn<typeof LandingPage> = () => {
  const themeP = useTheme()

  const redBase = '#F86F03'
  const redMain = alpha(redBase, 0.7)
  const maroonBase = '#FFA41B '
  const maroonMain = alpha(redBase, 0.7)

  const theme = createTheme({
    ...themeP,
    palette: {
      ...themeP.palette,
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
  })
  return (
    <>
      <ThemeProvider theme={theme}>
        <NavbarLandingPage />
        <Box component="main">
          <LandingPage />
        </Box>
        <FooterLandingPage />
      </ThemeProvider>
    </>
  )
}
export const Ejemplo = Template.bind({})
Ejemplo.storyName = 'Ejemplo 1'
Ejemplo.parameters = {
  docs: {
    description: {
      story: 'Ejemplo para el landing page',
    },
  },
}
