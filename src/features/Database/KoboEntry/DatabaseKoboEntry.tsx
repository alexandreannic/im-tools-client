import {Dialog, DialogActions, DialogTitle} from '@mui/material'
import {useState} from 'react'

export const DatabaseKoboEntry = ({}: {}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open}>
      <DialogTitle>""</DialogTitle>
      <DialogActions>
      </DialogActions>
    </Dialog>
  )
}