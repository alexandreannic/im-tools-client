import {Page} from '../../../shared/Page'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useConfig} from '../../../core/context/ConfigContext'
import React, {useEffect} from 'react'
import {ProtHHS_2_1} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1'
import {_Arr, Arr, mapFor} from '@alexandreannic/ts-utils'
import {mapProtHHS_2_1} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1Mapping'
import {useI18n} from '../../../core/i18n'
import {useProtHHS2Data} from './use_prot_h_h_s2_data'
import {Box} from '@mui/material'
import {DashboardProtHHS2Sample} from './DashboardProtHHS2Sample'
import {KoboAnswer2} from '../../../core/sdk/server/kobo/Kobo'

export type ProtHHS2Enrich = ReturnType<typeof enrichProtHHS_2_1>

export interface DashboardPageProps {
  data: Arr<ProtHHS2Enrich>
  computed: ReturnType<typeof useProtHHS2Data>
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
  }
}

export const DashboardProtHHS2 = () => {
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
  data: _Arr<ProtHHS2Enrich>
}) => {
  const {formatLargeNumber, m} = useI18n()
  const computed = useProtHHS2Data({data})

  console.log(data.map(_ => _.where_are_you_current_living_oblast))
  return (
    <Box sx={{maxWidth: 1200}}>
      <DashboardProtHHS2Sample data={data} computed={computed}/>
    </Box>
  )
}