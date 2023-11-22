import {Meal_VisitMonitoringOptions} from './Meal_VisitMonitoringOptions'

type Opt<T extends keyof typeof Meal_VisitMonitoringOptions> = keyof (typeof Meal_VisitMonitoringOptions)[T]

// Form id: a8GkjWBQDfxVADGHWJDrUw
export interface Meal_VisitMonitoring {
  start: string,
  end: string,
  // [select_one] Area
  mda: undefined | Opt<'mda'>,
  // [select_one] Responsible office:
  mdro: undefined | Opt<'mdro'>,
  // [date] Date of visit
  mdd: Date | undefined,
  // [select_one] Oblast
  md_det_oblast: undefined | Opt<'md_det_oblast'>,
  // [select_one] Raion
  md_det_raion: undefined | Opt<'md_det_raion'>,
  // [select_one] Hromada
  md_det_hromada: undefined | Opt<'md_det_hromada'>,
  // [text] Settlement
  mds: string | undefined,
  // [text] Location details
  location_details: string | undefined,
  // [select_one] MEAL Focal Point
  mdp: undefined | Opt<'mdp'>,
  // [select_multiple] DONOR:
  mdd_001: undefined | Opt<'mdd_001'>[],
  // [select_multiple] With which team was conducted visit?
  mdt: undefined | Opt<'mdt'>[],
  // [text] With whom?
  whom: string | undefined,
  // [select_one] Visit type?
  visit_type: undefined | Opt<'visit_type'>,
  // [text] Please specify
  visit_type_specify: string | undefined,
  // [text] Name of collective center?
  mdc: string | undefined,
  // [text] Other:
  mdo: string | undefined,
  // [select_multiple] If NFI distribution, then:
  pan: undefined | Opt<'pan'>[],
  // [select_one] If EcRec:
  pae: undefined | Opt<'pae'>,
  // [select_one] If Shelter:
  pas: undefined | Opt<'pas'>,
  // [select_one] If LAU:
  pal: undefined | Opt<'pal'>,
  // [select_one] If Protection:
  pap: undefined | Opt<'pap'>,
  // [select_one] If EORE:
  pao: undefined | Opt<'pao'>,
  // [text] Other:
  paoth: string | undefined,
  // [integer] What percentage of beneficiaries for this activity are male?
  sem: number | undefined,
  // [integer] What percentage of beneficiaries for this activity are female?
  sew: number | undefined,
  // [select_one] If a NFI distribution: Are there priority queues for vulnerable individuals?
  sey: undefined | Opt<'visf'>,
  // [text] If no, please explain why:
  set: string | undefined,
  // [select_one] Any concerns to flag?
  sef: undefined | Opt<'visf'>,
  // [select_multiple] If YES – Details to be provided
  sei: undefined | Opt<'sei'>[],
  // [select_one] Were there any security concerns during this activity?
  ssy: undefined | Opt<'visf'>,
  // [select_multiple] If yes, please select the type of situation:
  sst: undefined | Opt<'sst'>[],
  // [text] Other:
  sso: string | undefined,
  // [select_one] Did DRC staff inform beneficiaries of how they can provide feedback through the CFM mechanism?
  ccm: undefined | Opt<'visf'>,
  // [text] If no, please explain why:
  ccn: string | undefined,
  // [select_one] Was DRC staff behaviour in line with DRC Code of Conduct standards?
  ccs: undefined | Opt<'visf'>,
  // [text] If no, please explain why:
  ccsn: string | undefined,
  // [select_one] Did any beneficiaries report of not feeling safe around DRC staff?
  ccd: undefined | Opt<'visf'>,
  // [text] If no, please explain why:
  ccdn: string | undefined,
  // [select_one] Were CFM flyers distributed?
  ccc: undefined | Opt<'visf'>,
  // [text] If no, please explain why:
  cccn: string | undefined,
  // [select_one] Have you been asked for permission to collect your data?
  pmid: undefined | Opt<'visf'>,
  // [text] If no, please explain why:
  pmidn: string | undefined,
  // [select_one] For vulnerable staff, were issues handled with care and confidentiality?
  pmic: undefined | Opt<'visf'>,
  // [text] If no, please explain why:
  pmicn: string | undefined,
  // [select_one] Was the assistance from DRC timely for people?
  qtip: undefined | Opt<'visf'>,
  // [text] If no, please explain why:
  qtipn: string | undefined,
  // [select_one] Was the activity of quality and in line with the planned activity?
  qtia: undefined | Opt<'visf'>,
  // [text] If no, please explain why:
  qtian: string | undefined,
  // [select_one] Were all DRC staff in visibility and easily identified by beneficiaries?
  visb: undefined | Opt<'visf'>,
  // [text] If no, please explain why:
  visbn: string | undefined,
  // [select_one] Any critical concerns to flag?
  visf: undefined | Opt<'visf'>,
  // [select_multiple] If YES, ‘’any details to be provided’’
  visp: undefined | Opt<'visp'>[],
  // [text] Other:
  vispo: string | undefined,
  // [text] Comments
  fcpc: string | undefined,
  // [note] Photos of the visit
  fspp: string,
  // [image] The photo of the visit
  fcp1: string,
  // [image] The photo of the visit
  fcp2: string,
  // [image] The photo of the visit
  fcp3: string,
  // [image] The photo of the visit
  fcp4: string,
  // [image] The photo of the visit
  fcp5: string,
  // [image] The photo of the visit
  fcp6: string,
  // [image] The photo of the visit
  fcp7: string,
  // [image] The photo of the visit
  fcp8: string,
  // [image] The photo of the visit
  fcp9: string,
  // [image] The photo of the visit
  fcp10: string,
  // [text] Link to the folder with photos
  fcpl: string | undefined,
}