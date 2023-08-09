import {useAppSettings} from '@/core/context/ConfigContext'
import {useEffectFn, useFetcher} from '@alexandreannic/react-hooks-lib'
import {KoboAnswerFilter} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {Shelter_TA} from '@/core/koboModel/Shelter_TA/Shelter_TA'
import {KoboAnswer, KoboAnswerId} from '@/core/sdk/server/kobo/Kobo'
import {Shelter_NTA} from '@/core/koboModel/Shelter_NTA/Shelter_NTA'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {Page} from '@/shared/Page'
import {Sheet} from '@/shared/Sheet/Sheet'
import {kobo} from '@/koboDrcUaFormId'
import {Enum, fnSwitch, map} from '@alexandreannic/ts-utils'
import {Shelter_NTAOptions} from '@/core/koboModel/Shelter_NTA/Shelter_NTAOptions'
import {useI18n} from '@/core/i18n'
import {ShelterNtaTags, ShelterProgress, ShelterTagValidation, ShelterTaTags} from '@/core/sdk/server/kobo/KoboShelterTA'
import {AaSelect} from '@/shared/Select/Select'
import {useAsync} from '@/alexlib-labo/useAsync'
import {useKoboSchema} from '@/features/Database/KoboTable/useKoboSchema'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {useAaToast} from '@/core/useToast'
import {getKoboTranslations} from '@/features/Database/KoboTable/DatabaseKoboTableContent'
import {Panel} from '@/shared/Panel'
import {Box, Icon} from '@mui/material'
import {TableIcon} from '@/features/Mpca/MpcaData/TableIcon'
import {KoboAttachedImg} from '@/shared/TableImg/KoboAttachedImg'
import {Txt} from 'mui-extension'
import {render} from 'react-dom'
import {Utils} from '@/utils/utils'

export interface ShelterDataFilters extends KoboAnswerFilter {

}

