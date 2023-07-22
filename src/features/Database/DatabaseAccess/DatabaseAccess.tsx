import {useAppSettings} from '@/core/context/ConfigContext'
import {KoboId} from '@/core/sdk/server/kobo/Kobo'
import {AppFeatureId} from '@/features/appFeatureId'
import React, {useCallback, useEffect, useMemo} from 'react'
import {Txt} from 'mui-extension'
import {Autocomplete, Box, Chip, createFilterOptions} from '@mui/material'
import {AaInput} from '@/shared/ItInput/AaInput'
import {AaSelect} from '@/shared/Select/Select'
import {Controller, useForm} from 'react-hook-form'
import {AccessLevel, KoboDatabaseFeatureParams} from '@/core/sdk/server/access/Access'
import {Arr, Enum, map} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {useFetchers} from '@/features/Database/DatabaseMerge/useFetchersFn'
import {useDatabaseContext} from '@/features/Database/DatabaseContext'
import {useParams} from 'react-router'
import {databaseUrlParamsValidation} from '@/features/Database/Database'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {Page} from '@/shared/Page'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {DrcJob, DrcOffice} from '@/core/drcJobTitle'
import {getKoboLabel} from '@/shared/Sheet/KoboDatabase'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {useAsync} from '@/features/useAsync'
import {Sheet} from '@/shared/Sheet/Sheet'
import {DatabaseAccessForm} from '@/features/Database/DatabaseAccess/DatabaseAccessForm'

interface Form {
  selectBy?: 'email' | 'job'
  email?: string
  drcOffice?: DrcOffice
  drcJob?: DrcJob
  accessLevel: AccessLevel
  question: string
  questionAnswer: string[]
  // filters: Record<string, string[]>
}


export const DatabaseAccessRoute = () => {
  const _formSchemas = useDatabaseContext().formSchemas
  const {serverId, formId} = databaseUrlParamsValidation.validateSync(useParams())
  const form = _formSchemas.get(formId)

  useEffect(() => {
    _formSchemas.fetch({force: true}, serverId, formId)
  }, [serverId, formId])

  return (
    <Page>
      {form && (
        <DatabaseAccess formId={formId} form={form}/>
      )}
    </Page>
  )

}

export const DatabaseAccess = ({
  formId,
  form,
}: {
  formId: KoboId,
  form: KoboApiForm
}) => {
  const langIndex = 0
  const survey = form.content.survey
  const {m} = useI18n()
  const {api} = useAppSettings()

  const _addAccess = useAsync(api.access.add)

  const requestInConstToFixTsInference = (databaseId: KoboId) => api.access.searchByFeature(AppFeatureId.kobo_database)
    .then(_ => _.filter(_ => _.params?.koboFormId === databaseId))
  const _access = useFetchers(requestInConstToFixTsInference)

  useEffect(() => {
    _access.fetch({}, formId)
  }, [formId])

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: {errors},
  } = useForm<Form>()

  const {
    indexQuestion,
    indexOptionsByListName,
    indexOptionsByName,
  } = useMemo(() => {
    return {
      indexQuestion: Arr(survey).groupBy(_ => _.name),
      indexOptionsByListName: Arr(form.content.choices).groupBy(_ => _.list_name),
      indexOptionsByName: Arr(form.content.choices).groupBy(_ => _.name),
    }
  }, [form])

  const questions = useMemo(() => {
    return map(survey, schema => schema.filter(_ =>
      _.type === 'text' ||
      _.type === 'select_multiple' ||
      _.type === 'select_one'
    ))
  }, [survey])

  const filterOptions = useCallback((index: Record<string, {name: string, label?: string[]}[]>) => createFilterOptions({
    stringify: (optionName: string) => getKoboLabel(index[optionName][0], langIndex)
  }), [form])

  const submit = (f: Form) => {
    _addAccess.call({
      accessLevel: f.accessLevel,
      drcJob: f.drcJob,
      drcOffice: f.drcOffice,
      email: f.email,
      featureId: AppFeatureId.kobo_database,
      params: KoboDatabaseFeatureParams.create({
        koboFormId: formId,
        filters: {[f.question]: f.questionAnswer}
      })
    })
  }
  console.log('_access.list', _access.list)

  return (
    <Box>
      <DatabaseAccessForm formId={formId} form={form}>
        <AaBtn>{m.grantAccess}</AaBtn>
      </DatabaseAccessForm>
      <Sheet data={_access.get()} columns={[
        {
          id: 'drcJob',
          head: m.drcJob,
          render: _ => _.drcJob,
        },
        {
          id: 'drcOffice',
          head: m.drcOffice,
          render: _ => _.drcOffice,
        },
        {
          id: 'email',
          head: m.email,
          render: _ => _.email,
        },
        {
          id: 'accessLevel',
          head: m.accessLevel,
          render: _ => _.accessLevel,
        },
      ]}/>
    </Box>
  )
}
