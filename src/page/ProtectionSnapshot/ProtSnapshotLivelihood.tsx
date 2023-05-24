import {Arr, Enum, map} from '@alexandreannic/ts-utils'
import {ProtSnapshotSlideProps} from './ProtSnapshot'
import React from 'react'
import {useI18n} from '../../core/i18n'
import {usePdfContext} from '../../shared/PdfLayout/PdfLayout'
import {Divider, useTheme} from '@mui/material'
import {Slide, SlideBody, SlideContainer, SlideHeader, SlidePanelDepreacted, SlidePanelTitle, SlideTxt} from '../../shared/PdfLayout/Slide'
import {HorizontalBarChartGoogle} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {OblastIndex} from '../../shared/UkraineMap/oblastIndex'
import {Txt} from 'mui-extension'
import {toPercent} from '../../utils/utils'
import {PieChartIndicator} from '../../shared/PieChartIndicator'

export const ProtSnapshotLivelihood = ({
  current: {
    data,
    computed
  },
  previous,
  filters,
  onFilter,
  onFilterOblast
}: ProtSnapshotSlideProps) => {
  const {m, formatLargeNumber, formatDate} = useI18n()
  
  return (
    <Slide>
      <SlideHeader>{m.protHHSnapshot.titles.livelihood}</SlideHeader>
      <SlideBody>
        <SlideContainer>
          <SlideContainer sx={{flex: 4.3}} column>
            <SlideTxt dangerouslySetInnerHTML={{
              __html: m.protHHSnapshot.desc.livelihoodAbout({
                workingIdp: toPercent(computed._31_Is_anyone_from_the_household_percent.idp.percent, 0),
                workingNoIdp: toPercent(computed._31_Is_anyone_from_the_household_percent.notIdp.percent, 0),
                dependOfAidIdp: toPercent(computed._32_dependingOnAllowancePercent.idp.percent, 0),
                dependOfAidNotIdp: toPercent(computed._32_dependingOnAllowancePercent.notIdp.percent, 0),
              })
            }}/>
            <SlidePanelDepreacted>
              <PieChartIndicator
                title={m.atLeastOneMemberWorking}
                value={computed._31_Is_anyone_from_the_household_percent.all.percent}
                evolution={computed._31_Is_anyone_from_the_household_percent.all.percent - previous.computed._31_Is_anyone_from_the_household_percent.all.percent}
              />
              {/*<PieChartIndicator*/}
              {/*  title={m.atLeastOneMemberWorking}*/}
              {/*  value={computed._31_Is_anyone_from_the_household_percent.notIdp.percent}*/}
              {/*  evolution={computed._31_Is_anyone_from_the_household_percent.notIdp.percent - previous.computed._31_Is_anyone_from_the_household_percent.notIdp.percent}*/}
              {/*/>*/}
              <Divider sx={{my: 1.5}}/>
              <SlidePanelTitle>{m.employmentType}</SlidePanelTitle>
              <HorizontalBarChartGoogle data={computed._31_2_What_type_of_work}/>
            </SlidePanelDepreacted>
            {/*<SlidePanel>*/}
            {/*  /!*<HorizontalBarChartGoogle data={computed._32_What_is_the_main_source_of_inc}/>*!/*/}
            {/*<HorizontalBarChartGoogle data={computed._32_dependingOnAllowance} icons={categoryIcons}/>*/}
            {/*</SlidePanel>*/}

            <SlidePanelDepreacted title={m.protHHSnapshot.allowanceStateOrHumanitarianAsMainSourceOfIncome}>
              <SlideContainer
                sx={{justifyContent: 'space-between'}}
              >
                <PieChartIndicator
                  sx={{flex: 1}}
                  title={<Txt size="small">{m.idps}&nbsp;<Txt fontWeight="lighter">({computed.idpsCount})</Txt></Txt>}
                  value={computed._32_dependingOnAllowancePercent.idp.percent}
                  evolution={computed._32_dependingOnAllowancePercent.idp.percent - previous.computed._32_dependingOnAllowancePercent.idp.percent}
                />
                <PieChartIndicator
                  sx={{flex: 1}}
                  title={<Txt size="small">{m.noIdps}&nbsp;<Txt fontWeight="lighter">({computed.noIdpsCount})</Txt></Txt>}
                  value={computed._32_dependingOnAllowancePercent.notIdp.percent}
                  evolution={computed._32_dependingOnAllowancePercent.notIdp.percent - previous.computed._32_dependingOnAllowancePercent.notIdp.percent}
                />
              </SlideContainer>
              {/*<PieChartIndicator*/}
              {/*  sx={{flex: 1}}*/}
              {/*  title={m.protHHSnapshot.elderlyWithPension}*/}
              {/*  value={computed._32_1_What_type_of_allowances_byElderly.percent}*/}
              {/*  evolution={computed._32_1_What_type_of_allowances_byElderly.percent - previous.computed._32_1_What_type_of_allowances_byElderly.percent}*/}
              {/*/>*/}
              <Divider sx={{my: 1.5}}/>
              <PieChartIndicator
                title={m.protHHSnapshot.idpWithAllowance}
                value={computed._32_1_What_type_of_allowances_byIdp.percent}
                evolution={computed._32_1_What_type_of_allowances_byIdp.percent - previous.computed._32_1_What_type_of_allowances_byIdp.percent}
              />
              {/*<PieChartIndicator*/}
              {/*  sx={{flex: 1}}*/}
              {/*  title={m.protHHSnapshot.hhWith3childrenWithPension}*/}
              {/*  value={computed._32_1_What_type_of_allowances_byChildrens.percent}*/}
              {/*  evolution={computed._32_1_What_type_of_allowances_byChildrens.percent - previous.computed._32_1_What_type_of_allowances_byChildrens.percent}*/}
              {/*/>*/}
            </SlidePanelDepreacted>
          </SlideContainer>
          <SlideContainer column sx={{flex: 4}}>
            <SlideTxt dangerouslySetInnerHTML={{
              __html: m.protHHSnapshot.desc.livelihoodAbout2({
                hhIncomeBelow3000: toPercent(
                  computed._33_What_is_the_aver_income_per_household!.up_to_1_500_uah.value / Arr(Object.values(computed._33_What_is_the_aver_income_per_household!)).sum(_ => _.value),
                  0
                ),
                avgHHIncomeBelow3000: map(computed._33_incomeByIndividualsBelow3000, _ => toPercent(_.true.length / (_.false.length + _.true.length), 0))!,
                avgHHIncomeBelow3000Max: map(computed._33_incomeByIndividualsBelow3000Max, _ => toPercent(_.true.length / (_.false.length + _.true.length), 0))!,
              })
            }}/>
            <SlidePanelDepreacted title={m.monthlyIncomePerHH}>
              <HorizontalBarChartGoogle
                data={computed._33_What_is_the_aver_income_per_household}
                descs={Enum.entries(computed._8_What_is_your_household_sizeByIncome).reduce((acc, [k, v]) => ({
                  ...acc,
                  [k]: m.protHHSnapshot.avgHhSize((v.value ?? 0) / (v.base ?? 1))
                }), {} as Record<keyof typeof computed._8_What_is_your_household_sizeByIncome, string>)}
              />
            </SlidePanelDepreacted>
            <Divider/>
            <Txt sx={{mt: -1}} size="small" color="hint" textAlign="justify" dangerouslySetInnerHTML={{
              __html: m.protHHSnapshot.livelihoodAboutNotes
            }}/>
            {/*<SlidePanel title={m.protHHSnapshot.incomeUnder6000ByCategory}>*/}
            {/*  <HorizontalBarChartGoogle data={computed._33_incomeByCategory} icons={categoryIcons}/>*/}
            {/*</SlidePanel>*/}
          </SlideContainer>
        </SlideContainer>
      </SlideBody>
    </Slide>
  )
}

