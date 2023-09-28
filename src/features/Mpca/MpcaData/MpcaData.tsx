import React, {useEffect, useState} from 'react'
import {Page} from '@/shared/Page'
import {Sheet, SheetUtils} from '@/shared/Sheet/Sheet'
import {MpcaProgram, MpcaRowSource, useMPCAContext} from '../MpcaContext'
import {useI18n} from '@/core/i18n'
import {Panel} from '@/shared/Panel'
import {Enum, map} from '@alexandreannic/ts-utils'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useAsync, useFetcher} from '@alexandreannic/react-hooks-lib'
import {appConfig} from '@/conf/AppConfig'
import {kobo} from '@/koboDrcUaFormId'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {TableImg} from '@/shared/TableImg/TableImg'
import {BNREOptions} from '@/core/koboModel/BNRE/BNREOptions'
import {DeduplicationStatusIcon} from '@/features/WfpDeduplication/WfpDeduplicationData'
import {DrcSupportSuggestion, WfpDeduplicationStatus} from '@/core/sdk/server/wfpDeduplication/WfpDeduplication'
import {DrcDonor, DrcProject} from '@/core/drcUa'
import {OblastIndex} from '@/shared/UkraineMap/oblastIndex'
import {formatLargeNumber} from '@/core/i18n/localization/en'
import {Mpca} from '@/core/sdk/server/mpca/Mpca'

export const getKoboImagePath = (url: string): string => {
  return appConfig.apiURL + `/kobo-api/${kobo.drcUa.server.prod}/attachment?path=${url.split('api')[1]}`
}

