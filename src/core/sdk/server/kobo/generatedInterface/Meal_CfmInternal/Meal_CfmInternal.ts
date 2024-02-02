import {Meal_CfmInternalOptions} from './Meal_CfmInternalOptions'

type Opt<T extends keyof typeof Meal_CfmInternalOptions> = keyof (typeof Meal_CfmInternalOptions)[T]

// Form id: aN3Y8JeH2fU3GthrWAs9FG
export interface Meal_CfmInternal {
  start: string,
  end: string,
  // [select_one] Is this an existing beneficiary of DRC?
  existing_beneficiary: undefined | Opt<'existing_beneficiary'>,
  // [select_one] If yes, please enter the project code
  project_code: undefined | Opt<'project_code'>,
  // [text] Please specify
  project_code_specify: string | undefined,
  // [text] Name
  name: string | undefined,
  // [select_one] Gender
  gender: undefined | Opt<'gender'>,
  // [date] Date
  date: Date | undefined,
  // [text] Phone
  phone: string | undefined,
  // [text] Email
  email: string | undefined,
  // [note] <span style="border-radius: 3px; padding: 4px; color: #a94442; font-weight: bold; background: rgb(242, 222, 222)">Please fill email or phone number</span>
  validation_at_least_one_contact: string,
  // [select_one] Select the oblast of residence
  ben_det_oblast: undefined | Opt<'ben_det_oblast'>,
  // [select_one] Select the raion of residence
  ben_det_raion: undefined | string,
  // [select_one] Select the Hromada of residence
  ben_det_hromada: undefined | string,
  // [select_one] What is the method for submitting feedback?
  feedback_method: undefined | Opt<'feedback_method'>,
  // [text] Please specify
  feedback_method_other: string | undefined,
  // [select_one] What is the Feedback Category?
  feedback_type: undefined | Opt<'feedback_type'>,
  // [note] ⚠️ Please ensure this is flagged through the appropriate CoC focal point
  feedback_coc_type: string,
  // [text] Please enter the feedback
  feedback: string | undefined,
}