const shelterProgressKeys = Enum.keys(ShelterProgress)
const shelterTaTagsKeys = Enum.keys(ShelterTagValidation)

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
  const {api} = useAppSettings()
  const {m, formatDate} = useI18n()
  const _schemaNta = useKoboSchema({schema: schemas.nta})
  const _schemaTa = useKoboSchema({schema: schemas.ta})
  const _update = useAsync(api.kobo.answer.update)
  const [langIndex, setLangIndex] = useState<number>(0)

  const _translateTa = useMemo(() => getKoboTranslations({
    schema: schemas.ta,
    langIndex,
    questionIndex: _schemaTa.questionIndex,
  }), [schemas.ta, langIndex])

  const _translateNTa = useMemo(() => getKoboTranslations({
    schema: schemas.nta,
    langIndex,
    questionIndex: _schemaNta.questionIndex,
  }), [schemas.nta, langIndex])

  const _data = useFetcher(async (filters?: ShelterDataFilters) => {
    const index: Record<KoboAnswerId, {
      nta: KoboAnswer<Shelter_NTA, ShelterNtaTags>,
      ta?: KoboAnswer<Shelter_TA, ShelterTaTags>,
    }> = {} as any
    await Promise.all([
      api.kobo.answer.searchShelterNta(filters).then(_ => _.data.forEach(d => {
        if (!index[d.id]) index[d.id] = {nta: {} as any}
        index[d.id].nta = d
      })),
      api.kobo.answer.searchShelterTa(filters).then(_ => _.data.forEach(d => {
        if (!d.drc_reference_number) {
          console.log('no reference number for', d)
          return
        }
        if (!index[+d.drc_reference_number.replace(/[^\\d]/, '')]) index[d.id] = {nta: {} as any}
        index[d.id].ta = d
      })),
    ])
    // console.log(index)
    return Enum.entries(index).filter(([k, v]) => !!v.nta).map(([k, v]) => ({id: k, ...v}))
  })

  useEffect(() => {
    _data.fetch()
  }, [])

  return (
    <Panel>
      <Sheet
        data={_data.entity}
        loading={_data.loading}
        columns={[
          {
            id: 'Id',
            head: 'ID',
            type: 'string',
            renderValue: _ => _.id,
            render: _ => _.id,
          },
          {
            type: 'date',
            id: 'submissionTime',
            head: m.submissionTime,
            renderValue: _ => _.nta.submissionTime,
            render: _ => formatDate(_.nta.submissionTime),
          },
          {
            id: 'oblast',
            type: 'select_one',
            options: () => Enum.entries(Shelter_NTAOptions.ben_det_oblast).map(([value, label]) => ({value, label})),
            head: m.oblast,
            render: _ => _.nta.ben_det_oblast,
            renderValue: _ => _.nta.ben_det_oblast,
          },
          {
            id: 'raion',
            type: 'select_one',
            options: () => Enum.entries(Shelter_NTAOptions.ben_det_raion).map(([value, label]) => ({value, label})),
            head: m.raion,
            render: _ => _.nta.ben_det_raion,
            renderValue: _ => _.nta.ben_det_raion,
          },
          {
            id: 'owner_tenant_type',
            type: 'select_one',
            head: m._shelter.owner,
            options: () => Enum.entries(Shelter_NTAOptions.owner_tenant_type).map(([value, label]) => ({value, label})),
            renderValue: _ => _.nta.owner_tenant_type,
            render: _ => _translateNTa.translateChoice('owner_tenant_type', _.nta.owner_tenant_type),
          },
          {
            id: 'document_type',
            type: 'select_one',
            head: m._shelter.documentType,
            options: () => Enum.entries(Shelter_NTAOptions.document_type).map(([value, label]) => ({value, label})),
            renderValue: _ => _.nta.document_type,
            render: _ => _.nta.document_type,
          },
          {
            id: 'dwelling_type',
            type: 'select_one',
            head: m._shelter.accommodation,
            options: () => Enum.entries(Shelter_NTAOptions.dwelling_type).map(([value, label]) => ({value, label})),
            renderValue: _ => _.nta.dwelling_type,
            render: _ => _.nta.dwelling_type,
          },
          {
            id: 'ownership_verification',
            type: 'select_one',
            align: 'center',
            width: 0,
            head: m._shelter.ownershipDocumentExist,
            options: () => Enum.entries(Shelter_NTAOptions.pregnant_lac).map(([value, label]) => ({value, label})),
            renderValue: _ => _.nta.ownership_verification,
            render: _ => fnSwitch(_.nta.ownership_verification, {
              yes: <TableIcon color="success">check_circle</TableIcon>,
              no: <TableIcon color="error">clear_circle</TableIcon>,
            }, () => undefined),
          },
          {
            id: 'ownership_verification_doc',
            type: 'select_one',
            head: m._shelter.ownershipDocument,
            options: () => [{value: 'exist', label: m.exist}, {value: 'not_exist', label: m.notExist}],
            renderValue: _ => _.nta.doc_available_yes1 ? 'exist' : 'not_exist',
            render: _ =>
              <Box component="span" sx={{'& > :not(:last-child)': {marginRight: '2px'}}}>
                <KoboAttachedImg attachments={_.nta.attachments} fileName={_.nta.doc_available_yes1}/>
                <KoboAttachedImg attachments={_.nta.attachments} fileName={_.nta.doc_available_yes2}/>
                <KoboAttachedImg attachments={_.nta.attachments} fileName={_.nta.doc_available_yes3}/>
                <KoboAttachedImg attachments={_.nta.attachments} fileName={_.nta.doc_available_yes4}/>
                <KoboAttachedImg attachments={_.nta.attachments} fileName={_.nta.doc_available_yes5}/>
              </Box>,
          },
          {
            id: 'damage_score',
            type: 'number',
            head: m._shelter.scoreDamage,
            renderValue: _ => Utils.add(_.nta.apt_score, _.nta.hh_score),
            render: _ => Utils.add(_.nta.apt_score, _.nta.hh_score),
          },
          {
            id: 'displ_score',
            type: 'number',
            head: m._shelter.scoreDisplacement,
            renderValue: _ => _.nta.displ_score,
            render: _ => _.nta.displ_score,
          },
          {
            id: 'socio_score',
            type: 'number',
            head: m._shelter.scoreSocio,
            renderValue: _ => _.nta.socio_score,
            render: _ => _.nta.socio_score,
          },
          {
            id: 'total',
            type: 'number',
            head: m._shelter.total,
            renderValue: _ => Utils.add(_.nta.apt_score, _.nta.hh_score, _.nta.displ_score, _.nta.socio_score),
            render: _ => Utils.add(_.nta.apt_score, _.nta.hh_score, _.nta.displ_score, _.nta.socio_score),
          },
          {
            id: 'validation',
            type: 'select_one',
            head: m._shelter.validationStatus,
            // TODO(Alex) handle undefined value
            options: () => [{value: '', label: ''}, ...shelterTaTagsKeys.map(_ => ({value: _, label: _}))],
            renderValue: _ => _.nta.tags?.validation ?? '',
            render: _ => (
              <AaSelect
                defaultValue={_.nta?.tags?.validation ?? ''}
                sx={{border: 'none'}}
                onChange={(validation) => {
                  _update.call({
                    formId: kobo.drcUa.form.shelterNTA,
                    answerId: _.id,
                    tags: {validation}
                  })
                }
                }
                options={[
                  {value: ShelterTagValidation.Accepted, children: <TableIcon color="success">check_circle</TableIcon>},
                  {value: ShelterTagValidation.Rejected, children: <TableIcon color="error">cancel</TableIcon>},
                  {value: ShelterTagValidation.Pending, children: <TableIcon color="warning">schedule</TableIcon>},
                ]}
              />
            ),
          },
          {
            id: 'TA',
            type: 'select_one',
            options: () => [{value: 'true', label: 'true'}, {value: 'false', label: 'false'}],
            head: 'TA',
            render: _ => _.ta ? '✅' : '🛑',
            renderValue: _ => _.ta ? 'true' : 'false',
          },
          {
            id: 'progress',
            type: 'select_one',
            options: () => shelterProgressKeys.map(_ => ({value: _, label: _})),
            render: _ => (
              <AaSelect
                defaultValue={_.ta?.tags?.progress ?? ''}
                sx={{border: 'none'}}
                onChange={(progress) => {
                  _update.call({
                    formId: kobo.drcUa.form.shelterTA,
                    answerId: _.id,
                    tags: {progress: progress}
                  })
                }
                }
                options={shelterProgressKeys.map(_ => ({
                  value: _, children: m._shelter.progress[_],
                }))
                }
              />
            ),
          },
        ]}
      />
    </Panel>
  )
}