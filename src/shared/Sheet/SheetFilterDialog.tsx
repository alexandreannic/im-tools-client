import {Box, Checkbox, Divider, FormControlLabel, Icon, MenuItem, Popover, PopoverProps, Slider, Switch} from '@mui/material'
import {AaBtn} from '../Btn/AaBtn'
import {useI18n} from '../../core/i18n'
import React, {Dispatch, ReactNode, SetStateAction, useEffect, useMemo, useState} from 'react'
import {AaInput} from '../ItInput/AaInput'
import {MultipleChoices} from '../MultipleChoices'
import {PeriodPicker} from '../PeriodPicker/PeriodPicker'
import {AAIconBtn} from '../IconBtn'
import {Txt} from 'mui-extension'
import {OrderBy} from '@alexandreannic/react-hooks-lib'
import {PanelBody, PanelHead} from '@/shared/Panel'
import {PanelFoot} from '@/shared/Panel/PanelFoot'
import {SheetOptions} from '@/shared/Sheet/sheetType'
import {Arr} from '@alexandreannic/ts-utils'
import {SheetFilterValueDate, SheetFilterValueNumber, SheetFilterValueSelect, SheetFilterValueString, SheetRow} from '@/shared/Sheet/Sheet'
import {type} from 'os'

export type SheetFilterDialogProps = Pick<PopoverProps, 'anchorEl'> & {
  orderBy?: OrderBy
  sortBy?: string
  onOrderByChange?: (_?: OrderBy) => void
  onClose?: () => void
  onClear?: () => void
  columnId: string
  title: ReactNode
  options?: SheetOptions[]
  data: SheetRow[]
} & ({
  onChange?: (columnName: string, value: SheetFilterValueNumber) => void
  value: SheetFilterValueNumber
  type: 'number'
} | {
  onChange?: (columnName: string, value: SheetFilterValueDate) => void
  value: SheetFilterValueDate
  type: 'date'
} | {
  onChange?: (columnName: string, value: SheetFilterValueSelect) => void
  value: SheetFilterValueSelect
  type: 'select_one' | 'select_multiple'
} | {
  onChange?: (columnName: string, value: SheetFilterValueString) => void
  value: SheetFilterValueString
  type: 'string'
})

export const SheetFilterDialog = ({
  data,
  orderBy,
  sortBy,
  onOrderByChange,
  value,
  onChange,
  onClear,
  onClose,
  anchorEl,
  // schema,
  columnId,
  title,
  options,
  type,
}: SheetFilterDialogProps) => {
  const {m} = useI18n()
  const [innerValue, setInnerValue] = useState<any>()
  useEffect(() => {
    value && setInnerValue(value)
  }, [value])

  return (
    <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={onClose}>
      <PanelHead action={
        <AAIconBtn children="filter_alt_off" onClick={() => {
          onClear?.()
          setInnerValue(undefined)
        }}/>
      }>
        <Txt block sx={{maxWidth: 340}} truncate>{title}</Txt>
      </PanelHead>
      <PanelBody>
        <Box sx={{display: 'flex', alignItems: 'center', borderBottom: t => `1px solid ${t.palette.divider}`, mb: 1}}>
          <Txt color="hint" sx={{flex: 1}}>{m.sort}</Txt>
          <MenuItem onClick={() => onOrderByChange?.(orderBy === 'desc' ? undefined : 'desc')}>
            <Icon
              fontSize="small"
              color={sortBy === columnId && orderBy === 'desc' ? 'primary' : undefined}
              children="south"
            />
          </MenuItem>
          <MenuItem onClick={() => onOrderByChange?.(orderBy === 'asc' ? undefined : 'asc')}>
            <Icon
              fontSize="small"
              color={sortBy === columnId && orderBy === 'asc' ? 'primary' : undefined}
              children="north"
            />
          </MenuItem>
        </Box>
        {type && (() => {
          switch (type) {
            case 'date':
              return <PeriodPicker value={innerValue} onChange={setInnerValue}/>
            case 'select_one':
            case 'select_multiple':
              return (
                <SheetFilterDialogSelect options={options} value={innerValue} onChange={setInnerValue}/>
              )
            case 'number': {
              return (
                <SheetFilterDialogNumber data={data} columnId={columnId} value={innerValue} onChange={setInnerValue}/>
              )
            }
            default:
              return (
                <SheetFilterDialogText value={innerValue} onChange={setInnerValue}/>
              )
          }
        })()}
      </PanelBody>
      <PanelFoot alignEnd>
        <AaBtn color="primary" onClick={onClose}>
          {m.close}
        </AaBtn>
        <AaBtn color="primary" onClick={() => onChange && onChange(columnId, innerValue)}>
          {m.filter}
        </AaBtn>
      </PanelFoot>
    </Popover>
  )
}

