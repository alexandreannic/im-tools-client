import React, {ReactNode, useContext, useEffect, useState} from 'react'
import {MicrosoftGraphClient} from '../../core/sdk/microsoftGraph/microsoftGraphClient'
import {MPCADeduplicationDb} from './MPCADeduplicationDb'
import Loki from 'lokijs'

export interface MPCADeduplicationContext {
  search: MPCADeduplicationDb['search'] | undefined
}

const Context = React.createContext({} as MPCADeduplicationContext)

export const useMPCADeduplicationContext = () => useContext(Context)

export const MPCADeduplicationProvider = ({
  children,
  sdk = new MicrosoftGraphClient(),
  db,
}: {
  db: MPCADeduplicationDb
  sdk?: MicrosoftGraphClient
  children: ReactNode
}) => {
  const [search, setSearch] = useState<MPCADeduplicationDb['search'] | undefined>()

  useEffect(() => {
    // const z: Loki = new (Loki as any)('')
    // const col = z.addCollection('test')
    // col.insert({test: 'a'})
    // console.log(col.find())
    MPCADeduplicationDb.build({db, sdk}).then(() => {
      setSearch(() => db.search)
      console.log(db.getAll())
    })
  }, [])


  return (
    <Context.Provider value={{
      search
    }}>
      {children}
    </Context.Provider>
  )
}