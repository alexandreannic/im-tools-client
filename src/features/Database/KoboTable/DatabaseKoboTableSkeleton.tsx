import {Box, Skeleton} from '@mui/material'
import {mapFor} from '@alexandreannic/ts-utils'
import React, {memo} from 'react'

export const DatabaseKoboTableSkeleton = memo(() => {
  return (
    <>
      <Box>
        <Skeleton sx={{mx: 1, height: 54}}/>
      </Box>
      <table className="table borderY">
        <tbody>
        {mapFor(20, i => (
          <tr className="tr" key={i}>
            {mapFor(14, i => (
              <td className="td" key={i}><Skeleton sx={{mx: 1}}/></td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    </>
  )
})