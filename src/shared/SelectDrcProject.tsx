import React from 'react'
import {DrcProject, drcProjects} from '@/core/drcUa'
import {AaSelectMultiple, AaSelectMultipleProps} from '@/shared/Select/AaSelectMultiple'
import {AaSelectSingle, AaSelectSingleProps} from '@/shared/Select/AaSelectSingle'
import {AaSelectSimple} from '@/shared/Select/Select'
import {useI18n} from '@/core/i18n'


export const SelectDrcProjects = (props: Omit<AaSelectMultipleProps<DrcProject>, 'options'> & {
  options?: DrcProject[]
}) => {
  const {m} = useI18n()
  return (
    <AaSelectMultiple<DrcProject>
      placeholder={m.project}
      options={drcProjects}
      {...props}
    />
  )
}

export const SelectDrcProject = (props: Omit<AaSelectSingleProps<DrcProject>, 'options'> & {
  options?: DrcProject[]
}) => {
  const {m} = useI18n()
  return (
    <AaSelectSingle<DrcProject>
      placeholder={m.project}
      options={drcProjects}
      {...props}
    />
  )
}