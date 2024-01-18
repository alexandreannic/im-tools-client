import {Div, SlidePanel} from '@/shared/PdfLayout/PdfSlide'
import React, {useMemo, useState} from 'react'
import {useI18n} from '../../../core/i18n'
import {DashboardPageProps} from './DashboardProtHHS2'
import {Lazy} from '@/shared/Lazy'
import {ChartTools} from '@/shared/chart/chartHelper'
import {Protection_Hhs2_1Options} from '@/core/generatedKoboInterface/Protection_Hhs2_1/Protection_Hhs2_1Options'
import {ChartPieIndicator} from '@/shared/chart/KoboPieChartIndicator'
import {BarChart} from '@/shared/chart/BarChart'
import {chain} from '@/utils/utils'
import {Box, Checkbox} from '@mui/material'
import {Txt} from 'mui-extension'
import {Enum} from '@alexandreannic/ts-utils'
import {ChartPieIndicatorByKey} from '@/shared/chart/ChartPieIndicatorByKey'

type Filters = Pick<Record<keyof typeof Protection_Hhs2_1Options['are_you_separated_from_any_of_your_households_members'], boolean>,
  'partner' |
  'child_lt_18' |
  'child_gte_18' |
  'mother' |
  'father' |
  'caregiver' |
  'other_relative'
>

export const DashboardProtHHS2FamilyUnity = ({
  data,
  computed,
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()

  const [category, setCategory] = useState<Filters>({
    partner: true,
    child_lt_18: true,
    child_gte_18: true,
    mother: true,
    father: true,
    caregiver: true,
    other_relative: true,
  })

  const allChecked = useMemo(() => Enum.values(category).every(_ => _), [category])
  const oneChecked = useMemo(() => !!Enum.values(category).find(_ => _), [category])

  const updateAll = (checked: boolean) => {
    setCategory({
      partner: checked,
      child_lt_18: checked,
      child_gte_18: checked,
      mother: checked,
      father: checked,
      caregiver: checked,
      other_relative: checked,
    })
  }

  return (
    <>
      <Div responsive>
        <Div column>
          <SlidePanel>
            <ChartPieIndicatorByKey
              compare={{before: computed.lastMonth}}
              title={m.protHHS2.familyMemberSeparated}
              property="are_you_separated_from_any_of_your_households_members"
              filter={_ => !_.includes('no') && !_.includes('unable_unwilling_to_answer')}
              sx={{mb: 2}}
              data={data}
            />
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <Checkbox indeterminate={!allChecked && oneChecked} checked={allChecked} onClick={() => {
                updateAll(!allChecked)
              }}/>
              <Txt bold size="big">{m.selectAll}</Txt>
            </Box>
            <Lazy deps={[data]} fn={() =>
              chain(ChartTools.multiple({
                filterValue: ['unable_unwilling_to_answer', 'no'],
                data: data.map(_ => _.are_you_separated_from_any_of_your_households_members).compact()
              }))
                .map(ChartTools.setLabel(Protection_Hhs2_1Options.are_you_separated_from_any_of_your_households_members))
                .get
            }>
              {_ => <BarChart
                data={_}
                labels={{
                  partner: <Checkbox
                    size="small"
                    checked={category.partner}
                    onChange={e => setCategory(prev => ({...prev, partner: e.target.checked}))}
                  />,
                  child_lt_18: <Checkbox
                    size="small"
                    checked={category.child_lt_18}
                    onChange={e => setCategory(prev => ({...prev, child_lt_18: e.target.checked}))}
                  />,
                  child_gte_18: <Checkbox
                    size="small"
                    checked={category.child_gte_18}
                    onChange={e => setCategory(prev => ({...prev, child_gte_18: e.target.checked}))}
                  />,
                  mother: <Checkbox
                    size="small"
                    checked={category.mother}
                    onChange={e => setCategory(prev => ({...prev, mother: e.target.checked}))}
                  />,
                  father: <Checkbox
                    size="small"
                    checked={category.father}
                    onChange={e => setCategory(prev => ({...prev, father: e.target.checked}))}
                  />,
                  caregiver: <Checkbox
                    size="small"
                    checked={category.caregiver}
                    onChange={e => setCategory(prev => ({...prev, caregiver: e.target.checked}))}
                  />,
                  other_relative: <Checkbox
                    size="small"
                    checked={category.other_relative}
                    onChange={e => setCategory(prev => ({...prev, other_relative: e.target.checked}))}
                  />,
                } as any}
              />
              }
            </Lazy>
          </SlidePanel>

        </Div>
        <Div column>
          <SlidePanel title={m.protHHS2.locationOfSeparatedFamilyMembers}>
            <Lazy deps={[data, category]} fn={() => chain(ChartTools.single({
              data: data.flatMap(_ => [
                ...category.partner ? [_.where_is_your_partner] : [],
                ...category.child_lt_18 ? [_.where_is_your_child_lt_18] : [],
                ...category.child_gte_18 ? [_.where_is_your_child_gte_18] : [],
                ...category.mother ? [_.where_is_your_mother] : [],
                ...category.father ? [_.where_is_your_father] : [],
                ...category.caregiver ? [_.where_is_your_caregiver] : [],
                ...category.other_relative ? [_.where_is_your_other_relative] : [],
              ]).compact(),
              // filterValue: ['unable_unwilling_to_answer']
            })).map(ChartTools.setLabel(Protection_Hhs2_1Options.where_is_your_partner)).get
            }>
              {_ => <BarChart data={_}/>}
            </Lazy>
          </SlidePanel>
          <SlidePanel title={m.protHHS2.reasonForRemainInOrigin}>
            <Lazy deps={[data, category]} fn={() => chain(ChartTools.single({
              data: data.flatMap(_ => [
                ...category.partner ? [_.where_is_your_partner_remain_behind_in_the_area_of_origin] : [],
                ...category.child_lt_18 ? [_.where_is_your_child_lt_18_remain_behind_in_the_area_of_origin] : [],
                ...category.child_gte_18 ? [_.where_is_your_child_gte_18_remain_behind_in_the_area_of_origin] : [],
                ...category.mother ? [_.where_is_your_mother_remain_behind_in_the_area_of_origin] : [],
                ...category.father ? [_.where_is_your_father_remain_behind_in_the_area_of_origin] : [],
                ...category.caregiver ? [_.where_is_your_caregiver_remain_behind_in_the_area_of_origin] : [],
                ...category.other_relative ? [_.where_is_your_other_relative_remain_behind_in_the_area_of_origin] : [],
              ]).compact(),
              // filterValue: ['unable_unwilling_to_answer']
            })).map(ChartTools.setLabel(Protection_Hhs2_1Options.where_is_your_partner_remain_behind_in_the_area_of_origin)).get
            }>
              {_ => <BarChart data={_}/>}
            </Lazy>
          </SlidePanel>
        </Div>
      </Div>
    </>
  )
}