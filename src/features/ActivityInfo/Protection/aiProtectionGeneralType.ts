import {Protection_Hhs2_1Options} from '@/core/koboModel/Protection_Hhs2_1/Protection_Hhs2_1Options'
import {fnSwitch} from '@alexandreannic/ts-utils'
import {DrcDonor, DrcProject} from '@/core/drcUa'
import {AiTypeProtectionRmm} from '@/features/ActivityInfo/HHS_2_1/AiTypeProtectionRmm'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'

export namespace AiProtectionGeneralType {

  export enum Status {
    'Returnees' = 'Returnees',
    'Non-Displaced' = 'Non-Displaced',
    'IDPs' = 'IDPs',
  }

  export type Data = Pick<AiTypeProtectionRmm.FormParams,
    'Oblast' |
    'Raion' |
    'Hromada' |
    'Plan Code'
  > & Pick<AiTypeProtectionRmm.FormParams['subActivities'][0],
    'Reporting Month' |
    'Collective Centre' |
    'Population Group' |
    'Protection Indicators' |
    'Total Individuals Reached' |
    'Girls' |
    'Boys' |
    'Adult Women' |
    'Adult Men' |
    'Elderly Women' |
    'Elderly Men' |
    'People with disability'
  > & {
    answer: KoboAnswer<any>
  }

  export const mapStatus = (s: (keyof typeof Protection_Hhs2_1Options['do_you_identify_as_any_of_the_following']) | undefined): any => fnSwitch(s!, {
    returnee: 'Returnees',
    non_displaced: 'Non-Displaced',
    idp: 'IDPs',
    refugee: 'Non-Displaced',
  }, _ => 'Non-Displaced')

  export const planCode = Object.freeze({
    [DrcProject['ECHO1 (UKR-000269)']]: 'GP-DRC-00001',
    [DrcProject['Novo-Nordisk (UKR-000298)']]: 'GP-DRC-00002',
    [DrcProject['BHA (UKR-000284)']]: 'GP-DRC-00003',
    [DrcProject['OKF (UKR-000309)']]: 'GP-DRC-00004',
    [DrcProject['UHF4 (UKR-000314)']]: 'GP-DRC-00005',
    [DrcProject['ECHO2 (UKR-000322)']]: 'GP-DRC-00006',
    [DrcProject['PSPU (UKR-000304)']]: 'GP-DRC-00007',
    [DrcProject['BHA2 (UKR-000345)']]: 'GP-DRC-00008',
    [DrcProject['UHF6 (UKR-000336)']]: 'GP-DRC-00009',
    [DrcProject['SDC2 (UKR-000330)']]: 'GP-DRC-00010',
  })

  // export const planCode: Partial<Record<DrcDonor, AiProtectionHhs.GET<'Plan Code'>>> = {
  //   // [Donor.ECHO_UKR000322]: 'GP-DRC-00001',//ECHO
  //   [DrcDonor.NovoNordisk]: 'GP-DRC-00002',//Novo Nordisk ------
  //   [DrcDonor.BHA]: 'GP-DRC-00003',//BHA OK
  //   [DrcDonor.OKF]: 'GP-DRC-00004',//OKF ------
  //   [DrcDonor.UHF]: 'GP-DRC-00005',//UHF
  //   [DrcDonor.ECHO]: 'GP-DRC-00006',//ECHO
  //   // [Donor.D] MoF: 'GP-DRC-00007',//Danish
  // }
}