export const SheetFilterDialogSelect = ({
  value,
  onChange,
  options,
}: {
  value: SheetFilterValueString
  onChange: Dispatch<SetStateAction<SheetFilterValueSelect>>
  options?: SheetOptions[]
}) => {
  const {m} = useI18n()
  const [filter, setFilter] = useState<string>('')
  return (
    <MultipleChoices
      options={options?.filter(_ => filter === '' || (_.value ?? '').includes(filter)).map((_, i) => ({
        key: i,
        value: _.value ?? '',
        children: _.label
      })) ?? []}
      initialValue={value as any}
      onChange={onChange}
    >
      {({options, toggleAll, allChecked, someChecked}) => (
        <>
          <FormControlLabel
            sx={{display: 'block', fontWeight: t => t.typography.fontWeightBold}}
            onClick={toggleAll}
            control={<Checkbox size="small" checked={allChecked} indeterminate={!allChecked && someChecked}/>}
            label={m.selectAll}
          />
          <AaInput label={m.filterPlaceholder} helperText={null} sx={{mb: 1}} onChange={e => setFilter(e.target.value)}/>
          <Divider/>
          <Box sx={{maxHeight: 350, overflowY: 'auto'}}>
            {options.map(o =>
              <FormControlLabel
                sx={{display: 'block'}}
                key={o.key}
                control={<Checkbox size="small" name={o.value} checked={o.checked} onChange={o.onChange}/>}
                label={o.children}
              />
            )}
          </Box>
        </>
      )}
    </MultipleChoices>
  )
}

export const SheetFilterDialogText = ({
  value,
  onChange,
}: {
  value: SheetFilterValueString
  onChange: Dispatch<SetStateAction<SheetFilterValueString>>
}) => {
  const {m} = useI18n()
  return (
    <>
      <FormControlLabel
        sx={{mb: 1}}
        label={m.filterBlanks}
        value={value?.filterBlank}
        control={
          <Switch checked={value?.filterBlank} onChange={e => onChange(prev => ({...prev, filterBlank: e.target.checked}))}/>
        }
      />
      <AaInput value={value?.value} onChange={e => onChange(prev => ({...prev, value: e.target.value}))}/>
    </>
  )
}

export const SheetFilterDialogNumber = ({
  value,
  data,
  columnId,
  onChange,
}: Pick<SheetFilterDialogProps, 'data' | 'columnId'> & {
  value: SheetFilterValueNumber
  onChange: Dispatch<SetStateAction<SheetFilterValueNumber>>
}) => {
  const {min, max} = useMemo(() => {
    const values = Arr(data).map(_ => _[columnId] as number | undefined).compact()
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    }
  }, [type, data])

  const mappedValue = [value?.[0] ?? min, value?.[1] ?? max]

  useEffect(() => {
    onChange(value)
  }, [value])

  return (
    <>
      <Slider min={min} max={max} value={mappedValue} onChange={(e, _) => onChange(_ as [number, number])}/>
      <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
        <AaInput type="number" sx={{width: 60}} value={mappedValue[0]} onChange={e => onChange(prev => [+e.target.value, prev?.[1]])}/>
        <AaInput type="number" sx={{width: 60}} value={mappedValue[1]} onChange={e => onChange(prev => [prev?.[0], +e.target.value])}/>
      </Box>
    </>
  )
}