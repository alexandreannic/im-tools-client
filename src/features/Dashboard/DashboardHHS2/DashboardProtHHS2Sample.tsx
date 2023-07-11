import {SlideContainer, SlidePanel, SlideWidget} from '@/shared/PdfLayout/Slide'
import {HorizontalBarChartGoogle} from '@/shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {UkraineMap} from '@/shared/UkraineMap/UkraineMap'
import React, {useState} from 'react'
import {useI18n} from '../../../core/i18n'
import {DashboardPageProps} from './DashboardProtHHS2'
import {Box, Icon, useTheme} from '@mui/material'
import {ProtHHS_2_1Options} from '../../../core/koboModel/ProtHHS_2_1/ProtHHS_2_1Options'
import {Lazy} from '@/shared/Lazy'
import {ChartTools} from '../../../core/chartTools'
import {chain} from '@/utils/utils'
import {AAStackedBarChart} from '@/shared/Chart/AaStackedBarChart'
import {PieChartIndicator} from '@/shared/PieChartIndicator'
import {Panel} from '@/shared/Panel'
import {KoboPieChartIndicator} from '../shared/KoboPieChartIndicator'
import {ageGroup} from '@/core/type'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {Enum} from '@alexandreannic/ts-utils'
import {makeSx} from 'mui-extension'
import {ProtHHS2BarChart} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'

