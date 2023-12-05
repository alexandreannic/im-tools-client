import {Partnership_assessmentOptions} from './Partnership_assessmentOptions'

type Opt<T extends keyof typeof Partnership_assessmentOptions> = keyof (typeof Partnership_assessmentOptions)[T]

// Form id: aLD2Xc9cKSY22c5cAP5utT
export interface Partnership_assessment {
  start: string,
  end: string,
  // [text] Name:
  idn: string | undefined,
  // [text] Position:
  idp: string | undefined,
  // [date] Date of assessment:
  idd: Date | undefined,
  // [text] What is the name of the CSO
  rdc: string | undefined,
  // [text] What is the name of the individual being interviewed
  rdn: string | undefined,
  // [text] What is the position of the individual being interviewed
  rdp: string | undefined,
  // [integer] Contact details(cell):
  rdcc: number | undefined,
  // [text] Contact details(e-mail):
  rdce: string | undefined,
  // [text] Website, social media link
  rdwsm: string | undefined,
  // [select_one] Respondent’s consent to be contacted:
  rdr: undefined | Opt<'hcp'>,
  // [date] Date of creation/registration of CSO:
  idd_001: Date | undefined,
  // [select_multiple] Type of humanitarian activities:
  ccerho: undefined | Opt<'ccerho'>[],
  // [text] Examples of projects with Food and Nutrition (if possible with beneficiary number):
  food_examples: string | undefined,
  // [text] Examples of projects with Shelter (if possible with beneficiary number):
  shelter_examples: string | undefined,
  // [text] Examples of projects with water, sanitation, and hygiene (if possible with beneficiary number):
  wash_examples: string | undefined,
  // [text] Examples of projects with medical (if possible with beneficiary number):
  medical_example: string | undefined,
  // [text] Examples of projects with Evacuation (if possible with beneficiary number):
  evacuation_examples: string | undefined,
  // [text] Examples of projects with other interventions (if possible with beneficiary number):
  other_examples: string | undefined,
  // [select_one] (Direct) frontline response?
  ccerd: undefined | Opt<'hcp'>,
  // [integer] How many offices do you have
  hmo: number | undefined,
  // [begin_repeat] Office locations
  oflo: {oblast: undefined | Opt<'oblast_aop'> | undefined,settlement: string | undefined | undefined,gml: string | undefined | undefined}[] | undefined,
  // [integer] How many locations do you operate in?
  aop: number | undefined,
  // [begin_repeat] Locations of Operation
  loop: {oblast_aop: undefined | Opt<'oblast_aop'> | undefined,com: string | undefined | undefined}[] | undefined,
  // [integer] of staff in total
  scs: number | undefined,
  // [integer] of fulltime staff
  scf: number | undefined,
  // [integer] of part time staff
  scp: number | undefined,
  // [integer] of volunteers
  scv: number | undefined,
  // [select_one] Does the CSO have their own warehouse (belonging to the CSO)?
  wayn: undefined | Opt<'hcp'>,
  // [integer] Number of warehouses
  wa_001: number | undefined,
  // [select_multiple] If not, how are items stored?
  was: undefined | Opt<'was'>[],
  // [text] Other:
  waso: string | undefined,
  // [select_one] Does the CSO have its own safety and security policies, protocols and procedures?
  sasd: undefined | Opt<'hcp'>,
  // [select_one] Is relevant Personal Protective Equipment (PPE) and safety equipment in place?
  ser: undefined | Opt<'hcp'>,
  // [select_multiple] If yes, which:
  sery: undefined | Opt<'sery'>[],
  // [text] If other, specify
  other_spe: string | undefined,
  // [select_one] Are first aid kits in place:
  serk: undefined | Opt<'hcp'>,
  // [select_one] Were relevant trainings conducted?
  sert: undefined | Opt<'hcp'>,
  // [select_multiple] If yes, which:
  set: undefined | Opt<'set'>[],
  // [text] If other, specify
  other_spec: string | undefined,
  // [select_multiple] Operational challenges:
  oc: undefined | Opt<'oc'>[],
  // [text] Other
  oco: string | undefined,
  // [select_multiple] Which (technical) assistance would the CSO require to increase its efficiency in the provision of urgent humanitarian assistance?
  nftw: undefined | Opt<'nftw'>[],
  // [text] Other
  nfto: string | undefined,
  // [select_one] Are CSO’s staff members receiving psycho-social support (PSS)?
  npsa: undefined | Opt<'hcp'>,
  // [select_one] Is staff trained on psychological first aid (PFA)?
  npsi: undefined | Opt<'hcp'>,
  // [select_one] Has the CSO participated in capacity-building trainings, sessions, workshops etc. after 24 February 2022?
  nfch: undefined | Opt<'hcp'>,
  // [text] If yes, please mention what kind of training sessions and which topics were provided, when and how many CSO’s staff members participated
  nfci: string | undefined,
  // [select_multiple] What kind of capacity needs to be addressed?
  nfcf: undefined | Opt<'nfcf'>[],
  // [text] Other
  nfco: string | undefined,
  // [select_one] Cooperation with authorities (please, specify national, regional or local level):
  cca: undefined | Opt<'hcp'>,
  // [select_multiple] If yes, which:
  ccy: undefined | Opt<'ccy'>[],
  // [select_one] Permission to access hard-to-reach areas:
  ccp: undefined | Opt<'hcp'>,
  // [text] If yes, from whom:
  ccpy: string | undefined,
  // [select_one] Established partnership/cooperation with other CSOs:
  cce: undefined | Opt<'hcp'>,
  // [text] If yes, please name the organizations
  ccey: string | undefined,
  // [text] Nature of partnership/cooperation:
  ccn: string | undefined,
  // [select_one] Cooperation with private sector bodies:
  ccc: undefined | Opt<'hcp'>,
  // [text] If yes, which
  cccy: string | undefined,
  // [select_one] Cooperation with UN Agencies and INGOs:
  hcc: undefined | Opt<'hcp'>,
  // [select_multiple] If yes, which
  hcy: undefined | Opt<'hcy'>[],
  // [text] Other:
  hco: string | undefined,
  // [select_one] Participation in Humanitarian Cluster System (Shelter, Protection, WASH Cluster etc.):
  hcp: undefined | Opt<'hcp'>,
  // [text] If yes, which
  hcpy: string | undefined,
  // [text] Other information provided that might be valuable and helpful:
  aoo: string | undefined,
  // [text] Flag any other relevant information, red flags, overall comments and assessment
  aoc: string | undefined,
}