import {useAppSettings} from '@/core/context/ConfigContext'
import {useEffectFn, useFetcher} from '@alexandreannic/react-hooks-lib'
import {KoboAnswerFilter} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {Shelter_TA} from '@/core/koboModel/Shelter_TA/Shelter_TA'
import {KoboAnswer, KoboAnswerId} from '@/core/sdk/server/kobo/Kobo'
import {Shelter_NTA} from '@/core/koboModel/Shelter_NTA/Shelter_NTA'
import React, {ReactNode, useCallback, useEffect, useMemo, useState} from 'react'
import {Page} from '@/shared/Page'
import {Sheet, SheetColumnProps} from '@/shared/Sheet/Sheet'
import {kobo} from '@/koboDrcUaFormId'
import {Enum, fnSwitch, map} from '@alexandreannic/ts-utils'
import {Shelter_NTAOptions} from '@/core/koboModel/Shelter_NTA/Shelter_NTAOptions'
import {useI18n} from '@/core/i18n'
import {ShelterContractor, ShelterNtaTags, ShelterProgress, ShelterTagValidation, ShelterTaTags} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {AaSelect} from '@/shared/Select/Select'
import {useAsync} from '@/alexlib-labo/useAsync'
import {useKoboSchema} from '@/features/Database/KoboTable/useKoboSchema'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {useAaToast} from '@/core/useToast'
import {getKoboTranslations} from '@/features/Database/KoboTable/DatabaseKoboTableContent'
import {Panel} from '@/shared/Panel'
import {Box, useTheme} from '@mui/material'
import {TableIcon, TableIconBtn} from '@/features/Mpca/MpcaData/TableIcon'
import {KoboAttachedImg} from '@/shared/TableImg/KoboAttachedImg'
import {Utils} from '@/utils/utils'
import {useDatabaseKoboAnswerView} from '@/features/Database/KoboEntry/DatabaseKoboAnswerView'
import {Txt} from 'mui-extension'

export interface ShelterDataFilters extends KoboAnswerFilter {
}

interface Row {
  ta?: KoboAnswer<Shelter_TA, ShelterTaTags>
  nta?: KoboAnswer<Shelter_NTA, ShelterNtaTags>
  id: KoboAnswerId
}

export const ShelterData = () => {
  const {api} = useAppSettings()
  const {toastError} = useAaToast()
  const _schemas = useFetcher(async () => {
    const [ta, nta] = await Promise.all([
      api.koboApi.getForm(kobo.drcUa.server.prod, kobo.drcUa.form.shelterTA),
      api.koboApi.getForm(kobo.drcUa.server.prod, kobo.drcUa.form.shelterNTA),
    ])
    return {ta, nta}
  })

  useEffect(() => {
    _schemas.fetch()
  }, [])

  useEffectFn(_schemas.error, toastError)

  return (
    <Page width="full" loading={_schemas.loading}>
      {_schemas.entity && (
        <_ShelterData schemas={_schemas.entity}/>
      )}
    </Page>
  )
}

