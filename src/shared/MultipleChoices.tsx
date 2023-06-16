import {ReactNode, useEffect, useMemo, useState} from 'react'
import {SxProps, Theme} from '@mui/material'
import {ChartTools} from '../core/chartTools'


interface MultipleChoicesBase<T, V> {
  label?: ReactNode
  options: {value: T, children: ReactNode, key?: string}[]
  sx?: SxProps<Theme>
}

interface MultipleChoicesMultiple<T extends string, V> extends MultipleChoicesBase<T, V> {
  initialValue: T[]
  onChange: (t: T[], e?: any) => void
  children: (_: {
    allChecked?: boolean,
    someChecked?: boolean,
    toggleAll?: () => void,
    options: {
      value: T
      checked?: boolean
      children?: ReactNode
      key?: string
      onChange: () => void
    }[]
  }) => JSX.Element
}

// interface MultipleChoicesSimple<T, V> extends MultipleChoicesBase<T, V> {
//   initialValue: T
//   multiple?: false
//   onChange: (t: T, e?: any) => void
//   children: (_: {
//     options: {
//       value: T
//       checked?: boolean
//       children?: ReactNode
//       key?: string
//       onChange?: () => void
//     }[]
//   }) => ReactNode
// }

type MultipleChoices<T extends string, V> = MultipleChoicesMultiple<T, V> //| MultipleChoicesSimple<T, V>


export const MultipleChoices = <T extends string, V extends string = string>({
  initialValue,
  onChange,
  options,
  children
}: MultipleChoices<T, V>) => {

  const [innerValue, setInnerValue] = useState<T[]>(initialValue ?? [])

  const allValues = useMemo(() => options.map(_ => _.value), [options])

  const someChecked = !!allValues.find(_ => innerValue?.includes(_))

  const allChecked = allValues.length === innerValue?.length

  const toggleAll = () => onChange?.(innerValue?.length === 0 ? allValues : [])

  const onClick = (v: T) => {
    setInnerValue(prev => prev.includes(v)
      ? prev.filter(_ => _ !== v)
      : [...prev, v])
  }

  useEffect(() => {
    if (innerValue !== initialValue)
      onChange(innerValue)
  }, [innerValue])

  return children({
    someChecked,
    allChecked,
    toggleAll,
    options: options.map(_ => ({
      ..._,
      checked: innerValue.includes(_.value),
      onChange: () => onClick(_.value)
    }))
  })
}