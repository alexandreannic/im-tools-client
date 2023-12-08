import {AiProtectionGeneralType} from '@/features/ActivityInfo/Protection/aiProtectionGeneralType'
import {OblastIndex} from '@/shared/UkraineMap/oblastIndex'
import {fnSwitch, PromiseReturn, seq} from '@alexandreannic/ts-utils'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {Person} from '@/core/type'
import {Protection_groupSession} from '@/core/koboModel/Protection_groupSession/Protection_groupSession'
import {AILocationHelper} from '@/core/uaLocation/_LocationHelper'
import {DrcProject} from '@/core/drcUa'
import {enrichProtHHS_2_1} from '@/features/Dashboard/DashboardHHS2/dashboardHelper'
import Gender = Person.Gender
import {Bn_ReOptions} from '@/core/koboModel/Bn_Re/Bn_ReOptions'

const disaggregatePersons = (persons: Person.Person[]) => {
  const personsDefined = seq(persons)
  const children = personsDefined.filter(_ => _.age && _.age < 18)
  const adults = personsDefined.filter(_ => !_.age || _.age >= 18 && !Person.isElderly(_.age))
  const elderly = personsDefined.filter(_ => _.age && Person.isElderly(_.age))
  return {
    'Adult Men': adults.count(_ => _.gender === 'Male'),
    'Adult Women': adults.count(_ => _.gender !== 'Male'),
    'Boys': children.count(_ => _.gender === 'Male'),
    'Girls': children.count(_ => _.gender !== 'Male'),
    'Elderly Men': elderly.count(_ => _.gender === 'Male'),
    'Elderly Women': elderly.count(_ => _.gender !== 'Male'),
    'Total Individuals Reached': personsDefined.length,
  }
}

export const getAiLocation = (d: Pick<Protection_groupSession, 'ben_det_oblast' | 'ben_det_hromada' | 'ben_det_raion'>) => {
  const oblast = OblastIndex.byKoboName(d.ben_det_oblast!).name
  const raion = AILocationHelper.findRaion(oblast, Bn_ReOptions.ben_det_raion[d.ben_det_raion as keyof typeof Bn_ReOptions.ben_det_raion] ?? d.ben_det_raion)!
  const hromada = AILocationHelper.findHromada(oblast, raion?.en, Bn_ReOptions.ben_det_hromada[d.ben_det_hromada as keyof typeof Bn_ReOptions.ben_det_hromada] ?? d.ben_det_hromada)
  return {
    Oblast: AILocationHelper.findOblast(oblast)!,
    Raion: raion?._5w as any,
    Hromada: hromada?._5w as any,
  }
}

export class ActivityInfoProtectionMapper {

  static readonly mapHhs = (reportingMonth: string) => (res: PromiseReturn<ReturnType<ApiSdk['kobo']['typedAnswers']['searchProtection_Hhs2']>>) => {
    const data: AiProtectionGeneralType.Data[] = []

    res.data.map(enrichProtHHS_2_1).forEach(d => {
      d.persons!.forEach(ind => {
        data.push({
          answer: d,
          Oblast: AILocationHelper.findOblast(OblastIndex.byIso(d.where_are_you_current_living_oblast).name)!,
          Raion: AILocationHelper.findRaionByIso(d.where_are_you_current_living_raion)._5w as any,
          Hromada: AILocationHelper.findHromadaByIso(d.where_are_you_current_living_hromada)._5w as any,
          ...disaggregatePersons([ind]),
          'Reporting Month': reportingMonth,
          'Plan Code': fnSwitch(d.tags?.projects?.[0]!, AiProtectionGeneralType.planCode, () => undefined)!,
          'Population Group': fnSwitch(d.do_you_identify_as_any_of_the_following!, {
            returnee: 'Returnees',
            idp: 'IDPs',
            non_displaced: 'Non-Displaced',
          }, () => {
            // throw new Error(`Population Group should be defined Group session ${d.id}`)
            return 'Non-Displaced'
          }),
          'Protection Indicators': '# of persons reached through protection monitoring',
        })
      })
    })
    return data
  }

