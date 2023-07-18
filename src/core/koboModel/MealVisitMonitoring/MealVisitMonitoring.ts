import {MealVisitMonitoringOptions} from './MealVisitMonitoringOptions'

type Opt<T extends keyof typeof MealVisitMonitoringOptions> = keyof (typeof MealVisitMonitoringOptions)[T]

export interface MealVisitMonitoring {
  start: string,
  end: string,
  // Area
  mda: Opt<'mda'>,
  // Responsible office:
  mdro: Opt<'mdro'>,
  // Date of visit
  mdd: Date | undefined,
  // Oblast
  md_det_oblast: Opt<'md_det_oblast'>,
  // Raion
  md_det_raion: Opt<'md_det_raion'>,
  // Hromada
  md_det_hromada: Opt<'md_det_hromada'>,
  // Settlement
  mds: string | undefined,
  // MEAL Focal Point
  mdp: Opt<'mdp'>,
  // DONOR:
  mdd_001: Opt<'mdd_001'>[],
  // With which team was conducted visit?
  mdt: Opt<'mdt'>[],
  // Name of collective center?
  mdc: string | undefined,
  // Other:
  mdo: string | undefined,
  // If NFI distribution, then:
  pan: Opt<'pan'>[],
  // If EcRec:
  pae: Opt<'pae'>,
  // If Shelter:
  pas: Opt<'pas'>,
  // If LAU:
  pal: Opt<'pal'>,
  // If Protection:
  pap: Opt<'pap'>,
  // If EORE:
  pao: Opt<'pao'>,
  // Other:
  paoth: string | undefined,
  // What percentage of beneficiaries for this activity are male?
  sem: number | undefined,
  // What percentage of beneficiaries for this activity are female?
  sew: number | undefined,
  // If a NFI distribution: Are there priority queues for vulnerable individuals?
  sey: Opt<'visf'>,
  // If no, please explain why:
  set: string | undefined,
  // Any concerns to flag?
  sef: Opt<'visf'>,
  // If YES – Details to be provided
  sei: Opt<'sei'>[],
  // Were there any security concerns during this activity?
  ssy: Opt<'visf'>,
  // If yes, please select the type of situation:
  sst: Opt<'sst'>[],
  // Other:
  sso: string | undefined,
  // Did DRC staff inform beneficiaries of how they can provide feedback through the CFM mechanism?
  ccm: Opt<'visf'>,
  // If no, please explain why:
  ccn: string | undefined,
  // Was DRC staff behaviour in line with DRC Code of Conduct standards?
  ccs: Opt<'visf'>,
  // If no, please explain why:
  ccsn: string | undefined,
  // Did any beneficiaries report of not feeling safe around DRC staff?
  ccd: Opt<'visf'>,
  // If no, please explain why:
  ccdn: string | undefined,
  // Were CFM flyers distributed?
  ccc: Opt<'visf'>,
  // If no, please explain why:
  cccn: string | undefined,
  // Have you been asked for permission to collect your data?
  pmid: Opt<'visf'>,
  // If no, please explain why:
  pmidn: string | undefined,
  // For vulnerable staff, were issues handled with care and confidentiality?
  pmic: Opt<'visf'>,
  // If no, please explain why:
  pmicn: string | undefined,
  // Was the assistance from DRC timely for people?
  qtip: Opt<'visf'>,
  // If no, please explain why:
  qtipn: string | undefined,
  // Was the activity of quality and in line with the planned activity?
  qtia: Opt<'visf'>,
  // If no, please explain why:
  qtian: string | undefined,
  // Were all DRC staff in visibility and easily identified by beneficiaries?
  visb: Opt<'visf'>,
  // If no, please explain why:
  visbn: string | undefined,
  // Any critical concerns to flag?
  visf: Opt<'visf'>,
  // If YES, ‘’any details to be provided’’
  visp: Opt<'visp'>[],
  // Other:
  vispo: string | undefined,
  // Comments
  fcpc: string | undefined,
  // The photo of the visit
  fcp1: string,
  // The photo of the visit
  fcp2: string,
  // The photo of the visit
  fcp3: string,
  // The photo of the visit
  fcp4: string,
  // The photo of the visit
  fcp5: string,
  // The photo of the visit
  fcp6: string,
  // The photo of the visit
  fcp7: string,
  // The photo of the visit
  fcp8: string,
  // The photo of the visit
  fcp9: string,
  // The photo of the visit
  fcp10: string,
  // Link to the folder with photos
  fcpl: string | undefined,
}