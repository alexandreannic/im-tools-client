import {FormControl, InputLabel, OutlinedInput, OutlinedInputProps, TextFieldProps} from '@mui/material'
import React, {useEffect, useRef} from 'react'

export interface AaInputProps extends OutlinedInputProps, Pick<TextFieldProps, 'InputLabelProps'> {
  small?: boolean
  label?: string
}

export const AaInput = React.forwardRef(({
  small,
  label,
  sx,
  InputLabelProps,
  ...props
}: AaInputProps, ref) => {
  const id = Math.random() + ''
  const inputElement = useRef<HTMLInputElement>()
  useEffect(() => {
    if (props.autoFocus) inputElement?.current?.focus()
  }, [])

  return (
    <FormControl size="small" sx={{width: '100%', ...sx}}>
      <InputLabel {...InputLabelProps} htmlFor={id}>{label}</InputLabel>
      <OutlinedInput inputRef={inputElement} id={id} {...props} ref={ref} size="small" margin="dense"/>
    </FormControl>
  )
  // return <TextField {...props} size="small" variant="outlined" margin="dense" inputRef={ref} />
})
