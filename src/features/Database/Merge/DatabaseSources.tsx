import {Page} from '../../../shared/Page'
import {useAppSettings} from '../../../core/context/ConfigContext'
import {koboServerId} from '../../../koboFormId'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useEffect, useState} from 'react'
import {KoboFormListButton} from './KoboFormList'
import {UUID} from '../../../core/type'
import {useFetchers} from '@/alexlib-labo/useFetchersFn'
import {map} from '@alexandreannic/ts-utils'
import {Box} from '@mui/material'

export const DatabaseSources = () => {
  const {api} = useAppSettings()
  const _allKoboForm = useFetcher(() => api.koboApi.getForms(koboServerId.prod))
  const _sources = useFetchers((formId: UUID) => api.koboApi.getForm(koboServerId.prod, formId), {
    requestKey: ([_]) => _
  })
  const [mainSource, setMainSource] = useState<UUID | undefined>()

  useEffect(() => {
    if (mainSource)
      _sources.fetch({}, mainSource)
  }, [mainSource])

  useEffect(() => {
    _allKoboForm.fetch()
    // _old.fetch()
  }, [])

  return (
    <Page>
      {_allKoboForm.entity && (
        <>
          <KoboFormListButton forms={_allKoboForm.entity} onChange={_ => setMainSource(_)}/>
          {map(_sources.get(mainSource!), source => (
            <>
              {source.content.survey.map(q => (
                <Box key={q.name}>{q.name}</Box>
              ))}
            </>
          ))}
        </>
      )}
    </Page>
  )
}