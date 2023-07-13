import {Box, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, Icon, MenuItem, Popover, PopoverProps} from '@mui/material'
import {AaBtn} from '../Btn/AaBtn'
import {useI18n} from '../../core/i18n'
import React, {useEffect, useState} from 'react'
import {AaInput} from '../ItInput/AaInput'
import {SheetColumnProps} from './Sheet'
import {MultipleChoices} from '../MultipleChoices'
import {fnSwitch} from '@alexandreannic/ts-utils'
import {PeriodPicker} from '../PeriodPicker/PeriodPicker'
import {AAIconBtn} from '../IconBtn'
import {Txt} from 'mui-extension'
import {OrderBy} from '@alexandreannic/react-hooks-lib'
import {Panel, PanelBody, PanelHead, PanelTitle} from '@/shared/Panel'
import {PanelFoot} from '@/shared/Panel/PanelFoot'
import {KoboApiForm, KoboQuestionSchema} from '@/core/sdk/server/kobo/KoboApi'
import {property} from 'lodash'
import {getKoboLabel} from '@/shared/Sheet/KoboDatabase'

interface PropsBase {
  orderBy?: OrderBy
  sortBy?: string
  onOrderByChange?: (_?: OrderBy) => void
  onClose?: () => void
  onClear?: () => void
  schema: KoboQuestionSchema
  langIndex?: number
  form: KoboApiForm['content']
  choicesIndex: Record<string, KoboApiForm['content']['choices'][0][]>
  value?: string[] | string | [Date, Date]
  onChange?: (columnName: string, value: string[] | string | [Date, Date]) => void
}

//
// interface PropsMultiple extends PropsBase {
//   propertyType: string[]
//   value?: string[]
//   onChange?: (property: string, value: string[]) => void
//
// }
//
// interface PropsSingle extends PropsBase {
//   propertyType?: Exclude<SheetColumnProps<any>['type'], 'date' | string[]>
//   onChange?: (property: string, value: string) => void
//   value?: string
// }
//
// interface PropsDate extends PropsBase {
//   propertyType?: 'date'
//   onChange?: (property: string, value: string) => void
//   value?: string
// }

type Props = PropsBase// PropsMultiple | PropsSingle | PropsDate

export const SheetFilterDialog = ({
  orderBy,
  sortBy,
  onOrderByChange,
  value,
  onChange,
  choicesIndex,
  onClear,
  onClose,
  anchorEl,
  schema,
  langIndex,
}: Props & Pick<PopoverProps, 'anchorEl'>) => {
  const {m} = useI18n()
  const [innerValue, setInnerValue] = useState<any>()
  useEffect(() => {
    value && setInnerValue(value)
  }, [value])

  if (!schema) return <></>
  return (
    <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={onClose}>
      <PanelHead action={
        <AAIconBtn icon="filter_alt_off" onClick={() => {
          onClear?.()
          setInnerValue(undefined)
        }}/>
      }>
        <Txt block sx={{maxWidth: 400}} truncate>{getKoboLabel(schema, langIndex)}</Txt>
      </PanelHead>
      <PanelBody>
        <Box sx={{display: 'flex', alignItems: 'center', borderBottom: t => `1px solid ${t.palette.divider}`, mb: 1}}>
          <Txt color="hint" sx={{flex: 1}}>{m.sort}</Txt>
          <MenuItem onClick={() => onOrderByChange?.(orderBy === 'desc' ? undefined : 'desc')}>
            <Icon fontSize="small" color={sortBy === schema.name && orderBy === 'desc' ? 'primary' : undefined}>
              south
            </Icon>
          </MenuItem>
          <MenuItem onClick={() => onOrderByChange?.(orderBy === 'asc' ? undefined : 'asc')}>
            <Icon fontSize="small" color={sortBy === schema.name && orderBy === 'asc' ? 'primary' : undefined}>
              north
            </Icon>
          </MenuItem>
        </Box>
        {(() => {
          switch (schema.type) {
            case 'start':
            case 'end':
            case 'date': {
              return <PeriodPicker value={innerValue} onChange={setInnerValue}/>
            }
            case 'select_one':
            case 'select_multiple': {
              return (
                <MultipleChoices
                  options={choicesIndex[schema.select_from_list_name!]?.map(_ => ({
                    value: _.name,
                    children: getKoboLabel(_, langIndex)
                  }))}
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
            default:
              return (
                <AaInput value={innerValue} onChange={e => setInnerValue(e.target.value)}/>
              )
          }
        })()}
      </PanelBody>
      <PanelFoot alignEnd>
        <AaBtn color="primary" onClick={onClose}>
          {m.close}
        </AaBtn>
        <AaBtn color="primary" onClick={() => onChange && onChange(schema.name, innerValue)}>
          {m.filter}
        </AaBtn>
      </PanelFoot>
    </Popover>
  )
}