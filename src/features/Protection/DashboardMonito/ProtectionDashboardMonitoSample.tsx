import {Div, SlidePanel, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {ChartBar} from '@/shared/charts/ChartBar'
import {UkraineMap} from '@/shared/UkraineMap/UkraineMap'
import React, {useState} from 'react'
import {useI18n} from '@/core/i18n'
import {DashboardPageProps} from './ProtectionDashboardMonito'
import {Box, Icon, useTheme} from '@mui/material'
import {Lazy} from '@/shared/Lazy'
import {ChartHelperOld} from '@/shared/charts/chartHelperOld'
import {chain} from '@/utils/utils'
import {ChartBarStacker} from '@/shared/charts/ChartBarStacked'
import {ChartPieWidget} from '@/shared/charts/ChartPieWidget'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {Enum} from '@alexandreannic/ts-utils'
import {makeSx} from 'mui-extension'
import {Sheet} from '@/shared/Sheet/Sheet'
import {ChartPieWidgetByKey} from '@/shared/charts/ChartPieWidgetByKey'
import {ChartBarMultipleBy} from '@/shared/charts/ChartBarMultipleBy'
import {ChartBarSingleBy} from '@/shared/charts/ChartBarSingleBy'
import {Person} from '@/core/type/person'
import {Protection_hhs3} from '@/core/sdk/server/kobo/generatedInterface/Protection_hhs3'

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

export const ProtectionDashboardMonitoSample = ({
  data,
  computed
}: DashboardPageProps) => {
  const {formatLargeNumber, m} = useI18n()
  const theme = useTheme()
  const [ag, setAg] = useState<keyof (typeof Person.ageGroup)>('DRC')
  const [agDisplay, setAgDisplay] = useState<'chart' | 'table'>('chart')
  return (
    <Div column>
      <Div alignItems="flex-start" responsive>
        <Div column>
          <Div sx={{alignItems: 'stretch'}}>
            <SlideWidget sx={{flex: 1}} icon="home" title={m.hhs}>
              {formatLargeNumber(data.length)}
            </SlideWidget>
            <SlideWidget sx={{flex: 1}} icon="person" title={m.individuals}>
              {formatLargeNumber(computed.individualsCount)}
            </SlideWidget>
            <SlideWidget sx={{flex: 1}} icon="group" title={m.hhSize}>
              {(computed.individualsCount / data.length).toFixed(1)}
            </SlideWidget>
          </Div>
        </Div>
        <Div column>
          <Div sx={{alignItems: 'stretch'}}>
            <SlideWidget sx={{flex: 1}} icon="elderly" title={m.avgAge}>
              <Lazy deps={[data]} fn={() => computed.flatData.map(_ => _.age).compact().sum() / computed.flatData.length}>
                {_ => _.toFixed(1)}
              </Lazy>
            </SlideWidget>
            <SlidePanel BodyProps={{sx: {p: '0px !important'}}} sx={{flex: 1, m: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Lazy deps={[data]} fn={() => ChartHelperOld.percentage({
                data: computed.flatData,
                value: _ => _.gender === 'Female'
              })}>
                {_ => (
                  <ChartPieWidget value={_.value} base={_.base} title={m.females}/>
                )}
              </Lazy>
            </SlidePanel>
            <SlidePanel BodyProps={{sx: {p: '0px !important'}}} sx={{flex: 1, m: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <ChartPieWidgetByKey
                title={m.uaCitizen}
                data={data}
                property="if_ukrainian_do_you_or_your_household_members_identify_as_member_of_a_minority_group"
                filterBase={_ => _ !== 'unable_unwilling_to_answer'}
                filter={_ => _ === 'no'}
              />
              {/*<Lazy deps={[data]} fn={() => ChartTools.percentage({*/}
              {/*  data,*/}
              {/*  value: _ => _.if_ukrainian_do_you_or_your_household_members_identify_as_member_of_a_minority_group === 'no'*/}
              {/*})}>*/}
              {/*  {_ => (*/}
              {/*    <PieChartIndicator value={_.percent} title={m.uaCitizenShip}/>*/}
              {/*  )}*/}
              {/*</Lazy>*/}
            </SlidePanel>

            {/*<SlideWidget sx={{flex: 1}} icon="my_location" title={m.coveredOblasts}>*/}
            {/*  <Lazy deps={[data]} fn={() => data.distinct(_ => _.where_are_you_current_living_oblast).length}>*/}
            {/*    {_ => _}*/}
            {/*  </Lazy>*/}
            {/*</SlideWidget>*/}
          </Div>
        </Div>
      </Div>
      <Div alignItems="flex-start" responsive>
        <Div column>
          <SlidePanel title={m.HHsLocation}>
            <UkraineMap data={computed.byCurrentOblast} sx={{mx: 1}} base={data.length}/>
          </SlidePanel>
          <SlidePanel title={m.ageGroup}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
              <ScRadioGroup value={ag} onChange={setAg} dense inline sx={{mr: 1}}>
                {Enum.keys(Person.ageGroup).map(_ =>
                  <ScRadioGroupItem dense hideRadio key={_} value={_} title={_}/>
                )}
              </ScRadioGroup>
              <ScRadioGroup value={agDisplay} onChange={setAgDisplay} dense inline>
                <ScRadioGroupItem dense hideRadio value="table"
                                  title={<Icon color="disabled" sx={{marginBottom: '-5px', fontSize: '20px !important'}}>calendar_view_month</Icon>}/>
                <ScRadioGroupItem
                  dense hideRadio value="chart"
                  title={<Icon color="disabled" sx={{marginBottom: '-5px', fontSize: '20px !important'}}>align_horizontal_left</Icon>}
                />
              </ScRadioGroup>
            </Box>
            <Lazy deps={[ag, data]} fn={() => computed.ageGroup(Person.ageGroup[ag])}>
              {_ => agDisplay === 'chart' ? (
                <ChartBarStacker data={_} height={250}/>
              ) : (
                <Sheet
                  id="prot-dash-population"
                  sx={{border: t => `1px solid ${t.palette.divider}`, overflow: 'hidden', borderRadius: t => t.shape.borderRadius + 'px'}}
                  hidePagination
                  data={_}
                  columns={[
                    {width: 0, id: 'Group', head: m.ageGroup, type: 'select_one', render: _ => _.key},
                    {width: 0, id: 'Male', head: m.male, type: 'number', renderValue: _ => _.Male, render: _ => formatLargeNumber(_.Male)},
                    {width: 0, id: 'Female', head: m.female, type: 'number', renderValue: _ => _.Female, render: _ => formatLargeNumber(_.Female)},
                    {width: 0, id: 'Other', head: m.other, type: 'number', renderValue: _ => _.Other ?? 0, render: _ => formatLargeNumber(_.Other ?? 0)},
                  ]}
                />
                // <Box component="table" sx={css.table}>
                //   <tr>
                //     <td></td>
                //     <td>{m.female}</td>
                //     <td>{m.male}</td>
                //     <td>{m.other}</td>
                //   </tr>
                //   {_.map(k =>
                //     <tr key={k.key}>
                //       <td>{k.key}</td>
                //       <td>{k.Female}</td>
                //       <td>{k.Male}</td>
                //       <td>{k.Other}</td>
                //     </tr>
                //   )}
                //   <tr>
                //     <td><b>{m.total}</b></td>
                //     <td><b>{_.reduce((acc, _) => acc + (_.Female ?? 0), 0)}</b></td>
                //     <td><b>{_.reduce((acc, _) => acc + (_.Male ?? 0), 0)}</b></td>
                //     <td><b>{_.reduce((acc, _) => acc + (_.Other ?? 0), 0)}</b></td>
                //   </tr>
                // </Box>
              )}
            </Lazy>
          </SlidePanel>
        </Div>
        <Div column>
          <SlidePanel title={m.poc}>
            <Lazy
              deps={[data]}
              fn={() => chain(ChartHelperOld.single({
                data: data.map(_ => _.do_you_identify_as_any_of_the_following).compact(),
              }))
                .map(ChartHelperOld.sortBy.value)
                .map(ChartHelperOld.setLabel(Protection_hhs3.options.do_you_identify_as_any_of_the_following))
                .get}
            >
              {_ => <ChartBar data={_}/>}
            </Lazy>
          </SlidePanel>
          <SlidePanel>
            <Lazy deps={[data, computed.lastMonth]} fn={(d) => ChartHelperOld.percentage({
              data: d
                .map(_ => _.do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household)
                .compact()
                .filter(_ => !_.includes('unable_unwilling_to_answer')),
              value: _ => !_.includes('no_specific_needs'),
            })}>
              {(_, last) => <ChartPieWidget sx={{mb: 2}} title={m.protHHS2.HHSwSN} value={_.value} base={_.base} evolution={_.percent - last.percent}/>}
            </Lazy>
            <ChartBarMultipleBy
              data={data}
              by={_ => _.do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household}
              filterValue={['no_specific_needs', 'unable_unwilling_to_answer', 'other_specify']}
              label={Protection_hhs3.options.do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household}
            />
          </SlidePanel>
          <SlidePanel title={m.protHHS2.hhTypes}>
            <ChartBarSingleBy
              data={data}
              by={_ => _.what_is_the_type_of_your_household}
              label={Protection_hhs3.options.what_is_the_type_of_your_household}
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
        </Div>
      </Div>
    </Div>
  )
}