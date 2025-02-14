import { Grid } from '@mui/material'
import { HorizontalNonLinearStepper } from './components/HorizontalNonLinearStepper'

export default function StepsFormPageZustand() {
  return (
    <Grid
      container
      height={'100vh'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <HorizontalNonLinearStepper />
    </Grid>
  )
}