export const _ShelterData = ({
  schemas,
}: {
  schemas: {
    ta: KoboApiForm,
    nta: KoboApiForm,
  }
}) => {
  const theme = useTheme()
  const {api} = useAppSettings()
  const {m, formatDate, formatLargeNumber} = useI18n()
  const _schemaNta = useKoboSchema({schema: schemas.nta})
  const _schemaTa = useKoboSchema({schema: schemas.ta})
  const _update = useAsync(api.kobo.answer.updateTag)
  const [langIndex, setLangIndex] = useState<number>(0)
  const {toastHttpError, toastLoading} = useAaToast()

  const _translateTa = useMemo(() => getKoboTranslations({
    schema: schemas.ta,
    langIndex,
    questionIndex: _schemaTa.questionIndex,
  }), [schemas.ta, langIndex])

  const _editTa = useAsync(async (answerId: KoboAnswerId) => {
    return api.koboApi.getEditUrl(kobo.drcUa.server.prod, kobo.drcUa.form.shelterTA, answerId).then(_ => {
      if (_.url) window.open(_.url, '_blank')
    }).catch(toastHttpError)
  }, {requestKey: _ => _[0]})

  const _editNta = useAsync(async (answerId: KoboAnswerId) => {
    return api.koboApi.getEditUrl(kobo.drcUa.server.prod, kobo.drcUa.form.shelterNTA, answerId).then(_ => {
      if (_.url) window.open(_.url, '_blank')
    }).catch(toastHttpError)
  }, {requestKey: _ => _[0]})

  const _translateNta = useMemo(() => getKoboTranslations({
    schema: schemas.nta,
    langIndex,
    questionIndex: _schemaNta.questionIndex,
  }), [schemas.nta, langIndex])

  const [openModalAnswerTa] = useDatabaseKoboAnswerView<Row['ta']>({
    translateQuestion: _translateTa.translateQuestion,
    translateChoice: _translateTa.translateChoice,
    schema: schemas.ta,
    langIndex: langIndex,
  })
  const [openModalAnswerNta] = useDatabaseKoboAnswerView<Row['nta']>({
    translateQuestion: _translateNta.translateQuestion,
    translateChoice: _translateNta.translateChoice,
    schema: schemas.nta,
    langIndex: langIndex,
  })

  const _data = useFetcher(async (filters?: ShelterDataFilters) => {
    const index: Record<KoboAnswerId, {
      nta?: Row['nta'],
      ta?: Row['ta'],
    }> = {} as any
    await Promise.all([
      api.kobo.answer.searchShelterNta(filters).then(_ => _.data.forEach(d => {
        if (!index[d.id]) index[d.id] = {}
        index[d.id].nta = d
      })),
      api.kobo.answer.searchShelterTa(filters).then(_ => _.data.forEach(d => {
        // if (!d.nta_id) {
        //   console.log('no reference number for', d)
        // return
        // }
        const refId = d.nta_id ? +d.nta_id.replaceAll(/[^\d]/g, '') : d.id
        if (!index[refId]) index[refId] = {}
        index[refId].ta = d
      })),
    ])
    return Enum.entries(index)
      // .filter(([k, v]) => !!v.nta)
      .map(([k, v]) => ({id: k, ...v}))
      .sort((a, b) => {
        if (!a.nta) return -1
        if (!b.nta) return 1
        return a.nta.submissionTime?.getTime() - b.nta?.submissionTime.getTime()
      }) as Row[]
  })

  const buildTagEnumColumn = useCallback(<K extends string, >({
    form,
    head,
    tag,
    enumerator,
    translate,
    ...sheetProps
  }: Pick<SheetColumnProps<any>, 'style' | 'styleHead' | 'width'> & {
    head: string
    enumerator: Record<K, string>
    translate?: Record<K, ReactNode>
  } & ({
    form: (typeof kobo)['drcUa']['form']['shelterNTA'],
    tag: keyof Partial<ShelterNtaTags>,
  } | {
    form: (typeof kobo)['drcUa']['form']['shelterTA'],
    tag: keyof Partial<ShelterTaTags>,
  })): SheetColumnProps<Row> => {
    const formKey = form === kobo.drcUa.form.shelterTA ? 'ta' : 'nta'
    const enumKeys = Enum.keys(enumerator)
    return {
      id: tag,
      head,
      type: 'select_one',
      options: () => enumKeys.map(_ => ({value: _, label: _})),
      renderValue: row => (row[formKey]?.tags as any)?.[tag],
      render: row => map(row[formKey], rowFormKey => (
        <AaSelect
          showUndefinedOption
          defaultValue={(rowFormKey.tags as any)?.[tag] ?? ''}
          onChange={(tagChange) => {
            _update.call({
              formId: form,
              answerId: rowFormKey.id,
              tags: {[tag]: tagChange}
            }).then(newTag => _data.setEntity(data => data?.map(d => {
              if (d[formKey]?.id === rowFormKey.id) {
                rowFormKey.tags = newTag
              }
              return d
            })))
          }}
          options={enumKeys.map(_ => ({
            value: _, children: translate ? translate[_] : _,
          }))
          }
        />
      )),
      ...sheetProps,
    }
  }, [_data.entity])

  const column = useMemo(() => {
    return {
      validation: buildTagEnumColumn({
        form: kobo.drcUa.form.shelterNTA,
        head: m._shelter.validationStatus,
        tag: 'validation',
        enumerator: ShelterTagValidation,
        translate: {
          [ShelterTagValidation.Accepted]: <TableIcon color="success">check_circle</TableIcon>,
          [ShelterTagValidation.Rejected]: <TableIcon color="error">cancel</TableIcon>,
          [ShelterTagValidation.Pending]: <TableIcon color="warning">schedule</TableIcon>,
        }
      }),
      progress: buildTagEnumColumn({
        head: m._shelter.progressStatus,
        form: kobo.drcUa.form.shelterTA,
        tag: 'progress',
        enumerator: ShelterProgress,
        translate: m._shelter.progress,
      }),
      contractor1: buildTagEnumColumn({
        width: 148,
        head: m._shelter.contractor1,
        form: kobo.drcUa.form.shelterTA,
        tag: 'contractor1',
        enumerator: ShelterContractor,
      }),
      contractor2: buildTagEnumColumn({
        width: 148,
        head: m._shelter.contractor2,
        form: kobo.drcUa.form.shelterTA,
        tag: 'contractor2',
        enumerator: ShelterContractor,
      })
    }
  }, [_data])

  useEffect(() => {
    _data.fetch()
  }, [])

  useEffect(() => {
    console.log('_data.entity', _data.entity)
  }, [_data.entity])

  return (
    <Panel>
      <Sheet
        data={_data.entity}
        loading={_data.loading}
        getRenderRowKey={_ => '' + _.id}
        columns={[
          {
            tooltip: null,
            type: 'select_one',
            head: m._shelter.ntaForm,
            id: 'ntaForm',
            options: () => [{value: 'exist', label: m._shelter.taRefOk}, {value: 'notexist', label: m._shelter.taRefNok}],
            renderValue: _ => _.nta ? 'exist' : 'notexist',
            render: _ => (
              <>
                {map(_.nta, form =>
                  <>
                    <TableIconBtn tooltip={m.view} children="visibility" onClick={() => openModalAnswerNta(form)}/>
                    <TableIconBtn tooltip={m.edit} loading={_editNta.loading.has(form.id)} onClick={() => _editNta.call(form.id)} children="edit"/>
                  </>
                ) ?? (
                  <>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                      <TableIcon color="error" sx={{mr: .5}}>error</TableIcon>
                      <Box>
                        <Txt block size="small">TA ID: <Txt bold>{_.ta?.id}</Txt></Txt>
                        <Txt block size="small">NTA Ref: <Txt bold>{_.ta?.nta_id}</Txt></Txt>
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
            render: _ => _translateNta.translateChoice('ben_det_oblast', _.nta?.ben_det_oblast),
            renderValue: _ => _.nta?.ben_det_oblast,
          },
          {
            id: 'raion',
            type: 'string',
            // options: () => Enum.entries(Shelter_NTAOptions.ben_det_raion).map(([value, label]) => ({value, label})),
            head: m.raion,
            render: _ => _translateNta.translateChoice('ben_det_oblast', _.nta?.ben_det_oblast),
            renderValue: _ => _.nta?.ben_det_raion,
          },
          {
            id: 'owner_tenant_type',
            type: 'select_one',
            head: m._shelter.owner,
            options: () => Enum.entries(Shelter_NTAOptions.owner_tenant_type).map(([value, label]) => ({value, label})),
            renderValue: _ => _.nta?.owner_tenant_type,
            render: _ => _translateNta.translateChoice('owner_tenant_type', _.nta?.owner_tenant_type),
          },
          {
            id: 'document_type',
            type: 'select_one',
            head: m._shelter.documentType,
            options: () => Enum.entries(Shelter_NTAOptions.document_type).map(([value, label]) => ({value, label})),
            renderValue: _ => _.nta?.document_type,
            render: _ => _translateNta.translateChoice('document_type', _.nta?.document_type),
          },
          {
            id: 'dwelling_type',
            type: 'select_one',
            head: m._shelter.accommodation,
            options: () => Enum.entries(Shelter_NTAOptions.dwelling_type).map(([value, label]) => ({value, label})),
            render: _ => _translateNta.translateChoice('dwelling_type', _.nta?.dwelling_type),
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
            type: 'number',
            head: m._shelter.scoreDamage,
            renderValue: _ => Utils.add(_.nta?.apt_score, _.nta?.hh_score),
            render: _ => Utils.add(_.nta?.apt_score, _.nta?.hh_score),
          },
          {
            id: 'displ_score',
            type: 'number',
            head: m._shelter.scoreDisplacement,
            renderValue: _ => _.nta?.displ_score,
            render: _ => _.nta?.displ_score,
          },
          {
            id: 'socio_score',
            type: 'number',
            head: m._shelter.scoreSocio,
            renderValue: _ => _.nta?.socio_score,
            render: _ => _.nta?.socio_score,
          },
          {
            id: 'total',
            type: 'number',
            head: m._shelter.total,
            renderValue: _ => Utils.add(_.nta?.apt_score, _.nta?.hh_score, _.nta?.displ_score, _.nta?.socio_score),
            render: _ => Utils.add(_.nta?.apt_score, _.nta?.hh_score, _.nta?.displ_score, _.nta?.socio_score),
          },
          column.validation,
          {
            id: 'TA',
            style: {borderLeft: '4px solid ' + theme.palette.divider},
            styleHead: {borderLeft: '4px solid ' + theme.palette.divider},
            head: m._shelter.taForm,
            type: 'select_one',
            options: () => [{value: 'true', label: m._shelter.taFilled}, {value: 'false', label: m._shelter.taNotFilled}],
            renderValue: _ => _.ta ? 'true' : 'false',
            tooltip: null,
            render: _ => map(_.ta, form =>
              <>
                <TableIconBtn tooltip={m.view} children="visibility" onClick={() => openModalAnswerTa(form)}/>
                <TableIconBtn tooltip={m.edit} loading={_editTa.loading.has(form.id)} onClick={() => _editTa.call(form.id)} children="edit"/>
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
            id: 'roof',
            head: '',
            render: _ => _.ta ? Utils.add(_.ta.roof_shiffer_m, _.ta.roof_metal_sheets_m, _.ta.roof_onduline_sheets_m, _.ta.bitumen_paint_m) : undefined,
          },
          {
            type: 'number',
            id: 'windows',
            head: '',
            render: _ => _.ta ? Utils.add(
              _.ta.singleshutter_windowdoubleglazed_pc,
              _.ta.singleshutter_window_tripleglazed_pc,
              _.ta.doubleshutter_window_tripleglazed_pc,
              _.ta.glass_replacement_tripleglazed_pc
            ) : undefined,
          },
          column.contractor1,
          column.contractor2,
          column.progress,
          {
            type: 'number',
            id: 'price',
            head: m.price,
            renderValue: _ => _.ta?.tags?.contractor1 && 128000,
            render: _ => formatLargeNumber(_.ta?.tags?.contractor1 && 128000),
          },

        ]}
      />
    </Panel>
  )
}