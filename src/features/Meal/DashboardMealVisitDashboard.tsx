import React, {useMemo, useState} from 'react'
import {Enum, map, mapFor, seq, Seq} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {DashboardLayout} from '../Dashboard/shared/DashboardLayout'
import {DashboardFilterOptions} from '../Dashboard/shared/DashboardFilterOptions'
import {Box, Icon} from '@mui/material'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import {makeKoboBarChartComponent} from '../Dashboard/shared/KoboBarChart'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {Div, SlidePanel} from '@/shared/PdfLayout/PdfSlide'
import {KoboPieChartIndicator} from '@/features/Dashboard/shared/KoboPieChartIndicator'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {DashboardFilterHelper} from '@/features/Dashboard/helper/dashoardFilterInterface'
import {Lazy} from '@/shared/Lazy'
import {KoboUkraineMap} from '../Dashboard/shared/KoboUkraineMap'
import {PieChartIndicator} from '@/shared/PieChartIndicator'
import {AaBtn} from '@/shared/Btn/AaBtn'
import Link from 'next/link'
import {AAIconBtn} from '@/shared/IconBtn'
import {CommentsPanel} from '@/features/Meal/CommentsPanel'
import {KoboAttachedImg} from '@/shared/TableImg/KoboAttachedImg'
import {OblastIndex, OblastISO} from '@/shared/UkraineMap/oblastIndex'
import {useDashboardMealVisitContext} from '@/features/Meal/DashboardMealVisitContext'
import {NavLink} from 'react-router-dom'
import {mealModule} from '@/features/Meal/DashboardMealVisit'
import {Meal_VisitMonitoringOptions} from '@/core/koboModel/Meal_VisitMonitoring/Meal_VisitMonitoringOptions'
import {Meal_VisitMonitoring} from '@/core/koboModel/Meal_VisitMonitoring/Meal_VisitMonitoring'
import {useKoboSchemaContext} from '@/features/Kobo/KoboSchemaContext'

export interface DashboardPageProps {
  filters: Filters
  data: Seq<KoboAnswer<Meal_VisitMonitoring>>
}

const mapOblast = OblastIndex.koboOblastIndexIso

export const filterShape = DashboardFilterHelper.makeShape<typeof Meal_VisitMonitoringOptions>()({
  oblast: {
    icon: 'location_on',
    options: 'mdro',
    label: m => m.office,
  },
  focalPoint: {
    icon: 'person',
    options: 'mdp',
    label: m => m.focalPoint,
  },
  donor: {
    icon: 'handshake',
    options: 'mdd_001',
    multiple: true,
    label: m => m.donor,
  },
  activity: {
    icon: 'edit_calendar',
    options: 'mdt',
    label: m => m.project,
  },
  nfi: {
    multiple: true,
    // icon: 'edit_calendar',
    options: 'pan',
    label: m => m.mealMonitoringVisit.nfiDistribution,
  },
  ecrec: {
    // icon: 'edit_calendar',
    options: 'pae',
    label: m => m.mealMonitoringVisit.ecrec,
  },
  shelter: {
    // icon: 'edit_calendar',
    options: 'pas',
    label: m => m.mealMonitoringVisit.shelter,
  },
  lau: {
    // icon: 'edit_calendar',
    options: 'pal',
    label: m => m.mealMonitoringVisit.lau,
  },
  protection: {
    // icon: 'edit_calendar',
    options: 'pap',
    label: m => m.mealMonitoringVisit.protection,
  },
  eore: {
    // icon: 'edit_calendar',
    options: 'pao',
    label: m => m.mealMonitoringVisit.eore,
  },
})

export const MealVisitMonitoringBarChart = makeKoboBarChartComponent<Meal_VisitMonitoring, typeof Meal_VisitMonitoringOptions>({
  options: Meal_VisitMonitoringOptions
})

export type Filters = DashboardFilterHelper.InferShape<typeof filterShape>

export const DashboardMealVisitDashboard = () => {
  const ctx = useDashboardMealVisitContext()
  const schemaCtx = useKoboSchemaContext()
  const {m, formatDateTime, formatDate} = useI18n()
  const [optionFilter, setOptionFilters] = useState<Filters>(seq(Enum.keys(filterShape)).reduceObject<Filters>(_ => [_, []]))

  const data = useMemo(() => {
    return map(ctx.fetcherAnswers.entity, _ => seq(DashboardFilterHelper.filterData(_, filterShape, optionFilter)))
  }, [ctx.fetcherAnswers.entity, optionFilter])

  const getChoices = <T extends keyof typeof Meal_VisitMonitoringOptions>(
    questionName: T, {
      skipKey = [],
      // renameOptions
    }: {
      skipKey?: (keyof typeof Meal_VisitMonitoringOptions[T])[]
      // renameOptions?: Record<keyof typeof ProtHHS_2_1Options[T], string>
    } = {}
  ) => {
    return Enum.entries(Meal_VisitMonitoringOptions[questionName] ?? {})
      .map(([value, label]) => ({value, label: label}))
      .filter(_ => !(skipKey as string[]).includes(_.value))
  }

  return (
    <DashboardLayout
      hideEuLogo
      pageWidth={1360}
      loading={ctx.fetcherAnswers.loading}
      title={m.ukraine}
      subTitle={m.mealVisitMonitoringDashboard}
      action={
        <>
          <Link href="/">
            <AAIconBtn sx={{mr: 1}} children="home"/>
          </Link>
          <a href="https://drcngo.sharepoint.com/:x:/s/UKR-MEAL_DM-WS/Ee4lwQ1OMKhCkzyeza_UejoBVWdn-2zgxjoCbpPjN4DZZQ?e=zn5LHw" target="_blank">
            <AaBtn variant="outlined" icon="open_in_new">Open Excel tracker</AaBtn>
          </a>
        </>
      }
      header={
        <Box sx={{
          pt: 1,
          pb: 1,
          display: 'flex',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          alignItems: 'center',
          '& > :not(:last-child)': {mr: 1}
        }}>
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
          {Enum.entries(filterShape).map(([k, shape]) =>
            <DashboardFilterOptions
              key={k}
              icon={shape.icon}
              value={optionFilter[k]}
              label={shape.label(m)}
              options={getChoices(shape.options)}
              onChange={_ => setOptionFilters(prev => ({...prev, [k]: _}))}
            />
          )}
        </Box>
      }
      // visualisation of the project, visit, overall rating, and then someone can click to expand comments and details
      beforeSection={
        data && (
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
                          <NavLink to={mealModule.siteMap.details(row.id)}>
                            <AaBtn iconAfter="chevron_right">View details</AaBtn>
                          </NavLink>
                        </Box>
                      </Box>
                    )
                  }))}>
                    {_ => <CommentsPanel data={_}/>}
                  </Lazy>
                </SlidePanel>
              </Div>
            </Div>
          </>
        )
      }
    />
  )
}