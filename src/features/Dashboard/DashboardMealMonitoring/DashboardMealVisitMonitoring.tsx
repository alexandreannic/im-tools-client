import {useFetcher} from '@alexandreannic/react-hooks-lib'
import React, {useEffect, useMemo, useState} from 'react'
import {Arr, Enum, map, mapFor} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {DashboardLayout} from '../shared/DashboardLayout'
import {DashboardFilterOptions} from '../shared/DashboardFilterOptions'
import {Box, Icon} from '@mui/material'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import {makeKoboBarChartComponent} from '../shared/KoboBarChart'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {koboFormId} from '@/koboFormId'
import {useAppSettings} from '@/core/context/ConfigContext'
import {MealVisitMonitoring} from '@/core/koboModel/MealVisitMonitoring/MealVisitMonitoring'
import {MealVisitMonitoringOptions} from '@/core/koboModel/MealVisitMonitoring/MealVisitMonitoringOptions'
import {SlideContainer, SlidePanel} from '@/shared/PdfLayout/Slide'
import {KoboPieChartIndicator} from '@/features/Dashboard/shared/KoboPieChartIndicator'
import {KoboImg} from '@/shared/TableImg/KoboImg'
import {KoboAnswer2} from '@/core/sdk/server/kobo/Kobo'
import {Txt} from 'mui-extension'
import {DashboardFilterHelper} from '@/features/Dashboard/helper/dashoardFilterInterface'
import {Period} from '@/core/type'
import {Lazy} from '@/shared/Lazy'
import {KoboUkraineMap} from '../shared/KoboUkraineMap'
import {OblastISOSVG} from '@/shared/UkraineMap/ukraineSvgPath'
import {PieChartIndicator} from '@/shared/PieChartIndicator'
import {AaBtn} from '@/shared/Btn/AaBtn'

export interface DashboardPageProps {
  filters: OptionFilters
  data: Arr<KoboAnswer2<MealVisitMonitoring>>
}

const mapOblast: Record<string, OblastISOSVG> = {
  aroc: 'UA43',
  cherkaska: 'UA71',
  chernihivska: 'UA74',
  chernivetska: 'UA77',
  citykyiv: 'UA12',
  dnipropetrovska: 'UA14',
  donetska: 'UA26',
  'ivano-frankivska': 'UA63',
  kharkivska: 'UA65',
  khersonska: 'UA68',
  khmelnytska: 'UA35',
  kirovohradska: 'UA35',
  kyivska: 'UA32',
  luhanska: 'UA09',
  lvivska: 'UA46',
  mykolaivska: 'UA48',
  odeska: 'UA51',
  poltavska: 'UA53',
  rivnenska: 'UA56',
  sevastopilska: 'UA40',
  sumska: 'UA59',
  ternopilska: 'UA61',
  vinnytska: 'UA05',
  volynska: 'UA07',
  zakarpatska: 'UA21',
  zaporizka: 'UA23',
  zhytomyrska: 'UA18',
}

