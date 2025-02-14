import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material'
import { FC, PropsWithChildren } from 'react'
import { TransitionZoom } from './Animations'
import { PortalProps } from '@mui/base/Portal'

interface Props {
  isOpen: boolean
  titulo: string
  texto: string
  disablePortal?: PortalProps['disablePortal']
  disableScrollLock?: boolean
}

export const AlertDialog: FC<PropsWithChildren<Props>> = ({
  isOpen,
  titulo,
  texto,
  children,
  disablePortal,
  disableScrollLock,
}) => {
  return (
    <Dialog
      open={isOpen}
      TransitionComponent={TransitionZoom}
      disablePortal={disablePortal}
      disableScrollLock={disableScrollLock}
    >
      <DialogTitle sx={{ m: 1, px: 2, py: 1, fontWeight: '600' }}>
        {titulo}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography
            component={'span'}
            fontWeight={'400'}
            fontSize={'medium'}
            variant="body2"
            color="text.secondary"
          >
            {texto}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>{children}</DialogActions>
    </Dialog>
  )
}
