import React from 'react'
import {darken, useTheme} from '@mui/material'
import {useSnapshotProtMonitoringContext} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoContext'
import {Div, PdfSlide, PdfSlideBody, SlidePanel, SlidePanelTitle, SlideTxt, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {useI18n} from '@/core/i18n'
import {DRCLogo, EULogo, UhfLogo, UsaidLogo} from '@/shared/logo/logo'
import {ChartBarStacker, commonLegendProps} from '@/shared/charts/ChartBarStacked'
import {UkraineMap} from '@/shared/UkraineMap/UkraineMap'
import {Legend} from 'recharts'
import {ChartPie} from '@/shared/charts/ChartPie'
import {snapshotAlternateColor} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEcho'
import {useAppSettings} from '@/core/context/ConfigContext'
import {SnapshotHeader} from '@/features/Snapshot/SnapshotHeader'
import {Enum, seq} from '@alexandreannic/ts-utils'
import {OblastIndex} from '@/shared/UkraineMap/oblastIndex'
import {ChartBarSingleBy} from '@/shared/charts/ChartBarSingleBy'
import {Person} from '@/core/type/person'
import {Protection_Hhs2} from '@/core/sdk/server/kobo/generatedInterface/Protection_Hhs2'

export const SnapshotProtMonitoEchoSample = () => {
  const theme = useTheme()
  const {conf} = useAppSettings()
  const {data, computed, period} = useSnapshotProtMonitoringContext()
  const {formatLargeNumber, m} = useI18n()
  return (
    <PdfSlide>
      <SnapshotHeader period={period} logo={
        <>
          <UsaidLogo sx={{mr: 1.5}}/>
          <UhfLogo sx={{mr: 1.5}}/>
          <EULogo sx={{mr: 1.5}}/>
          <DRCLogo/>
        </>
      }/>
      <PdfSlideBody>
        <Div>
          <Div column sx={{flex: 4}}>
            <SlideTxt>
              This snapshot summarizes the findings of <b>Protection Monitoring</b> (PM)
              implemented through household surveys in the following oblasts:
              <ul style={{columns: 2}}>
                {seq(new Enum(computed.byCurrentOblast).entries())
                  .filter(([k, v]) => v.value > 0)
                  .map(([k]) => {
                    const r = OblastIndex.byIso(k).shortName
                    if (!r) throw new Error(k)
                    return r
                  })
                  .sortByString(_ => _)
                  .map(oblast =>
                    <li key={oblast}>{oblast}</li>
                  )}
              </ul>
            </SlideTxt>
            <UkraineMap data={computed.byCurrentOblast} sx={{mx: 1}}/>
            <SlideTxt>
              DRC protection monitoring targeted Internally Displaced Persons (IDPs) and people
              directly exposed to and affected by the current armed conflict in order to understand
              the protection needs facing affected populations; informing DRC and the protection
              communities' response.
            </SlideTxt>
          </Div>

          <Div column sx={{flex: 6}}>
            <Div sx={{flex: 0}}>
              <SlideWidget sx={{flex: 1}} icon="home" title={m.hhs}>
                {formatLargeNumber(data.length)}
              </SlideWidget>
              <SlideWidget sx={{flex: 1}} icon="person" title={m.individuals}>
                {formatLargeNumber(computed.individualsCount)}
              </SlideWidget>
              <SlideWidget sx={{flex: 1}} icon="group" title={m.hhSize}>
                {(computed.individualsCount / data.length).toFixed(1)}
              </SlideWidget>
            </Div>

            <Div>
              <Div column>
                <SlidePanel>
                  <ChartPie
                    outerRadius={65}
                    height={140}
                    width={270}
                    m={{
                      male: m.male,
                      female: m.female,
                      // other: m.other,
                    }}
                    data={{
                      female: computed.byGender.Female,
                      male: computed.byGender.Male,
                    }}
                    colors={{
                      female: theme.palette.primary.main,
                      malew: snapshotAlternateColor(theme),
                      // other: theme.palette.divider,
                    }}
                  >
                    <Legend {...commonLegendProps} layout="vertical" verticalAlign="middle" align="right"/>
                  </ChartPie>
                </SlidePanel>
                <SlidePanel>
                  <SlidePanelTitle>{m.ageGroup}</SlidePanelTitle>
                  <ChartBarStacker data={computed.ageGroup(Person.ageGroup['DRC'], true)} sx={{mt: 2}} height={300} colors={t => [
                    t.palette.primary.main,
                    snapshotAlternateColor(t),
                    darken(t.palette.primary.main, .5),
                  ]}/>
                </SlidePanel>
              </Div>
              <Div column>
                <SlidePanel>
                  <SlidePanelTitle>{m.protHHS2.hhTypes}</SlidePanelTitle>
                  <ChartBarSingleBy
                    data={data}
                    by={_ => _.what_is_the_type_of_your_household}
                    label={Protection_Hhs2.options.what_is_the_type_of_your_household}
                  />
                </SlidePanel>
                <SlidePanel>
                  <SlidePanelTitle>{m.displacementStatus}</SlidePanelTitle>
                  <ChartBarSingleBy data={data} by={_ => _.do_you_identify_as_any_of_the_following} label={Protection_Hhs2.options.do_you_identify_as_any_of_the_following}/>
                </SlidePanel>
              </Div>
            </Div>
          </Div>
        </Div>
      </PdfSlideBody>
    </PdfSlide>
  )
}