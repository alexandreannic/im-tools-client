import React, {ReactNode, useContext, useMemo} from 'react'
import {SheetColumnProps, SheetRow, SheetTableProps} from '@/shared/Sheet/Sheet'
import {UseSetState, useSetState} from '@alexandreannic/react-hooks-lib'
import {UseSheetData, useSheetData} from '@/shared/Sheet/context/useSheetData'
import {Arr} from '@alexandreannic/ts-utils'
import {useSheetModal} from '@/shared/Sheet/context/useSheetModal'
import {useSetState2} from '@/alexlib-labo/useSetState2'

export interface SheetContext<T extends SheetRow> {
  data: UseSheetData
  columnsIndex: Record<string, SheetColumnProps<T>>
  select: SheetTableProps<T>['select']
  columns: SheetTableProps<T>['columns']
  getRenderRowKey: SheetTableProps<T>['getRenderRowKey']
  selected: UseSetState<string>
  modal: ReturnType<typeof useSheetModal>
}

const SheetContext = React.createContext({} as SheetContext<any>)

export const useSheetContext = <T extends SheetRow>() => useContext<SheetContext<T>>(SheetContext)

export const SheetProvider = <T extends SheetRow>({
  children,
  columns,
  select,
  // sortBy,
  // orderBy,
  getRenderRowKey,
  data: _data,
}: {
  columns: SheetTableProps<T>['columns']
  data: SheetTableProps<T>['data']
  getRenderRowKey: SheetTableProps<T>['getRenderRowKey']
  select: SheetTableProps<T>['select']
  // sortBy?: KeyOf<T>
  // orderBy?: OrderBy
  children: ReactNode
}) => {
  const selected = useSetState2<string>()
  const columnsIndex = useMemo(() => Arr(columns).reduceObject<Record<string, SheetColumnProps<T>>>(_ => [_.id, _]), [columns])
  const data = useSheetData({
    columnsIndex,
    data: _data,
  })
  const modal = useSheetModal({data})
  return (
    <SheetContext.Provider value={{
      columnsIndex,
      selected,
      data,
      modal,
      columns,
      select,
      getRenderRowKey,
    }}>
      {children}
    </SheetContext.Provider>
  )
}
