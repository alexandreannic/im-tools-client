import {AaInput, AaInputProps} from '@/shared/ItInput/AaInput'
import {AAIconBtn} from '@/shared/IconBtn'
import {DebouncedInput} from '@/shared/DebouncedInput'
import React from 'react'

export const TableInput = ({
  debounce = 1250,
  value,
  originalValue,
  onChange,
  ...props
}: {
  onChange: (_: string | undefined) => void
  originalValue?: string | null
  value?: string
  debounce?: number
} & Omit<AaInputProps, 'onChange' | 'value'>) => {
  return (
    <DebouncedInput<string>
      debounce={debounce}
      value={value}
      onChange={_ => onChange(_ === '' || _ === originalValue ? undefined : _)}
    >
      {(value, onChange) => (
        <AaInput
          helperText={null}
          value={value}
          onChange={e => onChange(e.target.value)}
          endAdornment={value !== originalValue && originalValue !== null &&
            <AAIconBtn
              size="small"
              sx={{mr: -2, mt: .25}}
              onClick={() => onChange(originalValue ?? '')}
            >
              clear
            </AAIconBtn>
          }
          {...props}
        />
      )}
    </DebouncedInput>
  )
}