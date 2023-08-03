import {Dialog, DialogActions, DialogTitle} from '@mui/material'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {forwardRef, useImperativeHandle, useRef, useState} from 'react'

export const KoboFormView = forwardRef(({}: {}, ref) => {
  const [open, setOpen] = useState(false)
  const innerRef = useRef<any>()

  useImperativeHandle(ref, () => ({
    openDialog: () => setOpen(true),
    closeDialog: () => setOpen(false)
  }))

  return (
    <Dialog open={open} ref={innerRef}>
      <DialogTitle>""</DialogTitle>
      <DialogActions>
        <AaBtn onClick={() => setOpen(false)} color="primary" autoFocus>
          Close
        </AaBtn>
      </DialogActions>
    </Dialog>
  )
}