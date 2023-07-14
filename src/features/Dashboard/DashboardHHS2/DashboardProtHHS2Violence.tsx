import {SlideContainer, SlidePanel} from '@/shared/PdfLayout/Slide'
import React, {useMemo, useState} from 'react'
import {useI18n} from '../../../core/i18n'
import {DashboardPageProps} from './DashboardProtHHS2'
import {Lazy} from '@/shared/Lazy'
import {ChartTools} from '../../../core/chartTools'
import {HorizontalBarChartGoogle} from '@/shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {chain, forceArrayStringInference} from '@/utils/utils'
import {_Arr, Arr, Enum} from '@alexandreannic/ts-utils'
import {ProtHHS_2_1Options} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1Options'
import {ProtHHS_2_1} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1'
import {ProtHHS2BarChart} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'
import {Box, Checkbox} from '@mui/material'
import {Txt} from 'mui-extension'

export const DashboardProtHHS2Violence = ({
  data,
  computed,
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()

  const [category, setCategory] = useState({
    has_any_adult_male_member_experienced_violence: true,
    has_any_adult_female_member_experienced_violence: true,
    has_any_boy_member_experienced_violence: true,
    has_any_girl_member_experienced_violence: true,
    has_any_other_member_experienced_violence: true,
  })
  const allChecked = useMemo(() => Enum.values(category).every(_ => _), [category])
  const oneChecked = useMemo(() => !!Enum.values(category).find(_ => _), [category])

  const updateAll = (checked: boolean) => {
    setCategory({
      has_any_adult_male_member_experienced_violence: checked,
      has_any_adult_female_member_experienced_violence: checked,
      has_any_boy_member_experienced_violence: checked,
      has_any_girl_member_experienced_violence: checked,
      has_any_other_member_experienced_violence: checked,
    })
  }

  const groupedIndividualsType = useMemo(() => {
    // Verbose but more performant than functional version
    const res = {
      type: Arr() as _Arr<ProtHHS_2_1['what_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence']>,
      when: Arr() as _Arr<ProtHHS_2_1['when_did_the_incidents_occur_has_any_adult_male_member_experienced_violence']>,
      who: Arr() as _Arr<ProtHHS_2_1['who_were_the_perpetrators_of_the_incident_has_any_adult_male_member_experienced_violence']>,
    }
    data.forEach(_ => {
      res.type.push(...[
        ...category.has_any_adult_male_member_experienced_violence ? [_.what_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence] : [],
        ...category.has_any_adult_female_member_experienced_violence ? [_.what_type_of_incidents_took_place_has_any_adult_female_member_experienced_violence] : [],
        ...category.has_any_boy_member_experienced_violence ? [_.what_type_of_incidents_took_place_has_any_boy_member_experienced_violence] : [],
        ...category.has_any_girl_member_experienced_violence ? [_.what_type_of_incidents_took_place_has_any_girl_member_experienced_violence] : [],
        ...category.has_any_other_member_experienced_violence ? [_.what_type_of_incidents_took_place_has_any_other_member_experienced_violence] : [],
      ])
      res.when.push(...[
        ...category.has_any_adult_male_member_experienced_violence ? [_.when_did_the_incidents_occur_has_any_adult_male_member_experienced_violence] : [],
        ...category.has_any_adult_female_member_experienced_violence ? [_.when_did_the_incidents_occur_has_any_adult_female_member_experienced_violence] : [],
        ...category.has_any_boy_member_experienced_violence ? [_.when_did_the_incidents_occur_has_any_boy_member_experienced_violence] : [],
        ...category.has_any_girl_member_experienced_violence ? [_.when_did_the_incidents_occur_has_any_girl_member_experienced_violence] : [],
        ...category.has_any_other_member_experienced_violence ? [_.when_did_the_incidents_occur_has_any_other_member_experienced_violence] : [],
      ])
      res.who.push(...[
        ...category.has_any_adult_male_member_experienced_violence ? [_.who_were_the_perpetrators_of_the_incident_has_any_adult_male_member_experienced_violence] : [],
        ...category.has_any_adult_female_member_experienced_violence ? [_.who_were_the_perpetrators_of_the_incident_has_any_adult_female_member_experienced_violence] : [],
        ...category.has_any_boy_member_experienced_violence ? [_.who_were_the_perpetrators_of_the_incident_has_any_boy_member_experienced_violence] : [],
        ...category.has_any_girl_member_experienced_violence ? [_.who_were_the_perpetrators_of_the_incident_has_any_girl_member_experienced_violence] : [],
        ...category.has_any_other_member_experienced_violence ? [_.who_were_the_perpetrators_of_the_incident_has_any_other_member_experienced_violence] : [],
      ])
    })
    return res
  }, [data, category])
  return (
    <SlideContainer responsive>
      <SlideContainer column>
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
          return ChartTools.setLabel({
            has_any_adult_female_member_experienced_violence: m.adultWomen,
            has_any_adult_male_member_experienced_violence: m.adultMen,
            has_any_boy_member_experienced_violence: m.boy,
            has_any_girl_member_experienced_violence: m.girl,
            has_any_other_member_experienced_violence: m.other,
          })(res)
        }}>
          {_ =>
            <SlidePanel title={m.protHHS2.reportedIncidents}>
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Checkbox indeterminate={!allChecked && oneChecked} checked={allChecked} onClick={() => {
                  updateAll(!allChecked)
                }}/>
                <Txt bold size="big">{m.selectAll}</Txt>
              </Box>
              <HorizontalBarChartGoogle
                data={_}
                labels={{
                  has_any_adult_male_member_experienced_violence: <Checkbox
                    size="small"
                    checked={category.has_any_adult_male_member_experienced_violence}
                    onChange={e => setCategory(prev => ({...prev, has_any_adult_male_member_experienced_violence: e.target.checked}))}
                  />,
                  has_any_adult_female_member_experienced_violence: <Checkbox
                    size="small"
                    checked={category.has_any_adult_female_member_experienced_violence}
                    onChange={e => setCategory(prev => ({...prev, has_any_adult_female_member_experienced_violence: e.target.checked}))}
                  />,
                  has_any_boy_member_experienced_violence: <Checkbox
                    size="small"
                    checked={category.has_any_boy_member_experienced_violence}
                    onChange={e => setCategory(prev => ({...prev, has_any_boy_member_experienced_violence: e.target.checked}))}
                  />,
                  has_any_girl_member_experienced_violence: <Checkbox
                    size="small"
                    checked={category.has_any_girl_member_experienced_violence}
                    onChange={e => setCategory(prev => ({...prev, has_any_girl_member_experienced_violence: e.target.checked}))}
                  />,
                  has_any_other_member_experienced_violence: <Checkbox
                    size="small"
                    checked={category.has_any_other_member_experienced_violence}
                    onChange={e => setCategory(prev => ({...prev, has_any_other_member_experienced_violence: e.target.checked}))}
                  />,
                }}
              />
            </SlidePanel>
          }
        </Lazy>
        <SlidePanel title={m.majorStressFactors}>
          <ProtHHS2BarChart
            data={data}
            questionType="multiple"
            filterValue={['unable_unwilling_to_answer']}
            question="what_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members"
          />
        </SlidePanel>
      </SlideContainer>
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
            <SlidePanel title={m.protHHS2.timelineOfIncident}>
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
            <SlidePanel title={m.perpetrators}>
              <HorizontalBarChartGoogle data={_}/>
            </SlidePanel>
          )}
        </Lazy>
      </SlideContainer>
    </SlideContainer>
  )
}