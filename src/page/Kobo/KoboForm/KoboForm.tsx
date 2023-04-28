import {useConfig} from '../../../core/context/ConfigContext'
import {useFetcher, useSetState} from '@alexandreannic/react-hooks-lib'
import {useParams} from 'react-router'
import React, {useEffect} from 'react'
import {Page} from '../../../shared/Page'
import {Enum} from '@alexandreannic/ts-utils'
import {Box, GlobalStyles} from '@mui/material'
import {muiTheme} from '../../../core/theme'

const generalStyles = <GlobalStyles
  styles={{
    '.table': {
      borderTop: `1px solid ${muiTheme().palette.divider}`,
      borderLeft: `1px solid ${muiTheme().palette.divider}`,
    },
    '.th': {
      resize: 'horizontal',
    },
    '.tr': {
      display: 'flex',
      borderBottom: `1px solid ${muiTheme().palette.divider}`,
    },
    '.td': {
      display: 'flex',
      alignItems: 'center',
      height: 30,
      padding: '2px 0 2px 2px',
      borderRight: `1px solid ${muiTheme().palette.divider}`,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      minWidth: 100,
      width: 100,
    }
  }}
/>

export const KoboForm = () => {
  const {api} = useConfig()
  const {serverId, formId} = useParams()
  const _form = useFetcher(() => api.koboApi.getForm(serverId!, formId!))
  const _answers = useFetcher(() => api.koboApi.getAnswersFromKoboApi({serverId: serverId!, formId: formId!}))

  useEffect(() => {
    _form.fetch()
    _answers.fetch()
  }, [])

  const widths = useSetState()

  console.log(_answers.entity)
  return (
    <Page loading={_answers.loading} sx={{maxWidth: 2000}}>
      {serverId} / {formId}

      {generalStyles}
      <Box sx={{overflowY: 'scroll'}}>
        {_form.entity && (
          <div className="table">
            <div className="tr">
              {_form.entity.content.survey.map(v =>
                <div className="th td" onResize={console.log} key={v.name}>{v.name}</div>
              )}
            </div>
            {_answers.entity && _answers.entity.data.map(x =>
              <div className="tr">
                {Enum.entries(x).map(([k, v], i) =>
                  <div className="td" key={i}>{JSON.stringify(v)}</div>
                )}
              </div>
            )}
          </div>
        )}
      </Box>
    </Page>
  )
}
