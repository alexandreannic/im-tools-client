import {KoboFormProtHH} from '../../core/koboForm/koboFormProtHH'
import {Enum, map} from '@alexandreannic/ts-utils'
import {Box, BoxProps} from '@mui/material'
import React from 'react'

export const AnswerTable = ({
  answers,
  ...props
}: {
  answers: KoboFormProtHH.Answer[]
} & BoxProps) => {
  return (
    <Box {...props}>
      {map(answers[0], firstRow => (
        <table className="sheet">
          {Enum.keys(firstRow).map((column, i) => (
            <tr key={i}>
              <td>{column}</td>
              {answers.map((_, i) => (
                <td key={i}>{JSON.stringify(_[column])}</td>
              ))}
            </tr>
          ))}
        </table>
      ))}
    </Box>
  )
}
