import React, {useEffect, useMemo, useState} from 'react'
import {Page} from '@/shared/Page'
import {Sheet} from '@/shared/Sheet/Sheet'
import {useMPCADeduplicationContext} from '../MpcaDeduplicationContext'
import {useI18n} from '../../../core/i18n'
import {Box, Icon, IconProps} from '@mui/material'
import {Txt} from 'mui-extension'
import {Panel, PanelTitle} from '@/shared/Panel'
import {add, sub} from 'date-fns'
import {Enum, fnSwitch, map} from '@alexandreannic/ts-utils'
import {useAppSettings} from '../../../core/context/ConfigContext'
import {useAsync, useFetcher} from '@alexandreannic/react-hooks-lib'
import {appConfig} from '../../../conf/AppConfig'
import {koboServerId} from '../../../koboFormId'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {KoboAnswer2} from '../../../core/sdk/server/kobo/Kobo'
import {BNRE} from '../../../core/koboModel/BNRE/BNRE'
import {MpcaDeduplicationDb} from '../MpcaDeduplicationDb'

export const TableImg = ({
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

export const TableIcon = ({sx, ...props}: IconProps) => {
  return <Icon sx={{verticalAlign: 'middle', ...sx}} fontSize="medium" {...props}/>
}

enum DeduplicationStatus {
  duplicate = 'duplicate',
  no_duplicate = 'no_duplicate',
  pending = 'pending',
}

export const getKoboImagePath = (url: string): string => {
  return appConfig.apiURL + `/kobo-api/${koboServerId.prod}/attachment?path=${url.split('api')[1]}`
}

export const mapMpcaKoboAnswer = (deduplicationDb?: MpcaDeduplicationDb) => (_: KoboAnswer2<BNRE>) => {
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
}

export const MpcaDedupTable = () => {
  const {m, formatDate} = useI18n()
  const {api} = useAppSettings()
  const {deduplicationDb, _koboAnswers, _form} = useMPCADeduplicationContext()
  const _servers = useFetcher(api.kobo.fetchServers)
  const [selected, setSelected] = useState<string[]>([])
  const _payment = useAsync(api.mpcaPayment.create)

  useEffect(() => {
    _servers.fetch({force: false})
    _koboAnswers.fetch({force: false})
    _form.fetch({force: false})
  }, [])

  const enhancedData = useMemo(() => {
    if (!_koboAnswers.entity) return
    const map = mapMpcaKoboAnswer(deduplicationDb)
    return _koboAnswers.entity.map(map)
  }, [_koboAnswers.entity, deduplicationDb])

  const getAllPossibleValues = (key: keyof NonNullable<typeof enhancedData>[0]) => Array.from(new Set(enhancedData?.map(_ => _[key]))) as string[]

  return (
    <Page width="full">
      <Panel sx={{overflow: 'visible'}}>
        <Sheet
          header={<PanelTitle>MPCA</PanelTitle>}
          select={{
            getId: _ => _.id,
            onSelect: _ => setSelected(_),
            selectActions: (
              <>
                <AaBtn
                  sx={{mr: 1}}
                  color="primary"
                  icon="content_paste_search"
                  variant="outlined"
                >
                  {m.mpcaDb.generateDeduplicationFile}
                </AaBtn>
                <AaBtn
                  color="primary"
                  icon="create_new_folder"
                  variant="outlined"
                  loading={_payment.getLoading()}
                  onClick={() => {
                    _payment.call(selected)
                  }}
                >
                  {m.mpcaDb.makePaymentTool}
                </AaBtn>
              </>
            )
          }}
          getRenderRowKey={_ => _.id}
          data={enhancedData}
          columns={[
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
            {id: 'taxId', head: m.taxID, render: _ => _.taxId},
            {
              id: 'taxIdImg', align: 'center', head: m.taxID, render: _ => map(_.taxIdFileURL, url =>
                <TableImg url={getKoboImagePath(url.download_small_url)}/>
              )
            },
            {id: 'passportSerie', head: m.passportSerie, render: _ => _.passportSerie},
            {id: 'passportNum', head: m.passportNumber, render: _ => _.passportNum},
            {
              id: 'idFileImg', head: m.id, align: 'center', render: _ => map(_.idFileURL, url =>
                <TableImg url={getKoboImagePath(url.download_small_url)}/>
              )
            },
            {id: 'status', head: m.status, render: _ => _.status, type: getAllPossibleValues('status')},
            {id: 'lastName', head: m.lastName, render: _ => _.lastName},
            {id: 'firstName', head: m.firstName, render: _ => _.firstName},
            {id: 'patronyme', head: m.patronyme, render: _ => _.patronyme},
            {id: 'hhSize', head: m.hhSize, render: _ => _.hhSize},
            {id: 'phone', head: m.phone, render: _ => _.phone},
          ]}
        />
      </Panel>
    </Page>
  )
}
