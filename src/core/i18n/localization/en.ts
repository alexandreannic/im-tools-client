import {format, formatDistance, formatDuration as formatDurationFns, sub} from 'date-fns'
import {externalLinks} from '../../externalLinks'
import {KoboFormProtHH} from '../../koboModel/koboFormProtHH'
import {Period} from '../../type'
import Status = KoboFormProtHH.Status
import {MealCfmExternalOptions} from '@/core/koboModel/MealCfmExternal/MealCfmExternalOptions'

const invalidDate = ''

export const isDateValid = (d?: Date): boolean => {
  return !!d && d instanceof Date && !isNaN(d.getTime())
}

export const formatDate = (d?: Date): string => {
  if (!isDateValid(d)) return invalidDate
  return d!.toLocaleDateString()
}

export const formatTime = (d?: Date): string => {
  if (!isDateValid(d)) return invalidDate
  return d!.toLocaleTimeString()
}

export const formatDateTime = (d?: Date): string => {
  if (!isDateValid(d)) return invalidDate
  return formatDate(d) + ' ' + formatTime(d)
}

export const dateFromNow = (d?: Date): string | undefined => {
  return d ? formatDistance(d, new Date(), {addSuffix: true}) : undefined
}

export const formatLargeNumber = (n?: number): string => {
  return n !== undefined && n !== null && !isNaN(n) ? n.toLocaleString('en-EN') : '-'
}

export const formatDuration = formatDurationFns

export type Messages = typeof en['messages']

