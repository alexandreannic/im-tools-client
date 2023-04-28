import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useConfig} from '../../core/context/ConfigContext'
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react'
import {Page} from '../../shared/Page'
import {Layout} from '../../shared/Layout'
import {MPCA_NFI} from '../../core/koboForm/MPCA_NFI/MPCA_NFI'
import {ProtHHS_2_1Enrich} from '../Dashboard/Dashboard'
import {Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material'
import {map} from '@alexandreannic/ts-utils'

interface Answer {
  oblast: string | undefined
  hromada: string | undefined
  raion: string | undefined
  HKF_: MPCA_NFI['HKF_']
  HKMV_: MPCA_NFI['HKMV_']
  BK_Baby_Kit_: MPCA_NFI['BK_Baby_Kit_']
  BK_Baby_Kit: MPCA_NFI['BK_Baby_Kit']
  BK_Baby_Kit_001: MPCA_NFI['BK_Baby_Kit_001']
  BK_Baby_Kit_002: MPCA_NFI['BK_Baby_Kit_002']
  group_in3fh72: MPCA_NFI['group_in3fh72']
}

export const ActivityInfoNFI = () => {
  const [period, setPeriod] = useState('2023-04')
  const {api} = useConfig()

  const _data = useFetcher((period?: string): Promise<Answer[]> => {
    const filters = period ? (() => {
      const [year, month] = period.split('-')
      return {
        start: new Date(parseInt(year), parseInt(month) - 1),
        end: new Date(parseInt(year), parseInt(month)),
      }
    })() : undefined

    return api.koboApi.getAnswersMPCA_NFI({filters}).then(_ => _.data.map(_ => ({
      oblast: _.oblast,
      hromada: _.hromada,
      raion: _.raion,
      HKF_: _.HKF_,
      HKMV_: _.HKMV_,
      BK_Baby_Kit_: _.BK_Baby_Kit_,
      BK_Baby_Kit: _.BK_Baby_Kit,
      BK_Baby_Kit_001: _.BK_Baby_Kit_001,
      BK_Baby_Kit_002: _.BK_Baby_Kit_002,
      group_in3fh72: _.group_in3fh72,
    })))
  })

  useEffect(() => {
    _data.fetch({clean: false}, period)
  }, [period])

  return (
    <Layout>
      <Page width={1200} loading={_data.loading}>
        {map(_data.entity, _ => (
          <_ActivityInfo
            data={_}
            period={period}
            setPeriod={setPeriod}
          />
        ))}
      </Page>
    </Layout>
  )
}

const _ActivityInfo = ({
  data,
  period,
  setPeriod,
}: {
  data: Answer[]
  period: string
  setPeriod: Dispatch<SetStateAction<string>>
}) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>Location</TableCell>
          <TableCell>Plan Code</TableCell>
          <TableCell>Population Group</TableCell>
          <TableCell sx={{textAlign: 'right'}}>Boys</TableCell>
          <TableCell sx={{textAlign: 'right'}}>Girls</TableCell>
          <TableCell sx={{textAlign: 'right'}}>Adult Women</TableCell>
          <TableCell sx={{textAlign: 'right'}}>Adult Men</TableCell>
          <TableCell sx={{textAlign: 'right'}}>Elderly Women</TableCell>
          <TableCell sx={{textAlign: 'right'}}>Elderly Men</TableCell>
          <TableCell sx={{textAlign: 'right'}}>Total Individuals Reached</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
      </TableBody>
    </Table>
  )
}
