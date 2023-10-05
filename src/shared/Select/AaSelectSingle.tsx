import {Checkbox, FormControl, FormControlProps, InputLabel, MenuItem, OutlinedInput, Select, SxProps, Theme} from '@mui/material'
import React, {ReactNode, useEffect, useMemo, useState} from 'react'
import {useI18n} from '@/core/i18n'
import {makeSx} from '@/core/theme'

type Option<T extends string | number = string> = {value: T, children: ReactNode, key?: string}

export interface AaSelectSingleProps<T extends string | number = string> extends Pick<FormControlProps, 'placeholder' | 'disabled' | 'id'> {
  label?: ReactNode
  hideNullOption?: boolean
  options: Option<T>[] | string[]
  sx?: SxProps<Theme>
  defaultValue?: T
  value?: T
  multiple?: false
  onChange: (t: T | null, e: any) => void
}

const style = makeSx({
  item: {
    py: 0,
    minHeight: '38px !important',
  }
})

const IGNORED_VALUE_EMPTY = ''

export const AaSelectSingle = <T extends string | number>({
  defaultValue,
  hideNullOption,
  label,
  id,
  onChange,
  sx,
  value,
  placeholder,
  ...props
}: AaSelectSingleProps<T>) => {
  const {m} = useI18n()
  // const [innerValue, setInnerValue] = useState<T | null>(null)

  const options = useMemo(() => {
    const _options = props.options ?? []
    if (typeof _options[0] === 'string') {
      return props.options.map(_ => ({value: _, children: _})) as Option<T>[]
    }
    return _options as Option<T>[]
  }, [props.options])

  return (
    <FormControl size="small" sx={{width: '100%', ...sx}}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select
        label={label}
        size="small"
        margin="dense"
        placeholder={placeholder}
        id={id}
        value={value ?? IGNORED_VALUE_EMPTY}
        defaultValue={defaultValue}
        multiple={false}
        onChange={e => {
          const value = e.target.value as T
          if (value === IGNORED_VALUE_EMPTY)
            onChange(null, e)
          onChange(value, e)
          // setInnerValue(value)
        }}
        input={
          <OutlinedInput
            label={label}
            placeholder={placeholder}
          />
        }
        {...props}
      >
        {!hideNullOption && (
          <MenuItem dense value={IGNORED_VALUE_EMPTY} sx={style.item}/>
        )}
        {options.map((option, i) => (
          <MenuItem dense key={option.key ?? option.value} value={option.value} sx={style.item}>
            {option.children}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
