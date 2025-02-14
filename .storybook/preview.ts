import type { Preview } from '@storybook/react'
import { themes } from 'storybook/internal/theming'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { decorators, docsConfig } from './ajustes'
const preview: Preview = {
  parameters: {
    darkMode: {
      classTarget: 'html',
      stylePreview: true,
      // Set the initial theme
      current: 'light',
      // Override the default dark theme
      dark: { ...themes.dark, appBg: 'black', appPreviewBg: 'black' },
      // Override the default light theme
      light: { ...themes.light, appBg: 'white', appPreviewBg: 'white' },
    },
    options: {
      storySort: {
        order: [
          'Principal',
          'Átomos',
          'Moléculas',
          'Organismos',
          'Plantillas',
          'Páginas',
        ],
        locales: 'es',
      },
    },
    backgrounds: {
      disable: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      //👇 The viewports you want to use
      viewports: INITIAL_VIEWPORTS,
      //👇 Your own default viewport
    },
    docs: {
      container: docsConfig,
    },
  },

  decorators: decorators,
  tags: ['autodocs']
}

export default preview
