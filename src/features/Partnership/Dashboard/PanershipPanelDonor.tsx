import {SlidePanel} from '@/shared/PdfLayout/PdfSlide'
import {KoboBarChartSingle} from '@/shared/Chart/KoboBarChart'
import {Partnership_partnersDatabaseOptions} from '@/core/generatedKoboInterface/Partnership_partnersDatabase/Partnership_partnersDatabaseOptions'
import {Enum, fnSwitch, Seq} from '@alexandreannic/ts-utils'
import {DrcProject} from '@/core/typeDrc'
import React, {useState} from 'react'
import {PartnershipData} from '@/features/Partnership/PartnershipType'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {useI18n} from '@/core/i18n'

export const PanershipPanelDonor = ({
  data,
}: {
  data: Seq<PartnershipData>
}) => {
  const {m} = useI18n()
  const [mode, setMode] = useState<'project' | 'donor'>('donor')
  return (
    <SlidePanel>
      <ScRadioGroup inline dense value={mode} onChange={setMode}>
        <ScRadioGroupItem hideRadio value="donor">{m.donor}</ScRadioGroupItem>
        <ScRadioGroupItem hideRadio value="project">{m.project}</ScRadioGroupItem>
      </ScRadioGroup>
      {fnSwitch(mode, {
        donor: (
          <KoboBarChartSingle data={data.flatMap(_ => _.group_vi2hh32).compact()} label={Partnership_partnersDatabaseOptions.Donor} getValue={_ => _.Donor!}/>
        ),
        project: (
          <KoboBarChartSingle
            data={data.flatMap(_ => _.group_vi2hh32).compact()}
            getValue={_ => Enum.values(DrcProject).find(p => p.includes('' + _.Project_code!))!}
          />
        )
      })}
      {/*<Lazy deps={[data]} fn={() => {*/}
      {/*  return ChartTools.single({*/}
      {/*    data: data.flatMap(_ => _.group_vi2hh32?.map(_ => _.Donor)).compact(),*/}
      {/*  })*/}
      {/*}}>*/}
      {/*  {_ => <HorizontalBarChartGoogle data={_}/>}*/}
      {/*</Lazy>*/}
    </SlidePanel>
  )
}