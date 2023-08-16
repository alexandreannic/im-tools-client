import {MealCfmExternalOptions} from './MealCfmExternalOptions'

type Opt<T extends keyof typeof MealCfmExternalOptions> = keyof (typeof MealCfmExternalOptions)[T]

export interface MealCfmExternal {
  start: string,
  end: string,
  // [note] Please note that you are about to share your personal contact details with DRC in order for the team to respond to your feedback. Please do not continue with our survey if you do not wish to share your contact details, and instead you may contact us on our helpline instead.
  consent: string,
  // [select_one] Are you an existing beneficiary of DRC?
  existing_beneficiary: undefined | Opt<'prot_support'>,
  // [text] If yes, please explain your interaction with DRC support
  explain_beneficiary: string | undefined,
  // [text] Name
  name: string | undefined,
  // [select_one] Gender
  gender: undefined | Opt<'gender'>,
  // [date] Date
  date: Date | undefined,
  // [integer] Phone
  phone: string | undefined,
  // [text] Email
  email: string | undefined,
  // [note] <span style="border-radius: 3px; padding: 4px; color: #a94442; font-weight: bold; background: rgb(242, 222, 222)">Please fill email or phone number</span>
  validation_at_least_one_contact: string,
  // [select_one] Select your oblast of residence
  ben_det_oblast: undefined | Opt<'ben_det_oblast'>,
  // [select_one] Select your raion of residence
  ben_det_raion: undefined | string,
  // [select_one] Select your Hromada of residence
  ben_det_hromada: undefined | string,
  // [select_one] How can we support you?
  feedback_type: undefined | Opt<'feedback_type'>,
  // [text] If thanks, or a feedback, please provide further information
  thanks_feedback: string | undefined,
  // [text] Please provide information regarding your complaint
  complaint: string | undefined,
  // [select_one] Is this a topic you are happy to discuss with our DRC team, or would you like to speak to an individual who is trained in dealing with sensitive cases?
  prot_support: undefined | Opt<'prot_support'>,
  // [note] Thank you for completing this survey, you can use these feedback tool at any time, or call our CFM hotline number.
  thanks: string,
}