import {Checkbox, FormControl, FormControlProps, InputLabel, MenuItem, OutlinedInput, Select, SxProps, Theme} from '@mui/material'
import React, {ReactNode, useEffect, useMemo, useState} from 'react'
import {useI18n} from '../../core/i18n'
import {makeSx} from '@/core/theme'

type Option<T extends string | number = string> = {value: T, children: ReactNode, key?: string}

export interface AaSelectMultipleProps<T extends string | number = string> extends Pick<FormControlProps, 'disabled' | 'id'> {
  label?: ReactNode
  showUndefinedOption?: boolean
  options: Option<T>[] | string[]
  sx?: SxProps<Theme>
  defaultValue?: T[]
  value?: T[]
  onChange: (t: T[], e: any) => void
}

const style = makeSx({
  item: {
    py: 0,
    minHeight: '38px !important',
  }
})

const IGNORED_VALUE_FOR_SELECT_ALL_ITEM = 'IGNORED_VALUE'

export const AaSelectMultiple = <T extends string | number>({
  defaultValue,
  value,
  showUndefinedOption,
  label,
  id,
  onChange,
  sx,
  ...props
}: AaSelectMultipleProps<T>) => {
  const {m} = useI18n()
  const [innerValue, setInnerValue] = useState<T[] | undefined>(defaultValue)

  const options = useMemo(() => {
    const _options = props.options ?? []
    if (typeof _options[0] === 'string') {
      return props.options.map(_ => ({value: _, children: _})) as Option<T>[]
    }
    return _options as Option<T>[]
  }, [props.options])

  useEffect(() => {
    if (innerValue !== undefined)
      onChange(innerValue, {})
  }, [innerValue])

  useEffect(() => {
    if (value && value !== innerValue)
      setInnerValue(value)
  }, [value])

  const onSelectAll = (e: any) => {
    if (options.length === innerValue?.length)
      setInnerValue([])
    else {
      setInnerValue(_ => options.map(_ => _.value))
    }
  }

  return (
    <FormControl size="small" sx={{width: '100%', ...sx}}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select
        // endAdornment={
        //   // <InputAdornment position="start">
        //     <CircularProgress size={20}/>
        //   // </InputAdornment>
        // }
        label={label}
        size="small"
        margin="dense"
        id={id}
        value={innerValue ?? []}
        // defaultValue={defaultValue ?? []}
        multiple={true}
        renderValue={v => options.find(_ => v.includes(_.value))?.children + (v.length > 1 ? ` +${v.length - 1}  selected` : '')}
        onChange={e => {
          const value = e.target.value
          if (![value].flat().includes(IGNORED_VALUE_FOR_SELECT_ALL_ITEM as any)) {
            setInnerValue(value as any)
          }
        }}
        input={
          <OutlinedInput
            label={label}
            // endAdornment={
            //   <CircularProgress size={24} color="secondary"/>
          />
        }
        {...props}
      >
        {options.length > 5 && (
          <MenuItem dense value={IGNORED_VALUE_FOR_SELECT_ALL_ITEM} onClick={onSelectAll} divider sx={{
            py: 0,
            fontWeight: t => t.typography.fontWeightBold,
          }}>
            <Checkbox size="small" checked={innerValue?.length === options.length} sx={{
              paddingTop: `8px !important`,
              paddingBottom: `8px !important`,
            }}/>
            {m.selectAll}
          </MenuItem>
        )}
        {showUndefinedOption && (
          <MenuItem dense value={null as any} sx={style.item}/>
        )}
        {options.map((option, i) => (
          <MenuItem dense key={option.key ?? option.value} value={option.value} sx={style.item}>
            <Checkbox size="small" checked={innerValue?.includes(option.value)} sx={{
              paddingTop: `8px !important`,
              paddingBottom: `8px !important`,
            }}/>
            {option.children}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
