import {Box, Icon} from '@mui/material'
import React, {ReactNode, useCallback, useEffect} from 'react'
import {Txt} from 'mui-extension'
import {PanelFeatures} from '@/shared/Panel/PanelFeatures'
import {useAppSettings} from '@/core/context/ConfigContext'
import {endOfMonth, startOfMonth} from 'date-fns'
import {enrichProtHHS_2_1, ProtHHS2BarChart} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {Enum, seq} from '@alexandreannic/ts-utils'
import {Period, Person} from '@/core/type'
import {snapshotAlternateColor} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEcho'
import {AAStackedBarChart} from '@/shared/Chart/AaStackedBarChart'
import {DRCLogo, EULogo} from '@/shared/logo/logo'
import {SnapshotHeader} from '@/features/Snapshot/SnapshotHeader'

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
      <Txt block size="big" bold sx={{textAlign: 'center', mt: 2, mb: 1}}>{title}</Txt>
      <PanelFeatures savableAsImg>
        <Box sx={{
          // p: .5
        }}>
          <Box sx={{
            // border: t => `1px solid ${t.palette.divider}`,
            p: 1,
            // borderRadius: '8px',
          }}>
            {/*<Txt block size="big" bold sx={{textAlign: 'center', mb: 1}}>{title}</Txt>*/}
            {children}
          </Box>
        </Box>
      </PanelFeatures>
    </Box>
  )
}

const period: Period = {
  start: startOfMonth(new Date(2023, 6)),
  end: endOfMonth(new Date(2023, 8)),
}

export default () => {
  const {api} = useAppSettings()
  const req = () => api.kobo.answer.searchProtection_Hhs2({
    filters: period
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
      <SnapshotHeader period={period}/>
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
        <Txt bold block color="hint" size="small"><Icon sx={{fontSize: 10, mr: .5}}>fiber_manual_record</Icon>IDPs</Txt>
        <ProtHHS2BarChart
          data={data.filter(_ => _.do_you_identify_as_any_of_the_following === 'idp')}
          question="what_are_your_households_intentions_in_terms_of_place_of_residence"
          filterValue={['unable_unwilling_to_answer']}
        />
        <Txt bold block color="hint" size="small" sx={{mt: 3}}><Icon sx={{fontSize: 10, mr: .5}}>fiber_manual_record</Icon>NON-DISPLACED</Txt>
        <ProtHHS2BarChart
          data={data.filter(_ => _.do_you_identify_as_any_of_the_following === 'non_displaced')}
          question="what_are_your_households_intentions_in_terms_of_place_of_residence"
          filterValue={['unable_unwilling_to_answer']}
        />
        <Txt bold block color="hint" size="small" sx={{mt: 3}}><Icon sx={{fontSize: 10, mr: .5}}>fiber_manual_record</Icon>REFUGEES AND RETURNEES</Txt>
        <ProtHHS2BarChart
          data={data.filter(_ => _.do_you_identify_as_any_of_the_following === 'refugee' || _.do_you_identify_as_any_of_the_following === 'returnee')}
          question="what_are_your_households_intentions_in_terms_of_place_of_residence"
          filterValue={['unable_unwilling_to_answer']}
        />
      </Pan>
      <Pan title={title('Sense of safety: Influencing factors')}>
        <ProtHHS2BarChart
          data={data}
          questionType="multiple"
          question="what_are_the_main_factors_that_make_this_location_feel_unsafe"
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
          data={data.filter(_ => !_.what_are_your_main_concerns_regarding_your_accommodation?.includes('none'))}
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
          mergeOptions={{
            remittances: 'other_specify',
          }}
          filterValue={['unable_unwilling_to_answer']}
        />
      </Pan>
    </>
  )
}