import React, {useEffect, useMemo} from 'react'
import {Page} from '../../shared/Page'
import {Sheet} from '../../shared/Sheet/Sheet'
import {useMPCADeduplicationContext} from './MPCADeduplicationContext'
import {useI18n} from '../../core/i18n'
import {Box, Icon, IconProps} from '@mui/material'
import {Txt} from 'mui-extension'
import {Panel} from '../../shared/Panel'
import {add, sub} from 'date-fns'
import {Enum, fnSwitch, map} from '@alexandreannic/ts-utils'
import {useConfig} from '../../core/context/ConfigContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {appConfig} from '../../conf/AppConfig'
import {koboServerId} from '../../koboFormId'
import {AaBtn} from '../../shared/Btn/AaBtn'

const TableImg = ({
  url,
}: {
  url: string
}) => {
  return (
    <a href={url} target="_blank">
      <Box component="span" sx={{
        '&:hover': {
          transform: 'scale(1.1)'
          // height: 32,
          // width: 32,
        },
        verticalAlign: 'middle',
        display: 'inline-block',
        transition: t => t.transitions.create('all'),
        backgroundColor: t => t.palette.divider,
        backgroundImage: `url(${url})`,
        height: 30,
        width: 30,
        borderRadius: '4px',
        backgroundSize: 'cover'
      }}/>
    </a>
  )
}

const TableIcon = ({sx, ...props}: IconProps) => {
  return <Icon sx={{verticalAlign: 'middle', ...sx}} fontSize="medium" {...props}/>
}

enum DeduplicationStatus {
  duplicate = 'duplicate',
  no_duplicate = 'no_duplicate',
  pending = 'pending',
}

// @ts-ignore
export const MPCADedupTable = () => {
  const {m, formatDate} = useI18n()
  const {api} = useConfig()
  const {deduplicationDb, _koboAnswers, _form} = useMPCADeduplicationContext()
  const _servers = useFetcher(api.kobo.fetchServers)

  const getImagePath = (url: string): string => {
    return appConfig.apiURL + `/kobo-api/${koboServerId.prod}/attachment?path=${url.split('api')[1]}`
  }

  useEffect(() => {
    _servers.fetch({force: false})
    _koboAnswers.fetch({force: false})
    _form.fetch({force: false})
  }, [])

  const enhancedData = useMemo(() => {
    if (!_koboAnswers.entity) return
    return _koboAnswers.entity.map(_ => {
      const deduplication = deduplicationDb && _.pay_det_tax_id_num ? deduplicationDb.search({
        taxId: [_.pay_det_tax_id_num],
        start: sub(_.submissionTime, {days: 1}),
        end: add(_.submissionTime, {days: 1}),
      }) : undefined
      return ({
        id: _.id,
        date: _.start,
        status: _.ben_det_res_stat,
        lastName: _.ben_det_surname,
        firstName: _.ben_det_first_name,
        patronyme: _.ben_det_pat_name,
        hhSize: _.hh_char_hh_det?.length,
        passportSerie: _.pay_det_pass_ser,
        passportNum: _.pay_det_pass_num,
        taxId: _.pay_det_tax_id_num,
        taxIdFileName: _.pay_det_tax_id_ph,
        taxIdFileURL: _.attachments.find(x => x.filename.includes(_.pay_det_tax_id_ph)),
        idFileName: _.pay_det_id_ph,
        idFileURL: _.attachments.find(x => x.filename.includes(_.pay_det_id_ph)),
        phone: _.ben_det_ph_number,
        deduplicationFile: deduplication?.[0]?.list,
        // deduplicationFile: deduplication?.map(_ => _.list).join(', '),
        duplication: ((): DeduplicationStatus | undefined => {
          if (!_.pay_det_tax_id_num || !deduplication) return
          // if (t.length > 1) return <Icon fontSize="small" color="error">error</Icon>
          if (deduplication.length > 0) {
            return deduplication[0].duplicatedDonor ? DeduplicationStatus.duplicate : DeduplicationStatus.no_duplicate
          }
          return DeduplicationStatus.pending
        })(),
      })
    })
  }, [_koboAnswers.entity, deduplicationDb])

  const getAllPossibleValues = (key: keyof NonNullable<typeof enhancedData>[0]) => [...new Set(enhancedData?.map(_ => _[key]))] as string[]

  const columns = useMemo(() => {
    return []
  }, [_koboAnswers.entity])

  return (
    <Page width="full">
      <Panel sx={{overflow: 'visible'}}>
        <Sheet
          header="MPCA"
          select={{
            getId: _ => _.id, selectActions: (
              <>
                <AaBtn sx={{mr: 1}}
                  color="primary"
                  icon="content_paste_search"
                  variant="outlined"
                >
                  {m.mpcaDd.generateDeduplicationFile}
                </AaBtn>
                <AaBtn
                  color="primary"
                  icon="create_new_folder"
                  variant="outlined"
                >
                  {m.mpcaDd.generateFinanceDoc}
                </AaBtn>
              </>
            )
          }}
          getRenderRowKey={_ => _.id}
          data={enhancedData}
          columns={[
            // {id: 'select', render: _ => <Checkbox size="small"/>},
            {id: 'date', head: m.date, type: 'date', render: _ => formatDate(_.date)},
            {
              id: 'deduplicationFile',
              head: 'deduplicationFile',
              type: getAllPossibleValues('deduplicationFile'),
              render: _ => deduplicationDb ? _.deduplicationFile : <Txt skeleton={50}/>
            },
            {
              id: 'duplication',
              head: <TableIcon>content_copy</TableIcon>,
              type: Enum.keys(DeduplicationStatus),
              align: 'center',
              render: _ => fnSwitch(_.duplication!, {
                duplicate: <TableIcon color="warning" children="content_copy"/>,
                no_duplicate: <TableIcon color="success" children="check_circle"/>,
                pending: <TableIcon color="disabled" children="schedule"/>,
              }, () => deduplicationDb ? undefined : <Txt skeleton={30}/>)
            },
            {id: 'status', head: m.status, render: _ => _.status, type: getAllPossibleValues('status')},
            {id: 'lastName', head: m.lastName, render: _ => _.lastName},
            {id: 'firstName', head: m.firstName, render: _ => _.firstName},
            {id: 'patronyme', head: m.patronyme, render: _ => _.patronyme},
            {id: 'hhSize', head: m.hhSize, render: _ => _.hhSize},
            {id: 'passportSerie', head: m.passportSerie, render: _ => _.passportSerie},
            {id: 'passportNum', head: m.passportNumber, render: _ => _.passportNum},
            {
              id: 'idFileImg', head: m.id, align: 'center', render: _ => map(_.idFileURL, url =>
                <TableImg url={getImagePath(url.download_small_url)}/>
              )
            },
            {id: 'taxId', head: m.taxID, render: _ => _.taxId},
            {
              id: 'taxIdImg', align: 'center', head: m.taxID, render: _ => map(_.taxIdFileURL, url =>
                <TableImg url={getImagePath(url.download_small_url)}/>
              )
            },
            {id: 'phone', head: m.phone, render: _ => _.phone},
          ]}
        />
      </Panel>
    </Page>
  )
}
// https://kobo.humanitarianresponse.info/api/v2/assets/aQDZ2xhPUnNd43XzuQucVR/data/?query={"$and":[{"_submission_time":{"$gte":"2021-09-26"}},{"_submission_time":{"$lt":"2024-09-27"}}]}
