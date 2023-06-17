import {Page} from '@/shared/Page'
import React, {useEffect} from 'react'
import {useI18n} from '../../../core/i18n'
import {useMPCADeduplicationContext} from '../MpcaDeduplicationContext'
import {SlideContainer, SlidePanel, SlideWidget} from '@/shared/PdfLayout/Slide'
import {BNREOblastToISO, UseBNREComputed, useBNREComputed} from '../useBNREComputed'
import {KoboAnswer2} from '../../../core/sdk/server/kobo/Kobo'
import {BNRE} from '../../../core/koboModel/BNRE/BNRE'
import {MpcaDeduplicationDb} from '../MpcaDeduplicationDb'
import {UkraineMap} from '@/shared/UkraineMap/UkraineMap'
import {Lazy} from '@/shared/Lazy'
import {ChartTools} from '../../../core/chartTools'
import {AAStackedBarChart} from '@/shared/Chart/AaStackedBarChart'
import {HorizontalBarChartGoogle} from '@/shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {_Arr} from '@alexandreannic/ts-utils'

export const MpcaDashboard = () => {
  const {deduplicationDb, _koboAnswers} = useMPCADeduplicationContext()
  const computed = useBNREComputed({data: _koboAnswers.entity})

  useEffect(() => {
    _koboAnswers.fetch({force: false})
  }, [])

  return (
    <Page width="lg" loading={!deduplicationDb || _koboAnswers.loading}>
      {computed && _koboAnswers.entity && (
        <_MPCADashboard
          db={deduplicationDb}
          data={_koboAnswers.entity}
          computed={computed}
        />
      )}
    </Page>
  )
}

export const _MPCADashboard = ({
  db,
  data,
  computed,
}: {
  db?: MpcaDeduplicationDb,
  data: _Arr<KoboAnswer2<BNRE>>
  computed: NonNullable<UseBNREComputed>
}) => {
  const {m, formatDate, formatLargeNumber} = useI18n()
  return (
    <>
      <SlideContainer column>
        <SlideContainer>
          <SlideWidget sx={{flex: 1}} icon="home" title={m.hhs}>
            {formatLargeNumber(data.length)}
          </SlideWidget>
          <SlideWidget sx={{flex: 1}} icon="person" title={m.individuals}>
            {formatLargeNumber(computed?.flatData.length)}
          </SlideWidget>
          <SlideWidget sx={{flex: 1}} icon="content_copy" title={m.deduplications}>
            {formatLargeNumber(db?.length())}
          </SlideWidget>
        </SlideContainer>
        <SlideContainer>
          <SlideContainer column>
            <SlidePanel title={m.ageGroup}>
              <AAStackedBarChart data={computed.ageGroup} height={250} colors={t => [
                t.palette.primary.main,
                t.palette.info.main,
                t.palette.divider,
              ]}/>
            </SlidePanel>
            <SlidePanel title={m.program}>
              <Lazy deps={[data]} fn={() => ChartTools.multiple({
                data: data.map(_ => _.back_prog_type).compact().map(_ => _.map(x => x.split('_')[0]))
              })}>
                {_ => <HorizontalBarChartGoogle data={_}/>}
              </Lazy>
            </SlidePanel>
            <SlidePanel title={m.donor}>
              <Lazy deps={[data]} fn={() => ChartTools.single({
                data: data.map(_ => _.back_donor).compact().map(_ => _.split('_')[0])
              })}>
                {_ => <HorizontalBarChartGoogle data={_}/>}
              </Lazy>
            </SlidePanel>
          </SlideContainer>
          <SlideContainer column>
            <SlidePanel title={m.HHsLocation}>
              <Lazy deps={[data]} fn={() => ChartTools.groupBy({
                data,
                groupBy: _ => _.ben_det_oblast ? BNREOblastToISO[_.ben_det_oblast] : undefined,
                filter: _ => true
              })}>
                {_ => <UkraineMap data={_}/>}
              </Lazy>
            </SlidePanel>
          </SlideContainer>
        </SlideContainer>
      </SlideContainer>
    </>
  )
}