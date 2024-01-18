import {Bn_cashForRentApplicationOptions} from './Bn_cashForRentApplicationOptions'

type Opt<T extends keyof typeof Bn_cashForRentApplicationOptions> = keyof (typeof Bn_cashForRentApplicationOptions)[T]

export interface Bn_cashForRentApplication {
  start: string,
  end: string,
  // [note] Disclaimer:  With support from the European Union, Danish Refugee Council (DRC) will provide financial assistance to internally displaced people to rent safe and adequate housing. This programme is being implemented in the following regions:  Dnipropetrivska oblast: Zhovty Vody, Kryvyi Rih, Kamyanske, Pavlograd, and Novomoskovsk   Lvivska oblast: Lviv, Stryi and Drohobuch raions. Due to high level of interest, the deadline for applications from Lvivska oblast: Lviv, Stryi and Drohobych raions is 31 August 2023.  Applications received after this date will not be considered.  Other locations will not be considered at this time.  Financial assistance is provided for a period of 6 months and will be paid in two installments: the first installment (for the first three months) within one to two weeks after the application is approved (upon presenting a signed lease agreement), and the second installment (for the next three months) three months after the payment of the first installment. The approval of the second installment will be subject to the applicant meeting the following program criteria:  • DRC employees will be granted access to the leased accommodation.  • The applicant will be able to provide proof of rent payment (bank statement, payment receipt indicating the purpose of the payment, etc.).  Amount of financial support, per month: HH Size  1 - 3 - UAH 6,500                                 4 - UAH 7,000   5+ - UAH 8,500  Example of assistance calculation: A family of four can receive financial assistance for rent in the amount of 7,000 UAH x 3 months = 21,000 UAH (first payment), and 21,000 UAH (second payment).  The following groups are the primary target for cash for rent programme:  • Households which have been displaced from the settlements indicated according to Order of the Ministry of Reintegration of Temporary Occupied Territories of Ukraine dated December 22, 2022 No. 309, or from areas which are regularly under attack and located within 30km of the confrontation lines or border areas with Russia or Belarus. • Households whose home has been significantly damaged (i.e., the level of destruction does not allow living in the house) or destroyed by shelling or other disasters such as flood, wildfire etc., since February 24, 2022. • Newly displaced HH (less than 60 days)  In addition, the household selected must meet at least one of the income criteria outlined below:  • The Household is already renting an apartment but is struggling to meet their other basic needs due to low income, rising rent costs, or other vulnerability factors which may lead to eviction or resorting to negative coping strategies; • The Household has at least one source of income within the household, allowing to cover its basic household needs  • The Household is referred by the Protection team and assistance should be provided even if no known source of income, while referral and follow up is done by the Protection team to identify sustainable solutions  Filling out this application does not guarantee participation in the program. Each application will be considered individually, and a decision will be made on the further participation of the application in the program. The decision is final, and the Danish Refugee Council (DRC) reserves the right to reject any application.  All data collected on this form is for DRC's internal use and programmatic purposes and will be kept confidential. Please note that all questions marked with "*" are mandatory. All other questions are additional and may be omitted, at your discretion, if for any reason you do not wish to answer them.  Please note information shared via this form will be accessible to staff from the Danish Refugee Council, but will not be shared further.
  disclaimer: string,
  // [select_one] Do you reach the criteria for this support?
  disclaimer_consent: undefined | Opt<'mou6_ren_sup'>,
  // [select_one] Do you consent to the processing of your personal data?
  ben_consent: undefined | Opt<'mou6_ren_sup'>,
  // [text] First name
  ben_first_name: string | undefined,
  // [text] Patronymic name
  ben_first_patr: string | undefined,
  // [text] Last name
  ben_last_name: string | undefined,
  // [integer] Age
  ben_age: number | undefined,
  // [select_one] Sex
  ben_sex: undefined | Opt<'hh_char_hh_det_gender'>,
  // [select_one] Are you the head of the household?
  ben_head_household: undefined | Opt<'mou6_ren_sup'>,
  // [integer] Your contact phone number
  ben_number: number | undefined,
  // [select_one] Specify the Oblast of residence
  ben_det_oblastgov: undefined | Opt<'ben_det_oblastgov'>,
  // [select_one] Specify the Rayon of residence
  ben_det_raiongov: undefined | Opt<'ben_det_raiongov'>,
  // [select_one] Specify the Hromada of residence
  ben_det_hromadagov: undefined | Opt<'ben_det_hromadagov'>,
  // [text] Specify the settlement of residence
  ben_det_settlementgov: string | undefined,
  // [select_one] Specify the type of housing in which you currently live
  ben_det_type: undefined | Opt<'ben_det_type'>,
  // [text] Other (please specify)
  ben_det_type_oth: string | undefined,
  // [select_one] Are you an internally displaced person?
  ben_det_displaced: undefined | Opt<'mou6_ren_sup'>,
  // [select_one] Specify the Oblast from where you moved
  ben_det_oblast: undefined | Opt<'ben_det_oblast'>,
  // [select_one] Specify the Rayon from where you moved
  ben_det_raion: undefined | Opt<'ben_det_raion'>,
  // [select_one] Specify the Hromada from where you moved
  ben_det_hromada: undefined | Opt<'ben_det_hromada'>,
  // [text] Specify the settlement from where you moved
  ben_det_settlement: string | undefined,
  // [date] Enter the month and year when you moved
  ben_when_moved: Date | undefined,
  // [select_one] Was your house destroyed/damaged during the conflict
  ben_des_con: undefined | Opt<'mou6_ren_sup'>,
  // [select_one] Are you seeking to rent an apartment?
  ben_rent_apartment: undefined | Opt<'mou6_ren_sup'>,
  // [select_one] Have you already identified a potential apartment?
  ben_rent_inden_poten: undefined | Opt<'mou6_ren_sup'>,
  // [select_one] If you are renting an apartment or house, do you have an agreement with the landlord?
  ben_renting_apartment: undefined | Opt<'mou6_ren_sup'>,
  // [select_one] Are you able to sign an agreement?
  ben_renting_apartment_no: undefined | Opt<'mou6_ren_sup'>,
  // [integer] Indicate the total number of people in your household, including the HHH
  ben_det_hh_size: number | undefined,
  // [begin_repeat] HH Members
  hh_char_hh_det: {hh_char_hh_det_gender: undefined | Opt<'hh_char_hh_det_gender'> | undefined,hh_char_hh_det_age: number | undefined | undefined}[] | undefined,
  // [select_multiple] Describe why you are applying for rental support
  ben_ren_sup: undefined | Opt<'ben_ren_sup'>[],
  // [text] If selected, please provide more details
  ben_ren_sup_rsca: string | undefined,
  // [text] Other (please specify)
  ben_ren_sup_oth: string | undefined,
  // [select_multiple] Source of your family’s income
  ben_familys_income: undefined | Opt<'ben_familys_income'>[],
  // [text] Other (please specify)
  ben_ren_sup_oth_001: string | undefined,
  // [integer] Your family's total monthly income
  ben_total_income: number | undefined,
  // [select_one] Please indicate if any family members that you live with fall under any of these categories:
  indicate_any_family: undefined | Opt<'indicate_any_family'>,
  // [select_one] If provided with rental support, would you be able to provide monthly proof of payments?
  proof_payments: undefined | Opt<'mou6_ren_sup'>,
  // [text] Please explain
  proof_payments_no: string | undefined,
  // [select_one] If provided with rental support, a DRC staff member would request to visit prior to the second transfer. Do you consent?
  ren_sup_consent: undefined | Opt<'mou6_ren_sup'>,
  // [select_one] If provided with 6-months of rental support, do you anticipate being able to continue rental payments independently after the end of the program?
  mou6_ren_sup: undefined | Opt<'mou6_ren_sup'>,
  // [text] Please provide more information
  mou6_ren_sup_yes: string | undefined,
  // [text] Please use the box below to share any further information about your application for shelter support
  comments: string | undefined,
  // [note] Thank you for your answers
  thanks: string,
}