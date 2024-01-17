import React, {useMemo, useState} from 'react'
import {map, mapFor, seq, Seq} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {Box, Icon} from '@mui/material'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import {makeKoboBarChartComponent} from '../../Dashboard/shared/KoboBarChart'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {Div, SlidePanel} from '@/shared/PdfLayout/PdfSlide'
import {KoboPieChartIndicator} from '@/features/Dashboard/shared/KoboPieChartIndicator'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {DataFilter} from '@/features/Dashboard/helper/dashoardFilterInterface'
import {Lazy} from '@/shared/Lazy'
import {KoboUkraineMap} from '../../Dashboard/shared/KoboUkraineMap'
import {PieChartIndicator} from '@/shared/PieChartIndicator'
import {IpBtn} from '@/shared/Btn/IpBtn'
import {CommentsPanel} from '@/shared/CommentsPanel'
import {KoboAttachedImg} from '@/shared/TableImg/KoboAttachedImg'
import {OblastIndex} from '@/shared/UkraineMap/oblastIndex'
import {NavLink} from 'react-router-dom'
import {Meal_VisitMonitoringOptions} from '@/core/koboModel/Meal_VisitMonitoring/Meal_VisitMonitoringOptions'
import {Meal_VisitMonitoring} from '@/core/koboModel/Meal_VisitMonitoring/Meal_VisitMonitoring'
import {useKoboSchemaContext} from '@/features/Kobo/KoboSchemaContext'
import {FilterLayout} from '@/features/Dashboard/helper/FilterLayout'
import {useMealVisitContext} from '@/features/Meal/Visit/MealVisitContext'
import {mealIndex} from '@/features/Meal/Meal'
import {Page} from '@/shared/Page'

export interface DashboardPageProps {
  filters: Record<string, string[]>
  data: Seq<KoboAnswer<Meal_VisitMonitoring>>
}

const mapOblast = OblastIndex.koboOblastIndexIso

export const MealVisitMonitoringBarChart = makeKoboBarChartComponent<Meal_VisitMonitoring, typeof Meal_VisitMonitoringOptions>({
  options: Meal_VisitMonitoringOptions
})

// export type Filters = DashboardFilterHelper.InferShape<typeof fiterShape>

