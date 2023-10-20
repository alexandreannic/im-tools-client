import React, {useEffect, useState} from 'react'
import {Page} from '@/shared/Page'
import {Sheet} from '@/shared/Sheet/Sheet'
import {useMPCAContext} from '../MpcaContext'
import {useI18n} from '@/core/i18n'
import {Panel} from '@/shared/Panel'
import {map} from '@alexandreannic/ts-utils'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useAsync, useFetcher} from '@alexandreannic/react-hooks-lib'
import {appConfig} from '@/conf/AppConfig'
import {kobo} from '@/koboDrcUaFormId'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {TableImg} from '@/shared/TableImg/TableImg'
import {DeduplicationStatusIcon} from '@/features/WfpDeduplication/WfpDeduplicationData'
import {formatLargeNumber} from '@/core/i18n/localization/en'
import {MpcaHelper, MpcaType} from '@/core/sdk/server/mpca/MpcaType'
import {SheetUtils} from '@/shared/Sheet/util/sheetUtils'
import {SelectDrcProject} from '@/shared/SelectDrcProject'
import {Switch} from '@mui/material'
import {AaSelectSingle} from '@/shared/Select/AaSelectSingle'

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
        <Sheet<MpcaType>
          id="mpca"
          title={m.data}
          // header={<PanelTitle>{m.data}</PanelTitle>}
          loading={ctx.fetcherData.loading}
          getRenderRowKey={_ => '' + _.id}
          data={ctx.data}
          select={{
            getId: _ => _.id,
            onSelect: _ => setSelected(_),
            selectActions: (
              <>
                <SelectDrcProject sx={{width: 140, mr: 1}} options={MpcaHelper.projects} onChange={p => {
                  ctx.asyncUpdates.call({
                    answerIds: selected,
                    key: 'projects',
                    value: p ? [p] : null,
                  })
                }}/>
                <AaSelectSingle
                  label={m.mpca.committed}
                  sx={{width: 140, mr: 1}}
                  options={[
                    {value: new Date() as any, children: 'Committed'},
                  ]}
                  onChange={p => {
                    ctx.asyncUpdates.call({
                      answerIds: selected,
                      key: 'committed',
                      value: p,
                    })
                  }}
                />
                <AaBtn
                  disabled
                  sx={{mr: 1}}
                  color="primary"
                  icon="content_paste_search"
                  variant="outlined"
                >
                  {m.mpca.generateDeduplicationFile}
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
                  {m.mpca.makePaymentTool}
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
              // options: () => SheetUtils.buildOptions(Enum.keys(MpcaRowSource)),
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
              // options: () => SheetUtils.buildOptions(Enum.keys(DrcDonor), true),
              render: _ => _.finalDonor ?? ''
            },
            {
              id: 'project',
              head: m.project,
              type: 'select_one',
              width: 160,
              // options: () => SheetUtils.buildOptions(Enum.keys(DrcProject), true),
              render: _ => _.project ?? SheetUtils.blank
            },
            {
              id: 'project_overridden',
              head: m.mpca.projectOverride,
              width: 180,
              type: 'select_one',
              renderValue: row => row.tags?.projects?.[0],
              renderOption: row => row.tags?.projects?.[0],
              render: _ => (
                <SelectDrcProject label={null} options={MpcaHelper.projects} value={_.tags?.projects?.[0]} onChange={p => {
                  ctx.asyncUpdates.call({
                    formId: MpcaHelper.formNameToId[_.source],
                    answerIds: [_.id],
                    key: 'projects',
                    value: p ? [p] : null,
                  })
                }}/>
              )
            },
            {
              id: 'project_final',
              width: 160,
              head: m.mpca.projectFinal,
              type: 'select_one',
              render: _ => _.finalProject ?? SheetUtils.blank
            },
            {
              id: 'prog',
              head: m.program,
              type: 'select_multiple',
              // options: () => SheetUtils.buildOptions(Enum.keys(MpcaProgram), true),
              renderValue: _ => _.prog,
              render: _ => _.prog?.join(' | '),
            },
            {
              id: 'oblast',
              head: m.oblast,
              type: 'select_one',
              // options: () => SheetUtils.buildOptions(Enum.values(OblastIndex.oblastByISO), true),
              render: _ => _.oblast ?? SheetUtils.blank,
            },
            {
              id: 'office',
              head: m.office,
              type: 'select_one',
              // options: () => SheetUtils.buildOptions(Enum.values(DrcOffice), true),
              render: _ => _.office ?? SheetUtils.blank,
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
              // options: () => SheetUtils.buildOptions(Enum.keys(WfpDeduplicationStatus), true),
              tooltip: _ => _.deduplication && m.mpca.status[_.deduplication.status],
              renderValue: _ => _.deduplication?.status ?? SheetUtils.blank,
              render: _ => _.deduplication && <DeduplicationStatusIcon status={_.deduplication.status}/>,
            },
            {
              id: 'suggestion',
              head: m.suggestion,
              type: 'select_one',
              // options: () => SheetUtils.buildOptions(Enum.keys(DrcSupportSuggestion), true),
              render: _ => _.deduplication?.suggestion ?? SheetUtils.blank,
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
              // options: () => SheetUtils.buildOptions(Enum.keys(bn_ReOptions.ben_det_res_stat)),
            },
            {id: 'phone', head: m.phone, render: _ => _.phone},
            {
              id: 'committed',
              type: 'select_one',
              head: m.mpca.committed,
              tooltip: null,
              renderValue: row => row.tags?.committed ? 'true' : 'false',
              renderOption: row => row.tags?.committed ? m.mpca.committed : SheetUtils.blankLabel,
              render: row => (
                <>
                  <Switch size="small" checked={!!row.tags?.committed} onChange={(e, checked) => ctx.asyncUpdates.call({
                    formId: MpcaHelper.formNameToId[row.source],
                    answerIds: [row.id],
                    key: 'committed',
                    value: checked ? new Date() : null,
                  })}/>
                </>
              )
            }
          ]}
        />
      </Panel>
    </Page>
  )
}
