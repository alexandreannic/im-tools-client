import {useConfig} from '../../../core/context/ConfigContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useParams} from 'react-router'
import {useEffect} from 'react'
import {Page} from '../../../shared/Page'

export const KoboForm = () => {
  const {api} = useConfig()
  const {serverId, formId} = useParams()
  const _form = useFetcher(() => api.koboForm.getForm(serverId!, formId!))

  useEffect(() => {
    _form.fetch()
  }, [])

  console.log(_form.entity)
  return (
    <Page loading={_form.loading}>
      {serverId} / {formId}
    </Page>
  )
}
