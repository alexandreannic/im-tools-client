import {KoboAnswerFilter} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {Page} from '@/shared/Page'
import {Sheet, SheetUtils} from '@/shared/Sheet/Sheet'
import {Arr, Enum, fnSwitch, map} from '@alexandreannic/ts-utils'
import {Shelter_NTAOptions} from '@/core/koboModel/Shelter_NTA/Shelter_NTAOptions'
import {useI18n} from '@/core/i18n'
import {AaSelect} from '@/shared/Select/Select'
import {Panel} from '@/shared/Panel'
import {Box, useTheme} from '@mui/material'
import {TableIcon, TableIconBtn} from '@/features/Mpca/MpcaData/TableIcon'
import {KoboAttachedImg} from '@/shared/TableImg/KoboAttachedImg'
import {Utils} from '@/utils/utils'
import {Txt} from 'mui-extension'
import {useShelterContext} from '@/features/Shelter/ShelterContext'
import {AAIconBtn} from '@/shared/IconBtn'
import {AaInput} from '@/shared/ItInput/AaInput'
import {DebouncedInput} from '@/shared/DebouncedInput'
import {ShelterContractor, ShelterContractorPrices} from '@/core/sdk/server/kobo/custom/ShelterContractor'
import {ShelterRow} from '@/features/Shelter/useShelterData'
import {KoboShelterTa, ShelterProgress, ShelterTagValidation, ShelterTaPriceLevel} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {formatDateTime} from '@/core/i18n/localization/en'
import {ShelterSelectAccepted, ShelterSelectContractor} from '@/features/Shelter/Data/ShelterTableInputs'

export interface ShelterDataFilters extends KoboAnswerFilter {
}

