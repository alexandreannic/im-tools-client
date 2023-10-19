import React from 'react'
import {DrcProject, drcProjects} from '@/core/drcUa'
import {AaSelectMultiple, AaSelectMultipleProps} from '@/shared/Select/AaSelectMultiple'


export const SelectDrcProjects = (props: Omit<AaSelectMultipleProps<DrcProject>, 'options'>) => {
  return (
    <AaSelectMultiple
      {...props}
      options={drcProjects}
    />
  )
}