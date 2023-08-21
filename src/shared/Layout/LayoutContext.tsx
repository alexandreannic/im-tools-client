import * as React from 'react'
import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from 'react'
import {useEffectFn} from '@alexandreannic/react-hooks-lib'

const LayoutContext = createContext<UseLayoutContextProps>({} as UseLayoutContextProps)

export interface LayoutProviderProps {
  children: ReactNode
  mobileBreakpoint?: number
  title?: string
  showSidebarButton?: boolean
}

export interface UseLayoutContextProps {
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
  sidebarPinned: boolean
  setSidebarPinned: Dispatch<SetStateAction<boolean>>
  title?: string
  setTitle: Dispatch<SetStateAction<string | undefined>>
  isMobileWidth: boolean
  showSidebarButton?: boolean
}

export const LayoutProvider = ({title: _title, showSidebarButton, mobileBreakpoint = 760, children}: LayoutProviderProps) => {
  const [title, setTitle] = useState(_title)
  const [pageWidth, setPageWidth] = useState(getWidth())
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarPinned, setSidebarPinned] = useState(true)

  useEffectFn(_title, setTitle)

  useEffect(() => {
    window.addEventListener('resize', () => setPageWidth(getWidth()))
  }, [])

  return (
    <LayoutContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        sidebarPinned,
        setSidebarPinned,
        title,
        setTitle,
        isMobileWidth: pageWidth < mobileBreakpoint,
        showSidebarButton,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

function getWidth(): number {
  return (typeof window !== 'undefined') ? window.outerWidth : 1100
}

export const useLayoutContext = (): UseLayoutContextProps => {
  return useContext<UseLayoutContextProps>(LayoutContext)
}
