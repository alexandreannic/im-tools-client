import {AaBtn, AaBtnProps} from '@/shared/Btn/AaBtn'
import React from 'react'
import {useI18n} from '@/core/i18n'

export const DatabaseKoboSyncBtn = (props: AaBtnProps) => {
  const {m} = useI18n()
  return (
    <AaBtn
      variant="outlined"
      icon="cloud_sync"
      tooltip={props.tooltip ?? m._koboDatabase.pullData}
      {...props}
    >{m.sync}</AaBtn>
  )
}