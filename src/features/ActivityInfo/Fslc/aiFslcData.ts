import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {Period, Person} from '@/core/type'
import {AiTypeFslc} from '@/features/ActivityInfo/Fslc/aiFslcInterface'
import {Utils} from '@/utils/utils'
import {fnSwitch, seq} from '@alexandreannic/ts-utils'
import {getAiLocation} from '@/features/ActivityInfo/Protection/aiProtectionGeneralMapper'
import {DrcProject} from '@/core/drcUa'
import {ActiviftyInfoRecords} from '@/core/sdk/server/activity-info/ActiviftyInfoType'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {Ecrec_CashRegistration} from '@/core/koboModel/Ecrec_CashRegistration/Ecrec_CashRegistration'
import {addDays, format} from 'date-fns'
import {ActivityInfoSdk} from '@/core/sdk/server/activity-info/ActiviftyInfoSdk'
import {activityInfoFormIds} from '@/features/ActivityInfo/ActivityInfo'
import {EcrecCashRegistrationPaymentStatus} from '@/core/sdk/server/kobo/custom/KoboEcrecCashRegistration'
import groupByGenderAndGroup = Person.groupByGenderAndGroup
import Gender = Person.Gender

export interface AiFslcDataParser {
  all: KoboAnswer<Ecrec_CashRegistration>[],
  activity: AiTypeFslc.Type,
  request: ActiviftyInfoRecords,
}

export class AiFslcData {

  static readonly reqEcrecCashRegistration = (api: ApiSdk) => (period: Period): Promise<AiFslcDataParser[]> => {
    return api.kobo.typedAnswers.searchEcrec_cashRegistration({filters: undefined})
      .then(_ => {
        console.log('before', _.data.length)
        return _.data
          .filter(_ => _.tags?.status === EcrecCashRegistrationPaymentStatus.Paid)
          .map(_ => ({..._, ...getAiLocation(_)}))
      })
      .then(data => {
        console.log('after,', data.length)
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
            },
            {
              by: _ => fnSwitch(_.tags?.program!, {
                CashforAnimalFeed: 450,
                CashforAnimalShelter: 400,
              }, () => 7500)
            },
          ],
          finalTransform: (grouped, [project, oblast, raion, hromada, responseTheme, populationGroup, amount]) => {
            const persons = seq([
              ...grouped.flatMap(_ => ({hh_char_hh_det_age: _.hh_char_hhh_age, hh_char_hh_det_gender: _.hh_char_hhh_gender})),
              ...grouped.flatMap(_ => _.hh_char_hh_det ?? [])
            ]).compactBy('hh_char_hh_det_age').compactBy('hh_char_hh_det_gender').map(_ => {
              return {
                gender: fnSwitch(_.hh_char_hh_det_gender!, {
                  female: Gender.Female,
                  male: Gender.Male,
                }, () => undefined),
                age: _.hh_char_hh_det_age
              }
            })
            const desagreg = groupByGenderAndGroup(Person.ageGroup.Quick)(persons)
            const activity: AiTypeFslc.Type = {
              'Partner Organization': 'Danish Refugee Council',
              // 'Donor'?: '',
              // @ts-ignore
              length: grouped.length,
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
              'Activity status': 'Ongoing',
              // 'Activity Start Date'?: '',
              // 'Activity End Date'?: '',
              'Assistance Modality': 'Cash or Voucher',
              'Cash Delivery Mechanism': 'Bank Transfer',
              'Value per unit': amount,
              'Currency': 'UAH',
              'Frequency': 'One-off',
              'Total Individuals Reached': grouped.sum(_ => _.ben_det_hh_size ?? 0),
              'New unique Individuals Reached': grouped.sum(_ => _.ben_det_hh_size ?? 0),
              'Girls': desagreg['0 - 17']?.Female,
              'Boys': desagreg['0 - 17']?.Male,
              'Adult Women': desagreg['18 - 49']?.Female,
              'Adult Men': desagreg['18 - 49']?.Male,
              'Elderly Women': desagreg['50+']?.Female,
              'Elderly Men': desagreg['50+']?.Male,
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
                activityYYYYMM: format(period.start, 'yyMM'),
                activityIndex: index++,
              })

            })
          }
        })
        return formatted
      })
  }
}