export const en = Object.freeze({
  formatDate,
  formatTime,
  formatDateTime,
  dateFromNow,
  formatDuration,
  formatLargeNumber,
  messages: {
    invalid: 'Invalid',
    others: 'Others',
    other: 'Other',
    majorStressFactors: 'Major stress factors',
    exist: 'Exist',
    notExist: 'Not exist',
    area: 'Area',
    men: 'Men',
    activities: 'Activities',
    noComment: 'No comment',
    answers: 'Answers',
    seeResults: `See results`,
    users: 'Users',
    select3Outcomes: `Please, select 3 outcomes`,
    oblast: 'Oblast',
    edit: 'Edit',
    close: 'Close',
    connectAs: 'Connect as',
    focalPoint: 'Focal point',
    project: 'Project',
    name: 'Name',
    violence: 'Violence',
    copyingMechanisms: 'Coping mechanisms',
    female: 'Female',
    hhs: 'HHs',
    accessLevel: 'Access level',
    females: 'Females',
    adultMen: 'Adult men',
    adultWomen: 'Adult women',
    boy: 'Boy',
    girl: 'Girl',
    somethingWentWrong: 'Something went wrong',
    yes: 'Yes',
    influencingFactors: 'Influencing factors',
    familyUnity: 'Family unity',
    city: 'City',
    no: 'No',
    contactAdmin: 'Contact:',
    office: 'Office',
    drcOffice: 'DRC office',
    question: 'Question',
    answer: 'Answer',
    calculations: 'Calculations',
    mykolaiv: 'Mykolaiv',
    lastConnectedAt: 'Last connection',
    perpetrators: 'Perpetrators',
    kyiv: 'Kyiv',
    view: 'View',
    viewData: 'View data',
    theme: 'Dark theme',
    previous: 'Previous',
    filter: 'Filter',
    count: 'Count',
    sum: 'Sum',
    average: 'Average',
    min: 'Min',
    max: 'Max',
    next: 'Next',
    clearFilter: 'Clear filter',
    logout: 'Logout',
    youDontHaveAccess: `You don't have access. Contact alexandre.annic@drc.ngo`,
    share: 'Share',
    refresh: 'Refresh',
    grantAccess: 'Grant access',
    title: 'Information Management Portal',
    noDataAtm: 'No data at the moment',
    fileName: 'File name',
    subTitle: 'Ukraine',
    signIn: 'Sign-in',
    suggestion: 'Suggestion',
    signInDesc: 'With your DRC Microsoft account',
    viewDate: `View data`,
    information: 'Information',
    koboData: `Kobo data`,
    activity: 'Activity',
    previewActivity: `Preview activity`,
    previewRequestBody: `Preview request body code`,
    nLines: (n: number) => `<b>${n}</b> lignes`,
    confirm: 'Confirm',
    downloadAsXLS: 'Download as XLS',
    downloadAsPdf: 'Download as PDF',
    all: 'All',
    details: 'Details',
    toggleDatatableColumns: 'Toggle',
    areas: {
      north: 'North',
      east: 'East',
      south: 'South',
      west: 'West'
    },
    start: 'Start',
    end: 'End',
    endIncluded: 'End (included)',
    typeOfSite: 'Type of site',
    version: 'Version',
    error: 'Error',
    create: 'Create',
    proxy: 'Proxy',
    enabled: 'Enabled',
    households: 'Households',
    hhType: 'HH Type',
    displacementStatus: 'Displacement status',
    householdStatus: 'Household Status',
    individuals: 'Individuals',
    householdSize: 'Household size',
    hhSize: 'HH size',
    dashboard: 'Dashboard',
    loading: 'Loading',
    passportSerie: 'Passport serie',
    price: 'Price',
    passportNumber: 'Passport number',
    taxID: 'Tax ID',
    id: 'ID',
    access: 'Access',
    accesses: 'Accesses',
    url: 'URL',
    expireAt: 'Expire at',
    slug: 'Slug',
    try: 'Try',
    origin: 'Origin',
    destination: 'Destination',
    invalidUrl: 'Invalid URL',
    mainConcerns: 'Main concern',
    accommodationCondition: 'Accommodation condition',
    tenureOfAccommodation: 'Accommodation tenure',
    housingStructure: 'Accommodation structure',
    firstPriorityNeed: '1st Priority needs',
    secondPriorityNeed: '2nd Priority needs',
    thirdPriorityNeed: '3rd Priority needs',
    selected: 'Selected',
    phone: 'Phone',
    drcEmail: 'DRC Email',
    finance: 'Finance',
    decidingFactorsToReturn: 'Deciding factors to return',
    displacement: 'Displacement',
    originOblast: 'Oblast of origin',
    currentOblast: 'Current oblast',
    idpPopulationByOblast: 'IDP population by oblast',
    age: 'Age',
    submitAll: 'Submit all',
    submit: 'Submit',
    hohhOlder: 'HoHH 60+',
    changeAccount: 'Change account',
    lastName: 'Last name',
    housing: 'Housing',
    table: 'Table',
    comparedToTotalAnswers: 'Based on total answers:',
    chart: 'Chart',
    group: 'Group',
    required: 'Required',
    invalidEmail: 'Invalid email',
    confirmYourOffice: (office: string) => `Confirm ${office} office`,
    itCannotBeChanged: (admin: string) => `For privacy reasons, you will not be able to change it later without contacting ${admin}.`,
    select: 'Select',
    welcomePleaseSelectOffice: 'Welcome, select your DRC office:',
    firstName: 'First name',
    patronyme: 'Patronyme',
    data: 'Data',
    deduplication: 'Deduplication',
    wfpDeduplication: 'WFP Deduplication',
    deduplications: 'Deduplications',
    hohhFemale: 'HoHH female',
    vulnerabilities: 'Vulnerabilities',
    selectAll: 'Select all',
    ageGroup: 'Age groups',
    contact: (_: string) => `Contact <b>${_}</b>.`,
    intentions: 'Intentions',
    sex: 'Sex',
    createdAt: 'Created at',
    updatedAt: 'Updated at',
    returnToThePlaceOfHabitualResidence: 'Return to the place of habitual residence',
    currentStatus: 'Current status',
    status: 'Status',
    male: 'Male',
    ukraine: 'Ukraine',
    submissionTime: 'Submission',
    submittedBy: 'By',
    mealVisitMonitoringDashboard: 'MEAL Visit Monitoring Dashboard',
    protectionMonitoringDashboard: 'Protection monitoring dashboard',
    undefined: 'Unknown',
    women: 'Women',
    avgAge: 'Avg. age',
    coveredOblasts: 'Covered oblasts',
    lackOfPersonalDoc: 'Individuals lacking personal documentation',
    lackOfHousingDoc: 'HHs lacking HLP documentation',
    sample: 'Sample overview',
    documentation: 'Documentation',
    livelihoods: 'Livelihoods',
    priorityNeeds: 'Priority Needs',
    hhWithoutIncome: 'No income',
    hhOutOfWork: 'Out of work',
    idpWithAllowance: 'IDPs w/ allowance',
    specificNeeds: 'Specific needs',
    propertyDamaged: 'Properties damaged due to conflict',
    email: 'Email',
    drcJob: 'DRC Job',
    intentionToReturn: 'Intention to return',
    hhWithGapMeetingBasicNeeds: 'Basic needs gaps',
    unemployedMemberByOblast: 'By oblast population',
    Access: {
      giveAccessBy: 'Grant access by',
      jobAndOffice: 'Job and Office',
    },
    hhCategoryType: {
      idp: 'IDP',
      hohh60: 'Elderly HoHH',
      hohhFemale: 'Female HoHH',
      memberWithDisability: 'HH with PwD',
      all: 'Average'
    },
    statusType: {
      conflict_affected_person: 'Conflict-affected person',
      idp: 'IDP',
      host_community_member: 'Host community member',
      idp_returnee: 'IDP returnee',
    } as Record<Status, string>,
    shelter: 'Shelter',
    health: 'Health',
    cash: 'Cash',
    levelOfPropertyDamaged: 'Level of damaged',
    mainSourceOfIncome: 'Main source of income',
    employmentType: 'Type of employment',
    monthlyIncomePerHH: 'Average monthly income per HH',
    HHsLocation: 'HHs Location',
    idp: 'IDP',
    selectADatabase: 'Select a Kobo form',
    noIdp: 'Non-IDP',
    comparedToPreviousMonth: 'Compared to 30 days ago',
    idps: 'IDPs',
    poc: 'Person of concern',
    global: 'Global',
    donor: 'Donor',
    gender: 'Gender',
    respondentGender: 'Respondent gender',
    respondent: 'Respondent',
    program: 'Program',
    raion: 'Raion',
    hromada: 'Hromada',
    noIdps: 'Non-IDPs',
    selectForm: 'Select form',
    register: 'Register',
    noIdpsOnly: 'Non-IDPs only',
    uaCitizen: 'UA citizen',
    appInMaintenance: 'Application in maintenance, we\'ll be back soon.',
    comments: 'Comments',
    ukrainianCitizenShip: 'Ukrainian citizenship',
    hhBarriersToPersonalDocument: 'Experienced barriers to obtain civil documents',
    atLeastOneMemberWorking: 'HHs with at least one member working',
    database: {
      registerNewForm: 'Register new form',
    },
    mealMonitoringVisit: {
      ecrec: 'ECREC activities',
      protection: 'Protection activities',
      eore: 'EORE activities',
      shelter: 'Shelter activities',
      lau: 'LAU activities',
      criticalConcern: 'Critical concern',
      nfiDistribution: 'NFI distributions',
      photoFolder: 'Photo folder',
      concerns: 'Concerns',
      securityConcerns: 'Security concerns',
      hasPriorityQueuesForVulnerableIndividuals: 'Priority queues for vulnerable individuals',
    },
    protHHS2: {
      freedomOfMovement: 'Barriers to Freedom of Movement',
      _hhComposition: {
        girl: '1 or + girls 0-17',
        boy: '1 or + boys 0-17',
        adultFemale: '1 or + adult females 18-60',
        adultMale: '1 or + adult males 18-60',
        olderFemale: '1 or + older females 60+',
        olderMale: '1 or + older males 60+',
      },
      hhComposition: 'HH Composition',
      factorToHelpIntegration: 'Factors Supporting Integration',
      factorToReturn: 'Factors influencing intentions to return',
      reasonForRelocate: 'Reasons for relocating',
      hhTypes: 'Household Status',
      reportedIncidents: 'Reported incidents over the last 6 months',
      hhsAffectedByMultipleDisplacement: 'Multiple displacements since February 24 2022 by current oblast',
      barriersToAccessHealth: 'Barriers to access healthcare',
      hhWithMemberHavingDifficulties: 'HHs reporting member(s) with disability',
      factors: '',
      unregisteredDisability: 'Unregistered disability',
      wg_using_your_usual_language_have_difficulty_communicating: 'Using your usual (customary) language',
      reducing_consumption_of_food: 'Reducing consumption of food',
      unemploymentFactors: 'Factors affecting employment ',
      timelineOfIncident: 'Timeline of Incident',
      protectionIncidents: 'Protection incidents',
      disabilityAndHealth: 'Disability & Health',
      descTitle: `Protection monitoring`,
      desc: `is defined as "systematically and regularly collecting, verifying and analysing information over an extended period of time
        in order to identify violations of rights and protection risks for populations of concern for the purpose of informing effective responses".
      `,
      disclaimer: `
        The dashboard was created by the Danish Refugee Council (DRC), and funded by USAID's Bureau for Humanitarian Assistance (BHA)
        and the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect 
        those of the European Union or the BHA. Neither the European Union nor the BHA can be held responsible for any use of the dashboard.
      `,
      mainConcernsRegardingHousing: 'Concerns related to current accommodation',
      typeOfIncident: 'Type of incident',
      poorRelationshipWithHostCommunity: 'Poor intercommunity relationships',
      poorSenseOfSafety: 'Poor sense of safety',
      reasonForLeaving: 'Factors influencing departure',
      safetyAndSecurity: 'Safety & Security',
      reasonForRemainInOrigin: 'Reason for remaining in the area of origin',
      familyMemberSeparated: 'HHs with separated member(s)',
      locationOfSeparatedFamilyMembers: 'Location of separated family member(s)',
      residentialIntentionsByHousehold: 'Residential Intentions by Household',
      mainSourceOfIncome: 'Main source of income',
      hhOutOfWorkAndSeekingEmployment: 'HHs with member(s) out of employment',
      ethnicMinorities: 'Ethnic minorities',
      accessBarriersToObtainDocumentation: 'Access barriers to obtain documentation',
      registrationAndDocumention: 'Registration & Documentation',
      missingDocumentationByOblastPopulation: 'Missing Documentation by Oblast Population',
      HHSwSN: 'Head of HH with specific needs',
      specificNeedsToHHS: 'Specific needs of HH',
      safetyOrSecurityConcernsDuringDisplacement: 'HHs reporting security concerns during displacement',
      HHs: 'HHs',
      AvgHHSize: 'AvgHHSize',
    },
    snapshotProtMonito: {
      echo: {
        livelihood: ({
          outOfWork,
        }: {
          outOfWork?: string
        }) => `The percentage of surveyed individuals out of work and seeking employment remains quite high at <b>${outOfWork}</b> of responses. The primary factors contributing to unemployment were reported to be lack of available jobs, lack of childcare, and physical impairments/limitations. As a result of the limited livelihood opportunities or challenges in accessing livelihoods, a considerable proportion of the surveyed population is currently dependent on social protection schemes and humanitarian assistance.`,
        needs: ({
          healthPn,
          barriersRural,
          barriersUrban,
        }: {
          healthPn?: string
          barriersRural?: string
          barriersUrban?: string
          //}) => `Health continues to be the first priority for the vast majority of households surveyed, cited by a total of <b>${healthPn}</b> of respondents as a priority need. The ratio of households reporting barriers to access healthcare is exponentially higher in rural areas— <b>${barriersRural}</b> of respondents living in rural areas compared to <b>${barriersUrban}</b> of those living in urban areas.`,
          //}) => `<b>${healthPn}</b> of respondents indicated health as their first priority need. Response rates for health needs are twice as high in rural areas compared to urban areas at <b>${barriersRural}</b> and <b>${barriersUrban}</b> respectively, indicated improved access to health services in urban centres.`,
        }) => `<b>${healthPn}</b> of respondents indicated health as a priority need. Response rates for health needs are twice as high in rural areas compared to urban areas at <b>${barriersRural}</b> and <b>${barriersUrban}</b> respectively.`,
        safety: ({
          poorSafety,
          poorSafetyRural,
          poorSafetyUrban,
          protectionIncident,
          poorSafetySumy,
          poorSafetyChernihiv,
        }: {
          poorSafety?: string
          poorSafetySumy?: string
          poorSafetyChernihiv?: string
          poorSafetyRural?: string
          poorSafetyUrban?: string
          protectionIncident?: string
          //}) => `Perceptions of sense of safety vary significantly depending on the surveyed area. Overall, <b>${poorSafety}</b> of respondents across surveyed oblasts reported a poor sense of safety (feeling unsafe or very unsafe), mainly due to shelling or threats of shelling. This figure is particularly high in the areas of Chernihiv and Sumy Chernihiv and Sumy. Poor sense of safety is higher in rural areas (<b>${poorSafetyRural}</b>) than in urban areas (<b>${poorSafetyUrban}</b>). <b>${protectionIncident}</b> of respondents reported protection incidents experienced by household members over the past 6 months.`,
        }) => `Perceptions of safety vary significantly depending on the surveyed area. Overall <b>${poorSafety}</b> of respondents indicated a poor sense of safety (feeling unsafe or very unsafe) mainly due to shelling or threats of shelling. This figure is particularly high in the areas of Chernihiv and Sumy at <b>${poorSafetyChernihiv}</b> and <b>${poorSafetySumy}</b>. <b>${protectionIncident}</b> of respondents reported protection incidents experienced by household members over the past 6 months.`,
        registration: ({
          hrkLackPersonalDoc
        }: {
          hrkLackPersonalDoc?: string
        }) => `<b>${hrkLackPersonalDoc}</b> of individuals surveyed in Kharkivska oblast lack personal documentation and face subsequent challenges in accessing services as well as  limitations to their freedom of movement. Most of the respondents who reported lacking HLP documentation indicated not possessing property ownership for their apartment/house or land, which can prevent them from accessing compensation, resolving property disputes (which may pose the long-term threat of eviction for IDPs), or exercising their rights in relation to their land or property.`,
        displacement: `The majority of the IDPs surveyed during the monitoring period reported having left their place of habitual residence between February and May 2022. The main factors influencing departure from areas of origin included shelling and attacks on civilians, destruction or damage of housing, land or property due to conflict, occupation of property, exposure to UXOs/landmines, and lack of access to livelihoods.`,
        desc: 'This snapshot summarizes the findings of <b>Protection Monitoring</b> (PM) implemented through household surveys in the following oblasts: <ul style="columns: 2"><li>Chernihivska</li><li>Dnipropetrovska</li><li>Ivano-Frankivska</li><li>Kharkivska</li><li>Lvivska</li><li>Khersonska</li><li>Mykolaivska</li><li>Sumska</li><li>Volynska</li><li>Zaporizska</li></ul>DRC protection monitoring targeted Internally Displaced Persons (IDPs) and people directly exposed to and affected by the current armed conflict in order to understand the protection needs facing affected populations; informing DRC and the protection communities\' response.',
      },
      basicNeeds: `Basic Needs`,
      livelihood: `Livelihoods & Coping mechanisms`,
      safetyProtectionIncidents: 'Safety & Protection Incidents',
      displacementDesc: `Majority of the IDPs surveyed during the monitoring period reported having left their place of habitual residence between February and May 2022. Main factors influencing departure reported included shelling and attacks on civilians, destruction or damage of housing, land or property due to conflict, as well as occupation of property, exposure to UXOs/landmines and lack of access to livelihoods.`,
      integrateIntoTheLocalCommunity: 'Integrate into the local community',
      monitoredHhByOblast: 'Monitored HH By Oblast',
    },
    protHHSnapshot: {
      male1860: `Males 18-60 years old`,
      experiencedShellingDuringDisplacement: `Experienced shelling during displacement`,
      numberOfIdp: '# IDPs',
      numberOfHohh60: '# Elderly (60+) HoHH',
      numberOfHohhFemale: '# Female HoHH',
      numberOfMemberWithDisability: '# HHs with PwD',
      // <b>${hhIncomeBelow3000}</b> of the monitored HHs are in the poverty range<sup>(1)</sup>.
      // If we consider the number of members by HH, we can estimate that between <b>${avgHHIncomeBelow3000}</b> and <b>${avgHHIncomeBelow3000Max}</b> of HHs are in the poverty range.
      livelihoodAboutNotes: `
        <sup>(1)</sup> The range for social protection is calculated by the Ministry of Finance.
        In January 2023, the living wage is <b>${formatLargeNumber(2589)}</b> UAH average and <b>${formatLargeNumber(2833)} UAH</b> for children (6-18 years old) <u>https://index.minfin.com.ua</u>.`,
      allowanceStateOrHumanitarianAsMainSourceOfIncome: 'HHs Depending on state/humanitarian assistance',
      percentagePopulationByOblast: 'Monitored IDP population by oblast',
      hhSeparatedByOblast: `HHs separated by oblast`,
      senseOfSafety: `Sense of safety`,
      factorsInfluencingSenseOfSafety: `Factors for safety perception`,
      incomeUnder6000ByCategory: `HH category with income below 6,000 UAH`,
      avgHhSize: (n: number) => `Average HH size: ${n.toFixed(1)}`,
      elderlyWithPension: 'Elderly with pension',
      hhWith3childrenWithPension: 'HHs with 3+ children and pension',
      noAccommodationDocument: 'HHs without formal lease agreement',
      hhSeparatedDueToConflict: `Family separation due to conflict`,
      locationOfSeparated: `Location of separated members`,
      hhWDisabilityWoAllowance: `HHs with PwD registered`,
      enum: {
        _17_1_2_If_not_why: {
          not_entitled_to_the_allowance: 'Not entitled to the allowance',
          problems_with_registration: 'Problems with registration',
          costly_process: 'Costly process',
          registered_for_assistance_but_: 'Registered for assistance but payment is delayed',
          not_sure_if_entitled_to_the_in: 'Not sure if entitled to the information',
          distance26: 'Distance',
          is_not_aware_of_the_allowances: 'Is not aware of the allowances',
          other_please_specify26: 'Other (specify)',
        },
        _26_1_1_Where_do_you_live_now: {
          owned_apartment_or_house: 'Owned apartment or house',
          rented_house_or_apartment__wit: 'Rented house or apartment (with own means)',
          with_host_family_or_relatives: 'With host family or relatives',
          public_or_communal_building__e: 'Public or communal building (e.g. school)',
          temporary_shelter: 'Temporary shelter',
          modular_houses: 'Modular houses',
          unoccupied_house_or_apartment: 'Unoccupied house or apartment',
          unfinished_building: 'Unfinished building',
          open_air_no_shelter: 'Open air/no shelter',
          other__please_specify: 'Other (specify)',
          rented_accomodation__cash_for_: 'Rented accomodation (cash for rent support)',
        },
        _15_1_1_What_housing_land_and: {
          property_ownership_for_apartment_house: `Property ownership for apartment/house`,
          property_ownership_certificate_for_land: `Property ownership certificate for land`,
          lease_agreement_for_house: `Lease agreement for house`,
          bti__bureau_of_technical_inventory__cert: `BTI (Bureau of Technical Inventory) certificae`,
          construction_stage__subtituted_with_bti_: `Construction stage; subtituted with BTI certificate following completion of construction`,
          death_certificate_of_predecessor: `Death certificate of predecessor`,
          inheritance_will: `Inheritance will`,
          inheritance_certificate: `Inheritance certificate`,
          document_issues_by_police_state_emergenc: `Document issues by police/State Emergency Service proving that the house was damaged/destroyed – For Ukrainian state control areas`,
          document_issues_by_local_self_government: `Document issues by local self-government proving that the house was damaged/destroyed`,
          cost_estimation_certificate__state_commi: `Cost estimation certificate- state commission (issued when personal request is made)`,
          death_declaration_certificate_by_ambulan: `Death declaration certificate by ambulance or police of predecessor`,
          _informatsiyna_dovidka___informational_e: `"Informatsiyna dovidka" (Informational extract) on damaged property`,
          none_of_the_above24: `None of the above`,
          other_specify24: `Other`,
        },
        _13_4_3_If_separated_from_a_household_: {
          remained_behind_in_the_area_of: 'Remained in area of origin',
          do_not_know_their_whereabouts: 'Do not know their whereabouts',
          serving_in_the_military: 'Serving in the military',
          displaced_to_another_location_: 'Displaced to another area in Ukraine',
          other223: 'Other',
          displaced_to_another_country_o: 'Displaced to another country',
        },
        _19_1_2_What_factors_are_influencing_t: {
          language_differrence: 'Language differrence',
          threats_recieved: 'Threats recieved',
          bullying: 'Bullying',
          discrimination: 'Discrimination',
          tension_over_humanitarian_assi: 'Tension over humanitarian assistance',
          tension_over_access_to_service: 'Tension over access to services and/or employment opporunties',
          other_please_specify28: 'Other',
        },
        _16_2_1_Do_you_have_a_household_member: {
          seeing__even_if_wearing_glasses: 'Seeing, even if wearing glasses',
          hearing__even_if_using_a_hearing_aid: 'Hearing, even if using a hearing aid',
          walking_or_climbing_steps: 'Walking or climbing steps',
          remembering_or_concentration: 'Remembering or concentration',
          self_care__such_as_washing_all_over_or_d: 'Self-care, such as washing all over or dressing',
          using_your_usual__customary__language__h: 'Using your usual (customary) language, have difficulty communicating, for example understanding or being understood',
          no: 'No',
        },
        _12_5_1_During_your_displacement_journ: {
          none215: 'None',
          looting_robbery: 'Extortion/looting/robbery',
          physical_attacks: 'Physical attacks',
          shelling_or_missile_attacks_an: 'Shelling or fear of such attacks',
          harassment_at_checkpoints: 'Harassment at checkpoints',
          movement_restrictions: 'Movement restrictions',
          incident_of_gbv: 'Incident of GBV',
          // extortion: 'Extortion',
          destruction_of_personal_proper: 'Destruction of personal property',
          hate_speech: 'Hate speech',
          other_please_explain215: 'Other',
        },
        _32_1_What_type_of_allowances_do_you: {
          idp_allowance_from_the_governm: 'IDP allowance from the government',
          pension: 'Pension',
          pension_for_disability: 'Pension for disability',
          pension_for_three_or_more_chil: 'Pension for three or more children in the household',
          compensation_for_the_lost_dama: 'Compensation for the lost/damaged house',
          cash__mpca__from_humanitarians: 'Cash (MpcaDedupTable) from humanitarians',
          evacuation_compensation: 'Evacuation compensation',
        },
        _26_4_Do_you_have_fo_in_your_accomodation: {
          yes__i_have_a_rental_agreement: 'Yes, I have a rental agreement',
          yes__i_have_state_assigned_shelter_with_: 'Yes, I have state assigned shelter with proving documents',
          verbal_agreement: 'Verbal agreement',
          no_formal_documents: 'No formal documents',
        },
        _18_1_2_What_are_the_factors_t: {
          armed_conflict: 'Armed conflict',
          presence_of_armed_actors_and_or_military: 'Presence of armed actors',
          shelling_or_threat_of_shellnig: 'Shelling',
          eviction_or_threat_of_eviction: 'Eviction or threat of eviction',
          crime: 'Crime',
          tensions_with_the_host_community: 'Tensions with the host community',
          threat_of_gbv__including_sexual_harrassm: 'Threat of GBV',
          presence_of_hazards__including_uxos: 'Presence of hazards (UXOs)',
          unsafe_or_poor_living_conditions: 'Unsafe or poor living conditions',
        },
        _18_1_1_Please_rate_your_sense_of_safe: {
          '1__very_unsafe': 'Very unsafe',
          '2__unsafe': 'Unsafe',
          '3__acceptable': 'Acceptable',
          '4__safe': 'Safe',
          '5__very_safe': 'Very safe',
        },
        _19_1_1_Please_rate_your_relationship_: {
          '1__very_bad': 'Very bad',
          '2__bad': 'Bad',
          '3__acceptable': 'Acceptable',
          '4__good': 'Good',
          '5__very_good': 'Very good',
        },
        oblast: {
          avt: 'Avtonomna Respublika Krym',
          vin: 'Vinnytska',
          vol: 'Volynska',
          dnip: 'Dnipropetrovska',
          don: 'Donetska',
          zhy: 'Zhytomyrska',
          zak: 'Zakarpatska',
          zap: 'Zaporizka',
          ivan: 'Ivano-Frankivska',
          kyi: 'Kyivska',
          kir: 'Kirovonhradska',
          luh: 'Luhanska',
          lvi: 'Lvivska',
          myk: 'Mykolaivska',
          ode: 'Odeska',
          pol: 'Poltavska',
          riv: 'Rivenska',
          sum: 'Sumska',
          ter: 'Ternopilska',
          kha: 'Kharkivska',
          khe: 'Khersonska',
          khm: 'Khmelnytska',
          che: 'Cherkaska',
          chern: 'Chernivetska',
          cherni: 'Chernihivska',
          sev: 'Sevastopilska',
        },
        _14_2_1_Do_you_or_your_househo: {
          idp_certificate: 'IDP certificate',
          idp_e_registration: 'IDP E-registration',
          stateless_registration_certificate: 'Stateless registration certificate',
          refugee_status: 'Refugee status',
          asylum_seeker_registration_documentation: 'Asylum seeker registration documentation',
          none_of_the_above23: 'None of the above',
          don_t_know23: `Don't know`,
          prefer_not_to_answer23: 'Prefer not to answer',
          not_registered23: 'Not registered',
        },
        _14_1_1_What_type_of_ocuments_do_you_have: {
          national_passport: 'National passport',
          national_passport_book7: 'National passport (book)',
          national_passport_card7: 'National passport (card)',
          national_passport_diia_app7: 'National passport (Diia app)',
          passport_ussr_red_book7: 'Passport (USSR red book)',
          passport_for_internationa7l_travel: 'Passport for international travel',
          certificate_issues_on_birt7h_medical: 'Certificate issues on birth medical',
          tin_personal_identification_tax_number7: 'TIN - personal identification/tax number',
          birth_certificate7: 'Birth certificate',
          driver_s_licence7: 'Driver\'s licence',
          pensioners_certificate_s5ocial: 'Pensioners certificate (social)',
          pensioner_certificate_ret5irement: 'Pensioner certificate (retirement)',
        },
        barriersToPersonalDocuments: {
          cost_of_obtaining_the_documents: 'Cost of obtaining the documents',
          no_information_on_where_to_access: 'Lack of information on where to access',
          delay_in_restoration: 'Delay in restoration',
          achives_are_destroyed: 'Archives are destroyed',
          distance__not_accessible: 'Distance, not accessible',
          require_legal_support: 'Legal aid needed',
          other25: 'Other',
        },
        citizenShip: {
          ukrainian: 'Ukrainian',
          russian: 'Russian',
          belarusian: 'Belarusian',
          moldovan: 'Moldovan',
          polish: 'Polish',
          georgian: 'Georgian',
          romanian: 'Romanian',
          other14_1: 'Other',
          dual_citizenship: 'Dual citizenship',
          lacks_citizenship__stateless: 'Lacks citizenship (stateless)',
        },
        monthlyIncomes: {
          up_to_1_500_uah: 'Up to 3,000 UAH',
          between_1_501__3_000_uah: '3,000 - 6,000 UAH',
          between_3_001__5_000_uah: '6,000 - 9,000 UAH',
          between_5_001__7_000_uah: '9,000 - 12,000 UAH',
          between_7_001__11_000_uah: '12,000 - 15,000  UAH',
          more_than_11_000_uah: 'More than 15,000 UAH',
        },
        copingMechanisms: {
          spent_savings: 'spent_savings',
          depending_on_support_from_family_host_fm: 'depending_on_support_from_family_host_fm',
          skipping: 'skipping',
          reduced_expenses_on_food__health_and_edu: 'reduced_expenses_on_food__health_and_edu',
          borrowing_food: 'borrowing_food',
          sent_household_members_to_eat_elsewhere: 'sent_household_members_to_eat_elsewhere',
          planning_to_relocate_abroad: 'planning_to_relocate_abroad',
          borrowed_money__from_a_formal_lender_ban: 'borrowed_money__from_a_formal_lender_ban',
          unknown_no_answer341: 'unknown_no_answer341',
          sold_household_assets_goods: 'sold_household_assets_goods',
          other_specify341: 'other_specify341',
          asking_strangers_for_money_begging: 'asking_strangers_for_money_begging',
          sold_productive_assets: 'sold_productive_assets',
        },
        nfi: {
          infant_clothing: 'infant_clothing',
          hygiene_items: 'hygiene_items',
          do_not_require41: 'do_not_require41',
          other_household_items: 'other_household_items',
          blankets: 'blankets',
          towels_bed_linen: 'towels_bed_linen',
          winter_clothes: 'winter_clothes',
          kitchen_items: 'kitchen_items',
          clothes_and_shoes: 'clothes_and_shoes',
        },
        incomeSource: {
          employment: 'Employment',
          allowance__state: 'Allowance (state)',
          humanitarian_assistance: 'Humanitarian assistance',
          other43: 'Other',
        },
        employmentTypes: {
          public_sector: 'Public sector',
          private_sector: 'Private sector',
          entrepreneur: 'Entrepreneur',
          casual_daily_work: 'Casual daily work',
          ngo: 'NGO',
          other43: 'Other',
        },
        basicNeeds: {
          gas: 'Gas',
          electricity: 'Electricity',
          drinking_water: 'Drinking water',
          toilets: 'Toilets',
          shower: 'Shower',
          heating_system: 'Heating system',
          hot_water: 'Hot water',
          usage_water: 'Usage water',
          none_of_the_above40: 'None of the above',
        },
        vulnerability: {
          person_with_a_disability: 'Person with a disability',
          elderly_head_of_household__60__with_mino: 'Older person at risk',
          woman_at_risk: 'Woman at risk',
          exterme_poverty_impacting_acce: 'Extreme poverty impacting access to service',
          person_with_a_serious_medical_: 'Person with a serious medical ',
          child_at_risk: 'Child at risk',
          single_parent: 'Single parent',
          single_parent_male: 'Single parent male',
          single_parent_female: 'Single parent female',
          other_specifyg: 'Other',
          multiple_displacements: 'Multiple displacements',
          gbv_risk: 'GBV risk',
          no_legal_documentation: 'No legal documentation',
          unaccompanied_or_separated_chi: 'Unaccompanied or separated child',
        },
        _39_What_type_of_information_would: {
          health1: 'Health',
          legal_aid: 'Legal aid',
          food: 'Food',
          livelihoods: 'Livelihoods',
          shelter: 'Shelter',
          return: 'Return',
          protection: 'Protection',
          cash: 'Cash',
          family_reunification: 'Family reunification',
          compensation_regarding_the_mec: 'Compensation for destroyed houses',
          otheri: 'Other',
        },
        _38_Have_you_recveived_information: {
          health2: 'Health',
          legal_aid: 'Legal aid',
          food: 'Food',
          cash: 'Cash',
          education: 'Education',
          shelter: 'Shelter',
          employment: 'Employment',
          return: 'Return',
          family_reunification: 'Family reunification',
          specialised_services: 'Specialised services',
          othere: 'Other',
          none_of_the_abovee: 'None of the above',
          protection: 'Protection',
        },
        _12_7_1_Do_you_plan_to_return_to_your_: {
          yes: 'Yes',
          no: 'No',
          yes_but_no_clear_timeframe: 'Yes, but no clear timeframe',
        },
        priorityNeeds: {
          health: 'Health',
          shelter: 'Shelter',
          food: 'Food',
          livelihoods: 'Livelihoods',
          other: 'Other',
          winter_items: 'Winter items',
          cash: 'Cash',
          civil_documentation: 'Civil documentation',
          university_or_teritary_eduction: 'University or tertiary education',
          education_for_children: 'Education for children',
          nfis: 'NFIs',
          wash: 'Wash',
        },
        factorsToReturn: {
          shelter_is_repaired: 'Shelter is repaired',
          improvement_in_security_situat: 'Security situation improvement',
          increased_service_availability: 'Increased service availability',
          infrastructure__including_heat: 'Infrastructure is repaired',
          health_facilties_are_accessibl: 'Health facilities accessible',
          // cessation_of_hostilities: 'Cessation of hostilities',
          // government_regains_territory_f: 'Government regains territory from NGCA',
          other219: 'Other',
          education_facilities__schools_: 'Education facilities accessible',
        },
        propertyDamageTitle: {
          fully_damaged_needs_full_reconstruction: '⚫ Fully damaged',
          partially_damaged__considerable_repair_i: '🔴 Heavily damaged',
          partially_damage: '🟠 Medium damaged',
          light_damage: '🟢 Light damaged',
        },
        propertyDamageDesc: {
          fully_damaged_needs_full_reconstruction: 'Full rebuild needed',
          partially_damaged__considerable_repair_i: 'Structural repair needed',
          partially_damage: 'No structural repairs needed',
          light_damage: 'No structural repair needed',
        }
      },
      requiredLegalAidInformation: `Need for information on legal aid services`,
      // senseOfSafetyByOblast: 'Bad or Very bad sense of safety by Oblast',
      senseOfSafetyByOblast: 'Poor sense of safety by oblasts',
      elderlyWithoutPensionCertificate: 'Elderly without pensioner certificate',
      childWithoutBirthCertificate: 'Child without birth certificate',
      barriersToPersonalDocument: 'Barriers',
      maleWithoutIDPCertByOblast: 'IDP men 18 to 60 years old without IDP certificate',
      maleWithoutIDPCert: 'Unregistered IDPs',
      safetyConcernsDuringDisplacement: `Safety/Security on Displacement`,
      threatsOrConcernsDuringDisplacement: `Experienced threats`,
      threatsOrConcernsDuringDisplacementByOblast: `Experienced shelling threat by oblast of origin`,
      titles: {
        document: 'Registration & Documentation',
        livelihood: 'Livelihood',
        needs: 'Specific needs and priorities',
        safety: `Safety & Security`
      },
      desc: {
        livelihoodAbout: ({
          workingIdp,
          workingNoIdp,
          dependOfAidIdp,
          dependOfAidNotIdp,
        }: {
          workingIdp: string,
          workingNoIdp: string,
          dependOfAidIdp: string,
          dependOfAidNotIdp: string,
        }) => `
        <p>
          The conflict has significantly impacted the livelihood opportunities of both IDPs 
          and individuals affected by the conflict, leaving them highly dependent on State and humanitarian aid.
          Only <b>${workingIdp}</b> of IDP HHs have at least one member employed, 
          compared to <b>${workingNoIdp}</b> for non-displaced HHs.
         
        </p>
        <p>
          A considerable majority of IDP HHs without any employed members (<b>${dependOfAidIdp}</b>) receive aid, 
          compared to <b>${dependOfAidNotIdp}</b> for surveyed non-displaced and returnee HHs.
        </p>
      `,
        livelihoodAbout2: ({
          hhIncomeBelow3000,
          avgHHIncomeBelow3000,
          avgHHIncomeBelow3000Max,
        }: {
          hhIncomeBelow3000: string
          avgHHIncomeBelow3000: string
          avgHHIncomeBelow3000Max: string
        }) => `
        <p>
          According to PM data, <b>${hhIncomeBelow3000}</b> of HHs earn less than 3,000 UAH (80 USD) per month, 
          which is below the individual poverty range<sup>(1)</sup> in Ukraine.
        </p>
        <p>
          Dividing each HH income by the number of HH members, 
          we can estimate that between <b>${avgHHIncomeBelow3000}</b> to <b>${avgHHIncomeBelow3000Max}</b> of monitored HHs are living below the poverty range.
        </p>
      `,
        needs: ({
          percentLvivWithoutHot,
          percentZapoWithoutHot,
          percentChernihivWithoutHot,
        }: {
          percentLvivWithoutHot: string
          percentZapoWithoutHot: string
          percentChernihivWithoutHot: string
        }) => `
        <p>
          PM highlights disparities between groups and areas.
          HHs with PwDs, elderly or female-headed HHs and IDPs face greater challenges 
          in fulfilling their basic needs. For instance, <b>IDPs need more NFIs</b> than non-displaced 
          communities, including hygiene kits and linens, due to leaving their belongings behind.
        </p>
        <p>
          Access to information on humanitarian assistance and social services provided is 
          still challenging especially for those residing in remote/rural, hard-to-reach areas
          and for <b>PwDs and elderly who face
          barriers in accessing online information</b> and registration procedures.
          Limited information has reported to be the main barrier to accessing cash assistance.
        </p>
       `,
        documentationAboutIdp: ({
          maleWithoutIdpCert,
          _14_1_1_idp_nomale_without_cert,
          withoutDocuments,
        }: {
          maleWithoutIdpCert: string
          _14_1_1_idp_nomale_without_cert: string
          withoutDocuments: string
        }) => `
        <p>
          PM indicate that most IDPs are registered, while registration being facilitated by Diya digital application.
          However, a significantly higher percentage of men from 18 to 60 years old (<b>${maleWithoutIdpCert}</b>) 
          compared to others gender/age groups (<b>${_14_1_1_idp_nomale_without_cert}</b>) have not registered due to <b>fear of conscription</b>
          particularly in Chernihivska and Kharkivska oblasts.
        </p>
        <p>
          <b>${withoutDocuments}</b> of surveyed HHs reported not having any formal lease agreement, 
          mainly relying on verbal agreement, exposing them to risks of eviction.
        </p>
        `,
        safety: ({
          safetyDuringDisplacement,
          sosKharkiv,
          sosChernihiv,
        }: {
          safetyDuringDisplacement: string
          sosKharkiv: string
          sosChernihiv: string
        }) => `
          <p>
            According to PM data, safety and security threats were experienced by <b>${safetyDuringDisplacement}</b> of 
            IDPs during their displacement, with shelling being the primary safety concern. 
          </p>
          <p>
            The data shows that Kharkivska and Luhanska oblasts have been particularly affected, 
            with almost <b>80%</b> of IDPs originating from those areas having experienced shelling during their displacement. 
            However, Chernihivska oblast stands out as an area where the sense of safety is particularly poor, 
            with <b>${sosChernihiv}</b> of monitored HHs reporting feeling unsafe, compared to <b>${sosKharkiv}</b> in Kharkivska 
            oblast although closer to the frontline.
          </p>
        `,
        displacement: ({
          intentionToReturn,
          dnipIdps,
          cherniIdps,
          lvivIdps,
          chernivIdps,
        }: {
          intentionToReturn: string,
          dnipIdps: string,
          cherniIdps: string
          lvivIdps: string
          chernivIdps: string
        }) => `
          <p>
            Significant population movements were observed at the beginning of the crisis reaching over 8 million IDPs in May 2022 according to the
            <a href="${externalLinks.iomDtm}" class="link">IOM's Displacement Tracking Matrix</a>.
            Displacement is widely associated with conflict and direct threats to life, 
            security, and safety.
          </p>
          <p>
            Certain areas have seen a significant influx of IDPs, even though they are still experiencing active conflict.
            This has been observed in Dnipropetrovska oblast hosting <b>${dnipIdps}</b> of the <b>monitored</b> IDP population,
            mainly originating from Donetsk oblast and other NGCAs.
            Lvivska and Chernivetska oblasts, which are less affected by shellings, respectively accommodate 
            <b>${lvivIdps}</b> and <b>${chernivIdps}</b> of the <b>monitored</b> IDPs.   
          </p>
        `,
        sample: `
          The conflict generated various protection risks for the population. Although all areas where PM took place were directly
          or indirectly after by the conflict, the needs and protection risks vary in each area and are different depending to 
          the monitored population group such as  HHs with PwDs, elderly or female-headed HHs and IDPs.
        `,
        disclaimer: `
          This snapshot summarizes the findings of Protection Monitoring (PM) implemented 
          through household interviews in Ukraine and has been conducted in 
            <b>Chernihivska</b>,
            <b>Chernivetska</b>,
            <b>Dnipropetrovska</b>,
            <b>Kharkivska</b>,
            <b>Lvivska</b>,
            <b>Zaporizska</b>
            oblasts. 
          DRC protection monitoring targeted Internally Displaced Persons (IDPs)
          and people directly exposed to and affected by the current armed conflict.
        `,
        previousPeriodNote: (period: Period) => `<sup>(1)</sup> Compared to the previous period of ${format(period.start, 'LLL yyyy')} - ${format(sub(period.end, {days: 1}),
          'LLL yyyy')}`,
        dataAccuracy: `<sup>(1)</sup> Due to uneven monitoring across the oblasts, values does not reflect the exact proportions; however, they reveal trend insights.`,
      },
      mostNeededInformation: `Most needed information (% of HHs)`,
      lackOfInformationNeeded: 'Lack of access to information',
      first_priorty: `Firsts priority needs (% of HHs)`,
      firstPrioritiesIdp: `For IDPs`,
      firstPrioritiesHohh60: `For 60+ HoHH`,
      firstPrioritiesHohhFemale: `For female HoHH`,
      firstPrioritiesMemberWithDisability: `For HoHH w/ PwD`,
      nfiNeededByOblast: 'NFIs needed by oblast',
      _40_1_pn_shelter_byCategory: 'Prioritizing Shelter need by PoC',
      _40_1_pn_health_byCategory: 'Health by PoCs',
      _40_1_pn_cash_byCategory: 'Cash',
      // _40_1_pn_shelter_byCategory: 'Shelter as 1st priority need by category',
      // _40_1_pn_health_byCategory: 'Health as 1st priority need by category',
      // _40_1_pn_cash_byCategory: 'Cash as 1st priority need by category',
      _29_nfiNeededByCategory: 'Reported needs of NFIs',
      title: 'Protection Monitoring Snapshot',
      title2: 'Ukraine',
      subTitle: 'Ukraine Response',
      factorInfluencingSenseOfSafety: 'Factors influencing the sense of safety',
    },
    sort: 'Sort',
    taxId: 'Tax ID',
    amount: 'Amount',
    amountUAH: 'Amount UAH',
    date: 'Date',
    validFrom: 'Valid from',
    expiry: 'Expiry',
    departureFromAreaOfOrigin: `Displacement from area of origin`,
    displacementAndReturn: 'Displacement and Return Figures',
    returnToOrigin: `Return to area of origin`,
    dateOfDeparture: `Date of departure`,
    pin: 'Pin',
    _wfpDeduplication: {},
    mpcaDb: {
      drcSupportSuggestion: {
        ThreeMonthsUnAgency: '3 Months Assistance - UN Agency',
        ThreeMonthsNoDuplication: '3 Months Assistance - No Duplication',
        TwoMonths: '2 Months Assistance',
        OneMonth: '1 Month Assistance',
        NoAssistanceFullDuplication: 'No Assistance - Full Duplication',
        NoAssistanceExactSameTimeframe: 'No Assistance - Exact Same Timeframe',
        NoAssistanceDrcDuplication: 'No Assistance - DRC Duplication',
        DeduplicationFailed: 'Deduplication Failed',
        ManualCheck: 'Manual Check',
      },
      uploadWfpTaxIdMapping: 'Upload Tax IDs',
      existingOrga: 'Existing orga',
      existingAmount: 'Existing amount',
      existingStart: 'Existing start',
      existingEnd: 'Existing end',
      signatory: 'Signatory',
      headOfOperations: 'Head of Operations',
      financeAndAdministrationOfficer: 'Finance and Administration officer',
      cashAndVoucherAssistanceAssistant: 'Cash and Voucher Assistance assistant',
      paymentTool: 'Payment tool',
      allAmountsAreWithoutTaxes: 'All amounts are in UAH without taxes',
      paymentTools: 'Payment tools',
      generateDeduplicationFile: 'Generate WFP file',
      makePaymentTool: 'Make Payment Tool',
      deduplicationCheck: 'Deduplication',
      budgetLineCFR: 'Budget Line CFR',
      budgetLineMPCA: 'Budget Line MPCA',
      budgetLineStartUp: 'Budget Line StartUp',
      mpcaGrantAmount: 'MPCA grant amount',
      cfrGrantAmount: 'CFR grant amount',
      startupGrantAmount: 'Start-up grant amount',
      status: {
        Deduplicated: 'Deduplicated',
        PartiallyDeduplicated: 'Partially deduplicated',
        NotDeduplicated: 'Not deduplicated',
        Error: 'Error',
      }
    },
    _koboDatabase: {
      title: (form?: string) => `Kobo Database${form ? `: <b>${form}</b>` : ``}`,
      showAllQuestions: 'Show unanswered questions',
      pullData: `Synchronize last Kobo data.`,
      pullDataAt: (lastUpdate: Date) => `Synchronize Kobo data.<br/>Last synchronization: <b>${formatDateTime(lastUpdate)}</b>.`,
      valueNoLongerInOption: 'This value is no longer in the options list',
      noAccessToForm: `You don't have access to any database.`,
      openKoboForm: 'Open Kobo form',
    },
    _cfm: {
      _feedbackType: {
        'thanks': 'Thanks',
        'feedback': 'Feedback',
        'request': 'Request',
        'complaint': 'Complaint',
      },
      priority: 'Rank',
      openTicketsHigh: 'High priority',
      openTickets: 'Open tickets',
      referralMatrix: 'Referral Matrix',
      feedback: 'Feedback',
      feedbackType: 'Category',
      feedbackTypeExternal: 'Feedback type',
      contactAgreement: 'Contact agreement',
      existingDrcBeneficiary: 'Existing DRC beneficiary',
      reporterDetails: 'Reporter information',
      formLong: {
        Internal: 'Internal Form',
        External: 'External Form',
      },
      formFrom: {
        Internal: 'From Internal form',
        External: 'From External form',
      },
      form: {
        Internal: 'Internal',
        External: 'External',
      },
      status: {
        Close: 'Close',
        Open: 'Open',
        Processing: 'Processing',
      }
    },
    _shelter: {
      workDoneAt: 'Work done',
      scoreLevel: 'Price level',
      priceLevel: 'Price level',
      roofSum: 'Σ Roof',
      windowsSum: 'Σ Window',
      agreement: 'Agreement',
      workOrder: 'Work order',
      donor: 'Donor',
      contractor1: 'Contractor 1',
      contractor2: 'Contractor 2',
      ntaForm: 'NTA form',
      taForm: 'TA form',
      taRefOk: 'Correct reference or not filled TA',
      taRefNok: 'Wrong NTA reference in TA',
      taFilled: 'TA form filled',
      taNotFilled: 'TA form NOT filled',
      validationStatus: 'Accepted?',
      progressStatus: 'Status',
      documentType: 'Doc type',
      owner: 'Tenant',
      ownershipDocumentExist: 'Ownership docs exist',
      ownershipDocument: 'Ownership docs',
      accommodation: 'Accommodation',
      total: 'Total',
      scoreDamage: 'Damage',
      scoreSocio: 'Socio',
      scoreDisplacement: 'Displ.',
      progress: {
        ContractorVisitDone: 'Contractor visit done',
        WorkEstimatesReceived: 'Work estimates received',
        PurchaseRequestDone: 'Purchase Request Done',
        WorkOrderDone: 'Work Order Done',
        RepairWorksStarted: 'Repair works Started',
        RepairWorksCompleted: 'Repair works completed',
        ContractorInvoiceReceived: 'Contractor invoice received',
        HandoverCertificateOfCompletionSigned: 'Handover/Certificate of completion signed',
        InvoicePaymentProcessed: 'Invoice payment processed',
      }
    },
    admin: 'Admin',
    note: 'Note',
    projectCode: 'Project Code',
    form: 'Form',
    viewMore: 'More',
    viewLess: 'Less',
    showDummyAccounts: 'Show dummy accounts',
    filterBlanks: 'Filter blanks',
  },
})
