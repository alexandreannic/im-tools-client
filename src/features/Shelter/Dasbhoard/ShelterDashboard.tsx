import {Page} from '@/shared/Page'
import {UseShelterComputedData, useShelterComputedData} from '@/features/Shelter/Dasbhoard/useShelterComputedData'
import {Div, SlidePanel, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {Lazy} from '@/shared/Lazy'
import {Period, Person} from '@/core/type'
import React, {useMemo, useState} from 'react'
import {Box} from '@mui/material'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {Sheet} from '@/shared/Sheet/Sheet'
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
import {drcMaterialIcons, DrcOffice} from '@/core/drcUa'
import {themeLightScrollbar} from '@/core/theme'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {DashboardFilterOptions} from '@/features/Dashboard/shared/DashboardFilterOptions'
import {usePersistentState} from '@/alexlib-labo/usePersistantState'
import {ShelterEntity} from '@/core/sdk/server/shelter/ShelterEntity'
import {useShelterContext} from '@/features/Shelter/ShelterContext'
import {KoboBarChartMultiple, KoboBarChartSingle} from '@/features/Dashboard/shared/KoboBarChart'
import {Shelter_NTAOptions} from '@/core/koboModel/Shelter_NTA/Shelter_NTAOptions'
import {DataFilter} from '@/features/Dashboard/helper/dashoardFilterInterface'
import {ChartPieIndicator} from '@/features/Dashboard/shared/KoboPieChartIndicator'
import {shelterDrcProject, ShelterTagValidation, ShelterTaPriceLevel} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {ShelterContractor} from '@/core/sdk/server/kobo/custom/ShelterContractor'
import {FilterLayout} from '@/features/Dashboard/helper/FilterLayout'

const today = new Date()

// TODO Data re-fetched to bypass offices access filter. Need to find a more proper way
export const ShelterDashboard = () => {
  const ctx = useShelterContext()
  const [currency, setCurrency] = usePersistentState<Currency>(Currency.USD, {storageKey: 'mpca-dashboard-currency'})
  const [periodFilter, setPeriodFilter] = useState<Partial<Period>>({})
  const {m} = useI18n()

  const filterShape = useMemo(() => {
    const d = ctx.data.mappedData ?? seq([])
    return DataFilter.makeShape<ShelterEntity>({
      oblast: {
        icon: 'location_on',
        label: 'Oblast',
        getValue: _ => _.oblast,
        getOptions: () => d.map(_ => _.oblast!).compact().distinct(_ => _).sort().map(_ => ({value: _, label: _}))
      },
      office: {
        icon: 'business',
        label: 'Office',
        getValue: _ => _.office,
        getOptions: () => DataFilter.buildOptionsFromObject(DrcOffice),
      },
      project: {
        icon: drcMaterialIcons.project,
        label: m.project,
        getValue: _ => _.office,
        getOptions: () => [...shelterDrcProject, ''].sort().map(_ => ({value: _, label: _}))
      },
      contractor: {
        icon: 'gavel',
        label: m._shelter.contractor,
        customFilter: (filters, _) => filters.includes(_.ta?.tags?.contractor1!) || filters.includes(_.ta?.tags?.contractor2!),
        getOptions: () => DataFilter.buildOptionsFromObject(ShelterContractor),
      },
      vulnerabilities: {
        icon: drcMaterialIcons.disability,
        multiple: true,
        label: m.vulnerabilities,
        getValue: _ => _.nta?.hh_char_dis_select,
        getOptions: () => ctx.nta.helper.schemaHelper.getOptionsByQuestionName('hh_char_dis_select').map(_ => ({value: _.name, label: _.label[ctx.langIndex]}))
      },
      validationStatus: {
        icon: 'check',
        label: m._shelter.validationStatus,
        getValue: _ => _.nta?.tags?.validation,
        getOptions: () => DataFilter.buildOptionsFromObject(ShelterTagValidation),
      },
      displacementStatus: {
        icon: drcMaterialIcons.displacementStatus,
        label: m.displacement,
        getValue: _ => _.nta?.ben_det_res_stat,
        getOptions: () => ctx.nta.helper.schemaHelper.getOptionsByQuestionName('ben_det_res_stat').map(_ => ({value: _.name, label: _.label[ctx.langIndex]}))
      },
      damageLevel: {
        icon: 'construction',
        label: m.levelOfPropertyDamaged,
        getValue: _ => _.ta?.tags?.damageLevel,
        getOptions: () => DataFilter.buildOptionsFromObject(ShelterTaPriceLevel),
      },
    })
  }, [ctx.data.mappedData])

  const [filters, setFilters] = usePersistentState<Record<keyof typeof filterShape, string[] | undefined>>({}, {storageKey: 'shelter-dashboard'})

  const filteredData = useMemo(() => {
    if (!ctx.data.mappedData) return
    const filteredByDate = seq(ctx.data.mappedData).filter(d => {
      if (!d.nta) return false
      if (periodFilter?.start && periodFilter.start.getTime() >= d.nta.submissionTime.getTime()) return false
      if (periodFilter?.end && periodFilter.end.getTime() <= d.nta.submissionTime.getTime()) return false
      return true
    })
    return DataFilter.filterData(filteredByDate, filterShape, filters)
  }, [ctx.data, filters, periodFilter])

  const computed = useShelterComputedData({data: filteredData})

  return (
    <Page loading={ctx.data.loading} width="lg">
      <FilterLayout
        sx={{mb: 1}}
        filters={filters}
        setFilters={setFilters}
        shape={filterShape}
        before={
          <>
            <PeriodPicker
              defaultValue={[periodFilter.start, periodFilter.end]}
              onChange={([start, end]) => setPeriodFilter(prev => ({...prev, start, end}))}
              label={[m.start, m.endIncluded]}
              max={today}
            />
            <DashboardFilterLabel icon="attach_money" active={true} label={currency}>
              {() => (
                <Box sx={{p: 1}}>
                  <ScRadioGroup value={currency} onChange={setCurrency} inline dense>
                    <ScRadioGroupItem value={Currency.USD} title="USD" sx={{width: '100%'}}/>
                    <ScRadioGroupItem value={Currency.UAH} title="UAH" sx={{width: '100%'}}/>
                  </ScRadioGroup>
                </Box>
              )}
            </DashboardFilterLabel>
          </>
        }
      />

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
  data: Seq<ShelterEntity>
  computed: NonNullable<UseShelterComputedData>
}) => {
  const {m, formatLargeNumber} = useI18n()
  const [tableType, setTableType] = usePersistentState<typeof Person.ageGroups[0]>('ECHO', {storageKey: 'shelter-dashboard-tableType'})
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
          const gb = Person.groupByGenderAndGroup(Person.getAgeGroup(tableType))(computed.persons)
          return Enum.entries(gb).map(([k, v]) => ({ageGroup: k, ...v}))
        }}>
          {_ =>
            <Panel title={m.ageGroup}>
              <PanelBody>
                <Sheet
                  id="shelter-dashboard-pop"
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
        <SlidePanel>
          <ChartPieIndicator
            title={m.vulnerabilities}
            filter={_ => !_.nta?.hh_char_dis_select?.includes('diff_none')}
            filterBase={_ => !!_.nta?.hh_char_dis_select!}
            data={data}
          />
          <KoboBarChartMultiple
            data={data.filter(_ => !!_.nta?.hh_char_dis_select)}
            getValue={_ => _.nta?.hh_char_dis_select ?? []}
            label={Shelter_NTAOptions.hh_char_dis_select}
          />
        </SlidePanel>
        <SlidePanel title={m.status}>
          <KoboBarChartSingle
            data={data.filter(_ => !!_.nta?.ben_det_res_stat)}
            getValue={_ => _.nta?.ben_det_res_stat}
            label={Shelter_NTAOptions.ben_det_res_stat}
          />
        </SlidePanel>
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
        <Lazy deps={[data]} fn={() => {
          const contractors = data.map(_ => seq([_.ta?.tags?.contractor1 ?? undefined, _.ta?.tags?.contractor2 ?? undefined]).compact()).filter(_ => _.length > 0)
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
            <Panel>
              <PanelBody>
                <PieChartIndicator title={m._shelter.assignedContractor} value={_.count} base={data.length}/>
                <HorizontalBarChartGoogle data={_.contractors}/>
              </PanelBody>
            </Panel>
          )}
        </Lazy>
        <SlidePanel title={m.status}>
          <KoboBarChartSingle
            data={data}
            filterData={_ => !!_.ta?.tags?.damageLevel}
            getValue={_ => _.ta?.tags?.damageLevel}
            label={ShelterTaPriceLevel}
          />
        </SlidePanel>
      </Div>
    </Div>
  )
}
