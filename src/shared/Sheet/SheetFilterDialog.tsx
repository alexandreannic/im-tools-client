import {Box, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel} from '@mui/material'
import {AaBtn} from '../Btn/AaBtn'
import {useI18n} from '../../core/i18n'
import React, {useEffect, useState} from 'react'
import {AaInput} from '../ItInput/AaInput'
import {SheetColumnProps} from './Sheet'
import {MultipleChoices} from '../MultipleChoices'
import {fnSwitch} from '@alexandreannic/ts-utils'
import {PeriodPicker} from '../PeriodPicker/PeriodPicker'
import {IconBtn} from 'mui-extension'
import {AAIconBtn} from '../IconBtn'

interface PropsBase {
  property?: string
  onClose?: () => void
  onClear?: () => void
  // propertyType?: SheetColumnProps<any>['type']
}

interface PropsMultiple extends PropsBase {
  propertyType: string[]
  value?: string[]
  onChange?: (property: string, value: string[]) => void

}

interface PropsSingle extends PropsBase {
  propertyType?: Exclude<SheetColumnProps<any>['type'], 'date' | string[]>
  onChange?: (property: string, value: string) => void
  value?: string
}

interface PropsDate extends PropsBase {
  propertyType?: 'date'
  onChange?: (property: string, value: string) => void
  value?: string
}

type Props = PropsMultiple | PropsSingle | PropsDate

export const SheetFilterDialog = ({
  property,
  value,
  onChange,
  onClear,
  onClose,
  propertyType,
}: Props) => {
  const {m} = useI18n()
  const [innerValue, setInnerValue] = useState<any>()
  useEffect(() => {
    value && setInnerValue(value)
  }, [value])

  if (!property) return <></>
  return (
    <Dialog open={!!property}>
      <DialogTitle sx={{display: 'flex', alignItems: 'center'}}>
        <Box sx={{flex: 1}}>{property ?? ''}</Box>
        <AAIconBtn onClick={() => {
          onClear?.()
          setInnerValue(undefined)
        }} icon="filter_list_off"/>
      </DialogTitle>
      <DialogContent>
        {Array.isArray(propertyType) ? (
          <MultipleChoices
            options={propertyType?.map(_ => ({value: _, children: _}))}
            initialValue={value as any}
            onChange={_ => _.length === 0 ? setInnerValue(undefined) : setInnerValue(_)}
          >
            {({options, toggleAll, allChecked, someChecked}) => (
              <>
                <FormControlLabel
                  sx={{display: 'block', fontWeight: t => t.typography.fontWeightBold}}
                  onClick={toggleAll}
                  control={<Checkbox size="small" checked={allChecked} indeterminate={!allChecked && someChecked}/>}
                  label={m.selectAll}
                />
                <Divider/>
                {options.map(o =>
                  <FormControlLabel
                    sx={{display: 'block'}}
                    key={o.key}
                    control={<Checkbox size="small" name={o.value} checked={o.checked} onChange={o.onChange}/>}
                    label={o.children}
                  />
                )}
              </>
            )}
          </MultipleChoices>
        ) : fnSwitch(propertyType!, {
          'date': () => (
            <PeriodPicker value={innerValue} onChange={setInnerValue}/>
          ),
        }, () => (
          <AaInput value={innerValue} onChange={e => setInnerValue(e.target.value)}/>
        ))}
      </DialogContent>
      <DialogActions>
        <AaBtn color="primary" onClick={onClose}>
          {m.close}
        </AaBtn>
        <AaBtn color="primary" onClick={() => property && onChange && onChange(property, innerValue)}>
          {m.filter}
        </AaBtn>
      </DialogActions>
    </Dialog>
  )
}