import {useFetcher} from '@alexandreannic/react-hooks-lib'
import React, {useEffect, useMemo} from 'react'
import {useConfig} from '../../core/context/ConfigContext'
import {koboFormId} from '../../koboFormId'
import {Page} from '../../shared/Page'
import {Sheet} from '../../shared/Sheet/Sheet'
import {MPCADeduplicationProvider, useMPCADeduplicationContext} from './MPCADeduplicationContext'
import {MPCADeduplicationDb} from './MPCADeduplicationDb'
import {mapBNRE} from '../../core/koboModel/BNRE/BNREMapping'
import {useI18n} from '../../core/i18n'
import {Box, Icon, IconProps} from '@mui/material'
import {Txt} from 'mui-extension'
import {Panel} from '../../shared/Panel'
import {sub} from 'date-fns'
import {fnSwitch} from '@alexandreannic/ts-utils'

export const MPCA = () => {
  const db = useMemo(() => new MPCADeduplicationDb(), [])
  return (
    <MPCADeduplicationProvider db={db}>
      <_MPCA/>
    </MPCADeduplicationProvider>
  )
}

const TableIcon = ({sx, ...props}: IconProps) => {
  return <Icon sx={{verticalAlign: 'middle', ...sx}} fontSize="medium" {...props}/>
}

export const _MPCA = () => {
  const {m, formatDate} = useI18n()
  const {api} = useConfig()
  const {search} = useMPCADeduplicationContext()
  const _koboAnswers = useFetcher(() => api.koboForm.getAnswers({
    formId: koboFormId.prod.BNRE,
    fnMap: mapBNRE,
  }))
  //
  useEffect(() => {
    _koboAnswers.fetch()
  }, [])

  useEffect(() => {
    if (!search) return
  }, [search])

  const enhancedData = useMemo(() => {
    if (!_koboAnswers.entity) return
    return _koboAnswers.entity.data.map(_ => ({
      date: _.start,
      status: _.ben_det_res_stat,
      lastName: _.ben_det_surname,
      firstName: _.ben_det_first_name,
      patronyme: _.ben_det_pat_name,
      hhSize: _.hh_char_hh_det?.length,
      passportSerie: _.pay_det_pass_ser,
      passportNum: _.pay_det_pass_num,
      taxId: _.pay_det_tax_id_num,
      phone: _.ben_det_ph_number,
      duplication: (() => {
        if (!search) return 'loading'
        if (!_.pay_det_tax_id_num) return
        const t = search({
          taxId: [_.pay_det_tax_id_num],
          start: sub(_.submissionTime, {months: 3}),
          end: sub(_.submissionTime, {months: 3}),
        })
        // if (t.length > 1) return <Icon fontSize="small" color="error">error</Icon>
        if (t.length > 0) {
          return t[0].duplicatedDonor ? 'duplicate' : 'no_duplicate'
        }
        return 'pending'
      })(),
    }))
  }, [_koboAnswers.entity, search])

  const getAllPossibleValues = (key: keyof NonNullable<typeof enhancedData>[0]) => [...new Set(enhancedData?.map(_ => _[key]))] as string[]

  const columns = useMemo(() => {
    return []
  }, [_koboAnswers.entity])

  return (
    <Page width="lg">
      <Panel>
        <Sheet data={enhancedData} columns={[
          {
            id: 'duplication', head: <Icon>content_copy</Icon>, render: _ => fnSwitch(_.duplication!, {
              loading: <Txt skeleton={30}/>,
              duplicate: <TableIcon color="warning" children="content_copy"/>,
              no_duplicate: <TableIcon color="success" children="check_circle"/>,
              pending: <TableIcon color="disabled" children="schedule"/>,
            }, _ => undefined)
          },
          {id: 'date', head: m.date, type: 'date', render: _ => formatDate(_.date)},
          {id: 'status', head: m.status, render: _ => _.status, type: getAllPossibleValues('status')},
          {id: 'lastName', head: m.lastName, render: _ => _.lastName},
          {id: 'firstName', head: m.firstName, render: _ => _.firstName},
          {id: 'patronyme', head: m.patronyme, render: _ => _.patronyme},
          {id: 'hhSize', head: m.hhSize, render: _ => _.hhSize},
          {id: 'passportSerie', head: m.passportSerie, render: _ => _.passportSerie},
          {id: 'passportNum', head: m.passportNumber, render: _ => _.passportNum},
          {id: 'taxId', head: m.taxID, render: _ => _.taxId},
          {id: 'phone', head: m.phone, render: _ => _.phone},
        ]}/>
      </Panel>
    </Page>
  )
}