const css = makeSx({
  table: {
    borderRadius: t => t.shape.borderRadius + 'px',
    border: t => `1px solid ${t.palette.divider}`,
    width: '100%',
    '& > tr:not(:last-of-type) > td': {
      borderBottom: t => `1px solid ${t.palette.divider}`,
    },
    '& td': {
      padding: .5,
    },
    '& > tr': {}
  },
})
export const DashboardProtHHS2Sample = ({
  data,
  computed
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()
  const theme = useTheme()
  const [ag, setAg] = useState<keyof (typeof ageGroup)>('drc')
  const [agDisplay, setAgDisplay] = useState<'chart' | 'table'>('chart')
  return (
    <SlideContainer column>
      <SlideContainer alignItems="flex-start" responsive>
        <SlideContainer column>
          <SlideContainer>
            <SlideWidget sx={{flex: 1}} icon="home" title={m.hhs}>
              {formatLargeNumber(data.length)}
            </SlideWidget>
            <SlideWidget sx={{flex: 1}} icon="person" title={m.individuals}>
              {formatLargeNumber(computed.individualsCount)}
            </SlideWidget>
            <SlideWidget sx={{flex: 1}} icon="group" title={m.hhSize}>
              {(computed.individualsCount / data.length).toFixed(1)}
            </SlideWidget>
          </SlideContainer>
        </SlideContainer>
        <SlideContainer column>
          <SlideContainer>
            <SlideWidget sx={{flex: 1}} icon="elderly" title={m.avgAge}>
              <Lazy deps={[data]} fn={() => computed.flatData.map(_ => _.age).compact().sum() / computed.flatData.length}>
                {_ => _.toFixed(1)}
              </Lazy>
            </SlideWidget>
            <Panel sx={{flex: 1, m: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Lazy deps={[data]} fn={() => ChartTools.percentage({
                data: computed.flatData,
                value: _ => _.gender === 'female'
              })}>
                {_ => (
                  <PieChartIndicator value={_.value} base={_.base} title={m.females}/>
                )}
              </Lazy>
            </Panel>
            <Panel sx={{flex: 1, m: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <KoboPieChartIndicator
                title={m.uaCitizen}
                data={data}
                filterBase={_ => _ !== 'unable_unwilling_to_answer'}
                filter={_ => _ === 'no'}
                question="if_ukrainian_do_you_or_your_household_members_identify_as_member_of_a_minority_group"
              />
              {/*<Lazy deps={[data]} fn={() => ChartTools.percentage({*/}
              {/*  data,*/}
              {/*  value: _ => _.if_ukrainian_do_you_or_your_household_members_identify_as_member_of_a_minority_group === 'no'*/}
              {/*})}>*/}
              {/*  {_ => (*/}
              {/*    <PieChartIndicator value={_.percent} title={m.uaCitizenShip}/>*/}
              {/*  )}*/}
              {/*</Lazy>*/}
            </Panel>

            {/*<SlideWidget sx={{flex: 1}} icon="my_location" title={m.coveredOblasts}>*/}
            {/*  <Lazy deps={[data]} fn={() => data.distinct(_ => _.where_are_you_current_living_oblast).length}>*/}
            {/*    {_ => _}*/}
            {/*  </Lazy>*/}
            {/*</SlideWidget>*/}
          </SlideContainer>
        </SlideContainer>
      </SlideContainer>
      <SlideContainer alignItems="flex-start" responsive>
        <SlideContainer column>
          <SlidePanel title={m.HHsLocation}>
            <UkraineMap data={computed.byCurrentOblast} sx={{mx: 3}} base={data.length}/>
          </SlidePanel>
          <SlidePanel title={m.ageGroup}>
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
              <ScRadioGroup value={ag} onChange={setAg} dense inline sx={{mb: 2}}>
                {Enum.keys(ageGroup).map(_ =>
                  <ScRadioGroupItem dense hideRadio key={_} value={_} title={_.toUpperCase()}/>
                )}
              </ScRadioGroup>
              <ScRadioGroup value={agDisplay} onChange={setAgDisplay} dense inline sx={{mb: 2}}>
                <ScRadioGroupItem dense hideRadio value="table" title={<Icon color="disabled" sx={{marginBottom: '-5px', fontSize: '20px !important'}}>calendar_view_month</Icon>}/>
                <ScRadioGroupItem dense hideRadio value="chart"
                                  title={<Icon color="disabled" sx={{marginBottom: '-5px', fontSize: '20px !important'}}>align_horizontal_left</Icon>}/>
              </ScRadioGroup>
            </Box>
            <Lazy deps={[ag, data]} fn={() => computed.ageGroup(ageGroup[ag])}>
              {_ => agDisplay === 'chart' ? (
                <AAStackedBarChart data={_} height={250}/>
              ) : (
                <Box component="table" sx={css.table}>
                  <tr>
                    <td></td>
                    <td>{m.female}</td>
                    <td>{m.male}</td>
                    <td>{m.other}</td>
                  </tr>
                  {_.map(k =>
                    <tr key={k.key}>
                      <td>{k.key}</td>
                      <td>{k.Female}</td>
                      <td>{k.Male}</td>
                      <td>{k.Other}</td>
                    </tr>
                  )}
                </Box>
              )}
            </Lazy>
          </SlidePanel>
        </SlideContainer>
        <SlideContainer column>
          <SlidePanel title={m.poc}>
            <Lazy
              deps={[data]}
              fn={() => chain(ChartTools.single({
                data: data.map(_ => _.do_you_identify_as_any_of_the_following).compact(),
              }))
                .map(ChartTools.sortBy.value)
                .map(ChartTools.setLabel(ProtHHS_2_1Options.do_you_identify_as_any_of_the_following))
                .get}
            >
              {_ => <HorizontalBarChartGoogle data={_}/>}
            </Lazy>
          </SlidePanel>
          <SlidePanel>
            <Lazy deps={[data, computed.lastMonth]} fn={(d) => ChartTools.percentage({
              data: d
                .map(_ => _.do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household)
                .compact()
                .filter(_ => !_.includes('unable_unwilling_to_answer')),
              value: _ => !_.includes('no_specific_needs'),
            })}>
              {(_, last) => <PieChartIndicator sx={{mb: 2}} title={m.protHHS2.HHSwSN} value={_.value} base={_.base} evolution={_.percent - last.percent}/>}
            </Lazy>
            <ProtHHS2BarChart
              data={data}
              question="do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household"
              questionType="multiple"
              filterValue={['no_specific_needs', 'unable_unwilling_to_answer', 'other_specify']}
            />
          </SlidePanel>

          {/*<SlidePanel title={m.protHHS2.ethnicMinorities}>*/}
          {/*<DashboardProtHHS2BarChart*/}
          {/*  data={data}*/}
          {/*  question="if_ukrainian_do_you_or_your_household_members_identify_as_member_of_a_minority_group"*/}
          {/*  filterValue={[*/}
          {/*    'no',*/}
          {/*    'unable_unwilling_to_answer'*/}
          {/*  ]}*/}
          {/*/>*/}
          {/*</SlidePanel>*/}
        </SlideContainer>
      </SlideContainer>
    </SlideContainer>
  )
}