import {Protection_communityMonitoringOptions} from './Protection_communityMonitoringOptions'

type Opt<T extends keyof typeof Protection_communityMonitoringOptions> = keyof (typeof Protection_communityMonitoringOptions)[T]

export interface Protection_communityMonitoring {
  start: string,
  end: string,
  // [date] Date
  date: Date | undefined,
  // [select_one] DRC office
  staff_to_insert_their_DRC_office: undefined | Opt<'staff_to_insert_their_DRC_office'>,
  // [select_one] Staff code (facilitator)
  staff_code: undefined | Opt<'staff_code_001'>,
  // [select_one] Staff code (notetaker)
  staff_code_001: undefined | Opt<'staff_code_001'>,
  // [select_one] Select oblast
  ben_det_oblast: undefined | Opt<'ben_det_oblast'>,
  // [select_one] Select raion
  ben_det_raion: undefined | string,
  // [select_one] Select hromada
  ben_det_hromada: undefined | string,
  // [text] Specify settlement/village/city neighborhood
  ben_det_hromada_001: string | undefined,
  // [select_one] Type of site
  ben_det_type_site: undefined | Opt<'ben_det_type_site'>,
  // [select_one] Which activity have you conducted?
  activity: undefined | Opt<'activity'>,
  // [select_one] Is it a PMT KII (NPC)?
  pmt_npc: undefined | Opt<'pmt_npc'>,
  // [select_one] Key informant role
  informant_role: undefined | Opt<'informant_role'>,
  // [text] If "Other", please specify
  informant_role_other: string | undefined,
  // [select_one] Key informant gender
  informant_gender: undefined | Opt<'hh_char_hh_det_gender'>,
  // [integer] Key informant age
  informant_age: number | undefined,
  // [select_one] Key informant displacement status
  informant_status: undefined | Opt<'hh_char_hh_det_status'>,
  // [integer] Number of participants
  numb_part: number | undefined,
  // [begin_repeat] FGD participant
  hh_char_hh_det: {hh_char_hh_det_gender: undefined | Opt<'hh_char_hh_det_gender'> | undefined,hh_char_hh_det_age: number | undefined | undefined,hh_char_hh_det_status: undefined | Opt<'hh_char_hh_det_status'> | undefined}[] | undefined,
  // [text] Topic
  topic: string | undefined,
  // [text] Comments
  comments: string | undefined,
}