const filterShape = DashboardFilterHelper.makeShape<typeof MealVisitMonitoringOptions>()({
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
    options: 'mdd1',
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

type OptionFilters = DashboardFilterHelper.InferShape<typeof filterShape>

export const MealVisitMonitoringBarChart = makeKoboBarChartComponent<MealVisitMonitoring, typeof MealVisitMonitoringOptions>({
  options: MealVisitMonitoringOptions
})

export const DashboardMealVisitMonitoring = () => {
  const {api} = useAppSettings()
  const {m, formatDateTime, formatDate} = useI18n()

  const _period = useFetcher(() => api.kobo.answer.getPeriod(koboFormId.prod.mealVisitMonitoring))
  const [optionFilter, setOptionFilters] = useState<OptionFilters>(Arr(Enum.keys(filterShape)).reduceObject<OptionFilters>(_ => [_, []]))
  const [periodFilter, setPeriodFilter] = useState<Partial<Period>>({})

  const request = (filter: Partial<Period>) => api.kobo.answer.searchMealVisitMonitoring({
    filters: {
      start: filter.start,
      end: filter.end,
    }
  }).then(_ => _.data)

  const _answers = useFetcher(request)

  useEffect(() => {
    _period.fetch()
  }, [])
  useEffect(() => {
    map(_period.entity, setPeriodFilter)
  }, [_period.entity])

  useEffect(() => {
    _answers.fetch({force: true, clean: false}, periodFilter)
  }, [periodFilter])

  const getChoices = <T extends keyof typeof MealVisitMonitoringOptions>(
    questionName: T, {
      skipKey = [],
      // renameOptions
    }: {
      skipKey?: (keyof typeof MealVisitMonitoringOptions[T])[]
      // renameOptions?: Record<keyof typeof ProtHHS_2_1Options[T], string>
    } = {}
  ) => {
    return Enum.entries(MealVisitMonitoringOptions[questionName] ?? {})
      .map(([name, label]) => ({name, label: label}))
      .filter(_ => !(skipKey as string[]).includes(_.name))
  }

  const data = useMemo(() => {
    return map(_answers.entity, _ => Arr(DashboardFilterHelper.filterData(_, filterShape, optionFilter)))
  }, [_answers.entity, optionFilter])

  return (
    <DashboardLayout
      hideEuLogo
      pageWidth={1360}
      loading={_answers.loading}
      title={m.ukraine}
      subTitle={m.mealVisitMonitoringDashboard}
      action={
        <a href="https://drcngo.sharepoint.com/:x:/s/UKR-MEAL_DM-WS/Ee4lwQ1OMKhCkzyeza_UejoBVWdn-2zgxjoCbpPjN4DZZQ?e=zn5LHw" target="_blank">
          <AaBtn variant="outlined" icon="open_in_new">Open Excel tracker</AaBtn>
        </a>
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
            value={[periodFilter.start, periodFilter.end]}
            onChange={([start, end]) => setPeriodFilter(prev => ({...prev, start, end}))}
          >
            {(value, onChange) => <PeriodPicker
              sx={{marginTop: '-6px'}}
              value={value ?? [undefined, undefined]}
              onChange={onChange}
              min={_period.entity?.start}
              max={_period.entity?.end}
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
            <SlideContainer>
              <SlideContainer column>
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
                      return base.sum() / base.length / 100
                    }}>
                      {_ => <PieChartIndicator titleIcon="female" title={m.women} percent={_}/>}
                    </Lazy>
                    <Lazy deps={[data]} fn={() => {
                      const base = data.map(_ => _.sem).compact()
                      return base.sum() / base.length / 100
                    }}>
                      {_ => <PieChartIndicator titleIcon="male" title={m.men} percent={_}/>}
                    </Lazy>
                  </Box>
                </SlidePanel>
                <SlidePanel title={m.donor}>
                  <MealVisitMonitoringBarChart data={data} question="mdd1" questionType="multiple"/>
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
              </SlideContainer>

              <SlideContainer column sx={{maxHeight: '33%'}}>
                <SlidePanel title={m.mealMonitoringVisit.nfiDistribution}>
                  <MealVisitMonitoringBarChart data={data} question="pan"/>
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
              </SlideContainer>

              <SlideContainer column>
                <SlidePanel title={`${m.comments} (${data.length})`} BodyProps={{sx: {pr: 0}}}>
                  <Box sx={{maxHeight: '650px', overflowY: 'auto'}}>
                    {data.map(row => (
                      <Box key={row.id} sx={{
                        pb: 2,
                        pr: 1,
                        '&:not(:last-of-type)': {
                          mb: 2,
                          borderBottom: t => `1px solid ${t.palette.divider}`
                        }
                      }}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                          <Txt block bold size="big">{(MealVisitMonitoringOptions.mdp as any)[row.mdp]}</Txt>
                          <Txt color="hint">{formatDate(row.mdd ?? row.end)}</Txt>
                        </Box>
                        <Txt block color="hint" sx={{mb: 1}}>{row.fcpc ?? m.noComment}</Txt>
                        <Box sx={{display: 'flex', '& > *': {mr: 1}}}>
                          {row.fcpl && (
                            <Box component="a" target="_blank" href={row.fcpl} sx={{
                              height: 50,
                              width: 50,
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
                            <KoboImg key={i} attachments={row.attachments} size={50} fileName={(row as any)['fcp' + (i + 1)]}/>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </SlidePanel>
              </SlideContainer>
            </SlideContainer>
          </>
        )
      }
    />
  )
}
