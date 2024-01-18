import {Page} from '@/shared/Page'
import {usePartnershipContext} from '@/features/Partnership/PartnershipContext'
import React, {useEffect, useMemo, useState} from 'react'
import {KoboUkraineMap} from '@/features/Dashboard/shared/KoboUkraineMap'
import {usePartnershipDashboard} from '@/features/Partnership/Dashboard/usePartnershipDashboard'
import {Div, SlidePanel, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {useI18n} from '@/core/i18n'
import {Lazy} from '@/shared/Lazy'
import {ChartData, ChartTools, makeChartData} from '@/shared/chart/chartHelper'
import {ChartPieIndicator} from '@/shared/chart/ChartPieIndicator'
import {Enum, Seq, seq} from '@alexandreannic/ts-utils'
import {ChartBar} from '@/shared/chart/ChartBar'
import {PartnershipCard} from '@/features/Partnership/Dashboard/PartnershipCard'
import {ChartBarMultipleBy} from '@/shared/chart/ChartBarMultipleBy'
import {Utils} from '@/utils/utils'
import {drcMaterialIcons, DrcProject, DrcProjectHelper} from '@/core/typeDrc'
import {Txt} from 'mui-extension'
import {DataFilter} from '@/features/Dashboard/helper/dashoardFilterInterface'
import {Partnership_partnersDatabaseOptions} from '@/core/generatedKoboInterface/Partnership_partnersDatabase/Partnership_partnersDatabaseOptions'
import {PanershipPanelDonor} from '@/features/Partnership/Dashboard/PanershipPanelDonor'
import {PartnershipData} from '@/features/Partnership/PartnershipType'
import {useSetStateIp} from '@/shared/hook/useSetState'
import {Box, Checkbox} from '@mui/material'
import {IpIconBtn} from '@/shared/IconBtn'
import {ChartBarVertical} from '@/shared/chart/ChartBarVertical'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {FilterLayout} from '@/features/Dashboard/helper/FilterLayout'
import {useKoboSchemaContext} from '@/features/KoboSchema/KoboSchemaContext'
import {KoboSchemaHelper} from '@/features/KoboSchema/koboSchemaHelper'

export const PartnershipDashboard = ({}: {}) => {
  const ctx = usePartnershipContext()
  const ctxSchema = useKoboSchemaContext()
  useEffect(() => {
    ctxSchema.fetchers.fetch({}, 'partnership_partnersDatabase')
  }, [])

  return (
    <Page width="lg" loading={ctx.data.fetcherPartnersDb.loading}>
      {ctx.data.fetcherPartnersDb.get && ctxSchema.schema.partnership_partnersDatabase && (
        <_PartnershipDashboard schema={ctxSchema.schema.partnership_partnersDatabase}/>
      )}
    </Page>
  )
}

const mapSga = (data: Seq<PartnershipData>) => {
  return data.flatMap(_ => _.group_vi2hh32?.map(g => ({...g, ..._})))
    .compact()
    .map(sga => ({
      ...sga,
      project: Enum.values(DrcProject).find(_ => _.includes('' + sga.Project_code)),
      year: (sga.SGA_start_date as unknown as string)?.split('-')[0]
    }))
}

type SgaEntity = ReturnType<typeof mapSga>[0]

export const _PartnershipDashboard = ({
  schema,
}: {
  schema: KoboSchemaHelper.Bundle
}) => {
  const {m, formatLargeNumber} = useI18n()
  const selecteIds = useSetStateIp<string>()
  const ctx = usePartnershipContext()
  const mappedData = ctx.data.mappedData!

  const getOptions = (questionName: keyof typeof Partnership_partnersDatabaseOptions) => {
    return schema.schemaHelper.getOptionsByQuestionName(questionName)
      .map(_ => ({value: _.name, label: schema.translate.choice(questionName, _.name)}))
  }

  const filterShape = useMemo(() => DataFilter.makeShape<KoboAnswer<PartnershipData>>({
    oblast: {
      getValue: _ => _.Which_oblasts_does_t_t_and_has_experience,
      icon: 'location_on',
      getOptions: () => getOptions('Oblast_001'),
      label: m.oblast,
      multiple: true
    },
    activities: {
      icon: 'local_activity',
      getOptions: () => getOptions('The_organization_is_g_type_of_activities'),
      getValue: _ => _.The_organization_is_g_type_of_activities,
      label: m.activity,
      multiple: true
    },
    sector: {
      icon: 'support',
      getOptions: () => getOptions('Sectors_funded'),
      getValue: _ => _.Which_sectors_does_the_organiz,
      label: m.sector,
      multiple: true
    },
    relation: {
      icon: 'share',
      getValue: _ => _.Is_there_an_ongoing_relationsh,
      getOptions: () => getOptions('Is_there_an_ongoing_relationsh'),
      label: m._partner.relationship,
    },
    rapidMobilization: {
      icon: 'bolt',
      getValue: _ => _.Is_rapid_volunteer_mobilization_possible,
      getOptions: () => getOptions('Is_rapid_volunteer_mobilization_possible'),
      label: m._partner.rapidMobilization,
    },
    heardToReach: {
      icon: 'rocket_launch',
      getValue: _ => _.Is_access_possible_by_the_orga,
      getOptions: () => getOptions('Is_access_possible_by_the_orga'),
      label: m._partner.rapidMobilization,
    },
    cars: {
      icon: 'local_shipping',
      getValue: _ => _.Own_vehicles,
      getOptions: () => getOptions('Own_vehicles'),
      label: m.vehicule,
      multiple: true,
    },
    warehouse: {
      icon: 'warehouse',
      getValue: _ => _.Own_warehouse_belonging_to_th,
      getOptions: () => getOptions('Own_warehouse_belonging_to_th'),
      label: m.warehouse,
    },
    vetting: {
      icon: 'check_circle',
      getValue: _ => _.Has_vetting_been_conducted,
      getOptions: () => getOptions('Has_vetting_been_conducted'),
      label: m._partner.vetting,
    },
    risk: {
      icon: 'flag',
      getValue: _ => _.Overall_Residual_Risk,
      getOptions: () => getOptions('Overall_Residual_Risk'),
      label: m._partner.residualRisk,
    },
  }), [mappedData])

  const filterSgaShape = useMemo(() => DataFilter.makeShape<SgaEntity>({
    year: {
      icon: 'today',
      getValue: _ => _.year,
      getOptions: () => DataFilter.buildOptions(sgas?.map(_ => _.year).compact().distinct(_ => _)),
      label: m.year,
      multiple: false
    },
    donor: {
      icon: drcMaterialIcons.donor,
      getValue: _ => _.Donor,
      getOptions: () => getOptions('Donor'),
      label: m.donor,
      multiple: false
    },
    project: {
      icon: drcMaterialIcons.project,
      getValue: _ => _.project,
      getOptions: () => DataFilter.buildOptions(sgas?.map(_ => _.project).compact().distinct(_ => _)),
      label: m.project,
      multiple: false
    },
  }), [mappedData])

  const [optionFilter, setOptionFilters] = useState<DataFilter.InferShape<typeof filterShape> & DataFilter.InferShape<typeof filterSgaShape>>({})


  const sgas = useMemo(() => mapSga(mappedData), [mappedData])

  /** @deprecated Probably you need to use filteredAndPickedData instead */
  const filteredData = useMemo(() => {
    return seq(DataFilter.filterData(mappedData, filterShape, optionFilter))
  }, [mappedData, optionFilter, selecteIds])

  const filteredAndPickedData = useMemo(() => {
    return selecteIds.size === 0 ? filteredData : filteredData.filter(_ => selecteIds.has(_.id))
  }, [filteredData, selecteIds])

  const filteredAndPickedSgas = useMemo(() => {
    const w = mapSga(filteredAndPickedData)
    return seq(DataFilter.filterData(w, filterSgaShape, optionFilter))
  }, [filteredAndPickedData, optionFilter])

  const computed = usePartnershipDashboard({data: filteredAndPickedData})

  return (
    <Div column>
      <Box>
        <FilterLayout
          shape={{...filterShape, ...filterSgaShape}}
          filters={optionFilter}
          setFilters={setOptionFilters}
          onClear={() => {
            setOptionFilters({})
          }}
        />

        {/*<DashboardFilterOptions*/}
        {/*  icon="today"*/}
        {/*  value={optionFilter.year ?? []}*/}
        {/*  label={m.year}*/}
        {/*  options={allYears.map(SheetUtils.buildOption)}*/}
        {/*  onChange={_ => setOptionFilters(prev => ({...prev, year: _}))}*/}
        {/*/>*/}
      </Box>
      <Div>
        <Div column sx={{maxWidth: 320}}>
          <Panel sx={{display: 'flex'}}>
            <SlideWidget sx={{flex: 1}} title={m._partner.partners} icon="diversity_3">
              {formatLargeNumber(filteredAndPickedData.length)}
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
              <IpIconBtn sx={{marginLeft: 'auto'}} onClick={selecteIds.clear}>clear</IpIconBtn>
            </Box>
            {filteredData.map(d => <PartnershipCard schema={schema} state={selecteIds} key={d.id} partner={d} sx={{mt: 1}}/>)}
          </Panel>
        </Div>
        <Div column>
          <SlidePanel>
            <ChartPieIndicator dense showValue value={computed.ongoingGrant.length} base={filteredAndPickedData.length} title={m._partner.ongoingGrant}/>
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
                  base: DrcProjectHelper.budgetByProject[project] ?? 1
                })
              ]
            }).get()
          }}>
            {res => <Panel>
              <PanelBody>
                <Txt uppercase color="hint" bold>{m._partner.totalBudget}</Txt>
                <Txt sx={{fontSize: '2em', mb: 2, lineHeight: 1}} bold block>${formatLargeNumber(seq(Enum.values(res)).sum(_ => _.value))}</Txt>
                {Enum.entries(res).map(([project, budget]) => (
                  <ChartPieIndicator dense sx={{mb: 2}} key={project} value={budget.value} base={budget.base ?? 1} showValue showBase title={project}/>
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
                {_ => <ChartPieIndicator showValue dense title={m._partner.equitable} value={_.value} base={_.base} sx={{mb: 2}}/>}
              </Lazy>
              <Lazy deps={[filteredAndPickedData]} fn={() => {
                return ChartTools.percentage({
                  data: filteredAndPickedSgas,
                  base: _ => true,
                  value: _ => (_.Partnership_type === 'strategic_partnership' || _.Partnership_type === 'project_based_partnership') && _.Is_it_an_equitable_partnership === 'partially',
                })
              }}>
                {_ => <ChartPieIndicator showValue dense title={m._partner.partiallyEquitable} value={_.value} base={_.base}/>}
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
                return res
              }}>
                {_ => (
                  <ChartBarVertical data={_}/>
                )}
              </Lazy>

              {/*<ChartPieIndicator*/}
              {/*  title={m._partner.womenLedOrganization}*/}
              {/*  question="Is_this_a_women_led_organization"*/}
              {/*  filter={_ => _ === 'yes'}*/}
              {/*  data={filteredAndPickedData.filter(_ => _.Select_if_the_organi_inorities_in_Ukraine?.includes('women_s_rights'))}*/}
              {/*  sx={{mb: 2}}*/}
              {/*/>*/}
              {/*<ChartPieIndicator*/}
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
                  <ChartPieIndicator showValue showBase title={m._partner.benefReached} value={res.other.value} base={res.other.base!} sx={{mb: 2}}/>
                  <ChartPieIndicator showValue showBase title={m._partner.benefPwdReached} value={res.pwd.value} base={res.pwd.base!}/>
                  <ChartBar data={res.breakdown}/>
                </PanelBody>
              </Panel>
            )}
          </Lazy>
          <SlidePanel title={m._partner.targetedMinorities}>
            <ChartBarMultipleBy
              data={filteredAndPickedData}
              by={_ => _.Select_if_the_organi_inorities_in_Ukraine!}
              label={Partnership_partnersDatabaseOptions.Minority_group}
            />
          </SlidePanel>
          <Panel>
            <PanelHead>{m.sector}</PanelHead>
            <PanelBody>
              <ChartBarMultipleBy
                data={filteredAndPickedData}
                by={_ => _.Which_sectors_does_the_organiz!}
                label={Partnership_partnersDatabaseOptions.Sectors_funded}
              />
            </PanelBody>
          </Panel>
        </Div>
      </Div>
    </Div>
  )
}