export const MpcaData = () => {
  const {m, formatDate} = useI18n()
  const {api} = useAppSettings()
  const ctx = useMPCAContext()
  const _servers = useFetcher(api.kobo.server.getAll)
  const [selected, setSelected] = useState<string[]>([])
  const _payment = useAsync(api.mpcaPayment.create)

  useEffect(() => {
    ctx.fetcherData.fetch({force: false})
  }, [])

  // const getAllPossibleValues = (key: keyof NonNullable<typeof enhancedData>[0]) => Array.from(new Set(enhancedData?.map(_ => _[key]))) as string[]

  return (
    <Page width="full">
      <Panel sx={{overflow: 'visible'}}>
        <Sheet<Mpca>
          id="mpca"
          title={m.data}
          // header={<PanelTitle>{m.data}</PanelTitle>}
          loading={ctx.fetcherData.loading || ctx.fetcherDeduplication.loading}
          getRenderRowKey={_ => '' + _.id}
          data={ctx.data}
          select={{
            getId: _ => '' + _.id,
            onSelect: _ => setSelected(_),
            selectActions: (
              <>
                <AaBtn
                  disabled
                  sx={{mr: 1}}
                  color="primary"
                  icon="content_paste_search"
                  variant="outlined"
                >
                  {m.mpcaDb.generateDeduplicationFile}
                </AaBtn>
                <AaBtn
                  disabled
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
          columns={[
            {
              id: 'id',
              head: m.id,
              type: 'string',
              render: _ => _.id,
            },
            {
              id: 'source',
              head: m.form,
              type: 'select_one',
              options: () => SheetUtils.buildOptions(Enum.keys(MpcaRowSource)),
              render: _ => _.source
            },
            {
              id: 'date',
              head: m.date,
              type: 'date',
              renderValue: _ => _.date,
              render: _ => formatDate(_.date)
            },
            {
              id: 'donor',
              head: m.donor,
              type: 'select_one',
              options: () => SheetUtils.buildOptions(Enum.keys(DrcDonor), true),
              render: _ => _.donor ?? ''
            },
            {
              id: 'project',
              head: m.project,
              type: 'select_one',
              options: () => SheetUtils.buildOptions(Enum.keys(DrcProject), true),
              render: _ => _.project ?? SheetUtils.blankValue
            },
            {
              id: 'prog',
              head: m.program,
              type: 'select_multiple',
              options: () => SheetUtils.buildOptions(Enum.keys(MpcaProgram), true),
              renderValue: _ => _.prog,
              render: _ => _.prog?.join(' | '),
            },
            {
              id: 'oblast',
              head: m.oblast,
              type: 'select_one',
              options: () => SheetUtils.buildOptions(Enum.values(OblastIndex.oblastByISO), true),
              render: _ => _.oblast ?? SheetUtils.blankValue,
            },
            {
              id: 'hhSize',
              head: m.hhSize,
              type: 'number',
              render: _ => _.hhSize
            },
            {
              id: 'amountUahSupposed',
              align: 'right',
              head: m.amountUAH,
              type: 'number',
              renderValue: _ => _.amountUahSupposed,
              render: _ => _.amountUahSupposed ? formatLargeNumber(_.amountUahSupposed) : undefined,
            },
            {
              id: 'amountUahDedup',
              align: 'right',
              head: 'Amount dedup',
              type: 'number',
              renderValue: _ => _.amountUahDedup,
              render: _ => _.amountUahDedup ? formatLargeNumber(_.amountUahDedup) : undefined,
            },
            {
              id: 'amountUahFinal',
              align: 'right',
              head: 'Amount final',
              type: 'number',
              renderValue: _ => _.amountUahFinal,
              render: _ => _.amountUahFinal ? formatLargeNumber(_.amountUahFinal) : undefined,
            },
            {
              id: 'deduplication',
              align: 'center',
              width: 0,
              head: m.deduplication,
              type: 'select_one',
              options: () => SheetUtils.buildOptions(Enum.keys(WfpDeduplicationStatus), true),
              tooltip: _ => _.deduplication && m.mpcaDb.status[_.deduplication.status],
              renderValue: _ => _.deduplication?.status ?? SheetUtils.blankValue,
              render: _ => _.deduplication && <DeduplicationStatusIcon status={_.deduplication.status}/>,
            },
            {
              id: 'suggestion',
              head: m.suggestion,
              type: 'select_one',
              options: () => SheetUtils.buildOptions(Enum.keys(DrcSupportSuggestion), true),
              render: _ => _.deduplication?.suggestion ?? SheetUtils.blankValue,
            },            // {
            //   id: 'deduplicationFile',
            //   head: 'deduplicationFile',
            //   type: 'select_one',
            //   options: () => getAllPossibleValues('deduplicationFile').map(_ => ({value: _, label: _})),
            //   render: _ => <Txt skeleton={50}/>
            // },
            // {
            //   id: 'duplication',
            //   type: 'select_one',
            //   head: m.status,
            //   options: () => Enum.keys(DeduplicationStatus).map(_ => ({value: _, label: _})),
            //   align: 'center',
            //   render: _ => fnSwitch(_.duplication!, {
            //     duplicate: <TableIcon color="warning" children="content_copy"/>,
            //     no_duplicate: <TableIcon color="success" children="check_circle"/>,
            //     pending: <TableIcon color="disabled" children="schedule"/>,
            //   }, () => <Txt skeleton={30}/>)
            // },
            {
              type: 'string',
              id: 'taxId',
              head: m.taxID,
              render: _ => _.taxId
            },
            {
              id: 'taxIdImg', align: 'center', head: m.taxID, render: _ => map(_.taxIdFileURL, url =>
                <TableImg url={getKoboImagePath(url.download_small_url)}/>
              )
            },
            {type: 'string', id: 'passportSerie', head: m.passportSerie, render: _ => _.passportSerie},
            {type: 'string', id: 'passportNum', head: m.passportNumber, render: _ => _.passportNum},
            {
              id: 'idFileImg', head: m.id, align: 'center', render: _ => map(_.idFileURL, url =>
                <TableImg url={getKoboImagePath(url.download_small_url)}/>
              )
            },
            {type: 'string', id: 'lastName', head: m.lastName, render: _ => _.lastName},
            {type: 'string', id: 'firstName', head: m.firstName, render: _ => _.firstName},
            {type: 'string', id: 'patronyme', head: m.patronyme, render: _ => _.patronyme},
            {
              id: 'status',
              head: m.status,
              render: _ => _.benefStatus,
              type: 'select_one',
              options: () => SheetUtils.buildOptions(Enum.keys(BNREOptions.ben_det_res_stat)),
            },
            {id: 'phone', head: m.phone, render: _ => _.phone},
          ]}
        />
      </Panel>
    </Page>
  )
}
