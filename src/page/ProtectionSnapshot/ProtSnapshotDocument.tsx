import {ProtSnapshotSlideProps} from './ProtSnapshot'
import React from 'react'
import {useI18n} from '../../core/i18n'
import {Box, Divider, useTheme} from '@mui/material'
import {Slide, SlideBody, SlideContainer, SlideHeader, SlidePanel, SlidePanelTitle, SlideTxt} from '../../shared/PdfLayout/Slide'
import {HorizontalBarChartGoogle} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {AaPieChart} from '../../shared/Chart/AaPieChart'
import {PieChartIndicator} from '../../shared/PieChartIndicator'
import {UkraineMap} from '../../shared/UkraineMap/UkraineMap'
import {toPercent} from '../../utils/utils'

export const ProtSnapshotDocument = ({
  current: {
    data,
    period,
    computed
  },
  previous,
  filters,
  onFilter,
  onFilterOblast
}: ProtSnapshotSlideProps) => {
  const {m, formatLargeNumber, formatDate} = useI18n()
  const theme = useTheme()

  return (
    <Slide>
      <SlideHeader>{m.protHHSnapshot.titles.document}</SlideHeader>
      <SlideBody>
        <SlideContainer>
          <SlideContainer column sx={{flex: 3}}>
            {/*<SlidePanel title={m.uaCitizenShip}>*/}
            {/*  <AaPieChart*/}
            {/*    outerRadius={55}*/}
            {/*    innerRadius={40}*/}
            {/*    height={110}*/}
            {/*    width={110}*/}
            {/*    valueInMiddle={(computed._11_What_is_your_citizenship.percent * 100).toFixed(1) + '%'}*/}
            {/*    hideLabel*/}
            {/*    data={{*/}
            {/*      ukrainian: computed._11_What_is_your_citizenship.percent,*/}
            {/*      other: 1 - computed._11_What_is_your_citizenship.percent,*/}
            {/*    }}*/}
            {/*    colors={{*/}
            {/*      ukrainian: theme.palette.primary.main,*/}
            {/*      other: theme.palette.divider,*/}
            {/*    }}*/}
            {/*    m={{*/}
            {/*      ukrainian: 'ukrainian',*/}
            {/*      other: 'other',*/}
            {/*    }}*/}
            {/*  />*/}
            {/*</SlidePanel>*/}
            <SlidePanel>
              <PieChartIndicator
                title={m.protHHSnapshot.noAccommodationDocument}
                value={computed._26_4_noHouseFormalDocPercent.percent}
              />
            </SlidePanel>
            <SlideTxt dangerouslySetInnerHTML={{
              __html: m.protHHSnapshot.documentationAboutIdp({
                maleWithoutIdpCert: toPercent(computed._14_1_1_idp_male_without_cert.percent, 0),
                femaleWithoutIdpCert: toPercent(computed._14_1_1_idp_female_without_cert.percent, 0),
              })
            }}
            />
            <SlidePanel>
              {/*<PieChartIndicator*/}
              {/*  title={m.protHHSnapshot.childWithoutBirthCertificate}*/}
              {/*  value={computed._14_1_1_children_without_cert.percent}*/}
              {/*  evolution={computed._14_1_1_children_without_cert.percent - previous.computed._14_1_1_children_without_cert.percent}*/}
              {/*/>*/}
              {/*<Divider sx={{my: 2}}/>*/}
              {/*<PieChartIndicator*/}
              {/*  title={m.protHHSnapshot.elderlyWithoutPensionCertificate}*/}
              {/*  value={computed._14_1_1_elderly_without_cert.percent}*/}
              {/*  evolution={computed._14_1_1_elderly_without_cert.percent - previous.computed._14_1_1_elderly_without_cert.percent}*/}
              {/*/>*/}
              {/*<Divider sx={{my: 2}}/>*/}
              
              {/*<UkraineMap*/}
              {/*  data={computed.idpsWithoutCertByOblast}*/}
              {/*  fillBaseOn="percent"*/}
              {/*  onSelect={onFilterOblast('_4_What_oblast_are_you_from_iso')}*/}
              {/*  legend={m.protHHSnapshot.maleWithoutIDPCertByOblast}*/}
              {/*  sx={{width: 350, margin: 'auto'}}*/}
              {/*/>*/}
            </SlidePanel>
          </SlideContainer>
          <SlideContainer column sx={{minWidth: 445}}>
            <SlidePanel>
              <PieChartIndicator
                title={m.uaCitizenShip}
                value={computed._11_What_is_your_citizenship.percent}
              />
            </SlidePanel>
            <SlidePanel title={m.hhBarriersToPersonalDocument}>
              <PieChartIndicator
                value={computed._16_1_1_Have_you_experienced_a.percent}
                evolution={computed._16_1_1_Have_you_experienced_a.percent - previous.computed._16_1_1_Have_you_experienced_a.percent}
              />
              <Divider sx={{my: 2}}/>
              <SlidePanelTitle>{m.protHHSnapshot.barriersToPersonalDocument}</SlidePanelTitle>
              <HorizontalBarChartGoogle
                data={computed._16_1_2_What_are_the_barriers_}
              />
            </SlidePanel>
            <SlideContainer>

              {/*<SlideContainer>*/}
              {/*  <UkraineMap*/}
              {/*    data={computed.femaleIdpsWithoutCertByOblast}*/}
              {/*    fillBaseOn="percent"*/}
              {/*    onSelect={onFilterOblast('_4_What_oblast_are_you_from_iso')}*/}
              {/*    legend="Women"*/}
              {/*    sx={{width: '100%'}}*/}
              {/*  />*/}
              {/*</SlideContainer>*/}

            </SlideContainer>
          </SlideContainer>
        </SlideContainer>

      </SlideBody>
    </Slide>
  )
}

