import React, {ReactNode, useMemo} from 'react'
import {Checkbox, FormControlLabel, FormGroup} from '@mui/material'
import {makeSx, Txt} from 'mui-extension'
import {DashboardFilterLabel} from './DashboardFilterLabel'
import {useI18n} from '../../../core/i18n'
import {combineSx} from '../../../core/theme'

const css = makeSx({
  optionSelectAll: {
    display: 'block',
    borderBottom: t => `1px solid ${t.palette.divider}`,
  },
  option: {
    whiteSpace: 'nowrap',
    px: 1,
    mr: 0,
    transition: t => t.transitions.create('all'),
    '&:hover': {
      background: t => t.palette.action.hover,
    }
  }
})

export const DashboardFilterOptions = ({
  value = [],
  label,
  options,
  icon,
  onChange,
}: {
  icon?: string
  value: string[]
  label: string
  options: {name: string, label: ReactNode}[]
  onChange?: (_: string[]) => void
}) => {
  const {m} = useI18n()

  const valuesLabel = useMemo(() => {
    return value.map(_ => options.find(o => o.name === _)?.label)
  }, [value, options])

  const allValues = useMemo(() => options.map(_ => _.name), [options])

  const someChecked = !!allValues.find(_ => value?.includes(_))

  const allChecked = allValues.length === value?.length

  const toggleAll = () => onChange?.(value?.length === 0 ? allValues : [])

  return (
    <DashboardFilterLabel icon={icon} active={value.length > 0} label={
      <>
        {value.length > 0 ? valuesLabel[0] : label}
        {value.length > 1 && <>&nbsp;+ {value.length - 1}</>}
      </>
    }>
      <FormControlLabel
        onClick={toggleAll}
        control={<Checkbox checked={allChecked} indeterminate={!allChecked && someChecked}/>}
        label={
          // <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          <Txt bold sx={{mr: 1.5}}>{m.selectAll}</Txt>
          // <AAIconBtn icon="clear" size="small" sx={{ml: 1.5}}/>
          // </Box>
        }
        sx={combineSx(css.option, css.optionSelectAll)}
      />
      <FormGroup onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        if (!onChange) return
        if (e.target.checked) {
          onChange([...value, e.target.name])
        } else {
          onChange(value.filter(_ => _ !== e.target.name))
        }
      }}>
        {options.map(o =>
          <FormControlLabel
            key={o.name}
            control={<Checkbox name={o.name} checked={value.includes(o.name)}/>}
            label={o.label}
            sx={css.option}
          />
        )}
      </FormGroup>
    </DashboardFilterLabel>
  )
}
