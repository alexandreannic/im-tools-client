import {Page} from '@/shared/Page'
import {usePartnershipContext} from '@/features/Partnership/PartnershipContext'
import React, {useCallback, useMemo, useState} from 'react'
import {KoboUkraineMap} from '@/features/Dashboard/shared/KoboUkraineMap'
import {usePartnershipDashboard} from '@/features/Partnership/Dashboard/usePartnershipDashboard'
import {Div, SlidePanel, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {useI18n} from '@/core/i18n'
import {Lazy} from '@/shared/Lazy'
import {ChartData, ChartTools, makeChartData} from '@/core/chartTools'
import {PieChartIndicator} from '@/shared/PieChartIndicator'
import {Enum, Seq, seq} from '@alexandreannic/ts-utils'
import {HorizontalBarChartGoogle} from '@/shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {PartnershipCard} from '@/features/Partnership/Dashboard/PartnershipCard'
import {KoboBarChartMultiple} from '@/features/Dashboard/shared/KoboBarChart'
import {Utils} from '@/utils/utils'
import {drcMaterialIcons, DrcProject, DrcProjectBudget} from '@/core/drcUa'
import {Txt} from 'mui-extension'
import {DashboardFilterHelper} from '@/features/Dashboard/helper/dashoardFilterInterface'
import {Partnership_partnersDatabaseOptions} from '@/core/koboModel/Partnership_partnersDatabase/Partnership_partnersDatabaseOptions'
import {DashboardFilterOptions} from '@/features/Dashboard/shared/DashboardFilterOptions'
import {SheetUtils} from '@/shared/Sheet/util/sheetUtils'
import {PanershipPanelDonor} from '@/features/Partnership/Dashboard/PanershipPanelDonor'
import {PartnershipData} from '@/features/Partnership/PartnershipType'
import {useSetState2} from '@/alexlib-labo/useSetState2'
import {Box, Checkbox} from '@mui/material'
import {AAIconBtn} from '@/shared/IconBtn'
import {BarChartVertical} from '@/shared/BarChartVertical'

export const PartnershipDashboard = () => {
  const ctx = usePartnershipContext()
  return (
    <Page width="lg" loading={ctx.data.fetcherPartnersDb.loading}>
      {ctx.data.fetcherPartnersDb.entity && (
        <_PartnershipDashboard/>
      )}
    </Page>
  )
}

const filterShape = DashboardFilterHelper.makeShape<typeof Partnership_partnersDatabaseOptions>()({
  oblast: {
    propertyIfDifferentThanOption: 'Which_oblasts_does_t_t_and_has_experience',
    icon: 'location_on',
    options: 'Oblast_001',
    label: m => m.oblast,
    multiple: true
  },
  activities: {
    icon: 'local_activity',
    options: 'The_organization_is_g_type_of_activities',
    propertyIfDifferentThanOption: 'The_organization_is_g_type_of_activities',
    label: m => m.activity,
    multiple: true
  },
  sector: {
    icon: 'support',
    options: 'Sectors_funded',
    propertyIfDifferentThanOption: 'Which_sectors_does_the_organiz',
    label: m => m.sector,
    multiple: true
  },
  relation: {
    icon: 'share',
    options: 'Is_there_an_ongoing_relationsh',
    label: m => m._partner.relationship,
  },
  rapidMobilization: {
    icon: 'bolt',
    options: 'Is_rapid_volunteer_mobilization_possible',
    label: m => m._partner.rapidMobilization,
  },
  heardToReach: {
    icon: 'rocket_launch',
    options: 'Is_access_possible_by_the_orga',
    label: m => m._partner.rapidMobilization,
  },
  cars: {
    icon: 'local_shipping',
    options: 'Own_vehicles',
    label: m => m.vehicule,
  },
  warehouse: {
    icon: 'warehouse',
    options: 'Own_warehouse_belonging_to_th',
    label: m => m.warehouse,
  },
  vetting: {
    icon: 'check_circle',
    options: 'Has_vetting_been_conducted',
    label: m => m._partner.vetting,
  },
  risk: {
    icon: 'flag',
    options: 'Overall_Residual_Risk',
    label: m => m._partner.residualRisk,
  },
})

const filterSgaShape = DashboardFilterHelper.makeShape<any>()({
  year: {
    icon: 'today',
    options: 'year',
    label: m => m.year,
    multiple: false
  },
  donor: {
    icon: drcMaterialIcons.donor,
    options: 'Donor',
    label: m => m.donor,
    multiple: false
  },
  project: {
    icon: drcMaterialIcons.project,
    options: 'project',
    label: m => m.project,
    multiple: false
  },
})

type OptionFilters = DashboardFilterHelper.InferShape<typeof filterShape> & DashboardFilterHelper.InferShape<typeof filterSgaShape>

const mapSga = (data: Seq<PartnershipData>) => {
  return data.flatMap(_ => _.group_vi2hh32?.map(g => ({...g, ..._})))
    .compact()
    .map(sga => ({
      ...sga,
      project: Enum.values(DrcProject).find(_ => _.includes('' + sga.Project_code)),
      year: (sga.SGA_start_date as unknown as string)?.split('-')[0]
    }))
    .filter(_ => {
      return true
    })
}

export const _PartnershipDashboard = ({}: {}) => {
  const selecteIds = useSetState2<string>()
  const ctx = usePartnershipContext()
  // const data = seq(ctx.data.fetcherPartnersDb.entity!.data)
  const mappedData = ctx.data.mappedData!
  const [optionFilter, setOptionFilters] = useState<OptionFilters>(seq(Enum.keys(filterShape)).reduceObject<OptionFilters>(_ => [_, []]))

  const {m, formatLargeNumber} = useI18n()

  const sgas = useMemo(() => mapSga(mappedData), [mappedData])

  /** @deprecated Probably use filteredAndPickedData */
  const filteredData = useMemo(() => {
    return seq(DashboardFilterHelper.filterData(mappedData, filterShape, optionFilter))
  }, [mappedData, optionFilter, selecteIds])

  const filteredAndPickedData = useMemo(() => {
    return selecteIds.size === 0 ? filteredData : filteredData.filter(_ => selecteIds.has(_.id))
  }, [filteredData])

  const filteredAndPickedSgas = useMemo(() => {
    return seq(DashboardFilterHelper.filterData(mapSga(filteredAndPickedData), filterSgaShape, optionFilter))
  }, [filteredAndPickedData, optionFilter])

  const computed = usePartnershipDashboard({data: filteredAndPickedData})

  const getChoices = <T extends keyof typeof Partnership_partnersDatabaseOptions>(questionName: T, {
    skipKey = [],
  }: {
    skipKey?: (keyof typeof Partnership_partnersDatabaseOptions[T])[]
  } = {}) => {
    return Enum.entries(Partnership_partnersDatabaseOptions[questionName] ?? {})
      .map(([value, label]) => ({value, label: label}))
      .filter(_ => !(skipKey as string[]).includes(_.value))
  }

  const getSgaChoices = useCallback((questionName: keyof (typeof sgas[0])) => {
    return sgas.map(_ => _[questionName]).distinct(_ => _).compact().map(_ => SheetUtils.buildOption(_ as any))
  }, [sgas])

  // const allYears = useMemo(() => mappedData
  //     .flatMap(_ => seq(_.group_vi2hh32 ?? [])
  //       .map(_ => (_.SGA_start_date as unknown as string)?.split('-')[0])
  //       .compact()
  //       .sortByString(_ => _)
  //     ).distinct(_ => _),
  //   [filteredData])

  return (
    <Div column>
      <Box>
        <Box sx={{overflowX: 'auto', whiteSpace: 'nowrap', pb: 1}}>
          {Enum.entries(filterShape).map(([k, shape]) =>
            <DashboardFilterOptions
              key={k}
              icon={shape.icon}
              value={optionFilter[k]}
              label={shape.label(m)}
              options={getChoices(shape.options)}
              onChange={_ => setOptionFilters(prev => ({...prev, [k]: _}))}
              sx={{mr: .5}}
            />
          )}
        </Box>
        <Box>
          {Enum.entries(filterSgaShape).map(([k, shape]) =>
            <DashboardFilterOptions
              sx={{mr: .5}}
              key={k}
              icon={shape.icon}
              value={optionFilter[k]}
              label={shape.label(m)}
              options={getSgaChoices(shape.options as any)}
              onChange={_ => setOptionFilters(prev => ({...prev, [k]: _}))}
            />
          )}
        </Box>

        {/*<DashboardFilterOptions*/}
        {/*  icon="today"*/}
        {/*  value={optionFilter.year ?? []}*/}
        {/*  label={m.year}*/}
        {/*  options={allYears.map(SheetUtils.buildOption)}*/}
        {/*  onChange={_ => setOptionFilters(prev => ({...prev, year: _}))}*/}
        {/*/>*/}
      </Box>
      <Div>
        <Div column
             sx={{maxWidth: 320}}
        >
          <Panel sx={{display: 'flex'}}>
            <SlideWidget sx={{flex: 1}} title={m._partner.partners} icon="diversity_3">
              {formatLargeNumber(filteredData.length)}
            </SlideWidget>
            <SlideWidget sx={{flex: 1}} title={m._partner.sgas} icon="handshake">
              {formatLargeNumber(filteredAndPickedSgas.length)}
            </SlideWidget>
          </Panel>
          <Panel sx={{maxHeight: 800, overflowY: 'auto'}}>
            <Box sx={{
              m: 1,
              p: .125,
              // pl: 2,
              borderRadius: t => t.shape.borderRadius + 'px',
              border: t => `2px solid ${t.palette.primary.main}`,
              background: t => t.palette.action.focus,
              display: 'flex',
              alignItems: 'center',
              // justifyContent: 'space-between',
            }}>
              <Checkbox size="small" checked={selecteIds.size === filteredData.length} onClick={() => {
                if (selecteIds.size === filteredData.length) selecteIds.clear()
                else selecteIds.reset(filteredData.map(_ => _.id))
              }}/>
              {selecteIds.toArray.length} {m.selected}
              <AAIconBtn sx={{marginLeft: 'auto'}} onClick={selecteIds.clear}>clear</AAIconBtn>
            </Box>
            {filteredData.map(d => <PartnershipCard state={selecteIds} key={d.id} partner={d} sx={{mt: 1}}/>)}
          </Panel>
        </Div>
        <Div column>
          <SlidePanel>
            <PieChartIndicator dense showValue value={computed.ongoingGrant.length} base={filteredAndPickedData.length} title={m._partner.ongoingGrant}/>
          </SlidePanel>
          <PanershipPanelDonor data={filteredAndPickedData}/>
          <Lazy deps={[filteredAndPickedData]} fn={() => {
            const gb = filteredAndPickedSgas.compactBy('Project_code').groupBy(_ => _.Project_code!)
            return new Enum(gb).transform((k, v) => {
              const project: DrcProject = Enum.values(DrcProject).find(_ => _.includes('' + k))!
              return [
                project,
                makeChartData({
                  value: v.sum(_ => Utils.add(_.Amount_USD)),
                  base: DrcProjectBudget[project] ?? 1
                })
              ]
            }).get()
          }}>
            {res => <Panel>
              <PanelBody>
                <Txt uppercase color="hint" bold>{m._partner.totalBudget}</Txt>
                <Txt sx={{fontSize: '2em', mb: 2, lineHeight: 1}} bold block>${formatLargeNumber(seq(Enum.values(res)).sum(_ => _.value))}</Txt>
                {Enum.entries(res).map(([project, budget]) => (
                  <PieChartIndicator dense sx={{mb: 2}} key={project} value={budget.value} base={budget.base ?? 1} showValue showBase title={project}/>
                ))}
              </PanelBody>
            </Panel>
            }
          </Lazy>
          <Panel>
            <PanelBody>
              <Lazy deps={[filteredAndPickedData]} fn={() => {
                return ChartTools.percentage({
                  data: filteredAndPickedSgas,
                  base: _ => true,
                  value: _ => (_.Partnership_type === 'strategic_partnership' || _.Partnership_type === 'project_based_partnership') && _.Is_it_an_equitable_partnership === 'yes',
                })
              }}>
                {_ => <PieChartIndicator showValue dense title={m._partner.equitable} value={_.value} base={_.base} sx={{mb: 2}}/>}
              </Lazy>
              <Lazy deps={[filteredAndPickedData]} fn={() => {
                return ChartTools.percentage({
                  data: filteredAndPickedSgas,
                  base: _ => true,
                  value: _ => (_.Partnership_type === 'strategic_partnership' || _.Partnership_type === 'project_based_partnership') && _.Is_it_an_equitable_partnership === 'partially',
                })
              }}>
                {_ => <PieChartIndicator showValue dense title={m._partner.partiallyEquitable} value={_.value} base={_.base}/>}
              </Lazy>
            </PanelBody>
          </Panel>
          <Panel title={m._partner.percentByTypeOfOrg}>
            <PanelBody>
              <Lazy deps={[filteredAndPickedData]} fn={() => {
                const res = Enum.entries(filteredAndPickedSgas.groupBy(_ => _.year)).filter(([year]) => year !== 'undefined').map(([year, d]) => {
                  const distincted = d.distinct(_ => _.Partner_name_Ukrainian)
                  return {
                    name: year,
                    ['Youth-led partners']: distincted.sum(_ => _.Is_this_a_youth_led_organization === 'yes' || _.Select_if_the_organi_inorities_in_Ukraine?.includes('children') ? 1 : 0) / distincted.length * 100,
                    ['Elders and/or PwD focused partners']: distincted.sum(_ => _.Is_this_a_women_led_organization === 'yes' || _.Select_if_the_organi_inorities_in_Ukraine?.includes(
                      'women_s_rights') ? 1 : 0) / distincted.length * 100,
                  }
                })
                console.log(res)
                return res
              }}>
                {_ => (
                  <BarChartVertical data={_}/>
                )}
              </Lazy>

              {/*<KoboPieChartIndicator*/}
              {/*  title={m._partner.womenLedOrganization}*/}
              {/*  question="Is_this_a_women_led_organization"*/}
              {/*  filter={_ => _ === 'yes'}*/}
              {/*  data={filteredAndPickedData.filter(_ => _.Select_if_the_organi_inorities_in_Ukraine?.includes('women_s_rights'))}*/}
              {/*  sx={{mb: 2}}*/}
              {/*/>*/}
              {/*<KoboPieChartIndicator*/}
              {/*  title={m._partner.youthLedOrganization}*/}
              {/*  question="Is_this_a_youth_led_organization"*/}
              {/*  filter={_ => _ === 'yes'}*/}
              {/*  data={filteredAndPickedData.filter(_ => _.Select_if_the_organi_inorities_in_Ukraine?.includes('children'))}*/}
              {/*  sx={{mb: 2}}*/}
              {/*/>*/}
              {/*<Lazy deps={[filteredAndPickedData]} fn={() => {*/}
              {/*  return ChartTools.percentage({*/}
              {/*    data: filteredAndPickedData,*/}
              {/*    base: _ => true,*/}
              {/*    value: _ => !!_.Select_if_the_organi_inorities_in_Ukraine?.includes('women_s_rights') || !!_.Examples_of_projects_h_benefic_017,*/}
              {/*  })*/}
              {/*}}>*/}
              {/*  {_ => <PieChartIndicator title={m._partner.elderlyLedOrganization} value={_.value} base={_.base} showValue/>}*/}
              {/*</Lazy>*/}
            </PanelBody>
          </Panel>
        </Div>
        <Div column>
          <Panel>
            <PanelHead>{m._partner.workingOblast}</PanelHead>
            <PanelBody>
              <KoboUkraineMap
                fillBaseOn="value"
                data={computed.oblastIso.map(_ => ({oblast: _}))}
                getOblast={_ => _.oblast}
                value={_ => true}
                base={_ => true}
              />
            </PanelBody>
          </Panel>
          <Lazy deps={[filteredAndPickedData]} fn={() => {
            const sumPlanned = filteredAndPickedSgas.sum(_ => Utils.add(_.Number_of_beneficiaries_planned))
            const sumPlannedPwd = filteredAndPickedSgas.sum(_ => Utils.add(_.Number_of_beneficiaries_PwD_planned))
            const sumPlannedReached = filteredAndPickedSgas.sum(_ => Utils.add(_.Number_of_beneficiaries_reached_001))
            const sumPlannedReachedPwd = filteredAndPickedSgas.sum(_ => Utils.add(_.Number_of_beneficiaries_PwD_reached_001))

            const other = makeChartData({
              value: sumPlannedReached,
              base: sumPlanned,
            })
            const pwd = makeChartData({
              value: sumPlannedReachedPwd,
              base: sumPlannedPwd,
            })
            const breakdown: ChartData = {
              boy: makeChartData({value: filteredAndPickedSgas.sum(_ => Utils.add(_.group_eq2ox56_row_column)), base: sumPlanned, label: m.boy}),
              girl: makeChartData({value: filteredAndPickedSgas.sum(_ => Utils.add(_.group_eq2ox56_row_column_1)), base: sumPlanned, label: m.girl}),
              male: makeChartData({value: filteredAndPickedSgas.sum(_ => Utils.add(_.group_eq2ox56_row_1_column)), base: sumPlanned, label: m.male}),
              female: makeChartData({value: filteredAndPickedSgas.sum(_ => Utils.add(_.group_eq2ox56_row_1_column_1)), base: sumPlanned, label: m.female}),
              elderlyMale: makeChartData({value: filteredAndPickedSgas.sum(_ => Utils.add(_.group_eq2ox56_row_2_column)), base: sumPlanned, label: m.elderlyMale}),
              elderlyFemale: makeChartData({
                value: filteredAndPickedSgas.sum(_ => Utils.add(_.group_eq2ox56_row_2_column_1)),
                base: sumPlanned,
                label: m.elderlyFemale
              }),
            }
            return {
              other,
              pwd,
              breakdown,
            }
          }}>
            {res => (
              <Panel>
                <PanelBody>
                  <PieChartIndicator showValue showBase title={m._partner.benefReached} value={res.other.value} base={res.other.base!} sx={{mb: 2}}/>
                  <PieChartIndicator showValue showBase title={m._partner.benefPwdReached} value={res.pwd.value} base={res.pwd.base!}/>
                  <HorizontalBarChartGoogle data={res.breakdown}/>
                </PanelBody>
              </Panel>
            )}
          </Lazy>
          <SlidePanel title={m._partner.targetedMinorities}>
            <KoboBarChartMultiple
              data={filteredAndPickedData}
              getValue={_ => _.Select_if_the_organi_inorities_in_Ukraine!}
              label={Partnership_partnersDatabaseOptions.Minority_group}
            />
          </SlidePanel>
          <Panel>
            <PanelHead>{m.sector}</PanelHead>
            <PanelBody>
              <KoboBarChartMultiple
                data={filteredAndPickedData}
                getValue={_ => _.Which_sectors_does_the_organiz!}
                label={Partnership_partnersDatabaseOptions.Sectors_funded}
              />
            </PanelBody>
          </Panel>
        </Div>
      </Div>
    </Div>
  )
}
