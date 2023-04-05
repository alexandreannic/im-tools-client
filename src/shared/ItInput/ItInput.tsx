import {FilledInputProps, TextField, TextFieldProps} from '@mui/material'
import React from 'react'

export type ItInputProps = Omit<TextFieldProps, 'variant' | 'margin'> & {
  small?: boolean
  InputProps?: Partial<FilledInputProps>
}

export const ItInput = React.forwardRef(({small, ...props}: ItInputProps, ref) => {
  return <TextField {...props} size="small" variant="outlined" margin="dense" inputRef={ref} />
})
