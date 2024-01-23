import {Protection_pss} from '@/core/generatedKoboInterface/Protection_pss'
import {ProtectionActivity} from '@/features/Protection/Context/protectionType'
import {KoboGeneralMapping} from '@/core/koboForms/koboGeneralMapping'
import {Kobo, KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {DrcProject, DrcProjectHelper} from '@/core/type/drc'
import {Protection_gbv} from '@/core/generatedKoboInterface/Protection_gbv'
import {Protection_groupSession} from '@/core/generatedKoboInterface/Protection_groupSession'
import {ProtHHS2Enrich} from '@/features/Protection/DashboardMonito/dashboardHelper'
import {OblastIndex} from '@/shared/UkraineMap/oblastIndex'
import {AILocationHelper} from '@/core/uaLocation/_LocationHelper'
import {getAiLocation} from '@/features/ActivityInfo/Protection/aiProtectionGeneralMapper'

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
      oblast: KoboGeneralMapping.mapOblast(d.ben_det_oblast)?.name,
      raion: aiLoc.Raion,
      hromada: aiLoc.Hromada,
      project: [project],
      donor: [DrcProjectHelper.donorByProject[project!]],
      persons: d.hh_char_hh_det?.map(KoboGeneralMapping.mapPersonWithStatus),
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
      oblast: KoboGeneralMapping.mapOblast(d.ben_det_oblast)?.name,
      raion: aiLoc.Raion,
      hromada: aiLoc.Hromada,
      project: [project],
      donor: [DrcProjectHelper.donorByProject[project!]],
      persons: d.hh_char_hh_det?.map(KoboGeneralMapping.mapPerson),
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
      oblast: KoboGeneralMapping.mapOblast(d.ben_det_oblast)?.name,
      raion: aiLoc.Raion,
      hromada: aiLoc.Hromada,
      project: [project],
      donor: [DrcProjectHelper.donorByProject[project!]],
      persons: d.hh_char_hh_det?.map(KoboGeneralMapping.mapPerson),
    }
  }

  static readonly mapHhs = (d: ProtHHS2Enrich): ProtectionActivity => {
    return {
      ...Kobo.extraxtAnswerMetaData(d),
      date: d.submissionTime,
      koboForm: 'protection_hhs2_1',
      office: KoboGeneralMapping.mapOffice(d.staff_to_insert_their_DRC_office),
      oblast: OblastIndex.byIso(d.where_are_you_current_living_oblast).name,
      raion: AILocationHelper.findRaionByIso(d.where_are_you_current_living_raion)?._5w as any,
      hromada: AILocationHelper.findHromadaByIso(d.where_are_you_current_living_hromada)?._5w as any,
      project: [...d.tags?.projects ?? [], DrcProject['UKR-000322 ECHO2']],
      donor: d.tags?.projects?.map(_ => DrcProjectHelper.donorByProject[_!]),
      persons: d.persons,
    }
  }
}