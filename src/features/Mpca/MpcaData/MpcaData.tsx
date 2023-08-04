import React, {useEffect, useMemo, useState} from 'react'
import {Page} from '@/shared/Page'
import {Sheet} from '@/shared/Sheet/Sheet'
import {useMPCADeduplicationContext} from '../MpcaDeduplicationContext'
import {useI18n} from '@/core/i18n'
import {Txt} from 'mui-extension'
import {Panel} from '@/shared/Panel'
import {Enum, fnSwitch, map} from '@alexandreannic/ts-utils'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useAsync, useFetcher} from '@alexandreannic/react-hooks-lib'
import {appConfig} from '@/conf/AppConfig'
import {koboServerId} from '@/koboFormId'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {BNRE} from '@/core/koboModel/BNRE/BNRE'
import {TableImg} from '@/shared/TableImg/TableImg'
import {TableIcon} from '@/features/Mpca/MpcaData/TableIcon'

enum DeduplicationStatus {
  duplicate = 'duplicate',
  no_duplicate = 'no_duplicate',
  pending = 'pending',
}

export const getKoboImagePath = (url: string): string => {
  return appConfig.apiURL + `/kobo-api/${koboServerId.prod}/attachment?path=${url.split('api')[1]}`
}

export const mapMpcaKoboAnswer = () => (_: KoboAnswer<BNRE>) => {
  // TODO(Alex)
  // const deduplication = deduplicationDb && _.pay_det_tax_id_num ? deduplicationDb.search({
  //   taxId: [_.pay_det_tax_id_num],
  //   start: sub(_.submissionTime, {days: 1}),
  //   end: add(_.submissionTime, {days: 1}),
  // }) : undefined
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
    deduplicationFile: 'TODO',
    // deduplicationFile: deduplication?.map(_ => _.list).join(', '),
    duplication: ((): DeduplicationStatus | undefined => {
      if (!_.pay_det_tax_id_num) return
      // if (t.length > 1) return <Icon fontSize="small" color="error">error</Icon>
      if (false) {
        return false ? DeduplicationStatus.duplicate : DeduplicationStatus.no_duplicate
      }
      return DeduplicationStatus.pending
    })(),
  })
}

export const MpcaData = () => {
  const {m, formatDate} = useI18n()
  const {api} = useAppSettings()
  const {_koboAnswers, _form} = useMPCADeduplicationContext()
  const _servers = useFetcher(api.kobo.server.getAll)
  const [selected, setSelected] = useState<string[]>([])
  const _payment = useAsync(api.mpcaPayment.create)

  useEffect(() => {
    _servers.fetch({force: false})
    _koboAnswers.fetch({force: false})
    _form.fetch({force: false})
  }, [])

  const enhancedData = useMemo(() => {
    if (!_koboAnswers.entity) return
    const map = mapMpcaKoboAnswer()
    return _koboAnswers.entity.map(map)
  }, [_koboAnswers.entity])

  const getAllPossibleValues = (key: keyof NonNullable<typeof enhancedData>[0]) => Array.from(new Set(enhancedData?.map(_ => _[key]))) as string[]

  return (
    <Page width="full">
      <Panel sx={{overflow: 'visible'}}>
        <Sheet
          title={m.data}
          // header={<PanelTitle>{m.data}</PanelTitle>}
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
              type: 'select_one',
              options: () => getAllPossibleValues('deduplicationFile').map(_ => ({value: _, label: _})),
              render: _ => <Txt skeleton={50}/>
            },
            {
              id: 'duplication',
              type: 'select_one',
              head: <TableIcon>content_copy</TableIcon>,
              options: () => Enum.keys(DeduplicationStatus).map(_ => ({value: _, label: _})),
              align: 'center',
              render: _ => fnSwitch(_.duplication!, {
                duplicate: <TableIcon color="warning" children="content_copy"/>,
                no_duplicate: <TableIcon color="success" children="check_circle"/>,
                pending: <TableIcon color="disabled" children="schedule"/>,
              }, () => <Txt skeleton={30}/>)
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
            {
              id: 'status',
              head: m.status,
              render: _ => _.status,
              type: 'select_one',
              options: () => getAllPossibleValues('status').map(_ => ({value: _, label: _})),
            },
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