export const ShelterTable = () => {
  const ctx = useShelterContext()
  const theme = useTheme()
  const {m, formatDate, formatLargeNumber} = useI18n()
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // const getNtaIds = () => Arr(selectedIds).map(_ => ctx.data.index?.[_]?.nta).compact()
  // const getTaIds = () => Arr(selectedIds).map(_ => ctx.data.index?.[_]?.ta).compact()
  const getNta = useCallback(() => Arr(selectedIds).map(_ => ctx.data.index?.[_]?.nta).compact(), [ctx.data.index, selectedIds])
  const getTa = useCallback(() => Arr(selectedIds).map(_ => ctx.data.index?.[_]?.ta).compact(), [ctx.data.index, selectedIds])

  const columns = useMemo(() => {
    return SheetUtils.buildColumns([
      {
        tooltip: null,
        type: 'select_one',
        head: m._shelter.ntaForm,
        id: 'ntaForm',
        options: () => [{value: 'exist', label: m._shelter.taRefOk}, {value: 'notexist', label: m._shelter.taRefNok}],
        renderValue: _ => _.nta ? 'exist' : 'notexist',
        render: _ => (
          <>
            {map(_.nta, answer =>
              <>
                <TableIconBtn tooltip={m.view} children="visibility" onClick={() => ctx.nta.openModalAnswer(answer)}/>
                <TableIconBtn tooltip={m.edit} loading={ctx.nta._edit.loading.has(answer.id)} onClick={() => ctx.nta._edit.call(answer.id)} children="edit"/>
              </>
            ) ?? (
              <>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                  <TableIcon color="error" sx={{mr: .5}}>error</TableIcon>
                  <Box>
                    <Txt block size="small" sx={{marginBottom: '-5px'}}>TA ID: <Txt bold>{_.ta?.id}</Txt></Txt>
                    <Txt block size="small" sx={{marginBottom: '-2px'}}>NTA Ref: <Txt bold>{_.ta?.nta_id}</Txt></Txt>
                  </Box>
                </Box>
              </>
            )}
          </>
        )
      },
      {
        id: 'Id',
        head: 'ID',
        type: 'string',
        renderValue: _ => _.nta?.id,
        render: _ => _.nta?.id,
      },
      {
        type: 'date',
        id: 'ntaSubmissionTime',
        head: m.submissionTime,
        renderValue: _ => _.nta?.submissionTime,
        render: _ => formatDate(_.nta?.submissionTime),
      },
      {
        id: 'oblast',
        type: 'select_one',
        options: () => Enum.entries(Shelter_NTAOptions.ben_det_oblast).map(([value, label]) => ({value, label})),
        head: m.oblast,
        render: _ => ctx.nta._helper.translateChoice('ben_det_oblast', _.nta?.ben_det_oblast),
        renderValue: _ => _.nta?.ben_det_oblast,
      },
      {
        id: 'raion',
        type: 'string',
        // options: () => Enum.entries(Shelter_NTAOptions.ben_det_raion).map(([value, label]) => ({value, label})),
        head: m.raion,
        render: _ => ctx.nta._helper.translateChoice('ben_det_oblast', _.nta?.ben_det_oblast),
        renderValue: _ => _.nta?.ben_det_raion,
      },
      {
        id: 'owner_tenant_type',
        type: 'select_one',
        head: m._shelter.owner,
        options: () => Enum.entries(Shelter_NTAOptions.owner_tenant_type).map(([value, label]) => ({value, label})),
        renderValue: _ => _.nta?.owner_tenant_type,
        render: _ => ctx.nta._helper.translateChoice('owner_tenant_type', _.nta?.owner_tenant_type),
      },
      {
        id: 'document_type',
        type: 'select_one',
        head: m._shelter.documentType,
        options: () => Enum.entries(Shelter_NTAOptions.document_type).map(([value, label]) => ({value, label})),
        renderValue: _ => _.nta?.document_type,
        render: _ => ctx.nta._helper.translateChoice('document_type', _.nta?.document_type),
      },
      {
        id: 'dwelling_type',
        type: 'select_one',
        head: m._shelter.accommodation,
        options: () => Enum.entries(Shelter_NTAOptions.dwelling_type).map(([value, label]) => ({value, label})),
        render: _ => ctx.nta._helper.translateChoice('dwelling_type', _.nta?.dwelling_type),
        renderValue: _ => _.nta?.dwelling_type,
      },
      {
        id: 'ownership_verification',
        type: 'select_one',
        align: 'center',
        width: 0,
        head: m._shelter.ownershipDocumentExist,
        options: () => Enum.entries(Shelter_NTAOptions.pregnant_lac).map(([value, label]) => ({value, label})),
        renderValue: _ => _.nta?.ownership_verification,
        render: _ => fnSwitch(_.nta?.ownership_verification!, {
          yes: <TableIcon color="success">check_circle</TableIcon>,
          no: <TableIcon color="error">cancel</TableIcon>,
        }, () => undefined),
      },
      {
        id: 'ownership_verification_doc',
        type: 'select_one',
        head: m._shelter.ownershipDocument,
        options: () => [{value: 'exist', label: m.exist}, {value: 'not_exist', label: m.notExist}],
        renderValue: _ => _.nta?.doc_available_yes1 ? 'exist' : 'not_exist',
        render: _ =>
          <Box component="span" sx={{'& > :not(:last-child)': {marginRight: '2px'}}}>
            {_.nta?.attachments && (
              <>
                <KoboAttachedImg attachments={_.nta.attachments} fileName={_.nta.doc_available_yes1}/>
                <KoboAttachedImg attachments={_.nta.attachments} fileName={_.nta.doc_available_yes2}/>
                <KoboAttachedImg attachments={_.nta.attachments} fileName={_.nta.doc_available_yes3}/>
                <KoboAttachedImg attachments={_.nta.attachments} fileName={_.nta.doc_available_yes4}/>
                <KoboAttachedImg attachments={_.nta.attachments} fileName={_.nta.doc_available_yes5}/>
              </>
            )}
          </Box>,
      },
      {
        id: 'damage_score',
        typeIcon: null,
        type: 'number',
        width: 0,
        head: m._shelter.scoreDamage,
        renderValue: _ => Utils.add(_.nta?.apt_score, _.nta?.hh_score),
        render: _ => Utils.add(_.nta?.apt_score, _.nta?.hh_score),
      },
      {
        id: 'displ_score',
        typeIcon: null,
        type: 'number',
        width: 0,
        head: m._shelter.scoreDisplacement,
        renderValue: _ => _.nta?.displ_score,
        render: _ => _.nta?.displ_score,
      },
      {
        id: 'socio_score',
        typeIcon: null,
        type: 'number',
        width: 0,
        head: m._shelter.scoreSocio,
        renderValue: _ => _.nta?.socio_score,
        render: _ => Utils.add(_.nta?.socio_score!) < 6 ? <Txt bold color="error">{_.nta?.socio_score}</Txt> : _.nta?.socio_score,
      },
      {
        id: 'total',
        typeIcon: null,
        type: 'number',
        width: 0,
        head: m._shelter.total,
        renderValue: _ => Utils.add(_.nta?.apt_score, _.nta?.hh_score, _.nta?.displ_score, _.nta?.socio_score),
        render: _ => Utils.add(_.nta?.apt_score, _.nta?.hh_score, _.nta?.displ_score, _.nta?.socio_score),
      },
      {
        type: 'select_one',
        id: 'validation',
        head: m._shelter.validationStatus,
        width: 0,
        typeIcon: null,
        options: () => [
          {value: ShelterTagValidation.Accepted, label: <TableIcon color="success">check_circle</TableIcon>},
          {value: ShelterTagValidation.Rejected, label: <TableIcon color="error">cancel</TableIcon>},
          {value: ShelterTagValidation.Pending, label: <TableIcon color="warning">schedule</TableIcon>},
        ],
        renderValue: (row: ShelterRow) => row.nta?.tags?.validation,
        render: (row: ShelterRow) => map(row.nta, nta => (
          <ShelterSelectAccepted
            value={nta.tags?.validation}
            onChange={(tagChange) => {
              ctx.nta._update.call({
                answerId: nta.id,
                key: 'validation',
                value: tagChange,
              })
            }}
          />
        )),
      },
      // column.validation,
      {
        id: 'TA',
        width: 0,
        style: {borderLeft: '4px solid ' + theme.palette.divider},
        styleHead: {borderLeft: '4px solid ' + theme.palette.divider},
        head: m._shelter.taForm,
        type: 'select_one',
        options: () => [{value: 'true', label: m._shelter.taFilled}, {value: 'false', label: m._shelter.taNotFilled}],
        renderValue: _ => _.ta ? 'true' : 'false',
        tooltip: null,
        render: _ => map(_.ta, form =>
          <>
            <TableIconBtn tooltip={m.view} children="visibility" onClick={() => ctx.ta.openModalAnswer(form)}/>
            <TableIconBtn tooltip={m.edit} loading={ctx.ta._edit.loading.has(form.id)} onClick={() => ctx.ta._edit.call(form.id)} children="edit"/>
          </>
        ),
      },
      {
        type: 'date',
        id: 'taSubmissionTime',
        head: m.submissionTime,
        renderValue: _ => _.ta?.submissionTime,
        render: _ => formatDate(_.ta?.submissionTime),
      },
      {
        type: 'number',
        width: 0,
        head: m._shelter.roofSum,
        id: 'roof',
        render: _ => _.ta ? Utils.add(_.ta.roof_shiffer_m, _.ta.roof_metal_sheets_m, _.ta.roof_onduline_sheets_m, _.ta.bitumen_paint_m) : undefined,
      },
      {
        type: 'number',
        width: 0,
        head: m._shelter.windowsSum,
        id: 'windows',
        render: _ => _.ta ? Utils.add(
          _.ta.singleshutter_windowdoubleglazed_pc,
          _.ta.singleshutter_window_tripleglazed_pc,
          _.ta.doubleshutter_window_tripleglazed_pc,
          _.ta.glass_replacement_tripleglazed_pc
        ) : undefined,
      },
      {
        id: 'agreement',
        head: m._shelter.agreement,
        type: 'string',
        renderValue: _ => _.ta?.tags?.agreement,
        render: row => map(row.ta, ta => (
          <DebouncedInput<string>
            debounce={1250}
            value={row.ta?.tags?.agreement}
            onChange={_ => ctx.ta._update.call({answerId: ta.id, key: 'agreement', value: _})}
          >
            {(value, onChange) => (
              <AaInput
                helperText={null}
                defaultValue={value}
                onChange={e => onChange(e.target.value)}
              />
            )}
          </DebouncedInput>
        ))
      },
      {
        id: 'workOrder',
        head: m._shelter.workOrder,
        type: 'string',
        renderValue: _ => _.ta?.tags?.workOrder,
        typeIcon: null,
        render: row => map(row.ta, ta => (
          <DebouncedInput<string>
            debounce={1250}
            value={row.ta?.tags?.workOrder}
            onChange={_ => ctx.ta._update.call({answerId: ta.id, key: 'workOrder', value: _})}
          >
            {(value, onChange) => (
              <AaInput
                helperText={null}
                defaultValue={value}
                onChange={e => onChange(e.target.value)}
              />
            )}
          </DebouncedInput>
        ))
      },
      {
        id: 'donor',
        head: m._shelter.donor,
        type: 'string',
        renderValue: _ => _.ta?.tags?.donor,
        typeIcon: null,
        render: row => map(row.ta, ta => (
          <DebouncedInput<string>
            debounce={1250}
            value={row.ta?.tags?.donor}
            onChange={_ => ctx.ta._update.call({answerId: ta.id, key: 'donor', value: _})}
          >
            {(value, onChange) => (
              <AaInput
                helperText={null}
                defaultValue={value}
                onChange={e => onChange(e.target.value)}
              />
            )}
          </DebouncedInput>
        ))
      },
      {
        id: 'hasLot1',
        head: m._shelter.lot1,
        width: 0,
        align: 'center',
        type: 'select_one',
        typeIcon: null,
        tooltip: null,
        options: () => ['Yes', 'No', 'None'].map(SheetUtils.buildOption),
        renderValue: row => fnSwitch(KoboShelterTa.hasLot1(row.ta) + '', {
          true: 'Yes',
          false: 'No',
        }, () => 'None'),
        render: row => fnSwitch(KoboShelterTa.hasLot1(row.ta) + '', {
          true: <TableIcon color="success">task_alt</TableIcon>,
          false: <TableIcon color="disabled">block</TableIcon>,
        }, () => <></>),
      },
      {
        id: 'contractor1',
        width: 148,
        head: m._shelter.contractor1,
        type: 'select_one',
        options: () => Enum.keys(ShelterContractor).map(_ => ({value: _, label: _})),
        renderValue: row => row.ta?.tags?.contractor1,
        typeIcon: null,
        render: row => map(row.ta, ta => (
          <ShelterSelectContractor
            disabled={!KoboShelterTa.hasLot1(ta)}
            value={ta.tags?.contractor1}
            oblast={ta?.ben_det_oblast}
            onChange={(tagChange) => {
              ctx.ta._update.call({
                answerId: ta.id,
                key: 'contractor1',
                value: tagChange,
                // value: ShelterContractor[tagChange],
              })
            }}
          />
        )),
      },
      {
        id: 'hasLot2',
        head: m._shelter.lot2,
        width: 0,
        align: 'center',
        type: 'select_one',
        typeIcon: null,
        tooltip: null,
        options: () => ['Yes', 'No', 'None'].map(SheetUtils.buildOption),
        renderValue: row => fnSwitch(KoboShelterTa.hasLot2(row.ta) + '', {
          true: 'Yes',
          false: 'No',
        }, () => 'None'),
        render: row => fnSwitch(KoboShelterTa.hasLot2(row.ta) + '', {
          true: <TableIcon color="success">task_alt</TableIcon>,
          false: <TableIcon color="disabled">block</TableIcon>,
        }, () => <></>),
      },
      {
        id: 'contractor2',
        width: 148,
        head: m._shelter.contractor2,
        type: 'select_one',
        options: () => Enum.keys(ShelterContractor).map(_ => ({value: _, label: _})),
        typeIcon: null,
        renderValue: row => row.ta?.tags?.contractor2,
        render: row => map(row.ta, ta => (
          <>
            <AaSelect
              disabled={!KoboShelterTa.hasLot2(ta)}
              showUndefinedOption
              value={ta.tags?.contractor2}
              onChange={(tagChange) => {
                ctx.ta._update.call({
                  answerId: ta.id,
                  key: 'contractor2',
                  value: tagChange,
                })
              }}
              options={ShelterContractorPrices.findContractor({oblast: ta?.ben_det_oblast, lot: 2}).map(_ => ({
                value: _, children: _,
              }))
              }
            />
          </>
        )),
      },
      // column.progress,
      {
        type: 'number',
        width: 0,
        id: 'price',
        head: m.price,
        renderValue: row => row.ta?._price,
        render: (row: ShelterRow) => map(row.ta?._price, _ => typeof _ === 'string' ? _ : formatLargeNumber(_)),
      },
      {
        type: 'select_one',
        id: 'price_level',
        head: m._shelter.priceLevel,
        width: 0,
        align: 'center',
        typeIcon: null,
        options: () => SheetUtils.buildOptions(Object.keys(ShelterTaPriceLevel)),
        renderValue: (row: ShelterRow) => row.ta?._priceLevel,
        render: (row: ShelterRow) => fnSwitch(row.ta?._priceLevel!, {
          [ShelterTaPriceLevel.Light]: <TableIcon color="success">looks_one</TableIcon>,
          [ShelterTaPriceLevel.Medium]: <TableIcon color="warning">looks_two</TableIcon>,
          [ShelterTaPriceLevel.Heavy]: <TableIcon color="error">looks_3</TableIcon>,
        }, () => <></>)
      },
      {
        type: 'select_one',
        id: 'progress',
        head: m._shelter.progressStatus,
        width: 190,
        typeIcon: null,
        options: () => Enum.keys(ShelterProgress).map(_ => ({value: _, label: m._shelter.progress[_]})),
        renderValue: (row: ShelterRow) => row.ta?.tags?.progress,
        render: (row: ShelterRow) => map(row.ta, ta => (
          <AaSelect<ShelterProgress>
            showUndefinedOption
            defaultValue={ta.tags?.progress}
            onChange={(tagChange) => {
              ctx.ta._update.call({
                answerId: ta.id,
                key: 'progress',
                value: tagChange,
              })
              if (tagChange === ShelterProgress.RepairWorksCompleted)
                ctx.ta._update.call({
                  answerId: ta.id,
                  key: 'workDoneAt',
                  value: new Date(),
                })
              else if (ta.tags?.workDoneAt)
                ctx.ta._update.call({
                  answerId: ta.id,
                  key: 'workDoneAt',
                  value: null,
                })
            }}
            options={Enum.values(ShelterProgress).map(_ => ({value: _, children: m._shelter.progress[_],}))}
          />
        )),
      },
      {
        id: 'workDoneAt',
        head: m._shelter.workDoneAt,
        type: 'date',
        renderValue: _ => _.ta?.tags?.workDoneAt,
        render: (row: ShelterRow) => map(row.ta, ta => formatDateTime(row.ta?.tags?.workDoneAt))
      },
    ])
  }, [ctx.data.mappedData])

  useEffect(() => {
    ctx.fetchAll()
  }, [])

  return (
    <Page width="full">
      <Panel>
        <Sheet
          id="shelter"
          title="Shelter-Assessment_database"
          select={{
            onSelect: setSelectedIds,
            getId: _ => _.id + '',
            selectActions: (
              <Box sx={{
                width: '100%',
                display: 'flex',
                '& > *': {
                  marginLeft: t => t.spacing(1) + ' !important',
                }
              }}>
                <ShelterSelectAccepted
                  sx={{maxWidth: 110}}
                  label={m._shelter.validationStatus}
                  onChange={(tagChange) => {
                    map(getNta()?.map(_ => _.id), ids => {
                      ctx.nta._updates.call({
                        answerIds: ids,
                        key: 'validation',
                        value: tagChange,
                      })
                    })
                  }}
                />
                <ShelterSelectContractor
                  sx={{maxWidth: 140}}
                  label={m._shelter.contractor1}
                  onChange={(tagChange) => {
                    map(getTa()?.map(_ => _.id), ids => {
                      ctx.ta._updates.call({
                        answerIds: ids,
                        key: 'contractor1',
                        value: tagChange,
                      })
                    })
                  }}
                />
                <ShelterSelectContractor
                  sx={{maxWidth: 140}}
                  label={m._shelter.contractor2}
                  onChange={(tagChange) => {
                    map(getTa()?.map(_ => _.id), ids => {
                      ctx.ta._updates.call({
                        answerIds: ids,
                        key: 'contractor2',
                        value: tagChange,
                      })
                    })
                  }}
                />
              </Box>
            )
          }}
          // showExportBtn
          header={
            <>
              <AAIconBtn
                loading={ctx.refresh.loading.size > 0}
                children="cloud_sync"
                tooltip={m._koboDatabase.pullData}
                onClick={ctx.refresh.call}
              />
            </>
          }
          data={ctx.data.mappedData}
          loading={ctx.fetching}
          getRenderRowKey={_ => '' + _.id}
          columns={columns}
        />
      </Panel>
    </Page>
  )
}
