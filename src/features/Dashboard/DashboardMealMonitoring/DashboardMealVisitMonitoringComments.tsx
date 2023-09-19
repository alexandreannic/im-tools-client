import {Box, Icon} from '@mui/material'
import {Txt} from 'mui-extension'
import {MealVisitMonitoringOptions} from '@/core/koboModel/MealVisitMonitoring/MealVisitMonitoringOptions'
import {ViewMoreText} from '@/shared/ViewMoreText'
import {_Arr, mapFor} from '@alexandreannic/ts-utils'
import {KoboAttachedImg} from '@/shared/TableImg/KoboAttachedImg'
import React, {memo, useState} from 'react'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {MealVisitMonitoring} from '@/core/koboModel/MealVisitMonitoring/MealVisitMonitoring'
import {useI18n} from '@/core/i18n'
import {AaBtn} from '@/shared/Btn/AaBtn'

const pageSize = 5
const imgSize = 90

export const DashboardMealVisitMonitoringComments = memo(({
  data,
}: {
  data: _Arr<KoboAnswer<MealVisitMonitoring>>
}) => {
  const [limit, setLimit] = useState(pageSize)
  const {m, formatDate} = useI18n()
  return (
    <Box sx={{maxHeight: '650px', overflowY: 'auto'}}>
      {data.slice(0, limit).map(row => (
        <Box key={row.id} sx={{
          pb: 2,
          pr: 1,
          '&:not(:last-of-type)': {
            mb: 2,
            borderBottom: t => `1px solid ${t.palette.divider}`
          }
        }}>
          <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Txt block bold size="big">{(MealVisitMonitoringOptions.mdp as any)[row.mdp]}</Txt>
            <Txt color="hint">{formatDate(row.mdd ?? row.end)}</Txt>
          </Box>
          <Txt block color="hint" sx={{mb: 1}}>
            <ViewMoreText limit={210} children={row.fcpc ?? m.noComment}/>
          </Txt>
          <Box sx={{display: 'flex', flexWrap: 'wrap', '& > *': {mb: 1, mr: 1}}}>
            {row.fcpl && (
              <Box component="a" target="_blank" href={row.fcpl} sx={{
                height: imgSize,
                width: imgSize,
                display: 'flex',
                alignItems: 'center',
                borderRadius: '6px',
                justifyContent: 'center',
                color: t => t.palette.primary.main,
                border: t => `1px solid ${t.palette.divider}`
              }}>
                <Icon>open_in_new</Icon>
              </Box>
            )}
            {mapFor(10, i =>
              <KoboAttachedImg key={i} attachments={row.attachments} size={imgSize} fileName={(row as any)['fcp' + (i + 1)]}/>
            )}
          </Box>
        </Box>
      ))}
      {limit < data.length && (
        <AaBtn variant="outlined" sx={{margin: 'auto'}} color="primary" onClick={() => setLimit(_ => _ + pageSize)}>{m.viewNMore(pageSize)}</AaBtn>
      )}
    </Box>
  )
})