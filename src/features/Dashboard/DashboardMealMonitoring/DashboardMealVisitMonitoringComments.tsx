import {Box, Icon} from '@mui/material'
import {Txt} from 'mui-extension'
import {MealVisitMonitoringOptions} from '@/core/koboModel/MealVisitMonitoring/MealVisitMonitoringOptions'
import {ViewMoreText} from '@/shared/ViewMoreText'
import {_Arr, mapFor} from '@alexandreannic/ts-utils'
import {KoboAttachedImg} from '@/shared/TableImg/KoboAttachedImg'
import React, {memo, ReactNode, useState} from 'react'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {MealVisitMonitoring} from '@/core/koboModel/MealVisitMonitoring/MealVisitMonitoring'
import {useI18n} from '@/core/i18n'
import {AaBtn} from '@/shared/Btn/AaBtn'

const pageSize = 5

export const DashboardMealVisitMonitoringComments = memo(({
  data,
}: {
  data: _Arr<{
    id: string
    title: string
    date?: Date
    desc?: string
    children?: ReactNode
  }>
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
            <Txt block bold size="big">{(MealVisitMonitoringOptions.mdp as any)[row.title]}</Txt>
            <Txt color="hint">{formatDate(row.date)}</Txt>
          </Box>
          <Txt block color="hint" sx={{mb: 1}}>
            <ViewMoreText limit={210} children={row.desc ?? m.noComment}/>
          </Txt>
          <Box sx={{display: 'flex', flexWrap: 'wrap', '& > *': {mb: 1, mr: 1}}}>
            {row.children}
          </Box>
        </Box>
      ))}
      {limit < data.length && (
        <AaBtn variant="outlined" sx={{margin: 'auto'}} color="primary" onClick={() => setLimit(_ => _ + pageSize)}>{m.viewNMore(pageSize)}</AaBtn>
      )}
    </Box>
  )
})