  static readonly mapGroupSession = (reportingMonth: string) => (res: PromiseReturn<ReturnType<ApiSdk['kobo']['typedAnswers']['searchProtection_groupSession']>>) => {
    const data: AiProtectionGeneralType.Data[] = []

    res.data.forEach(d => {
      const project = fnSwitch(d.project!, {
        bha: DrcProject['UKR-000345 BHA2'],
        echo: DrcProject['UKR-000322 ECHO2'],
        novo: DrcProject['UKR-000298 Novo-Nordisk'],
        okf: DrcProject['UKR-000309 OKF'],
        uhf4: DrcProject['UKR-000314 UHF4'],
        uhf6: DrcProject['UKR-000336 UHF6'],
      }, () => undefined)
      d.hh_char_hh_det!.forEach(ind => {
        data.push({
          answer: d,
          ...getAiLocation(d),
          ...disaggregatePersons([{
            age: ind.hh_char_hh_det_age,
            gender: fnSwitch(ind.hh_char_hh_det_gender!, {
              female: Gender.Female,
              male: Gender.Male,
              other: Gender.Other,
            }, () => undefined)
          }]),
          'Reporting Month': reportingMonth,
          'Plan Code': fnSwitch(project!, AiProtectionGeneralType.planCode, () => undefined)!,
          'Population Group': fnSwitch(ind.hh_char_hh_det_status!, {
            returnee: 'Returnees',
            idp: 'IDPs',
            'non-displaced': 'Non-Displaced',
          }, () => {
            // throw new Error(`Population Group should be defined Group session ${d.id}`)
            return 'Non-Displaced'
          }),
          'Protection Indicators': '# of persons who participated in awareness raising activities - GP',
        })
      })
    })
    return data
  }

  static readonly mapCommunityMonitoring = (reportingMonth: string) => (res: PromiseReturn<ReturnType<ApiSdk['kobo']['typedAnswers']['searchProtection_communityMonitoring']>>) => {
    const data: AiProtectionGeneralType.Data[] = []
    res.data.forEach(d => {
      switch (d.activity) {
        case 'kll': {
          data.push({
            answer: d,
            ...getAiLocation(d),
            ...disaggregatePersons([{
              age: d.informant_age,
              gender: fnSwitch(d.informant_gender!, {
                female: Gender.Female,
                male: Gender.Male,
                other: Gender.Other,
              }, () => undefined)
            }]),
            'Reporting Month': reportingMonth,
            'Plan Code': fnSwitch(d.tags?.project!, AiProtectionGeneralType.planCode, () => undefined)!,
            'Population Group': fnSwitch(d.informant_status!, {
              returnee: 'Returnees',
              idp: 'IDPs',
              'non-displaced': 'Non-Displaced',
            }, () => {
              return 'Non-Displaced'
              // throw new Error(`Population Group should be defined Community Monitoring ${d.id}`)
            }),
            'Protection Indicators': '# of key informants reached through community level protection monitoring',
          })
          break
        }
        case 'fgd': {
          d.hh_char_hh_det!.forEach(ind => {
            data.push({
              answer: d,
              ...getAiLocation(d),
              ...disaggregatePersons([{
                age: ind.hh_char_hh_det_age,
                gender: fnSwitch(ind.hh_char_hh_det_gender!, {
                  female: Gender.Female,
                  male: Gender.Male,
                  other: Gender.Other,
                }, () => undefined)
              }]),
              'Reporting Month': reportingMonth,
              'Plan Code': fnSwitch(d.tags?.project!, AiProtectionGeneralType.planCode, () => undefined)!,
              'Population Group': fnSwitch(ind.hh_char_hh_det_status!, {
                returnee: 'Returnees',
                idp: 'IDPs',
                'non-displaced': 'Non-Displaced',
              }, () => {
                return 'Non-Displaced'
                // throw new Error(`Population Group should be defined Community Monitoring ${d.id}`)
              }),
              'Protection Indicators': '# of key informants reached through community level protection monitoring',
            })
          })
          break
        }
      }
    })
    return data
  }
}

