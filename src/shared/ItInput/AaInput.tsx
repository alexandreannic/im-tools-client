import {FilledInputProps, FormControl, FormControlProps, InputLabel, OutlinedInput, OutlinedInputProps} from '@mui/material'
import React from 'react'

export interface ItInputProps extends OutlinedInputProps {
  small?: boolean
  InputProps?: Partial<FilledInputProps>
  label?: string
}

export const AaInput = React.forwardRef(({
  small,
  label,
  InputProps,
  sx,
  ...props
}: ItInputProps, ref) => {
  const id = Math.random() + ''
  return (
    <FormControl size="small" sx={{width: '100%', ...sx}}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput id={id} {...props} ref={ref} size="small" margin="dense"/>
    </FormControl>
  )
  // return <TextField {...props} size="small" variant="outlined" margin="dense" inputRef={ref} />
})
