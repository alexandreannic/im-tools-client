import {Protection_pss} from '@/core/sdk/server/kobo/generatedInterface/Protection_pss'
import {ProtectionActivity} from '@/features/Protection/Context/protectionType'
import {KoboGeneralMapping} from '@/core/sdk/server/kobo/custom/KoboGeneralMapping'
import {Kobo, KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {DrcProject, DrcProjectHelper} from '@/core/type/drc'
import {Protection_gbv} from '@/core/sdk/server/kobo/generatedInterface/Protection_gbv'
import {Protection_groupSession} from '@/core/sdk/server/kobo/generatedInterface/Protection_groupSession'
import {OblastIndex} from '@/shared/UkraineMap/oblastIndex'
import {AILocationHelper} from '@/core/uaLocation/_LocationHelper'
import {getAiLocation} from '@/features/ActivityInfo/Protection/aiProtectionGeneralMapper'
import {KoboProtection_hhs3} from '@/core/sdk/server/kobo/custom/KoboProtection_hhs3'

export class ProtectionDataHelper {

  static readonly koboForms = [
    'protection_gbv',
    'protection_pss',
    'protection_hhs2_1',
    'protection_groupSession'
  ] as const

  static readonly mapPss = (d: KoboAnswer<Protection_pss.T>): ProtectionActivity => {
    const project = KoboGeneralMapping.mapProject(Protection_pss.options.project[d.project!])
    const aiLoc = getAiLocation(d)
    return {
      ...Kobo.extraxtAnswerMetaData(d),
      date: d.date ?? d.submissionTime,
      koboForm: 'protection_pss',
      office: KoboGeneralMapping.mapOffice(d.staff_to_insert_their_DRC_office),
      oblast: KoboGeneralMapping.mapOblast(d.ben_det_oblast),
      raion: aiLoc.Raion,
      hromada: aiLoc.Hromada,
      project: [project],
      donor: [DrcProjectHelper.donorByProject[project!]],
      persons: d.hh_char_hh_det?.filter((_: any) => _.hh_char_hh_new_ben !== 'no').map(KoboGeneralMapping.mapPersonWithStatus),
    }
  }

  static readonly mapGbv = (d: KoboAnswer<Protection_gbv.T>): ProtectionActivity => {
    const project = KoboGeneralMapping.mapProject(Protection_gbv.options.project[d.project!])
    const aiLoc = getAiLocation(d)
    return {
      ...Kobo.extraxtAnswerMetaData(d),
      date: d.date ?? d.submissionTime,
      koboForm: 'protection_gbv',
      office: KoboGeneralMapping.mapOffice(d.staff_to_insert_their_DRC_office),
      oblast: KoboGeneralMapping.mapOblast(d.ben_det_oblast),
      raion: aiLoc.Raion,
      hromada: aiLoc.Hromada,
      project: [project],
      donor: [DrcProjectHelper.donorByProject[project!]],
      persons: d.hh_char_hh_det?.map(KoboGeneralMapping.mapPersonWithStatus),
    }
  }

  static readonly mapGroupSession = (d: KoboAnswer<Protection_groupSession.T>): ProtectionActivity => {
    const project = KoboGeneralMapping.mapProject(Protection_groupSession.options.project[d.project!])
    const aiLoc = getAiLocation(d)
    return {
      ...Kobo.extraxtAnswerMetaData(d),
      date: d.date ?? d.submissionTime,
      koboForm: 'protection_groupSession',
      office: KoboGeneralMapping.mapOffice(d.staff_to_insert_their_DRC_office),
      oblast: KoboGeneralMapping.mapOblast(d.ben_det_oblast),
      raion: aiLoc.Raion,
      hromada: aiLoc.Hromada,
      project: [project],
      donor: [DrcProjectHelper.donorByProject[project!]],
      persons: d.hh_char_hh_det?.map(KoboGeneralMapping.mapPersonWithStatus),
      // ?.filter((_: any) => _.hh_char_hh_new_ben !== 'no')
    }
  }

  static readonly mapHhs = (d: KoboProtection_hhs3.T): ProtectionActivity => {
    return {
      ...Kobo.extraxtAnswerMetaData(d),
      date: d.submissionTime,
      koboForm: 'protection_hhs2_1',
      office: KoboGeneralMapping.mapOffice(d.staff_to_insert_their_DRC_office),
      oblast: OblastIndex.byIso(d.where_are_you_current_living_oblast),
      raion: AILocationHelper.findRaionByIso(d.where_are_you_current_living_raion)?._5w as any,
      hromada: AILocationHelper.findHromadaByIso(d.where_are_you_current_living_hromada!)?._5w as any,
      project: [...d.tags?.projects ?? [], DrcProject['UKR-000322 ECHO2']],
      donor: d.tags?.projects?.map(_ => DrcProjectHelper.donorByProject[_!]),
      persons: d.persons
    }
  }
}