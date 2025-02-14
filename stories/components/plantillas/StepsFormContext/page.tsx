import { Grid } from '@mui/material'
import { FromProvider } from './components/FormContext'
import { HorizontalNonLinearStepper } from './components/HorizontalNonLinearStepper'

export default function StepsFormPageContext() {
  return (
    <FromProvider>
      <Grid
        container
        height={'100vh'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <HorizontalNonLinearStepper />
      </Grid>
    </FromProvider>
  )
}
