import {Box} from '@mui/material'
import {Txt} from 'mui-extension'
import {ViewMoreText} from '@/shared/ViewMoreText'
import {Seq} from '@alexandreannic/ts-utils'
import React, {memo, ReactNode, useState} from 'react'
import {useI18n} from '@/core/i18n'
import {AaBtn} from '@/shared/Btn/AaBtn'

export interface CommentsPanelProps {
  pageSize?: number
  data: Seq<{
    id: number | string
    title?: ReactNode
    date?: Date
    desc?: string
    children?: ReactNode
  }>
}

export const CommentsPanel = memo(({
  data,
  pageSize = 5,
}: CommentsPanelProps) => {
  const [limit, setLimit] = useState(pageSize)
  const {m, formatDateTime} = useI18n()
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
            <Txt block bold size="big">{row.title}</Txt>
            <Txt color="hint">{formatDateTime(row.date)}</Txt>
          </Box>
          {row.desc && (
            <Txt block color="hint" sx={{mb: 1}}>
              <ViewMoreText limit={210} children={row.desc}/>
            </Txt>
          )}
          {row.children}
        </Box>
      ))}
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {limit > pageSize && (
          <AaBtn icon="remove" variant="outlined" sx={{mr: 1}} color="primary" onClick={() => setLimit(_ => _ - pageSize)}>{m.viewNMore(pageSize)}</AaBtn>
        )}
        {limit < data.length && (
          <AaBtn icon="add" variant="outlined" color="primary" onClick={() => setLimit(_ => _ + pageSize)}>{m.viewNMore(pageSize)}</AaBtn>
        )}
      </Box>
    </Box>
  )
})