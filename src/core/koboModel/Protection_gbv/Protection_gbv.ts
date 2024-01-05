import {Protection_gbvOptions} from './Protection_gbvOptions'

type Opt<T extends keyof typeof Protection_gbvOptions> = keyof (typeof Protection_gbvOptions)[T]

// Form id: a5Noq6Wf9a8aE2cmi74FyS
export interface Protection_gbv {
  start: string,
  end: string,
  // [date] Date of activity
  date: Date | undefined,
  // [select_one] DRC office
  staff_to_insert_their_DRC_office: undefined | Opt<'staff_to_insert_their_DRC_office'>,
  // [select_one] Staff code (facilitator 1)
  staff_code: undefined | Opt<'staff_code_001'>,
  // [select_one] Staff code (facilitator 2)
  staff_code_001: undefined | Opt<'staff_code_001'>,
  // [select_one] Project code
  project: undefined | Opt<'project'>,
  // [select_one] Select oblast
  ben_det_oblast: undefined | Opt<'ben_det_oblast'>,
  // [select_one] Select raion
  ben_det_raion: undefined | string,
  // [select_one] Select hromada
  ben_det_hromada: undefined | string,
  // [text] Specify settlement/village/city neighborhood
  ben_det_hromada_001: string | undefined,
  // [select_one] Location
  location: undefined | Opt<'location'>,
  // [text] If "Other", please specify
  location_other: string | undefined,
  // [select_multiple] Which activity have you conducted?
  activity: undefined | Opt<'activity'>[],
  // [text] If "Other", please specify
  activity_other: string | undefined,
  // [select_one] Are there new beneficiaries in the group activity?
  new_ben: undefined | Opt<'new_ben'>,
  // [integer] If yes there are new beneficairies, how many new beneficiaries in the session?
  new_ben_yes: number | undefined,
  // [integer] Number of participants
  numb_part: number | undefined,
  // [begin_repeat] Participant
  hh_char_hh_det: {hh_char_hh_det_gender: undefined | Opt<'hh_char_hh_det_gender'> | undefined,hh_char_hh_det_age: number | undefined | undefined,hh_char_hh_det_status: undefined | Opt<'hh_char_hh_det_status'> | undefined}[] | undefined,
  // [text] Topic/Type of activity
  topic_activity: string | undefined,
  // [text] Comments
  comments: string | undefined,
}