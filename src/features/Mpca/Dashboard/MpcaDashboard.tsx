import {Page} from '@/shared/Page'
import React, {useCallback, useMemo, useState} from 'react'
import {useI18n} from '../../../core/i18n'
import {MpcaProgram, MpcaRowSource, useMPCAContext} from '../MpcaContext'
import {Div, SlidePanel, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {UseBNREComputed, useBNREComputed} from '../useBNREComputed'
import {_Arr, Arr, Enum, fnSwitch} from '@alexandreannic/ts-utils'
import {chain, toPercent, Utils} from '@/utils/utils'
import {Txt} from 'mui-extension'
import {PieChartIndicator} from '@/shared/PieChartIndicator'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import {Period, Person} from '@/core/type'
import {HorizontalBarChartGoogle} from '@/shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {Lazy} from '@/shared/Lazy'
import {ChartTools, makeChartData} from '@/core/chartTools'
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
import {DrcOffice} from '@/core/drcUa'
import {themeLightScrollbar} from '@/core/theme'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Panel} from '@/shared/Panel'

export const today = new Date()

enum AmountType {
  amountUahSupposed = 'amountUahSupposed',
  amountUahDedup = 'amountUahDedup',
  amountUahFinal = 'amountUahFinal',
}

export enum Currency {
  USD = 'USD',
  UAH = 'UAH',
}

