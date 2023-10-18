import {Page} from '@/shared/Page'
import {UseShelterComputedData, useShelterComputedData} from '@/features/Shelter/Dasbhoard/useShelterComputedData'
import {ShelterRow, useShelterData} from '@/features/Shelter/useShelterData'
import {Div, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {Lazy} from '@/shared/Lazy'
import {Utils} from '@/utils/utils'
import {Period, Person} from '@/core/type'
import React, {useEffect, useMemo, useState} from 'react'
import {Box} from '@mui/material'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {Sheet} from '@/shared/Sheet/Sheet'
import {usePersistentState} from 'react-persistent-state'
import {useI18n} from '@/core/i18n'
import {Enum, fnSwitch, seq, Seq} from '@alexandreannic/ts-utils'
import {OblastIndex} from '@/shared/UkraineMap/oblastIndex'
import {ChartTools, makeChartData} from '@/core/chartTools'
import {UkraineMap} from '@/shared/UkraineMap/UkraineMap'
import {Currency} from '@/features/Mpca/Dashboard/MpcaDashboard'
import {DashboardFilterLabel} from '@/features/Dashboard/shared/DashboardFilterLabel'
import {useAppSettings} from '@/core/context/ConfigContext'
import {HorizontalBarChartGoogle} from '@/shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {PieChartIndicator} from '@/shared/PieChartIndicator'
import {Panel, PanelBody} from '@/shared/Panel'
import {Mpca} from '@/core/sdk/server/mpca/Mpca'
import {SheetOptions} from '@/shared/Sheet/util/sheetType'
import {DrcOffice} from '@/core/drcUa'
import {themeLightScrollbar} from '@/core/theme'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {DashboardFilterOptions} from '@/features/Dashboard/shared/DashboardFilterOptions'
import {SheetUtils} from '@/shared/Sheet/util/sheetUtils'

const today = new Date()

// TODO Data re-fetched to bypass offices access filter. Need to find a more proper way
export const ShelterDashboard = () => {
  const ctxData = useShelterData()
  const [currency, setCurrency] = usePersistentState<Currency>(Currency.USD, 'mpca-dashboard-currency')
  const [periodFilter, setPeriodFilter] = useState<Partial<Period>>({})
  const {m} = useI18n()

  const {defaultFilter, filterShape} = useMemo(() => {
    const d = ctxData.mappedData ?? seq([])
    const filterShape: {icon?: string, label: string, property: keyof Mpca, multiple?: boolean, options: SheetOptions[]}[] = [{
      icon: 'location_on', label: 'Oblast', property: 'oblast',
      options: SheetUtils.buildOptions(d.map(_ => _.oblast!).compact().distinct(_ => _).sort())
    }, {
      icon: 'business', label: 'Office', property: 'office',
      options: SheetUtils.buildOptions([...Object.keys(DrcOffice), ''].sort())
    }]
    return {
      filterShape,
      defaultFilter: seq(filterShape).reduceObject<any>(_ => [_.property, []]),
    }
  }, [ctxData.mappedData])

  const [filters, setFilters] = usePersistentState<Record<keyof Mpca, string[]>>(defaultFilter)

  const filteredData = useMemo(() => {
    if (!ctxData.mappedData) return
    return seq(ctxData.mappedData).filter(d => {
      if (!d.nta) return false
      if (periodFilter?.start && periodFilter.start.getTime() >= d.nta.submissionTime.getTime()) return false
      if (periodFilter?.end && periodFilter.end.getTime() <= d.nta.submissionTime.getTime()) return false
      if (filters.oblast.length > 0 && !filters.oblast?.includes(d.oblast!)) return false
      if (filters.office.length > 0 && !filters.office?.includes(d.office!)) return false
      return true
    })
  }, [ctxData, filters, periodFilter])

  const computed = useShelterComputedData({data: filteredData})

  useEffect(() => {
    ctxData.fetchAll()
  }, [])

  return (
    <Page loading={ctxData.loading} width="lg">
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
      </Box>

      {filteredData && computed && (
        <_ShelterDashboard
          data={filteredData}
          computed={computed}
          currency={currency}
        />
      )}
    </Page>
  )
}

export const _ShelterDashboard = ({
  data,
  currency,
  computed,
}: {
  currency: Currency
  data: Seq<ShelterRow>
  computed: NonNullable<UseShelterComputedData>
}) => {
  const {m, formatLargeNumber} = useI18n()
  const [tableType, setTableType] = usePersistentState<typeof Person.ageGroups[0]>('ECHO', 'shelter-dashboard-tableType')
  const {conf} = useAppSettings()

  return (
    <Div>
      <Div column>
        <Div>
          <SlideWidget title={m.households} icon="home">
            {formatLargeNumber(data.length)}
          </SlideWidget>
          <SlideWidget title={m.individuals} icon="person">
            {formatLargeNumber(computed.persons.length)}
          </SlideWidget>
          <SlideWidget title={m.hhSize} icon="person">
            {formatLargeNumber(computed.persons.length / data.length, {maximumFractionDigits: 2})}
          </SlideWidget>
        </Div>
        <Lazy deps={[data, tableType]} fn={() => {
          const gb = Person.groupByGenderAndGroup(Person.ageGroup[tableType])(computed.persons)
          return new Enum(gb).entries().map(([k, v]) => ({ageGroup: k, ...v}))
        }}>
          {_ =>
            <Panel title={m.ageGroup}>
              <PanelBody>
                <Sheet
                  className="ip-border"
                  hidePagination
                  header={
                    <Box sx={{with: '100%', display: 'flex'}}>
                      <ScRadioGroup value={tableType} onChange={setTableType} dense inline sx={{mr: 1}}>
                        {Person.ageGroups.map(_ =>
                          <ScRadioGroupItem key={_} value={_} title={m._ageGroup[_]} hideRadio/>
                        )}
                      </ScRadioGroup>
                    </Box>
                  }
                  data={_}
                  columns={[
                    {width: 0, id: 'Group', head: m.ageGroup, type: 'select_one', render: _ => _.ageGroup},
                    {width: 0, id: 'Male', head: m.male, type: 'number', renderValue: _ => _.Male, render: _ => formatLargeNumber(_.Male)},
                    {width: 0, id: 'Female', head: m.female, type: 'number', renderValue: _ => _.Female, render: _ => formatLargeNumber(_.Female)},
                    {width: 0, id: 'Other', head: m.other, type: 'number', renderValue: _ => _.Other ?? 0, render: _ => formatLargeNumber(_.Other ?? 0)},
                  ]}
                />
              </PanelBody>
            </Panel>
          }
        </Lazy>
        <Lazy deps={[data]} fn={() => {
          const contractors = data.map(_ => seq([_.ta?.tags.contractor1 ?? undefined, _.ta?.tags.contractor2 ?? undefined]).compact()).filter(_ => _.length > 0)
          return {
            count: contractors.length,
            contractors: ChartTools.multiple({
              data: contractors,
              base: 'percentOfTotalChoices',
              filterValue: [undefined as any]
            })
          }
        }}>
          {_ => (
            <>
              <Panel>
                <PanelBody>
                  <PieChartIndicator title={m._shelter.assignedContractor} value={_.count} base={data.length}/>
                  <HorizontalBarChartGoogle data={_.contractors}/>
                </PanelBody>
              </Panel>
            </>
          )}
        </Lazy>
      </Div>
      <Div column>
        <Div>
          <Lazy deps={[data]} fn={() => {
            const assisted = data.filter(_ => !!_.ta?._price)
            return {
              amount: assisted.sum(_ => _.ta?._price ?? 0) * fnSwitch(currency, {[Currency.UAH]: 1, [Currency.USD]: conf.uahToUsd}),
              assistedHhs: assisted.length,
            }
          }}>
            {_ => (
              <>
                <SlideWidget title={m._shelter.repairCost} icon="savings">
                  <>{formatLargeNumber(_.amount, {maximumFractionDigits: 0})} {currency}</>
                </SlideWidget>
                <SlideWidget title={m._shelter.repairCostByHh} icon="real_estate_agent">
                  <>{formatLargeNumber(_.amount / _.assistedHhs, {maximumFractionDigits: 0})} {currency}</>
                </SlideWidget>
              </>
            )}
          </Lazy>
        </Div>
        <Panel title={m._shelter.assessmentLocations}>
          <PanelBody>
            <Lazy deps={[data]} fn={() => {
              const gb = seq(data).groupBy(_ => fnSwitch(_.nta?.ben_det_oblast!, OblastIndex.koboOblastIndexIso, () => undefined)!)
              return new Enum(gb).transform((k, v) => [k, makeChartData({value: v.length})]).get()
            }}>
              {_ => <UkraineMap data={_} sx={{mx: 1}} maximumFractionDigits={0} base={data.length}/>}
            </Lazy>
          </PanelBody>
        </Panel>
      </Div>
    </Div>
  )
}
