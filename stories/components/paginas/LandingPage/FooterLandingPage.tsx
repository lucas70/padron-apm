import { Box, useTheme } from '@mui/material'
import Image from 'next/image'
import quesoFooter from '../../../../stories/assets/queso.png'

export const FooterLandingPage = () => {
  const theme = useTheme()
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: '#fff',
        textAlign: 'center',
        py: 2,
      }}
      borderTop={1}
      borderColor={'ThreeDHighlight'}
    >
      <Box>
        <Image
          src={quesoFooter}
          alt={'imagen_footer'}
          width={681}
          height={528}
          style={{ width: 'auto', height: '60px' }}
        />
      </Box>
    </Box>
  )
}
