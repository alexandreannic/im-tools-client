import {KoboIndex} from '@/core/KoboIndex'
import {KoboEcrec_cashRegistration} from '@/core/sdk/server/kobo/custom/KoboEcrecCashRegistration'
import {KoboGeneralMapping} from '@/core/sdk/server/kobo/custom/KoboGeneralMapping'

export const databaseCustomMapping: Record<any, (_: any) => any> = {
  [KoboIndex.byName('ecrec_cashRegistration').id]: KoboGeneralMapping.addIndividualBreakdownColumn,
  [KoboIndex.byName('ecrec_cashRegistrationBha').id]: KoboGeneralMapping.addIndividualBreakdownColumn,
  [KoboIndex.byName('bn_re').id]: KoboGeneralMapping.addIndividualBreakdownColumn,
  [KoboIndex.byName('shelter_nta').id]: KoboGeneralMapping.addIndividualBreakdownColumn,
  [KoboIndex.byName('bn_cashForRentRegistration').id]: KoboGeneralMapping.addIndividualBreakdownColumn,
  [KoboIndex.byName('bn_cashForRentApplication').id]: KoboGeneralMapping.addIndividualBreakdownColumn,
}