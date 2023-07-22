import {useAppSettings} from '@/core/context/ConfigContext'
import {KoboId} from '@/core/sdk/server/kobo/Kobo'
import {AppFeatureId} from '@/features/appFeatureId'
import React, {ReactElement, useCallback, useMemo} from 'react'
import {Modal, Txt} from 'mui-extension'
import {Autocomplete, Box, Chip, createFilterOptions} from '@mui/material'
import {AaInput} from '@/shared/ItInput/AaInput'
import {AaSelect} from '@/shared/Select/Select'
import {Controller, useForm} from 'react-hook-form'
import {AccessLevel, KoboDatabaseFeatureParams} from '@/core/sdk/server/access/Access'
import {Arr, Enum, map} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {useFetchers} from '@/features/Database/DatabaseMerge/useFetchersFn'
import {useDatabaseContext} from '@/features/Database/DatabaseContext'
import {KoboApiForm} from '@/core/sdk/server/kobo/KoboApi'
import {useSession} from '@/core/Session/SessionContext'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {DrcJob, DrcOffice} from '@/core/drcJobTitle'
import {getKoboLabel} from '@/shared/Sheet/KoboDatabase'
import {useAsync} from '@/features/useAsync'
import {useAaToast} from '@/core/useToast'
import {useEffectFn} from '@alexandreannic/react-hooks-lib'

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

