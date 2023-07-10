import {useAppSettings} from '@/core/context/ConfigContext'
import {KoboId} from '@/core/sdk/server/kobo/Kobo'
import {AppFeatureId} from '@/features/appFeatureId'
import React, {ReactElement, useEffect, useMemo} from 'react'
import {Modal, Txt} from 'mui-extension'
import {Autocomplete, Box, OutlinedInput} from '@mui/material'
import {AaInput} from '@/shared/ItInput/AaInput'
import {AaSelect} from '@/shared/Select/Select'
import {Controller, useForm} from 'react-hook-form'
import {AccessLevel} from '@/core/sdk/server/access/Access'
import {Enum, map} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {useFetchers} from '@/features/Database/DatabaseMerge/useFetchersFn'
import {useDatabaseContext} from '@/features/Database/DatabaseContext'

interface Form {
  email: string
  level: AccessLevel
  filters: Record<string, string[]>
}

export const DatabaseAccess = ({
  serverId,
  koboFormId,
  children,
}: {
  children: ReactElement
  serverId: string
  koboFormId: KoboId
}) => {
  const {m} = useI18n()
  const {api} = useAppSettings()
  const _formSchemas = useDatabaseContext().formSchemas
  const requestInConstToFixTsInference = (databaseId: KoboId) => api.access.searchByFeature(AppFeatureId.databases)
    .then(_ => _.filter(_ => _.params?.database === databaseId))
  const _access = useFetchers(requestInConstToFixTsInference)
  const {control, register} = useForm<Form>()

  const schema = _formSchemas.get(koboFormId)?.content.survey
  const questions = useMemo(() => {
    return map(schema, schema => schema.filter(_ =>
      _.type === 'text' ||
      _.type === 'select_multiple' ||
      _.type === 'select_one'
    ))
  }, [schema])

  useEffect(() => {
    _formSchemas.fetch({}, serverId, koboFormId)
    _access.fetch({}, koboFormId)
  }, [koboFormId])

  return (
    <Modal content={
      <>
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <AaInput autoFocus {...register('email', {pattern: {value: /@drc.ngo$/, message: m.invalid}})}/>
          <Controller
            name="level"
            defaultValue={AccessLevel.Read}
            control={control}
            render={({field}) => (
              <AaSelect<AccessLevel>
                multiple={false}
                value={field.value as AccessLevel ?? ''}
                onChange={_ => field.onChange({target: {value: _}} as any)}
                options={Enum.values(AccessLevel).map(_ => ({children: _, value: _}))}/>
            )}
          />
          <Autocomplete
            loading={!questions}
            onChange={console.log}
            options={questions ?? []}
            renderOption={(props, _) => <Txt truncate>{_.label?.[0]?.replace(/<[^>]+>/g, '') ?? _.name}</Txt>}
            renderInput={({InputProps, ...props}) => <AaInput sx={{minWidth: 300}} {...InputProps} {...props}/>}
          />
          {_access.get()?.map(_ =>
            <Box key={_.id}></Box>
          )}
        </Box>
      </>
    }>
      {children}
    </Modal>
  )
}