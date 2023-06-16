import {SlideContainer, SlidePanel, SlidePanelTitle} from '../../../shared/PdfLayout/Slide'
import React, {useMemo} from 'react'
import {useI18n} from '../../../core/i18n'
import {DashboardPageProps, ProtHHS2BarChart} from './DashboardProtHHS2'
import {KoboUkraineMap} from '../shared/KoboUkraineMap'
import {KoboPieChartIndicator, KoboPieChartIndicatorMultiple} from '../shared/KoboPieChartIndicator'
import {Lazy} from '../../../shared/Lazy'
import {ChartTools} from '../../../core/chartTools'
import {HorizontalBarChartGoogle} from '../../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {chain, forceArrayStringInference} from '@/utils/utils'
import {_Arr, Arr, Enum, fnSwitch} from '@alexandreannic/ts-utils'
import {PieChartIndicator} from '../../../shared/PieChartIndicator'
import {Panel} from '../../../shared/Panel'
import {ProtHHS_2_1Options} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1Options'
import {ProtHHS_2_1} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1'

export const DashboardProtHHS2Violence = ({
  data,
  computed,
  filters,
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()
  const groupedIndividualsType = useMemo(() => {
    // Verbose but more performant than functional version
    const res = {
      type: Arr() as _Arr<ProtHHS_2_1['what_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence']>,
      when: Arr() as _Arr<ProtHHS_2_1['when_did_the_incidents_occur_has_any_adult_male_member_experienced_violence']>,
      who: Arr() as _Arr<ProtHHS_2_1['who_were_the_perpetrators_of_the_incident_has_any_adult_male_member_experienced_violence']>,
    }
    data.forEach(_ => {
      res.type.push(...[
        _.what_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence,
        _.what_type_of_incidents_took_place_has_any_adult_female_member_experienced_violence,
        _.what_type_of_incidents_took_place_has_any_boy_member_experienced_violence,
        _.what_type_of_incidents_took_place_has_any_girl_member_experienced_violence,
        _.what_type_of_incidents_took_place_has_any_other_member_experienced_violence,
      ])
      res.when.push(...[
        _.when_did_the_incidents_occur_has_any_adult_male_member_experienced_violence,
        _.when_did_the_incidents_occur_has_any_adult_female_member_experienced_violence,
        _.when_did_the_incidents_occur_has_any_boy_member_experienced_violence,
        _.when_did_the_incidents_occur_has_any_girl_member_experienced_violence,
        _.when_did_the_incidents_occur_has_any_other_member_experienced_violence,
      ])
      res.who.push(...[
        _.who_were_the_perpetrators_of_the_incident_has_any_adult_male_member_experienced_violence,
        _.who_were_the_perpetrators_of_the_incident_has_any_adult_female_member_experienced_violence,
        _.who_were_the_perpetrators_of_the_incident_has_any_boy_member_experienced_violence,
        _.who_were_the_perpetrators_of_the_incident_has_any_girl_member_experienced_violence,
        _.who_were_the_perpetrators_of_the_incident_has_any_other_member_experienced_violence,
      ])
    })
    return res
  }, [data])
  return (
    <SlideContainer column>
      <SlideContainer>
        <Lazy deps={[data]} fn={() => {
          const questions = forceArrayStringInference([
            'has_any_adult_male_member_experienced_violence',
            'has_any_adult_female_member_experienced_violence',
            'has_any_boy_member_experienced_violence',
            'has_any_girl_member_experienced_violence',
            'has_any_other_member_experienced_violence',
          ])
          const res = {} as Record<(typeof questions)[0], {value: number, base: 0}>
          questions.forEach(q => {
            res[q] = {value: 0, base: 0}
          })
          data.forEach(row => {
            row.persons.forEach(_ => {
              if (_.age) {
                if (_.gender === 'male') {
                  if (_.age >= 18) res.has_any_adult_male_member_experienced_violence.base += 1
                  else res.has_any_boy_member_experienced_violence.base += 1
                } else if (_.gender === 'female') {
                  if (_.age >= 18) res.has_any_adult_female_member_experienced_violence.base += 1
                  else res.has_any_girl_member_experienced_violence.base += 1
                } else {
                  res.has_any_other_member_experienced_violence.base += 1
                }
              } else {
                res.has_any_other_member_experienced_violence.base += 1
              }
            })
            forceArrayStringInference([
              'has_any_adult_male_member_experienced_violence',
              'has_any_adult_female_member_experienced_violence',
              'has_any_boy_member_experienced_violence',
              'has_any_girl_member_experienced_violence',
              'has_any_other_member_experienced_violence',
            ]).forEach(key => {
              if (row[key] === 'yes') {
                res[key].value += 1
              }
            })
          })
          return res
        }}>
          {_ => Enum.entries(_).map(([k, v]) => (
            <SlidePanel key={k} sx={{flex: 1, m: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <PieChartIndicator value={v.value} base={v.base} percent={v.value / v.base} title={fnSwitch(k, {
                has_any_adult_female_member_experienced_violence: m.adultWomen,
                has_any_adult_male_member_experienced_violence: m.adultMen,
                has_any_boy_member_experienced_violence: m.boy,
                has_any_girl_member_experienced_violence: m.girl,
                has_any_other_member_experienced_violence: m.other,
              })}/>
            </SlidePanel>
          ))}
        </Lazy>
      </SlideContainer>
      <SlideContainer>
        <SlideContainer column>
          <Lazy deps={[groupedIndividualsType.type]} fn={() =>
            chain(ChartTools.multiple({
              data: groupedIndividualsType.type,
              filterValue: ['unable_unwilling_to_answer']
            }))
              .map(ChartTools.setLabel(ProtHHS_2_1Options.what_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence))
              .map(ChartTools.sortBy.value)
              .get
          }>
            {_ => (
              <SlidePanel title={m.protHHS2.typeOfIncident}>
                <HorizontalBarChartGoogle data={_}/>
              </SlidePanel>
            )}
          </Lazy>
        </SlideContainer>
        <SlideContainer column>
          <Lazy deps={[groupedIndividualsType.when]} fn={() =>
            chain(ChartTools.multiple({
              data: groupedIndividualsType.when,
              filterValue: ['unable_unwilling_to_answer']
            }))
              .map(ChartTools.setLabel(ProtHHS_2_1Options.when_did_the_incidents_occur_has_any_adult_male_member_experienced_violence))
              .map(ChartTools.sortBy.value)
              .get
          }>
            {_ => (
              <SlidePanel title={m.protHHS2.typeOfIncident}>
                <HorizontalBarChartGoogle data={_}/>
              </SlidePanel>
            )}
          </Lazy>
          <Lazy deps={[groupedIndividualsType.who]} fn={() =>
            chain(ChartTools.multiple({
              data: groupedIndividualsType.who,
              filterValue: ['unable_unwilling_to_answer']
            }))
              .map(ChartTools.setLabel(ProtHHS_2_1Options.who_were_the_perpetrators_of_the_incident_has_any_adult_male_member_experienced_violence))
              .map(ChartTools.sortBy.value)
              .get
          }>
            {_ => (
              <SlidePanel title={m.protHHS2.typeOfIncident}>
                <HorizontalBarChartGoogle data={_}/>
              </SlidePanel>
            )}
          </Lazy>
        </SlideContainer>
      </SlideContainer>
    </SlideContainer>
  )
}