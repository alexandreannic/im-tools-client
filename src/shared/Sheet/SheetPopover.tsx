import {Box, Popover, PopoverProps} from '@mui/material'
import React, {ReactNode, useMemo} from 'react'
import {ChartTools} from '@/core/chartTools'
import {HorizontalBarChartGoogle} from '@/shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {Arr} from '@alexandreannic/ts-utils'
import {PanelBody, PanelHead} from '@/shared/Panel'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {useI18n} from '@/core/i18n'
import {PanelFoot} from '@/shared/Panel/PanelFoot'
import {Txt} from 'mui-extension'
import {KoboLineChartDate} from '@/features/Dashboard/shared/KoboLineChartDate'
import {SheetOptions} from '@/shared/Sheet/sheetType'
import {KeyOf} from '@/utils/utils'

const RenderRow = ({label, value}: {
  label: ReactNode
  value: ReactNode
}) => {
  return (
    <Box sx={{display: 'flex', '&:not(:last-of-child)': {mb: 2}}}>
      <Txt color="hint" sx={{flex: 1, mr: 2}}>{label}</Txt>
      <Txt block bold>{value}</Txt>
    </Box>
  )
}

export const NumberChoicesPopover = <T, >({
  question,
  data,
  mapValues,
  anchorEl,
  onClose,
}: {
  mapValues?: (_: any) => any
  question: KeyOf<T>
  data: T[]
} & Pick<PopoverProps, 'anchorEl' | 'onClose'>) => {
  const {m, formatLargeNumber} = useI18n()
  const chart = useMemo(() => {
    const mapped = Arr(data).map(_ => mapValues? mapValues(_) : _[question]).compact().map(_ => +_)
    const min = Math.min(...mapped)
    const max = Math.max(...mapped)
    const sum = mapped.sum()
    const avg = sum / mapped.length
    return {mapped, min, max, sum, avg,}
  }, [data, question])
  return (
    <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={onClose}>
      <PanelHead>
        {question as string}
      </PanelHead>
      <PanelBody>
        <RenderRow label={m.count} value={formatLargeNumber(chart.mapped.length)}/>
        <RenderRow label={m.sum} value={formatLargeNumber(chart.sum)}/>
        <RenderRow label={m.average} value={chart.avg.toFixed(2)}/>
        <RenderRow label={m.min} value={formatLargeNumber(chart.min)}/>
        <RenderRow label={m.max} value={formatLargeNumber(chart.max)}/>
      </PanelBody>
      <PanelFoot alignEnd>
        <AaBtn color="primary" onClick={onClose as any}>
          {m.close}
        </AaBtn>
      </PanelFoot>
    </Popover>
  )
}

export const MultipleChoicesPopover = <T, >({
  property,
  title,
  data,
  anchorEl,
  onClose,
  multiple,
  translations,
}: {
  title?: ReactNode
  translations?: SheetOptions[]
  multiple?: boolean
  property: keyof T
  data: T[]
} & Pick<PopoverProps, 'anchorEl' | 'onClose'>) => {
  const {m} = useI18n()
  const chart = useMemo(() => {
    const mapped = Arr(data).map(_ => _[property] as any).compact()
    const chart = multiple
      ? ChartTools.multiple({data: mapped})
      : ChartTools.single({data: mapped})
    return translations
      ? ChartTools.setLabel(Arr(translations).reduceObject<Record<string, string>>(_ => [_.value!, _.label!]))(ChartTools.sortBy.value(chart))
      : ChartTools.sortBy.value(chart)
  }, [property, data, translations])
  return (
    <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={onClose} slotProps={{paper: {sx: {minWidth: 400, maxWidth: 500}}}}>
      <PanelHead>
        <Txt truncate>{title ?? property as string}</Txt>
      </PanelHead>
      <PanelBody sx={{maxHeight: '50vh', overflowY: 'auto'}}>
        <HorizontalBarChartGoogle data={chart}/>
      </PanelBody>
      <PanelFoot alignEnd>
        <AaBtn color="primary" onClick={onClose as any}>
          {m.close}
        </AaBtn>
      </PanelFoot>
    </Popover>
  )
}

export const DatesPopover = <T, >({
  question,
  data,
  anchorEl,
  onClose,
}: {
  question: keyof T
  data: T[]
} & Pick<PopoverProps, 'anchorEl' | 'onClose'>) => {
  const {m} = useI18n()
  // const chart = useMemo(() => {
  //   const res: Record<string, Record<K, number>> = {}
  //   data.forEach(d => {
  //     if (!d[question]) return
  //     const date = d[q] as Date
  //     const yyyyMM = format(date, 'yyyy-MM')
  //     if (!res[yyyyMM]) res[yyyyMM] = 0
  //     res[yyyyMM] += 1
  //   })
  //   return res
  // }, [question, data])
  return (
    <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={onClose}>
      <PanelHead>
        {question as string}
      </PanelHead>
      <PanelBody sx={{maxHeight: '50vh', overflowY: 'auto'}}>
        <KoboLineChartDate data={data} question={question as any} sx={{minWidth: 360}}/>
      </PanelBody>
      <PanelFoot alignEnd>
        <AaBtn color="primary" onClick={onClose as any}>
          {m.close}
        </AaBtn>
      </PanelFoot>
    </Popover>
  )
}
