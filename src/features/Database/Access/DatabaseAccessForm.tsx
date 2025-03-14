import {useAppSettings} from '@/core/context/ConfigContext'
import {KoboId} from '@/core/sdk/server/kobo/Kobo'
import {AppFeatureId} from '@/features/appFeatureId'
import React, {ReactElement, useCallback, useMemo} from 'react'
import {Modal, Txt} from 'mui-extension'
import {Autocomplete, Box, Chip, createFilterOptions} from '@mui/material'
import {IpInput} from '@/shared/Input/Input'
import {Controller, useForm} from 'react-hook-form'
import {KoboDatabaseAccessParams} from '@/core/sdk/server/access/Access'
import {map, seq} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {KoboSchema} from '@/core/sdk/server/kobo/KoboApi'
import {useAsync} from '@/shared/hook/useAsync'
import {useIpToast} from '@/core/useToast'
import {useEffectFn} from '@alexandreannic/react-hooks-lib'
import {AccessForm, IAccessForm} from '@/features/Access/AccessForm'
import {getKoboLabel} from '@/features/Database/KoboTable/DatabaseKoboTableContent'
import {AccessFormSection} from '@/features/Access/AccessFormSection'
import {Utils} from '@/utils/utils'
import {useFetcher} from '@/shared/hook/useFetcher'

interface Form extends IAccessForm {
  question?: string
  questionAnswer?: string[]
}

export const DatabaseAccessForm = ({
  formId,
  children,
  form,
  onAdded,
}: {
  onAdded?: () => void,
  children: ReactElement,
  formId: KoboId,
  form: KoboSchema
}) => {
  const langIndex = 0
  const survey = form.content.survey

  const {m} = useI18n()
  const {toastHttpError} = useIpToast()
  const {api} = useAppSettings()

  const _addAccess = useAsync(api.access.create)
  const requestInConstToFixTsInference = (databaseId: KoboId) => api.access.search({featureId: AppFeatureId.kobo_database})
    .then(_ => _.filter(_ => _.params?.koboFormId === databaseId))
  const _access = useFetcher(requestInConstToFixTsInference)

  useEffectFn(_addAccess.error, toastHttpError)
  useEffectFn(_access.error, toastHttpError)

  const accessForm = useForm<Form>()

  const {
    indexQuestion,
    indexOptionsByListName,
    indexOptionsByName,
  } = useMemo(() => {
    return {
      indexQuestion: seq(survey).groupBy(_ => _.name),
      indexOptionsByListName: seq(form.content.choices).groupBy(_ => _.list_name),
      indexOptionsByName: seq(form.content.choices).groupBy(_ => _.name),
    }
  }, [form])

  const questions = useMemo(() => {
    return map(survey, schema => schema.filter(_ =>
      _.type === 'text' ||
      _.type === 'select_multiple' ||
      _.type === 'select_one'
    ))
  }, [survey])

  const filterOptions = useCallback((index: Record<string, {
    name: string,
    label?: string[]
  }[]>) => createFilterOptions({
    stringify: (optionName: string) => getKoboLabel(index[optionName][0], langIndex)
  }), [form])

  const submit = ({selectBy, question, questionAnswer, ...f}: Form) => {
    _addAccess.call({
      ...Utils.nullValuesToUndefined(f),
      featureId: AppFeatureId.kobo_database,
      params: KoboDatabaseAccessParams.create({
        koboFormId: formId,
        filters: question && questionAnswer ? {[question]: questionAnswer} : undefined
      })
    }).then(onAdded)
  }

  return (
    <Modal
      loading={_addAccess.loading}
      confirmDisabled={!accessForm.formState.isValid}
      onConfirm={(_, close) => accessForm.handleSubmit(_ => {
        submit(_)
        close()
      })()}
      content={
        <Box sx={{width: 500}}>
          <AccessForm form={accessForm}/>
          <AccessFormSection icon="filter_alt" label={m.filter}>
            <Controller
              name="question"
              control={accessForm.control}
              render={({field: {onChange, value, ...field}}) => (
                <Autocomplete
                  {...field}
                  value={value}
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason === 'reset') {
                      onChange('')
                    } else {
                      onChange(newInputValue)
                    }
                  }}
                  filterOptions={filterOptions(indexQuestion)}
                  onChange={(e, _) => {
                    if (_) {
                      onChange(_)
                      accessForm.setValue('questionAnswer', [])
                    }
                  }}
                  loading={!questions}
                  options={questions?.map(_ => _.name) ?? []}
                  renderInput={({InputProps, ...props}) => <IpInput
                    {...InputProps}
                    {...props}
                    label={m.question}
                    error={!!accessForm.formState.errors.question}
                    helperText={accessForm.formState.errors.question && m.required}
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
            {map(accessForm.watch('question'), question => {
              if (question === '') return
              const listName = indexQuestion[question]?.[0]?.select_from_list_name
              const options = indexOptionsByListName[listName!]
              return (
                <Controller
                  name="questionAnswer"
                  // rules={{
                  //   required: accessForm.watch('question') !== undefined && accessForm.watch('question') === '',
                  control={accessForm.control}
                  render={({field}) => (
                    <Autocomplete
                      {...field}
                      onReset={() => accessForm.setValue('questionAnswer', [])}
                      freeSolo
                      filterOptions={filterOptions(indexOptionsByName)}
                      multiple
                      onChange={(e, _) => _ && field.onChange(_)}
                      loading={!questions}
                      disableCloseOnSelect
                      options={options?.map(_ => _.name) ?? []}
                      // options={options?.map(_ => ({children: getKoboLabel(_, langIndex), value: _.name}))}
                      renderInput={({InputProps, ...props}) => <IpInput
                        {...InputProps}
                        {...props}
                        label={m.answer}
                        error={!!accessForm.formState.errors.questionAnswer}
                        helperText={accessForm.formState.errors.questionAnswer && m.required}
                      />}
                      renderTags={(value: string[], getTagProps) =>
                        value.map((option: string, index: number) => (
                          // eslint-disable-next-line react/jsx-key
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
          </AccessFormSection>
        </Box>
      }
    >
      {children}
    </Modal>
  )
}