export const DatabaseAccessForm = ({
  formId,
  children,
  form,
}: {
  children: ReactElement,
  formId: KoboId,
  form: KoboApiForm
}) => {
  const langIndex = 0
  const survey = form.content.survey

  const {m} = useI18n()
  const {toastHttpError} = useAaToast()
  const {api} = useAppSettings()

  const _addAccess = useAsync(api.access.add)
  const requestInConstToFixTsInference = (databaseId: KoboId) => api.access.searchByFeature(AppFeatureId.kobo_database)
    .then(_ => _.filter(_ => _.params?.koboFormId === databaseId))
  const _access = useFetchers(requestInConstToFixTsInference)

  useEffectFn(_addAccess.getError(), toastHttpError)
  useEffectFn(_access.getError(), toastHttpError)

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: {errors, isValid},
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

  return (
    <Modal
      loading={_addAccess.getLoading()}
      confirmDisabled={!isValid}
      onConfirm={(_, close) => handleSubmit(_ => {
        submit(_)
        close()
      })()}
      content={
        <Box sx={{width: 400}}>
          {isValid ? 'true' : 'false'}
          <Txt block color="hint" fontSize="small" sx={{mb: .5}}>{m.Access.giveAccessBy}</Txt>
          <Controller
            name="selectBy"
            rules={{required: {value: true, message: m.required}}}
            control={control}
            render={({field}) => (
              <ScRadioGroup
                sx={{mb: 2.5}}
                dense
                error={!!errors.selectBy}
                {...field}
                onChange={e => {
                  setValue('drcJob', undefined)
                  setValue('drcOffice', undefined)
                  setValue('email', undefined)
                  field.onChange(e)
                }}
              >
                <ScRadioGroupItem value="email" title={m.email}/>
                <ScRadioGroupItem value="job" title={m.Access.jobAndOffice}/>
              </ScRadioGroup>
            )}
          />
          {watch('selectBy') === 'job' && (
            <>
              <Controller
                name="drcJob"
                rules={{required: {value: true, message: m.required}}}
                control={control}
                render={({field: {onChange, ...field}}) => (
                  <Autocomplete
                    {...field}
                    onChange={(e: any, _) => _ && onChange(_)}
                    sx={{mb: 2.5}}
                    loading={!questions}
                    options={Enum.values(DrcJob) ?? []}
                    // renderOption={(props, _) => <Txt truncate>{_.label?.[0]?.replace(/<[^>]+>/g, '') ?? _.name}</Txt>}
                    renderInput={({InputProps, ...props}) => <AaInput label={m.drcJob} {...InputProps} {...props}/>}
                  />
                )}
              />
              <Controller
                name="drcOffice"
                rules={{required: {value: true, message: m.required}}}
                control={control}
                render={({field: {onChange, ...field}}) => (
                  <AaSelect<DrcOffice>
                    {...field}
                    label={m.drcOffice}
                    onChange={_ => onChange(_)}
                    options={Enum.values(DrcOffice)}
                    sx={{mb: 2.5}}
                  />
                )}
              />
            </>
          )}
          {watch('selectBy') === 'email' && (
            <AaInput
              sx={{mb: 2.5}}
              label={m.drcEmail}
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email', {required: false, pattern: {value: /(@drc.ngo$|\s)/, message: m.invalidEmail}})}
            />
          )}
          <Txt block color="hint" fontSize="small" sx={{mb: .5}}>{m.accessLevel}</Txt>
          <Controller
            name="accessLevel"
            defaultValue={AccessLevel.Read}
            control={control}
            render={({field}) => (
              <ScRadioGroup<AccessLevel>
                sx={{mb: 2.5}}
                error={!!errors.accessLevel}
                dense
                {...field}
                // onChange={_ => field.onChange({target: {value: _}} as any)}
              >
                {Enum.values(AccessLevel).map(level =>
                  <ScRadioGroupItem value={level} key={level} title={level}/>
                )}
              </ScRadioGroup>
            )}
          />
          <Controller
            name="question"
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, value, ...field}}) => (
              <Autocomplete<string>
                {...field}
                sx={{mb: 2.5}}
                value={value}
                filterOptions={filterOptions(indexQuestion)}
                onChange={(e, _) => {
                  if (_) {
                    onChange(_)
                    setValue('questionAnswer', [])
                  }
                }}
                loading={!questions}
                options={questions?.map(_ => _.name) ?? []}
                renderInput={({InputProps, ...props}) => <AaInput
                  {...InputProps}
                  {...props}
                  label={m.question}
                  error={!!errors.question}
                  helperText={errors.question && m.required}
                />}
                renderOption={(props, option) => (
                  <Box component="li" key={option} {...props}>
                    <div>
                      <Txt block>{getKoboLabel(indexQuestion[option][0], langIndex).replace(/<[^>]+>/g, '') ?? option}</Txt>
                      <Txt color="disabled">{option}</Txt>
                    </div>
                  </Box>
                )}
              />
            )}
          />
          {map(watch('question'), question => {
            const listName = indexQuestion[question][0].select_from_list_name
            const options = indexOptionsByListName[listName!]
            return (
              <Controller
                name="questionAnswer"
                rules={{
                  required: true,
                }}
                control={control}
                render={({field}) => (
                  <Autocomplete
                    {...field}
                    freeSolo
                    sx={{mb: 2.5}}
                    filterOptions={filterOptions(indexOptionsByName)}
                    multiple
                    onChange={(e, _) => _ && field.onChange(_)}
                    loading={!questions}
                    disableCloseOnSelect
                    options={options?.map(_ => _.name) ?? []}
                    // options={options?.map(_ => ({children: getKoboLabel(_, langIndex), value: _.name}))}
                    renderInput={({InputProps, ...props}) => <AaInput
                      {...InputProps}
                      {...props}
                      label={m.answer}
                      error={!!errors.questionAnswer}
                      helperText={errors.questionAnswer && m.required}
                    />}
                    renderTags={(value: string[], getTagProps) =>
                      value.map((option: string, index: number) => (
                        <Chip
                          size="small"
                          variant="outlined"
                          label={option}
                          {...getTagProps({index})}
                        />
                      ))
                    }
                    renderOption={(props, option) => (
                      <Box component="li" key={option} {...props}>
                        <div>
                          <Txt block>{getKoboLabel(indexOptionsByName[option][0], langIndex).replace(/<[^>]+>/g, '') ?? option}</Txt>
                          <Txt color="disabled">{option}</Txt>
                        </div>
                      </Box>
                    )}
                  />
                )}
              />
            )
          })}
        </Box>
      }
    >
      {children}
    </Modal>
  )
}
