import {BoxProps} from '@mui/material'
import React from 'react'
import {Sheet} from '../../../shared/Sheet/Sheet'
import {Enum} from '@alexandreannic/ts-utils'

export const AnswerTable = <T extends Record<string, any>, >({
  answers,
  ...props
}: {
  answers: T[]
} & BoxProps) => {
  return (
    <Sheet<T>
      {...props}
      data={answers}
      columns={Enum.keys(answers[0]).map(k => ({
        id: k,
        head: k,
        render: _ => JSON.stringify(_[k]),
      }))}
    />
  )
}