export const MpcaDashboard = () => {
  const {conf} = useAppSettings()
  const ctx = useMPCAContext()
  const [periodFilter, setPeriodFilter] = useState<Partial<Period>>({})
  const {m, formatLargeNumber} = useI18n()
  const [amountType, setAmountType] = usePersistentState<AmountType>(AmountType.amountUahFinal, 'mpca-dashboard-amountType')
  const [currency, setCurrency] = usePersistentState<Currency>(Currency.USD, 'mpca-dashboard-currency')

  const mappedData = useMemo(() => ctx.data?.map(_ => {
    if (_.donor === undefined) _.donor = SheetUtils.blankValue as any
    if (_.project === undefined) _.project = SheetUtils.blankValue as any
    if (_.oblastIso === undefined) _.oblastIso = SheetUtils.blankValue as any
    if (_.oblast === undefined) _.oblast = SheetUtils.blankValue as any
    if (_.office === undefined) _.office = SheetUtils.blankValue as any
    return _
  }), [ctx.data])

  // useEffect(() => {
  //   if (periodFilter.start || periodFilter.end)
  //     ctx.fetcherData.fetch({force: true}, {filters: periodFilter})
  // }, [periodFilter])

  const {defaultFilter, filterShape} = useMemo(() => {
    const d = mappedData ?? Arr([])
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
    }, {
      icon: 'business', label: 'Office', property: 'office',
      options: SheetUtils.buildOptions([...Object.keys(DrcOffice), ''].sort())
    }]
    return {
      filterShape,
      defaultFilter: Arr(filterShape).reduceObject<any>(_ => [_.property, []]),
    }
  }, [mappedData])

  const [filters, setFilters] = usePersistentState<Record<keyof Mpca, string[]>>(defaultFilter)

  const filteredData = useMemo(() => {
    return mappedData?.filter(d => {
      if (periodFilter?.start && periodFilter.start.getTime() >= d.date.getTime()) return false
      if (periodFilter?.end && periodFilter.end.getTime() <= d.date.getTime()) return false
      return filterShape.every(shape => {
        const value = d[shape.property] as any
        if (filters[shape.property].length <= 0) return true
        if (shape.multiple)
          return Arr(filters[shape.property]).intersect(value).length > 0
        return filters[shape.property].includes(value)
      })
    })
  }, [mappedData, filters, periodFilter])

  const computed = useBNREComputed({data: filteredData})

  const getAmount = useCallback((_: Mpca) => {
    const amount = _[amountType]
    if (!amount) return
    return amount * fnSwitch(currency, {
      [Currency.UAH]: 1,
      [Currency.USD]: conf.uahToUsd,
    })
    // return formatLargeNumber(converted) + ' ' + Currency.UAH
  }, [currency, amountType])

  return (
    <Page width="lg" loading={ctx.fetcherData.loading}>
      <Box sx={{display: 'flex', alignItems: 'center', ...themeLightScrollbar, whiteSpace: 'nowrap'}}>
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
        <AAIconBtn sx={{ml: 1, mb: 1.5}} children="clear" tooltip={m.clearFilter} onClick={() => {
          setFilters(defaultFilter)
          setPeriodFilter({})
        }}/>
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
  const [tableDataType, setTableDataType] = usePersistentState<'ratio' | 'absolute'>('absolute', 'mpca-dashboard-tableType')
  const [tableArea, setTableArea] = usePersistentState<'office' | 'oblast'>('office', 'mpca-dashboard-tableArea')
  const [tableAgeGroup, setTableAgeGroup] = usePersistentState<typeof Person.ageGroups[0]>('echo', 'mpca-dashboard-ageGroup')

  const totalAmount = useMemo(() => data.sum(_ => getAmount(_) ?? 0), [data, getAmount])

  console.log(data)
  const displayAmount = (_: number) => formatLargeNumber(_, {maximumFractionDigits: 0}) + ' ' + currency
  return (
    <>
      <Div column>
        <Div sx={{alignItems: 'stretch'}}>
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
                  .transform((k, v) => [k, Arr(v).sum(_ => (getAmount(_) ?? 0))])
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
              <Lazy deps={[computed.persons, tableAgeGroup]} fn={() => {
                const gb = Utils.groupBy({
                  data: computed.persons,
                  groups: [
                    {
                      by: _ => Person.ageToAgeGroup(_.age, Person.ageGroup[tableAgeGroup]) ?? '',
                      sort: (a, b) => Object.keys(Person.ageGroup[tableAgeGroup]).indexOf(a) - Object.keys(Person.ageGroup[tableAgeGroup]).indexOf(b)
                    },
                    {by: _ => _.gender ?? Person.Gender.Other},
                  ],
                  finalTransform: _ => _.length
                })
                return new Enum(gb).entries().map(([k, v]) => ({ageGroup: k, ...v}))
              }}>
                {_ =>
                  <Sheet
                    hidePagination
                    header={
                      <DashboardFilterLabel label="ok">
                        <Box sx={{with: '100%', display: 'flex'}}>
                          <ScRadioGroup value={tableDataType} onChange={setTableDataType} dense inline sx={{mr: 1}}>
                            <ScRadioGroupItem value="absolute" title={m.absolute} hideRadio/>
                            <ScRadioGroupItem value="ratio" title={m.ratio} hideRadio/>
                          </ScRadioGroup>
                          <ScRadioGroup value={tableArea} onChange={setTableArea} dense inline>
                            <ScRadioGroupItem value="oblast" title={m.oblast} hideRadio/>
                            <ScRadioGroupItem value="office" title={m.office} hideRadio/>
                          </ScRadioGroup>
                          <ScRadioGroup value={tableDataType} onChange={setTableDataType} dense inline sx={{mr: 1}}>
                            {Person.ageGroups.map(_ =>
                              <ScRadioGroupItem key={_} value={_} title={_} hideRadio/>
                            )}
                          </ScRadioGroup>
                        </Box>
                      </DashboardFilterLabel>
                    }
                    data={_}
                    columns={[
                      {width: 0, id: 'Group', head: m.ageGroup, type: 'select_one', render: _ => _.ageGroup},
                      {width: 0, id: 'Male', head: m.male, type: 'number', renderValue: _ => _.Male, render: _ => formatLargeNumber(_.Male)},
                      {width: 0, id: 'Female', head: m.female, type: 'number', renderValue: _ => _.Female, render: _ => formatLargeNumber(_.Female)},
                      {width: 0, id: 'Other', head: m.other, type: 'number', renderValue: _ => _.Other ?? 0, render: _ => formatLargeNumber(_.Other ?? 0)},
                    ]}
                  />
                }
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
            {/*<SlidePanel title={`${m.mpca.assistanceByLocation}`}>*/}
            {/*  <Lazy deps={[data, currency, getAmount]} fn={() => {*/}
            {/*    const by = data.groupBy(_ => _.oblastIso)*/}
            {/*    return new Enum(by).transform((k, v) => [OblastIndex.findByIso(k)!, {value: v.sum(x => getAmount(x) ?? 0)}]).get()*/}
            {/*  }}>*/}
            {/*    {_ => <HorizontalBarChartGoogle data={_}/>}*/}
            {/*  </Lazy>*/}
            {/*</SlidePanel>*/}
            <SlidePanel title={`${m.mpca.assistanceByLocation}`}>
              <Lazy deps={[data, currency, getAmount]} fn={() => {
                const by = data.groupBy(_ => _.oblastIso)
                return new Enum(by).transform((k, v) => [k, makeChartData({value: Arr(v).sum(x => getAmount(x) ?? 0)})]).get()
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