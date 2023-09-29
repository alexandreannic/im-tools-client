import {Page} from '@/shared/Page'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {useI18n} from '../../../core/i18n'
import {MpcaProgram, MpcaRowSource, useMPCAContext} from '../MpcaContext'
import {Div, SlidePanel, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {UseBNREComputed, useBNREComputed} from '../useBNREComputed'
import {_Arr, Arr, Enum, fnSwitch} from '@alexandreannic/ts-utils'
import {chain, toPercent, Utils} from '@/utils/utils'
import {Txt} from 'mui-extension'
import {PieChartIndicator} from '@/shared/PieChartIndicator'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import {Period} from '@/core/type'
import {HorizontalBarChartGoogle} from '@/shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {Lazy} from '@/shared/Lazy'
import {ChartTools} from '@/core/chartTools'
import {KoboLineChartDate} from '@/features/Dashboard/shared/KoboLineChartDate'
import {UkraineMap} from '@/shared/UkraineMap/UkraineMap'
import {Box} from '@mui/material'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {DashboardFilterOptions} from '@/features/Dashboard/shared/DashboardFilterOptions'
import {SheetOptions} from '@/shared/Sheet/sheetType'
import {Sheet, SheetUtils} from '@/shared/Sheet/Sheet'
import {ScLineChart2} from '@/shared/Chart/ScLineChart2'
import {format} from 'date-fns'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {AAIconBtn} from '@/shared/IconBtn'
import {Mpca} from '@/core/sdk/server/mpca/Mpca'
import {DashboardFilterLabel} from '@/features/Dashboard/shared/DashboardFilterLabel'
import {usePersistentState} from 'react-persistent-state'

const today = new Date()

enum AmountType {
  amountUahSupposed = 'amountUahSupposed',
  amountUahDedup = 'amountUahDedup',
  amountUahFinal = 'amountUahFinal',
}

enum Currency {
  USD = 'USD',
  UAH = 'UAH',
}

export const MpcaDashboard = () => {
  const ctx = useMPCAContext()
  const [periodFilter, setPeriodFilter] = useState<Partial<Period>>({})
  const {m, formatLargeNumber} = useI18n()
  const [amountType, setAmountType] = usePersistentState<AmountType>(AmountType.amountUahFinal, 'mpca-dashboard-amountType')
  const [currency, setCurrency] = usePersistentState<Currency>(Currency.USD, 'mpca-dashboard-currency')


  useEffect(() => {
    if (periodFilter.start || periodFilter.end)
      ctx.fetcherData.fetch({force: true}, {filters: periodFilter})
  }, [periodFilter])

  const {defaultFilter, filterShape} = useMemo(() => {
    const d = ctx.data ?? Arr([])
    const filterShape: {icon?: string, label: string, property: keyof Mpca, multiple?: boolean, options: SheetOptions[]}[] = [{
      icon: 'assignment_turned_in', label: 'Kobo Form', property: 'source',
      options: Object.keys(MpcaRowSource).map(_ => SheetUtils.buildCustomOption(_, ctx.formNameTranslation[_]))
    }, {
      icon: 'handshake', label: 'Donor', property: 'donor',
      options: SheetUtils.buildOptions(d.map(_ => _.donor!).distinct(_ => _).sort())
    }, {
      icon: 'inventory_2', label: 'Project', property: 'project',
      options: SheetUtils.buildOptions(d.map(_ => _.project!).distinct(_ => _).sort())
    }, {
      icon: 'groups', label: 'Prog', property: 'prog', multiple: true,
      options: SheetUtils.buildOptions([...Object.keys(MpcaProgram), ''].sort())
    }, {
      icon: 'location_on', label: 'Oblast', property: 'oblast',
      options: SheetUtils.buildOptions(d.map(_ => _.oblast!).distinct(_ => _).sort())
    }]
    return {
      filterShape,
      defaultFilter: Arr(filterShape).reduceObject<any>(_ => [_.property, []]),
    }
  }, [ctx.data])

  const [filters, setFilters] = useState<Record<keyof Mpca, string[]>>(defaultFilter)

  const filteredData = useMemo(() => {
    return ctx.data?.filter(d => {
      return filterShape.every(shape => {
        const value = d[shape.property] as any
        if (filters[shape.property].length <= 0) return true
        if (shape.multiple)
          return Arr(filters[shape.property]).intersect(value).length > 0
        return filters[shape.property].includes(value)
      })
    })
  }, [ctx.data, filters])

  const computed = useBNREComputed({data: filteredData})

  const getAmount = useCallback((_: Mpca) => {
    const amount = _[amountType]
    if (!amount) return
    return amount * fnSwitch(currency, {
      [Currency.UAH]: 1,
      [Currency.USD]: 0.027,
    })
    // return formatLargeNumber(converted) + ' ' + Currency.UAH
  }, [currency, amountType])

  return (
    <Page width="lg" loading={ctx.fetcherData.loading}>
      <Box sx={{display: 'flex', alignItems: 'center'}}>
        <PeriodPicker
          defaultValue={[periodFilter.start, periodFilter.end]}
          onChange={([start, end]) => setPeriodFilter(prev => ({...prev, start, end}))}
          sx={{mb: 2}}
          label={[m.start, m.endIncluded]}
          max={today}
        />
        <DashboardFilterLabel sx={{mb: 1.5, ml: 1}} icon="attach_money" active={true} label={currency}>
          <Box sx={{p: 1}}>
            <ScRadioGroup value={amountType} onChange={setAmountType} dense sx={{mb: 2}}>
              <ScRadioGroupItem value={AmountType.amountUahSupposed} title="Estimated" description="Estimated when filling the form"/>
              <ScRadioGroupItem value={AmountType.amountUahDedup} title="Deduplicated" description="Amount given after WFP deduplication"/>
              <ScRadioGroupItem value={AmountType.amountUahFinal} title="Reel" description="Deduplicated amount or Estimated if none"/>
            </ScRadioGroup>
            <ScRadioGroup value={currency} onChange={setCurrency} inline dense>
              <ScRadioGroupItem value={Currency.USD} title="USD" sx={{width: '100%'}}/>
              <ScRadioGroupItem value={Currency.UAH} title="UAH" sx={{width: '100%'}}/>
            </ScRadioGroup>
          </Box>
        </DashboardFilterLabel>
        {filterShape.map(shape =>
          <DebouncedInput<string[]>
            key={shape.property}
            debounce={50}
            value={filters[shape.property]}
            onChange={_ => setFilters((prev: any) => ({...prev, [shape.property]: _}))}
          >
            {(value, onChange) =>
              <DashboardFilterOptions
                icon={shape.icon}
                value={value ?? []}
                label={shape.label}
                options={shape.options}
                onChange={onChange}
                sx={{mb: 1.5, ml: 1}}
              />
            }
          </DebouncedInput>
        )}
        <AAIconBtn sx={{ml: 1, mb: 1.5}} children="clear" tooltip={m.clearFilter} onClick={() => setFilters(defaultFilter)}/>
      </Box>
      {computed && filteredData && (
        <_MPCADashboard
          currency={currency}
          amountType={amountType}
          data={filteredData}
          computed={computed}
          getAmount={getAmount}
        />
      )}
    </Page>
  )
}

export const _MPCADashboard = ({
  data,
  computed,
  currency,
  getAmount,
}: {
  getAmount: (_: Mpca) => number | undefined
  amountType: AmountType
  currency: Currency
  data: _Arr<Mpca>
  computed: NonNullable<UseBNREComputed>
}) => {
  const ctx = useMPCAContext()
  const {m, formatDate, formatLargeNumber} = useI18n()
  const [tableType, setTableType] = useState<'ratio' | 'absolute'>('absolute')

  const totalAmount = useMemo(() => data.sum(_ => getAmount(_) ?? 0), [data, getAmount])

  const displayAmount = (_: number) => formatLargeNumber(_, {maximumFractionDigits: 0}) + ' ' + currency
  return (
    <>
      <Div column>
        <Div>
          <SlideWidget sx={{flex: 1}} icon="person" title="Beneficiaries">
            <Lazy deps={[data]} fn={() => data.sum(_ => _.hhSize ?? 0)}>
              {_ => formatLargeNumber(_)}
            </Lazy>
          </SlideWidget>
          <SlideWidget sx={{flex: 1}} icon="how_to_reg" title="Duplications checked with WFP">
            {formatLargeNumber(computed.deduplications.length)}
          </SlideWidget>
          <SlideWidget sx={{flex: 1}} icon="content_copy" title="Multiple time assisted">
            {formatLargeNumber(Enum.keys(computed.multipleTimeAssisted).length)}
            <Txt color="hint" sx={{ml: 1}}>{toPercent(Enum.keys(computed.multipleTimeAssisted).length / data.length)}</Txt>
          </SlideWidget>
          <SlidePanel sx={{flex: 1}}>
            <PieChartIndicator showValue showBase value={computed.preventedAssistance.length} base={computed.deduplications.length} title="Prevented assistances"/>
          </SlidePanel>
          {/*<SlideWidget sx={{flex: 1}} icon="person" title={m.individuals}>*/}
          {/*  {formatLargeNumber(computed?.flatData.length)}*/}
          {/*</SlideWidget>*/}
        </Div>
        <Div sx={{alignItems: 'flex-start'}}>
          <Div column>
            <SlidePanel BodyProps={{sx: {pt: 0}}}>

              <SlideWidget title="Total amount">
                {displayAmount(totalAmount)}
              </SlideWidget>

              <Lazy deps={[data, getAmount]} fn={() => {
                const gb = data.groupBy(d => format(d.date, 'yyyy-MM'))
                return new Enum(gb)
                  .transform((k, v) => [k, v.sum(_ => (getAmount(_) ?? 0) / 1000)])
                  .sort(([ka], [kb]) => ka.localeCompare(kb))
                  .entries()
                  .map(([k, v]) => ({name: k, amount: v}))
              }}>
                {_ => (
                  <ScLineChart2
                    data={_ as any}
                    height={220}
                    hideLabelToggle
                  />
                )}
              </Lazy>
            </SlidePanel>
            <SlidePanel title={m.submissionTime}>
              <KoboLineChartDate
                data={data}
                curves={{
                  'date': _ => _.date,
                }}
              />
            </SlidePanel>
            <SlidePanel title={m.disaggregation}>
              <Lazy deps={[data, tableType]} fn={() => {
                const gb = data.groupBy(_ => _.oblast)
                const computed = new Enum(gb).transform((k, v) => [k, {
                  oblast: k,
                  total: v.sum(d => d.hhSize ?? 0),
                  men: v.sum(d => d.men ?? 0),
                  women: v.sum(d => d.women ?? 0),
                  boys: v.sum(d => d.boys ?? 0),
                  girls: v.sum(d => d.girls ?? 0),
                }]).entries().map(([, _]) => ({
                  ..._,
                  sum: Utils.add(_.men, _.women, _.boys, _.girls),
                }))
                if (tableType === 'absolute') return computed
                return computed.map(_ => ({
                  ..._,
                  men: _.men / _.sum,
                  women: _.women / _.sum,
                  boys: _.boys / _.sum,
                  girls: _.girls / _.sum,
                }))
              }}>
                {_ => (
                  <Sheet
                    header={
                      <ScRadioGroup value={tableType} onChange={setTableType} dense inline>
                        <ScRadioGroupItem value="absolute" title={m.absolute}/>
                        <ScRadioGroupItem value="ratio" title={m.ratio}/>
                      </ScRadioGroup>
                    }
                    data={_}
                    columns={[
                      {id: 'oblast', head: 'Oblast', type: 'string', render: _ => _.oblast},
                      {width: 0, id: 'men', head: 'Men', type: 'number', renderValue: _ => _.men, render: _ => formatLargeNumber(_.men)},
                      {width: 0, id: 'women', head: 'Women', type: 'number', renderValue: _ => _.women, render: _ => formatLargeNumber(_.women)},
                      {width: 0, id: 'boys', head: 'Boys', type: 'number', renderValue: _ => _.boys, render: _ => formatLargeNumber(_.boys)},
                      {width: 0, id: 'girls', head: 'Girls', type: 'number', renderValue: _ => _.girls, render: _ => formatLargeNumber(_.girls)},
                      {width: 0, id: 'sum', head: 'Total Disaggregated', type: 'number', renderValue: _ => _.sum, render: _ => <b>{formatLargeNumber(_.sum)}</b>},
                      {width: 0, id: 'total', head: 'Total', type: 'number', renderValue: _ => _.total, render: _ => <b>{formatLargeNumber(_.total)}</b>},
                    ]}
                  />
                )}
              </Lazy>
            </SlidePanel>
          </Div>
          {/*// POFU data Cghernihiv donestk lvivi zapo*/}
          <Div column>
            {/*<SlidePanel title={m.location}>*/}
            {/*  <Lazy deps={[data]} fn={() => ChartTools.byCategory({*/}
            {/*    data,*/}
            {/*    categories: new Enum(OblastIndex.oblastByISO).transform((k, v) => [k, (_: Mpca) => _.oblastIso === k]).get(),*/}
            {/*    filter: _ => true,*/}
            {/*  })}>*/}
            {/*    {_ => <UkraineMap data={_} base={data.length} sx={{mx: 2}}/>}*/}
            {/*  </Lazy>*/}
            {/*</SlidePanel>*/}
            <SlidePanel title={`${m.mpca.assistanceByLocation}`}>
              <Lazy deps={[data, currency, getAmount]} fn={() => {
                const by = data.groupBy(_ => _.oblastIso)
                return new Enum(by).transform((k, v) => [k, {value: v.sum(x => getAmount(x) ?? 0)}]).get()
              }}>
                {_ => <UkraineMap data={_} sx={{mx: 2}} maximumFractionDigits={0} base={totalAmount}/>}
              </Lazy>
            </SlidePanel>
            <SlidePanel title={m.form}>
              <Lazy deps={[data]} fn={() => chain(ChartTools.single({
                data: data.map(_ => _.source),
              })).map(ChartTools.setLabel(ctx.formNameTranslation)).get}>
                {_ => <HorizontalBarChartGoogle data={_}/>}
              </Lazy>
            </SlidePanel>
            <SlidePanel title={m.program}>
              <Lazy deps={[data]} fn={() => ChartTools.multiple({
                data: data.map(_ => _.prog),
              })}>
                {_ => <HorizontalBarChartGoogle data={_}/>}
              </Lazy>
            </SlidePanel>
            <SlidePanel title={m.donor}>
              <Lazy deps={[data]} fn={() => ChartTools.single({
                data: data.map(_ => _.donor ?? ''),
              })}>
                {_ => <HorizontalBarChartGoogle data={_}/>}
              </Lazy>
            </SlidePanel>
            <SlidePanel title={m.project}>
              <Lazy deps={[data]} fn={() => ChartTools.single({
                data: data.map(_ => _.project ?? SheetUtils.blankValue),
              })}>
                {_ => <HorizontalBarChartGoogle data={_}/>}
              </Lazy>
            </SlidePanel>
          </Div>
        </Div>
        {/*<Div>*/}
        {/*  <Div column>*/}
        {/*    <SlidePanel title={m.ageGroup}>*/}
        {/*      <AAStackedBarChart data={computed.ageGroup} height={270} colors={t => [*/}
        {/*        t.palette.primary.main,*/}
        {/*        t.palette.info.main,*/}
        {/*        t.palette.divider,*/}
        {/*      ]}/>*/}
        {/*    </SlidePanel>*/}
        {/*<SlidePanel title={m.program}>*/}
        {/*  <Lazy deps={[data]} fn={() => ChartTools.multiple({*/}
        {/*    data: data.map(_ => _.back_prog_type).compact().map(_ => _.map(x => x.split('_')[0]))*/}
        {/*  })}>*/}
        {/*    {_ => <HorizontalBarChartGoogle data={_}/>}*/}
        {/*  </Lazy>*/}
        {/*</SlidePanel>*/}
        {/*<SlidePanel title={m.donor}>*/}
        {/*  <Lazy deps={[data]} fn={() => ChartTools.single({*/}
        {/*    data: data.map(_ => _.back_donor).compact().map(_ => _.split('_')[0])*/}
        {/*  })}>*/}
        {/*    {_ => <HorizontalBarChartGoogle data={_}/>}*/}
        {/*  </Lazy>*/}
        {/*</SlidePanel>*/}
        {/*</Div>*/}
        {/*<Div column>*/}
        {/*  <SlidePanel title={m.HHsLocation}>*/}
        {/*    <Lazy deps={[data]} fn={() => ChartTools.groupBy({*/}
        {/*      data,*/}
        {/*      groupBy: _ => _.ben_det_oblast ? BNREOblastToISO[_.ben_det_oblast] : undefined,*/}
        {/*      filter: _ => true*/}
        {/*    })}>*/}
        {/*      {_ => <UkraineMap data={_}/>}*/}
        {/*    </Lazy>*/}
        {/*  </SlidePanel>*/}
        {/*</Div>*/}
        {/*</Div>*/}
      </Div>
    </>
  )
}