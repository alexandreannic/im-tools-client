import {MpcaEntity} from '@/core/sdk/server/mpca/MpcaEntity'
import {Enum, Seq, seq} from '@alexandreannic/ts-utils'
import {Sheet} from '@/shared/Sheet/Sheet'
import React, {ReactNode, useMemo, useState} from 'react'
import {useI18n} from '@/core/i18n'
import {SlidePanel} from '@/shared/PdfLayout/PdfSlide'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {Tooltip} from '@mui/material'

enum Type {
  'phone' = 'phone',
  'taxId' = 'taxId',
  'taxId+phone' = 'taxId+phone',
}

export const MpcaDuplicatedCheckPanel = ({
  data
}: {
  data: Seq<MpcaEntity>
}) => {
  const {m} = useI18n()
  const [type, setType] = useState<Type>(Type.phone)
  return (
    <SlidePanel title={m.mpca.duplicationCheck}>
      <MpcaDuplicatedCheck
        header={
          <ScRadioGroup value={type} onChange={setType} inline dense>
            {Enum.values(Type).map(_ =>
              <ScRadioGroupItem hideRadio value={_} key={_} title={_}/>
            )}
          </ScRadioGroup>
        }
        data={data}
        property={type}
        fn={_ => {
          if (type === Type['taxId+phone'])
            if (_.phone && _.taxId) return _.phone + '+' + _.taxId
          return (_ as any)[type]
        }}/>
    </SlidePanel>
  )
}

export const MpcaDuplicatedCheck = ({
  data,
  property,
  fn,
  header,
}: {
  header: ReactNode
  property: string //keyof MpcaEntity
  fn: (_: MpcaEntity) => string
  data: Seq<MpcaEntity>
}) => {
  const {m, formatDate} = useI18n()
  const res = useMemo(() => {
    const gb = data
      // .compactBy(property)
      // .groupBy(_ => (_ as any)[property])
      .groupBy(fn)
    return seq(Enum.entries(gb)).map(([k, v]) => ({
      key: k,
      count: v.length,
      list: v.map(_ => _.date)
    }))
      .filter(_ => _.count > 2 && _.key !== 'undefined')
      // .sortByNumber(_ => _.count, '9-0')
      .sort((a, b) => {
        return b.count - a.count
      })
  }, [property, data])
  return (
    <Sheet
      className="ip-border"
      header={header}
      id={'mpca-duplicate-' + property}
      data={res}
      columns={[
        {type: 'select_one', id: property, head: property, render: _ => _.key, width: 80,},
        {type: 'number', id: 'count', head: m.count, render: _ => _.count, width: 10,},
        {
          id: 'list',
          head: m.date,
          render: _ => (
            <Tooltip title={<>{_.list.map(formatDate).map(_ => <>{_}<br/></>)}</>}>
              <div>{_.list.map(formatDate).join(', ')}</div>
            </Tooltip>
          ),
        },
      ]}
    />
  )
}