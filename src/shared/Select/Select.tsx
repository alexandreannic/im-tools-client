import {Checkbox, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SxProps, Theme} from '@mui/material'
import React, {ReactNode, useEffect, useState} from 'react'
import {useI18n} from '../../core/i18n'

interface AaSelectBase<T, V> {
  label?: ReactNode
  options: {value: T, children: ReactNode, key?: string}[]
  sx?: SxProps<Theme>
}

interface AaSelectMultiple<T, V> extends AaSelectBase<T, V> {
  value: T[]
  multiple: true
  onChange: (t: T[], e: any) => void
}

interface AaSelectSimple<T, V> extends AaSelectBase<T, V> {
  value: T
  multiple?: false
  onChange: (t: T, e: any) => void
}

type AaSelect<T, V> = AaSelectSimple<T, V> | AaSelectMultiple<T, V>

export const AaSelect = <T extends string, V extends string = string>({
  value,
  multiple,
  label,
  onChange,
  options,
  sx,
  ...props
}: AaSelect<T, V>) => {
  const {m} = useI18n()
  const [innerValue, setInnerValue] = useState<T | T[]>()
  const IGNORED_VALUE = 'IGNORED_VALUE' as T
  const id = Math.random() + ''

  useEffect(() => {
    if (innerValue) onChange(innerValue as any, {})
  }, [innerValue])

  const onSelectAll = (e: any) => {
    if (multiple) {
      if (options.length === value.length)
        setInnerValue([])
      else {
        setInnerValue(_ => options.map(_ => _.value))
      }
    }
  }

  return (
    <FormControl size="small" sx={{width: '100%', ...sx}}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select
        label={label}
        size="small"
        margin="dense"
        id={id}
        renderValue={x => [x].flat().join(', ')}
        multiple={multiple}
        value={value}
        onChange={e => {
          const value = e.target.value
          if (![value].flat().includes(IGNORED_VALUE)) {
            setInnerValue(value as any)
          }
        }}
        input={<OutlinedInput label={label}/>}
        {...props}
      >
        {multiple && options.length > 5 && (
          <MenuItem dense value={IGNORED_VALUE} onClick={onSelectAll} divider disableGutters sx={{
            py: 0,
            fontWeight: t => t.typography.fontWeightBold,
          }}>
            <Checkbox size="small" checked={value.length === options.length} sx={{
              paddingTop: `8px !important`,
              paddingBottom: `8px !important`,
            }}/>
            {m.selectAll}
          </MenuItem>
        )}
        {options.map((option, i) => (
          <MenuItem dense key={option.key ?? option.value} disableGutters value={option.value} sx={{
            py: 0,
            minHeight: '38px !important',
          }}>
            {multiple && (
              <Checkbox size="small" checked={value.includes(option.value)} sx={{
                paddingTop: `8px !important`,
                paddingBottom: `8px !important`,
              }}/>
            )}
            {option.children}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
