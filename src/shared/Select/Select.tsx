import {Checkbox, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SxProps, Theme} from '@mui/material'
import React, {ReactNode, useEffect, useMemo, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {makeSx} from '@/core/theme'

interface AaSelectBase<T> {
  label?: ReactNode
  showUndefinedOption?: boolean
  options: {value: T, children: ReactNode, key?: string}[]
  sx?: SxProps<Theme>
}

interface AaSelectMultiple<T> extends AaSelectBase<T> {
  value: T[]
  multiple: true
  onChange: (t: T[], e: any) => void
}

interface AaSelectSimple<T> extends AaSelectBase<T> {
  value?: T
  multiple?: false
  onChange: (t: T, e: any) => void
}

type AaSelect<T> = AaSelectSimple<T> | AaSelectMultiple<T>

const style = makeSx({
  item: {
    py: 0,
    minHeight: '38px !important',
  }
})

export const AaSelect = <T extends string | number>({
  value,
  multiple,
  showUndefinedOption,
  label,
  onChange,
  options,
  sx,
  ...props
}: AaSelect<T>) => {
  const {m} = useI18n()
  const [innerValue, setInnerValue] = useState<T | T[]>()
  const IGNORED_VALUE_FOR_SELECT_ALL_ITEM = 'IGNORED_VALUE' as T
  const id = Math.random() + ''

  useEffect(() => {
    if (innerValue !== undefined)
      onChange(innerValue === '' ? undefined : innerValue as any, {})
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

  const displayedValue = useMemo(() => options.find(_ => _.value === innerValue)?.children, [options, innerValue])

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
        value={displayedValue}
        onChange={e => {
          const value = e.target.value
          if (![value].flat().includes(IGNORED_VALUE_FOR_SELECT_ALL_ITEM)) {
            setInnerValue(value as any)
          }
        }}
        input={<OutlinedInput label={label}/>}
        {...props}
      >
        {multiple && options.length > 5 && (
          <MenuItem dense value={IGNORED_VALUE_FOR_SELECT_ALL_ITEM} onClick={onSelectAll} divider sx={{
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
        {showUndefinedOption && (
          <MenuItem dense value={''} sx={style.item}/>
        )}
        {options.map((option, i) => (
          <MenuItem dense key={option.key ?? option.value} value={option.value} sx={style.item}>
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
