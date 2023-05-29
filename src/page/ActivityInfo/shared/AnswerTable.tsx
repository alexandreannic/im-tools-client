import {BoxProps} from '@mui/material'
import React from 'react'
import {Sheet} from '../../../shared/Sheet/Sheet'

export const AnswerTable = <T extends Record<string, any>, >({
  answers,
  ...props
}: {
  answers: T[]
} & BoxProps) => {
  console.log('answers', answers)
  return (
    <Sheet<T>
      {...props}
      data={answers}
      columns={Object.keys(answers[0]).map(k => ({
        id: k,
        head: k,
        render: _ => JSON.stringify(_[k]),
      }))}
    />
  )
}
