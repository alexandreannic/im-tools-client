import {ProtSnapshotSlideProps} from './ProtSnapshot'
import React from 'react'
import {useI18n} from '../../core/i18n'
import {Box, Divider, useTheme} from '@mui/material'
import {Slide, SlideBody, SlideContainer, SlideHeader, SlidePanelDepreacted, SlidePanelTitle, SlideTxt} from '../../shared/PdfLayout/Slide'
import {HorizontalBarChartGoogle} from '../../shared/HorizontalBarChart/HorizontalBarChartGoogle'
import {PieChartIndicator} from '../../shared/PieChartIndicator'
import {UkraineMap} from '../../shared/UkraineMap/UkraineMap'
import {toPercent} from '../../utils/utils'

export const ProtSnapshotDocument = ({
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
            <SlideTxt dangerouslySetInnerHTML={{
              __html: m.protHHSnapshot.desc.documentationAboutIdp({
                maleWithoutIdpCert: toPercent(computed._14_1_1_idp_male_without_cert.percent, 0),
                _14_1_1_idp_nomale_without_cert: toPercent(computed._14_1_1_idp_nomale_without_cert.percent, 0),
                withoutDocuments: toPercent(computed._26_4_noHouseFormalDocPercent.percent, 0),
              })
            }}
            />
            <SlidePanelDepreacted>
              <PieChartIndicator
                title={m.protHHSnapshot.requiredLegalAidInformation}
                percent={computed._39_What_type_of_information_wouldPercent.percent}
                evolution={computed._39_What_type_of_information_wouldPercent.percent - previous.computed._39_What_type_of_information_wouldPercent.percent}
              />
              <Divider sx={{my: 2}}/>
              <PieChartIndicator
                title={m.hhBarriersToPersonalDocument}
                percent={computed._16_1_1_Have_you_experienced_a.percent}
                evolution={computed._16_1_1_Have_you_experienced_a.percent - previous.computed._16_1_1_Have_you_experienced_a.percent}
              />
              <Divider sx={{my: 2}}/>
              <SlidePanelTitle>{m.protHHSnapshot.barriersToPersonalDocument}</SlidePanelTitle>
              <HorizontalBarChartGoogle
                data={computed._16_1_2_What_are_the_barriers_}
              />
            </SlidePanelDepreacted>
          </SlideContainer>
          <SlideContainer column sx={{flex: 2.8}}>
            <SlidePanelDepreacted>
              <PieChartIndicator
                title={m.protHHSnapshot.hhWDisabilityWoAllowance}
                percent={computed.disabilityWithoutAllowance.percent}
                evolution={computed.disabilityWithoutAllowance.percent - previous.computed.disabilityWithoutAllowance.percent}
              />
              <Divider sx={{my: 2}}/>
              <PieChartIndicator
                title={m.protHHSnapshot.noAccommodationDocument}
                percent={computed._26_4_noHouseFormalDocPercent.percent}
                evolution={computed._26_4_noHouseFormalDocPercent.percent - previous.computed._26_4_noHouseFormalDocPercent.percent}
              />
              {/*<PieChartIndicator*/}
              {/*  title={m.protHHSnapshot.childWithoutBirthCertificate}*/}
              {/*  value={computed._15_1_1_What_housing_land_and.percent}*/}
              {/*/>*/}
            </SlidePanelDepreacted>
            <SlidePanelDepreacted>
              <SlidePanelTitle>{m.protHHSnapshot.maleWithoutIDPCert}</SlidePanelTitle>
              <Box sx={{display: 'flex', mt: 2.5, mb: 5, justifyContent: 'space-between'}}>
                <PieChartIndicator
                  title={m.protHHSnapshot.male1860}
                  percent={computed._14_1_1_idp_male_without_cert.percent}
                  evolution={computed._14_1_1_idp_male_without_cert.percent - previous.computed._14_1_1_idp_male_without_cert.percent}
                />
                <PieChartIndicator
                  title={m.others}
                  percent={computed._14_1_1_idp_nomale_without_cert.percent}
                  evolution={computed._14_1_1_idp_nomale_without_cert.percent - previous.computed._14_1_1_idp_nomale_without_cert.percent}
                />
              </Box>
              <UkraineMap
                data={computed.idpsWithoutCertByOblast}
                fillBaseOn="percent"
                onSelect={onFilterOblast('_4_What_oblast_are_you_from_iso')}
                title={m.protHHSnapshot.maleWithoutIDPCertByOblast}
                sx={{width: 350, margin: 'auto'}}
              />
            </SlidePanelDepreacted>
            {/*<SlidePanel>*/}
            {/*  <PieChartIndicator*/}
            {/*    title={m.uaCitizenShip}*/}
            {/*    value={computed._11_What_is_your_citizenship.percent}*/}
            {/*  />*/}
            {/*</SlidePanel>*/}
          </SlideContainer>
        </SlideContainer>

      </SlideBody>
    </Slide>
  )
}

