import {Page} from '../../shared/Page'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useConfig} from '../../core/context/ConfigContext'
import React, {useEffect} from 'react'
import {ProtHHS_2_1} from '../../core/koboForm/ProtHHS_2_1/ProtHHS_2_1'
import {_Arr, Arr, mapFor} from '@alexandreannic/ts-utils'
import {mapProtHHS_2_1} from '../../core/koboForm/ProtHHS_2_1/ProtHHS_2_1Mapping'
import {useI18n} from '../../core/i18n'
import {useProtHH_2_1Data} from './useProtHH_2_1Data'
import {OblastIndex} from '../../shared/UkraineMap/oblastIndex'
import {Box} from '@mui/material'
import {DashboardSample} from './DashboardSample'
import {KoboAnswer2} from '../../core/sdk/server/kobo/Kobo'

export type ProtHHS_2_1Enrich = ReturnType<typeof enrichProtHHS_2_1>

export interface DashboardPageProps {
  data: Arr<ProtHHS_2_1Enrich>
  computed: ReturnType<typeof useProtHH_2_1Data>
}

export const enrichProtHHS_2_1 = (a: KoboAnswer2<ProtHHS_2_1>) => {
  const maxHHNumber = 12
  const mapPerson = (a: ProtHHS_2_1) => {
    const fields = [
      ...mapFor(maxHHNumber, i => [
        'hh_age_' + i,
        'hh_sex_' + i,
      ]),
    ] as [keyof ProtHHS_2_1, keyof ProtHHS_2_1][]
    return Arr(fields)
      .map(([ageCol, sexCol]) => {
        return ({
          age: isNaN(a[ageCol] as any) ? undefined : +a[ageCol]!,
          gender: a[sexCol] as NonNullable<ProtHHS_2_1['hh_sex_1']>,
        })
      }).filter(_ => _.age !== undefined || _.gender !== undefined)
  }

  return {
    ...a,
    persons: mapPerson(a),
    where_are_you_current_living_oblast_iso: OblastIndex.findByShortISO(a.where_are_you_current_living_oblast!)?.iso,
    what_is_your_area_of_origin_oblast_iso: OblastIndex.findByShortISO(a.what_is_your_area_of_origin_oblast!)?.iso,
  }
}

export const Dashboard = () => {
  const {api} = useConfig()
  const _answers = useFetcher(() => api.koboForm.getAnswers<ProtHHS_2_1>({
    formId: 'aQDZ2xhPUnNd43XzuQucVR',
    fnMap: mapProtHHS_2_1
  })
    .then(_ => _.data)
    .then(_ => _.map(enrichProtHHS_2_1)
    ))

  useEffect(() => {
    _answers.fetch()
  }, [])

  return (
    <Page>
      {_answers.entity && (
        <_Dashboard
          data={Arr(_answers.entity)}
        />
      )}
    </Page>
  )
}

export const _Dashboard = ({
  data,
}: {
  data: _Arr<ProtHHS_2_1Enrich>
}) => {
  const {formatLargeNumber, m} = useI18n()
  const computed = useProtHH_2_1Data({data})

  console.log(data.map(_ => _.where_are_you_current_living_oblast))
  return (
    <Box sx={{maxWidth: 1200}}>
      <DashboardSample data={data} computed={computed}/>
    </Box>
  )
}