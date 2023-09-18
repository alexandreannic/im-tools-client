import {Page} from '@/shared/Page'
import React, {useEffect, useState} from 'react'
import {useI18n} from '../../../core/i18n'
import {MpcaRow, useMPCAContext} from '../MpcaContext'
import {Div, SlidePanel, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {UseBNREComputed, useBNREComputed} from '../useBNREComputed'
import {_Arr, Enum} from '@alexandreannic/ts-utils'
import {toPercent} from '@/utils/utils'
import {Txt} from 'mui-extension'
import {PieChartIndicator} from '@/shared/PieChartIndicator'
import {PeriodPicker} from '@/shared/PeriodPicker/PeriodPicker'
import {Period} from '@/core/type'
import {HorizontalBarChartGoogle} from '@/shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {Lazy} from '@/shared/Lazy'
import {ChartTools} from '@/core/chartTools'
import {KoboLineChartDate} from '@/features/Dashboard/shared/KoboLineChartDate'

const today = new Date()

export const MpcaDashboard = () => {
  const ctx = useMPCAContext()
  const computed = useBNREComputed({data: ctx.data})
  const [periodFilter, setPeriodFilter] = useState<Partial<Period>>({})
  const {m} = useI18n()

  useEffect(() => {
    if (periodFilter.start || periodFilter.end)
      ctx.fetcherData.fetch({force: true}, {filters: periodFilter})
  }, [periodFilter])

  return (
    <Page width="lg" loading={ctx.fetcherData.loading}>
      <PeriodPicker
        defaultValue={[periodFilter.start, periodFilter.end]}
        onChange={([start, end]) => setPeriodFilter(prev => ({...prev, start, end}))}
        sx={{mb: 2}}
        label={[m.start, m.endIncluded]}
        max={today}
      />
      {computed && ctx.data && (
        <_MPCADashboard
          data={ctx.data}
          computed={computed}
        />
      )}
    </Page>
  )
}

export const _MPCADashboard = ({
  data,
  computed,
}: {
  data: _Arr<MpcaRow>
  computed: NonNullable<UseBNREComputed>
}) => {
  const {m, formatDate, formatLargeNumber} = useI18n()
  return (
    <>
      <Div column>
        <Div>
          <SlideWidget sx={{flex: 1}} icon="person" title="Beneficiaries">
            {formatLargeNumber(data.length)}
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
        <Div>
          <Div column>
            <SlidePanel title={m.program}>
              <Lazy deps={[data]} fn={() => ChartTools.multiple({
                data: data.map(_ => _.prog),
              })}>
                {_ => <HorizontalBarChartGoogle data={_}/>}
              </Lazy>
            </SlidePanel>
            <SlidePanel title={m.form}>
              <Lazy deps={[data]} fn={() => ChartTools.single({
                data: data.map(_ => _.source),
              })}>
                {_ => <HorizontalBarChartGoogle data={_}/>}
              </Lazy>
            </SlidePanel>
          </Div>
          <Div column>
            <SlidePanel title={m.submissionTime}>
              <KoboLineChartDate
                data={data}
                curves={{
                  'date': _ => _.date,
                }}
              />
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