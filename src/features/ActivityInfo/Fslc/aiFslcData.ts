import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {Period} from '@/core/type'
import {AiTypeFslc} from '@/features/ActivityInfo/Fslc/aiFslcInterface'
import {ShelterEntity} from '@/core/sdk/server/shelter/ShelterEntity'
import {AiSnfiInterface} from '@/features/ActivityInfo/Snfi/AiSnfiInterface'
import {Utils} from '@/utils/utils'
import {fnSwitch} from '@alexandreannic/ts-utils'
import {getAiLocation} from '@/features/ActivityInfo/Protection/aiProtectionGeneralMapper'
import {DrcProject} from '@/core/drcUa'
import {ActiviftyInfoRecords} from '@/core/sdk/server/activity-info/ActiviftyInfoType'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {Ecrec_CashRegistration} from '@/core/koboModel/Ecrec_CashRegistration/Ecrec_CashRegistration'
import {addDays, format} from 'date-fns'
import {ActivityInfoSdk} from '@/core/sdk/server/activity-info/ActiviftyInfoSdk'
import {activityInfoFormIds} from '@/features/ActivityInfo/ActivityInfo'

export interface AiFslcDataParser {
  all: KoboAnswer<Ecrec_CashRegistration>[],
  activity: AiTypeFslc.Type,
  request: ActiviftyInfoRecords,
}

export class AiFslcData {

  static readonly req = (api: ApiSdk) => (period: Period): Promise<AiFslcDataParser[]> => {
    return api.kobo.typedAnswers.searchEcrec_cashRegistration({filters: period})
      .then(_ => _.data.map(_ => ({..._, ...getAiLocation(_)})))
      .then(data => {
        const formatted: AiFslcDataParser[] = []
        let index = 0
        Utils.groupBy({
          data,
          groups: [
            {
              by: _ => fnSwitch(_.back_donor!, {
                uhf6: DrcProject['UKR-000336 UHF6'],
                uhf7: DrcProject['UKR-000352 UHF7']
              }, () => undefined)!
            },
            {by: _ => _.Oblast!},
            {by: _ => _.Raion!},
            {by: _ => _.Hromada!},
            {
              by: _ => fnSwitch(_.back_donor!, {
                uhf6: 'Newly retaken areas',
                uhf7: 'Winter response',
              }, () => undefined)!
            },
            {
              by: _ => fnSwitch(_.ben_det_res_stat!, {
                idp: 'IDPs',
                long_res: 'Non-Displaced',
                ret: 'Returnees',
                ref_asy: 'Non-Displaced',
              }, () => 'Non-Displaced')
            }
          ],
          finalTransform: (grouped, [project, oblast, raion, hromada, responseTheme, populationGroup]) => {
            const persons = grouped.flatMap(_ => _.hh_char_hh_det ?? []).compactBy('hh_char_hh_det_age').compactBy('hh_char_hh_det_gender')
            const activity: AiTypeFslc.Type = {
              'Partner Organization': 'Danish Refugee Council',
              // 'Donor'?: '',
              'Report to a planned project?': 'Yes',
              'Project (FSLC-Updated)': project,
              'Oblast': oblast,
              'Raion': raion,
              'Hromada': hromada,
              // 'Settlement'?: '',
              // 'Collective Sites'?: '',
              'Response Theme': responseTheme,
              'Response Plan': 'HRP 2023',
              'Reporting Month': format(addDays(period.start, 1), 'yyyy-MM'),
              'Population Group': populationGroup,
              'FSLC Indicators': 'Agriculture and livestock inputs (cash)',
              'Activity status': 'Completed',
              // 'Activity Start Date'?: '',
              // 'Activity End Date'?: '',
              'Assistance Modality': 'Cash or Voucher',
              'Cash Delivery Mechanism': 'Bank Transfer',
              'Value per unit': 7500,
              'Currency': 'UAH',
              'Frequency': 'One-off',
              'Total Individuals Reached': grouped.sum(_ => _.ben_det_hh_size ?? 0),
              'New unique Individuals Reached': grouped.sum(_ => _.ben_det_hh_size ?? 0),
              'Girls': persons.filter(_ => _.hh_char_hh_det_gender === 'female' && _.hh_char_hh_det_age! < 18).length,
              'Boys': persons.filter(_ => _.hh_char_hh_det_gender === 'male' && _.hh_char_hh_det_age! < 18).length,
              'Adult Women': persons.filter(_ => _.hh_char_hh_det_gender === 'female' && _.hh_char_hh_det_age! >= 18 && _.hh_char_hh_det_age! < 60).length,
              'Adult Men': persons.filter(_ => _.hh_char_hh_det_gender === 'male' && _.hh_char_hh_det_age! >= 18 && _.hh_char_hh_det_age! < 60).length,
              'Elderly Women': persons.filter(_ => _.hh_char_hh_det_gender === 'female' && _.hh_char_hh_det_age! > 60).length,
              'Elderly Men': persons.filter(_ => _.hh_char_hh_det_gender === 'male' && _.hh_char_hh_det_age! > 60).length,
              'People with Disability': grouped.sum(_ => _.hh_char_dis_select && _.hh_char_dis_select.includes('diff_none') ? 1 : 0),
              'Comments': ('Kobo IDs: ' + grouped.map(_ => _.id).join(',')).slice(0, 1000),
            }
            formatted.push({
              all: grouped,
              activity,
              request: ActivityInfoSdk.makeRecordRequest({
                activity: AiTypeFslc.map(activity),
                formId: activityInfoFormIds.fslc,
                activityIdPrefix: 'drcecrec',
                activityIndex: index++,
              })

            })
          }
        })
        return formatted
      })
  }
}