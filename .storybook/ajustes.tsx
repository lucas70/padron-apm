import { Decorator } from '@storybook/react'
import { ThemeProvider } from '@mui/material/styles'

import { themes } from 'storybook/internal/theming'
import { addons } from 'storybook/internal/preview-api'
import { DocsContainer, DocsContainerProps } from '@storybook/blocks'

import React, {
  createElement,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react'
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode'
import { darkTheme } from '@/themes/dark-theme'
import { lightTheme } from '@/themes/light-theme'
// get channel to listen to event emitter
const channel = addons.getChannel()

// create a component that listens for the DARK_MODE event
const ThemeWrapper = (props: PropsWithChildren) => {
  // this example uses hook but you can also use class component as well
  const [isDark, setDark] = useState(false)

  useEffect(() => {
    // listen to DARK_MODE event
    channel.on(DARK_MODE_EVENT_NAME, setDark)

    return () => channel.off(DARK_MODE_EVENT_NAME, setDark)
  }, [channel, setDark])

  // render your custom theme provider
  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      {props.children}
    </ThemeProvider>
  )
}

export const decorators: Array<Decorator> = [
  (Story) => (
    <>
      <Story />
    </>
  ),
  (renderStory) => <ThemeWrapper>{renderStory()}</ThemeWrapper>,
]

export const docsConfig = (props: DocsContainerProps) => {
  const [isDark, setDark] = useState(false)

  useEffect(() => {
    // listen to DARK_MODE event
    channel.on(DARK_MODE_EVENT_NAME, setDark)

    return () => channel.off(DARK_MODE_EVENT_NAME, setDark)
  }, [channel, setDark])

  const currentProps = { ...props }
  currentProps.theme = isDark
    ? { ...themes.dark, appPreviewBg: 'black', barHoverColor: '' }
    : {
        ...themes.light,
        appPreviewBg: 'white',
        barHoverColor: '',
      }
  return createElement(DocsContainer, currentProps)
}