export const MealVisitDashboard = () => {
  const ctx = useMealVisitContext()
  const schemaCtx = useKoboSchemaContext()
  const {m, formatDateTime, formatDate} = useI18n()
  const [optionFilter, setOptionFilters] = useState<Record<string, string[] | undefined>>({})

  const filterShape = useMemo(() => {
    return DataFilter.makeShape<KoboAnswer<Meal_VisitMonitoring>>({
      oblast: {
        icon: 'location_on',
        getOptions: () => schemaCtx.schemaHelper.getOptionsByQuestionName('mdro').map(_ => ({value: _.name, label: _.label[schemaCtx.langIndex]})),
        label: m.office,
        getValue: _ => _.mdro,
      },
      focalPoint: {
        icon: 'person',
        getOptions: () => schemaCtx.schemaHelper.getOptionsByQuestionName('mdp').map(_ => ({value: _.name, label: _.label[schemaCtx.langIndex]})),
        label: m.focalPoint,
        getValue: _ => _.mdp,
      },
      donor: {
        icon: 'handshake',
        getOptions: () => schemaCtx.schemaHelper.getOptionsByQuestionName('mdd_001').map(_ => ({value: _.name, label: _.label[schemaCtx.langIndex]})),
        label: m.donor,
        getValue: _ => _.mdd_001,
        multiple: true,
      },
      activity: {
        multiple: true,
        icon: 'edit_calendar',
        getOptions: () => schemaCtx.schemaHelper.getOptionsByQuestionName('mdt').map(_ => ({value: _.name, label: _.label[schemaCtx.langIndex]})),
        label: m.project,
        getValue: _ => _.mdt,
      },
      nfi: {
        // icon: 'edit_calendar',
        getOptions: () => schemaCtx.schemaHelper.getOptionsByQuestionName('pan').map(_ => ({value: _.name, label: _.label[schemaCtx.langIndex]})),
        label: m.mealMonitoringVisit.nfiDistribution,
        getValue: _ => _.pan,
        multiple: true,
      },
      ecrec: {
        // icon: 'edit_calendar',
        getOptions: () => schemaCtx.schemaHelper.getOptionsByQuestionName('pae').map(_ => ({value: _.name, label: _.label[schemaCtx.langIndex]})),
        label: m.mealMonitoringVisit.ecrec,
        getValue: _ => _.pae,
      },
      shelter: {
        // icon: 'edit_calendar',
        getOptions: () => schemaCtx.schemaHelper.getOptionsByQuestionName('pas').map(_ => ({value: _.name, label: _.label[schemaCtx.langIndex]})),
        label: m.mealMonitoringVisit.shelter,
        getValue: _ => _.pas,
      },
      lau: {
        // icon: 'edit_calendar',
        getOptions: () => schemaCtx.schemaHelper.getOptionsByQuestionName('pal').map(_ => ({value: _.name, label: _.label[schemaCtx.langIndex]})),
        label: m.mealMonitoringVisit.lau,
        getValue: _ => _.pal,
      },
      protection: {
        // icon: 'edit_calendar',
        getOptions: () => schemaCtx.schemaHelper.getOptionsByQuestionName('pap').map(_ => ({value: _.name, label: _.label[schemaCtx.langIndex]})),
        label: m.mealMonitoringVisit.protection,
        getValue: _ => _.pap,
      },
      eore: {
        // icon: 'edit_calendar',
        getOptions: () => schemaCtx.schemaHelper.getOptionsByQuestionName('pao').map(_ => ({value: _.name, label: _.label[schemaCtx.langIndex]})),
        label: m.mealMonitoringVisit.eore,
        getValue: _ => _.pao,
      },
    })
  }, [schemaCtx])

  const data = useMemo(() => {
    return map(ctx.fetcherAnswers.entity, _ => seq(DataFilter.filterData(_, filterShape, optionFilter)))
  }, [ctx.fetcherAnswers.entity, optionFilter, filterShape])

  return (
    <Page
      width="full"
      loading={ctx.fetcherAnswers.loading}
    >
      <FilterLayout
        shape={filterShape}
        filters={optionFilter}
        setFilters={setOptionFilters}
        before={
          <DebouncedInput<[Date | undefined, Date | undefined]>
            debounce={400}
            value={[ctx.periodFilter.start, ctx.periodFilter.end]}
            onChange={([start, end]) => ctx.setPeriodFilter(prev => ({...prev, start, end}))}
          >
            {(value, onChange) => <PeriodPicker
              sx={{marginTop: '-6px'}}
              defaultValue={value ?? [undefined, undefined]}
              onChange={onChange}
              min={ctx.fetcherPeriod.entity?.start}
              max={ctx.fetcherPeriod.entity?.end}
            />}
          </DebouncedInput>
        }
      />
      {data && (
        <>
          <Div>
            <Div column>
              <SlidePanel>
                <KoboUkraineMap
                  fillBaseOn="value"
                  data={data}
                  getOblast={_ => mapOblast[_.md_det_oblast!]}
                  value={_ => true}
                  base={_ => _.md_det_oblast !== undefined}
                />
              </SlidePanel>
              <SlidePanel>
                <Box sx={{display: 'flex', '& > *': {flex: 1}}}>
                  <Lazy deps={[data]} fn={() => {
                    const base = data.map(_ => _.sew).compact()
                    return {value: base.sum(), base: base.length * 100}
                  }}>
                    {_ => <PieChartIndicator titleIcon="female" title={m.women} value={_.value} base={_.base}/>}
                  </Lazy>
                  <Lazy deps={[data]} fn={() => {
                    const base = data.map(_ => _.sem).compact()
                    return {value: base.sum(), base: base.length * 100}
                  }}>
                    {_ => <PieChartIndicator titleIcon="male" title={m.men} value={_.value} base={_.base}/>}
                  </Lazy>
                </Box>
              </SlidePanel>
              <SlidePanel title={m.donor}>
                <MealVisitMonitoringBarChart data={data} question="mdd_001" questionType="multiple"/>
              </SlidePanel>
              <SlidePanel>
                <KoboPieChartIndicator title={m.mealMonitoringVisit.securityConcerns} question="ssy" filter={_ => _ === 'yes'} data={data} sx={{mb: 1}}/>
                <MealVisitMonitoringBarChart data={data} question="sst"/>
              </SlidePanel>
              <SlidePanel>
                <KoboPieChartIndicator title={m.mealMonitoringVisit.concerns} question="sef" filter={_ => _ === 'yes'} data={data} sx={{mb: 1}}/>
                <MealVisitMonitoringBarChart data={data} question="sei"/>
              </SlidePanel>
              <SlidePanel>
                <KoboPieChartIndicator title={m.mealMonitoringVisit.criticalConcern} question="visf" filter={_ => _ === 'yes'} data={data} sx={{mb: 1}}/>
                <MealVisitMonitoringBarChart data={data} question="visp"/>
              </SlidePanel>
            </Div>

            <Div column sx={{maxHeight: '33%'}}>
              <SlidePanel title={m.mealMonitoringVisit.nfiDistribution}>
                <MealVisitMonitoringBarChart data={data} question="pan" questionType="multiple"/>
              </SlidePanel>
              <SlidePanel title={m.mealMonitoringVisit.ecrec}>
                <MealVisitMonitoringBarChart data={data} question="pae"/>
              </SlidePanel>
              <SlidePanel title={m.mealMonitoringVisit.shelter}>
                <MealVisitMonitoringBarChart data={data} question="pas"/>
              </SlidePanel>
              <SlidePanel title={m.mealMonitoringVisit.lau}>
                <MealVisitMonitoringBarChart data={data} question="pal"/>
              </SlidePanel>
              <SlidePanel title={m.mealMonitoringVisit.protection}>
                <MealVisitMonitoringBarChart data={data} question="pap"/>
              </SlidePanel>
              <SlidePanel title={m.mealMonitoringVisit.eore}>
                <MealVisitMonitoringBarChart data={data} question="pao"/>
              </SlidePanel>
            </Div>

            <Div column>
              <SlidePanel title={`${m.comments} (${data.length})`} BodyProps={{sx: {pr: 0}}}>
                <Lazy deps={[data]} fn={() => data.map(row => ({
                  id: row.id,
                  title: <>
                    {schemaCtx.translate.choice('mdp', row.mdp)}
                    {/*<AAIconBtn>chevron_right</AAIconBtn>*/}
                  </>,
                  date: row.mdd ?? row.end,
                  desc: row.fcpc,
                  children: (
                    <Box>
                      <Box sx={{display: 'flex', flexWrap: 'wrap', '& > *': {mb: 1, mr: 1}}}>
                        {row.fcpl && (
                          <Box component="a" target="_blank" href={row.fcpl} sx={{
                            height: 90,
                            width: 90,
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: '6px',
                            justifyContent: 'center',
                            color: t => t.palette.primary.main,
                            border: t => `1px solid ${t.palette.divider}`
                          }}>
                            <Icon>open_in_new</Icon>
                          </Box>
                        )}
                        {mapFor(10, i =>
                          <KoboAttachedImg key={i} attachments={row.attachments} size={90} fileName={(row as any)['fcp' + (i + 1)]}/>
                        )}
                      </Box>
                      <Box sx={{textAlign: 'right'}}>
                        <NavLink to={mealIndex.siteMap.visit.details(row.id)}>
                          <IpBtn iconAfter="chevron_right">View details</IpBtn>
                        </NavLink>
                      </Box>
                    </Box>
                  )
                }))}>
                  {_ => <CommentsPanel data={_} height={700}/>}
                </Lazy>
              </SlidePanel>
            </Div>
          </Div>
        </>
      )}
    </Page>
  )
}
