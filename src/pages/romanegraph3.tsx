import {Box} from '@mui/material'
import React, {ReactNode, useCallback, useEffect} from 'react'
import {Txt} from 'mui-extension'
import {PanelFeatures} from '@/shared/Panel/PanelFeatures'
import {useAppSettings} from '@/core/context/ConfigContext'
import {endOfMonth, startOfMonth} from 'date-fns'
import {enrichProtHHS_2_1, ProtHHS2BarChart} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {Enum, seq} from '@alexandreannic/ts-utils'
import {Person} from '@/core/type'
import {snapshotAlternateColor} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEcho'
import {AAStackedBarChart} from '@/shared/Chart/AaStackedBarChart'

export const Pan = ({
  title,
  children
}: {
  title: string
  children: ReactNode
}) => {
  return (
    <Box sx={{
      maxWidth: 500,
      margin: 'auto',
      my: 1,
    }}>
      <PanelFeatures savableAsImg>
        <Box sx={{
          // p: .5
        }}>
          <Box sx={{
            border: t => `1px solid ${t.palette.divider}`,
            p: 1,
            borderRadius: '8px',
          }}>
            <Txt block size="big" bold sx={{textAlign: 'center', mb: 1}}>{title}</Txt>
            {children}
          </Box>
        </Box>
      </PanelFeatures>
    </Box>
  )
}

export default () => {
  const {api} = useAppSettings()
  const req = () => api.kobo.answer.searchProtection_Hhs2({
    filters: {
      start: startOfMonth(new Date(2023, 6)),
      end: endOfMonth(new Date(2023, 8)),
    }
  }).then(_ => seq(_.data).map(enrichProtHHS_2_1))

  const fetcher = useFetcher(req)

  useEffect(() => {
    fetcher.fetch()
  }, [])

  const data = fetcher.entity

  const ageGroup = useCallback((ageGroup: Person.AgeGroup, hideOther?: boolean) => {
    const gb = Person.groupByGenderAndGroup(ageGroup)(data?.flatMap(_ => _.persons)!)
    return new Enum(gb).entries().map(([k, v]) => ({key: k, ...v}))
  }, [data])

  if (!data) return

  let index = 0
  const title = (title: string) => `Graph ${++index}. ${title}`

  return (
    <>
      <Pan title={title('Household respondents per displacement group')}>
        <ProtHHS2BarChart
          data={data}
          question="do_you_identify_as_any_of_the_following"
        />
      </Pan>
      <Pan title={title('Surveyed households per age and gender groups')}>
        <AAStackedBarChart data={ageGroup(Person.ageGroup['DRC'], true)} height={250} colors={t => [
          t.palette.primary.main,
          snapshotAlternateColor(t),
        ]}/>
      </Pan>
      <Pan title={title('Intentions per displacement status')}>
        <Txt bold block color="hint" uppercase size="small">IDPs</Txt>
        <ProtHHS2BarChart
          data={data.filter(_ => _.do_you_identify_as_any_of_the_following === 'idp')}
          question="what_are_your_households_intentions_in_terms_of_place_of_residence"
          filterValue={['unable_unwilling_to_answer']}
        />
        <Txt bold block color="hint" uppercase size="small" sx={{mt: 3}}>Non-displaced</Txt>
        <ProtHHS2BarChart
          data={data.filter(_ => _.do_you_identify_as_any_of_the_following === 'non_displaced')}
          question="what_are_your_households_intentions_in_terms_of_place_of_residence"
          filterValue={['unable_unwilling_to_answer']}
        />
        <Txt bold block color="hint" uppercase size="small" sx={{mt: 3}}>Refugees and returnees</Txt>
        <ProtHHS2BarChart
          data={data.filter(_ => _.do_you_identify_as_any_of_the_following === 'refugee' || _.do_you_identify_as_any_of_the_following === 'returnee')}
          question="what_are_your_households_intentions_in_terms_of_place_of_residence"
          filterValue={['unable_unwilling_to_answer']}
        />
      </Pan>
      <Pan title={title('Sense of safety: Influencing factors')}>
        <ProtHHS2BarChart
          data={data}
          question="please_rate_your_sense_of_safety_in_this_location"
          filterValue={['unable_unwilling_to_answer']}
        />
      </Pan>
      <Pan title={title('Major stress factors')}>
        <ProtHHS2BarChart
          data={data}
          questionType="multiple"
          question="what_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members"
          filterValue={['unable_unwilling_to_answer']}
        />
      </Pan>
      <Pan title={title('Concerns related to current accommodation')}>
        <ProtHHS2BarChart
          data={data}
          questionType="multiple"
          question="what_are_your_main_concerns_regarding_your_accommodation"
          filterValue={['unable_unwilling_to_answer']}
        />
      </Pan>
      <Pan title={title('Barriers to access healthcare')}>
        <ProtHHS2BarChart
          data={data}
          questionType="multiple"
          question="what_are_the_barriers_to_accessing_health_services"
          filterValue={['unable_unwilling_to_answer']}
        />
      </Pan>
      <Pan title={title('Main sources of income per displacement status')}>
        <ProtHHS2BarChart
          data={data}
          questionType="multiple"
          question="what_are_the_main_sources_of_income_of_your_household"
          filterValue={['unable_unwilling_to_answer']}
        />
      </Pan>
    </>
  )
}