import React from 'react'
import {DrcProject, DrcProjectHelper} from '@/core/drcUa'
import {AaSelectMultiple, AaSelectMultipleProps} from '@/shared/Select/AaSelectMultiple'
import {AaSelectSingle, AaSelectSingleProps} from '@/shared/Select/AaSelectSingle'
import {useI18n} from '@/core/i18n'

export const SelectDrcProjects = (props: Omit<AaSelectMultipleProps<DrcProject>, 'options'> & {
  options?: DrcProject[]
}) => {
  const {m} = useI18n()
  return (
    <AaSelectMultiple<DrcProject>
      label={m.project}
      options={DrcProjectHelper.list}
      {...props}
    />
  )
}

export const SelectDrcProject = (props: Omit<AaSelectSingleProps<DrcProject>, 'onChange' | 'hideNullOption' | 'options'> & {
  options?: DrcProject[]
  onChange: (_: DrcProject | null) => void
}) => {
  const {m} = useI18n()
  return (
    <AaSelectSingle<DrcProject>
      hideNullOption={false}
      label={m.project}
      options={DrcProjectHelper.list}
      {...props}
    />
  )
}