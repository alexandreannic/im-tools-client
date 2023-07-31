import React, {Dispatch, ReactNode, SetStateAction, useContext, useState} from 'react'
import {SheetRow} from '@/shared/Sheet/Sheet'
import {KeyOf} from '@/utils/utils'
import {OrderBy, UseSetState, useSetState} from '@alexandreannic/react-hooks-lib'
import {SheetSearch} from '@/shared/Sheet/sheetType'

export interface SheetContext<T extends SheetRow> {
  _selected: UseSetState<string>
  search: SheetSearch<T>
  setSearch: Dispatch<SetStateAction<SheetSearch<T>>>
}

const SheetContext = React.createContext({} as SheetContext<any>)

export const useSheetContext = <T extends SheetRow>() => useContext<SheetContext<T>>(SheetContext)

export const SheetProvider = <T extends SheetRow>({
  children,
  sortBy,
  orderBy,
}: {
  sortBy?: KeyOf<T>
  orderBy?: OrderBy
  children: ReactNode
}) => {

  const [search, setSearch] = useState<SheetSearch<any>>({
    limit: 20,
    offset: 0,
    sortBy: sortBy,
    orderBy: orderBy,
  })

  const _selected = useSetState<string>()


  return (
    <SheetContext.Provider value={{
      _selected,
      search,
      setSearch,
    }}>
      {children}
    </SheetContext.Provider>
  )
}
