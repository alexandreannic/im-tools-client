import {Partnership_initialQuestionnaireOptions} from './Partnership_initialQuestionnaireOptions'

type Opt<T extends keyof typeof Partnership_initialQuestionnaireOptions> = keyof (typeof Partnership_initialQuestionnaireOptions)[T]

// Form id: a6u7CBysEz746Hdx6pVLzp
export interface Partnership_initialQuestionnaire {
  start: string,
  end: string,
  // [text] Name of the organization
  rdc: string | undefined,
  // [text] Name of the respondent
  rdn: string | undefined,
  // [text] Title, role at the organization
  rdp: string | undefined,
  // [integer] Contact details(cell):
  rdcc: number | undefined,
  // [text] Contact details(e-mail):
  rdce: string | undefined,
  // [select_one] Respondent’s consent to be contacted:
  rdr: undefined | Opt<'hcc'>,
  // [date] Date of creation/registration of CSO:
  idd: Date | undefined,
  // [select_multiple] Type of humanitarian activities:
  ccerho: undefined | Opt<'ccerho'>[],
  // [text] Examples of projects with other interventions (if possible with beneficiary number):
  other_examples: string | undefined,
  // [integer] How many offices do you have
  hmo: number | undefined,
  // [begin_repeat] Office locations
  oflo: {oblast: undefined | Opt<'oblast_aop'> | undefined,settlement: string | undefined | undefined}[] | undefined,
  // [integer] How many locations do you operate in?
  aop: number | undefined,
  // [begin_repeat] Locations of Operation
  loop: {oblast_aop: undefined | Opt<'oblast_aop'> | undefined,settlement_aop: string | undefined | undefined}[] | undefined,
  // [integer] of staff in total
  scs: number | undefined,
  // [integer] of staff with contract
  scf: number | undefined,
  // [integer] of volunteers
  scv: number | undefined,
  // [select_one] Does the CSO have their own warehouse (belonging to the CSO)?
  wayn: undefined | Opt<'hcc'>,
  // [select_multiple] If not, how are items stored?
  was: undefined | Opt<'was'>[],
  // [text] Other:
  waso: string | undefined,
  // [select_multiple] Which (technical) assistance would the CSO require to increase its efficiency in the provision of urgent humanitarian assistance?
  nftw: undefined | Opt<'nftw'>[],
  // [text] Other
  nfto: string | undefined,
  // [select_one] Permission to access hard-to-reach areas:
  ccp: undefined | Opt<'hcc'>,
  // [text] If yes, from whom:
  ccpy: string | undefined,
  // [select_one] Cooperation with UN Agencies and INGOs:
  hcc: undefined | Opt<'hcc'>,
  // [select_multiple] If yes, which
  hcy: undefined | Opt<'hcy'>[],
  // [text] Other
  hco: string | undefined,
}