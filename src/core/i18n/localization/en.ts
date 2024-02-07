import {format, formatDistance, formatDuration as formatDurationFns, sub} from 'date-fns'
import {externalLinks} from '../../externalLinks'
import {appConfig} from '@/conf/AppConfig'
import {capitalize} from '@/utils/utils'
import {OblastIndex, OblastISO} from '@/shared/UkraineMap/oblastIndex'
import {Period} from '@/core/type/period'

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

export const dateFromNow: {
  (d: Date): string
  (d?: undefined): undefined
  (d?: Date): string | undefined
} = (d) => {
  return d ? formatDistance(d, new Date(), {addSuffix: true}) : undefined as any
}

export const formatLargeNumber = (n?: number, options?: Intl.NumberFormatOptions): string => {
  return n !== undefined && n !== null && !isNaN(n) ? n.toLocaleString('en-EN', options) : '-'
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
    snapshot: 'Snapshot',
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
    updating: 'Updating',
    users: 'Users',
    select3Outcomes: `Please, select 3 outcomes`,
    oblast: 'Oblast',
    edit: 'Edit',
    apply: 'Apply',
    clear: 'Clear',
    custom: 'Custom',
    close: 'Close',
    reinitialize: 'Reinitialize',
    connectAs: 'Connect as',
    focalPoint: 'Focal point',
    project: 'Project',
    name: 'Name',
    violence: 'Violence',
    copyingMechanisms: 'Coping mechanisms',
    female: 'Female',
    settlement: 'Settlement',
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
    enumerator: 'Enumerator',
    disaggregation: 'Disaggregation',
    drcOffice: 'DRC office',
    question: 'Question',
    _ageGroup: {
      Quick: 'Quick',
      DRC: 'DRC',
      ECHO: 'ECHO',
      BHA: 'BHA',
      UNHCR: 'UNHCR',
    },
    answer: 'Answer',
    calculations: 'Calculations',
    value: 'Value',
    percent: 'Percent',
    Pending: 'Pending',
    recap: 'Recap',
    Approved: 'Approved',
    Rejected: 'Rejected',
    mykolaiv: 'Mykolaiv',
    lastConnectedAt: 'Last connection',
    validation: 'Validation',
    perpetrators: 'Perpetrators',
    kyiv: 'Kyiv',
    view: 'View',
    continue: 'Continue',
    viewData: 'View data',
    theme: 'Dark theme',
    format: 'Format',
    previous: 'Previous',
    filter: 'Filter',
    noneFormatted: '<i>None</i>',
    none: '<i>None</i>',
    filterPlaceholder: 'Filter...',
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
    refreshTable: 'Refresh current data',
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
    toggleDatatableColumns: 'Show/hide columns',
    areas: {
      north: 'North',
      east: 'East',
      south: 'South',
      west: 'West'
    },
    paid: 'Paid',
    start: 'Start',
    submissionStart: 'Submission start',
    end: 'End',
    filters: 'Filters',
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
    submissions: 'Submissions',
    householdSize: 'Household size',
    hhSize: 'HH size',
    dashboard: 'Dashboard',
    loading: 'Loading',
    passportSerie: 'Passport serie',
    price: 'Price',
    passportNumber: 'Passport number',
    taxID: 'Tax ID',
    id: 'ID',
    back: 'Back',
    access: 'Access',
    accesses: 'Accesses',
    url: 'URL',
    confirmRemove: 'Confirm remove',
    expireAt: 'Expire at',
    slug: 'Slug',
    try: 'Try',
    category: 'Category',
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
    admin: 'Admin',
    idpOriginOblast: 'Origin oblast of IDPs',
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
    duplicate: 'Duplicate',
    duplication: 'Duplication',
    deduplication: 'Deduplication',
    wfpDeduplication: 'WFP Deduplication',
    deduplications: 'Deduplications',
    hohhFemale: 'HoHH female',
    vulnerabilities: 'Vulnerabilities',
    selectAll: 'Select all',
    ageGroup: 'Age groups',
    ratio: 'Ratio',
    koboSubmissionTime: 'Kobo submission',
    absolute: 'Absolute',
    contact: (_: string) => `Contact <b>${_}</b>.`,
    intentions: 'Intentions',
    sex: 'Sex',
    daily: 'Daily',
    monthly: 'Monthly',
    createdAt: 'Created at',
    updatedAt: 'Updated at',
    returnToThePlaceOfHabitualResidence: 'Return to the place of habitual residence',
    currentStatus: 'Current status',
    status: 'Status',
    male: 'Male',
    elderlyMale: 'Elderly male',
    elderlyFemale: 'Elderly female',
    selectForm: 'Select form',
    selectData: 'Select Data',
    ukraine: 'Ukraine',
    location: 'Location',
    submissionTime: 'Submission',
    submittedBy: 'By',
    add: 'Add',
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
    shelter: 'Shelter',
    health: 'Health',
    cash: 'Cash',
    levelOfPropertyDamaged: 'Level of damaged',
    mainSourceOfIncome: 'Main source of income',
    employmentType: 'Type of employment',
    monthlyIncomePerHH: 'Average monthly income per HH',
    HHsLocation: 'HHs Location',
    idp: 'IDP',
    overview: 'Overview',
    requests: 'Requests',
    selectADatabase: 'Select a Kobo form',
    noIdp: 'Non-IDP',
    comparedToPreviousMonth: 'Compared to 30 days ago',
    idps: 'IDPs',
    nonDisplaced: 'Non-displaced',
    refugeesAndReturnees: 'Refugees and returnees',
    poc: 'Person of concern',
    global: 'Global',
    description: 'Description',
    createdBy: 'Created by',
    donor: 'Donor',
    gender: 'Gender',
    respondentGender: 'Respondent gender',
    respondent: 'Respondent',
    program: 'Program',
    raion: 'Raion',
    relative: 'Relative',
    cumulative: 'Cumulative',
    hromada: 'Hromada',
    noIdps: 'Non-IDPs',
    register: 'Register',
    noIdpsOnly: 'Non-IDPs only',
    uaCitizen: 'UA citizen',
    appInMaintenance: 'Application in maintenance, we\'ll be back soon.',
    comments: 'Comments',
    ukrainianCitizenShip: 'Ukrainian citizenship',
    hhBarriersToPersonalDocument: 'Experienced barriers to obtain civil documents',
    atLeastOneMemberWorking: 'HHs with at least one member working',
    _meal: {
      openTracker: 'Open Excel tracker',
      visitMonitoring: 'Visit Monitoring',
      verification: 'Verification',
    },
    _protection: {
      filterEchoReporting: 'Filter duplication',
      filterEchoReportingDetails: (n: number) => `Skip ${n}% of HHS data to limit double counting.`,
      filterEchoReportingDisability: 'Filter with disability',
      filterEchoReportingDisabilityDetails: (n: number) => `Select ${n}% of individuals.`,
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
    _mealVerif: {
      numericToleranceMargin: 'Tolerance margin',
      activityForm: 'Activity form',
      verificationForm: 'Verification form',
      showBoth: 'Show side by side',
      koboForm: `Kobo form`,
      newRequest: 'New request',
      requested: 'Request created!',
      verified: 'Verified',
      notVerified: 'Not verified',
      requestTitle: 'Meal Verification Request',
      selectedKoboForm: 'Selected Kobo form',
      selectedData: (n: number) => `You selected <b>${n}</b> rows`,
      sampleSizeN: (n: number) => `MEAL team will verify ${n}%`,
      sampleSize: 'Sample size',
      dataToBeVerified: (n?: number) => `<b>${n ?? '-'}</b> rows to be verified`,
      // sampleSize: 'Sample Size',
      applyFilters: 'Use table filters to selected data that must be verified.',
      selectedNRows: (n: number) => `Select ${n} rows`,
      giveANameToId: 'Give a name to identify this set of verifications',
      giveDetails: 'Give some details',
      allIndicators: 'Indicators',
      allValidIndicators: 'Valid indicators',
      allErrorIndicators: 'Invalid indicators',
      valid: 'Validity',
      viewRegistrationData: 'View Registration Data',
      viewDataCheck: 'View Verification Data',
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
      factors: 'Factors',
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
    safety: {
      minusRusLabel: {
        prisoners: 'Prisoners',
        killed: 'Killed',
        aircraft: 'Aircraft',
        armored_combat_vehicles: 'Armored combat vehicles',
        artillery: 'Artillery',
        helicopters: 'Helicopters',
        wounded: 'Wounded',
        ships_boats: 'Ships boats',
        tanks: 'Tanks',
      },
      minusRusTitle: 'Intensity Proxy',
      dataTakenFromMinusRus: 'Data extracted in real-time from <a class="link" target="_blank" href="https://www.minusrus.com/en">https://www.minusrus.com/en</a>.',
      aggravatingFactors: 'Aggravating factors',
      lastAttacks: 'Last attacks',
      incidentTrackerTitle: 'Incidents dashboard',
      incidents: 'Incidents',
      incident: 'Incident',
      attackOfOn: (oblast?: OblastISO,
        type?: string[]) => `${type?.map(capitalize).join(' and ') ?? ''}${type ? ' a' : 'A'}ttack${oblast ? ` in ${OblastIndex.byIso(oblast).name}` : ''}`,
      attackTypes: 'Attack type',
      attacks: 'Attacks',
      attack: 'Attack',
      dead: 'Dead',
      injured: 'Injured',
      typeOfCasualties: 'Type of casualties',
      target: 'Target',
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
      nn2: {
        livelihood: ({
          outOfWork,
        }: {
          outOfWork?: string
          //}) => `<b>${outOfWork}</b> of respondents reported household members being out of work and seeking employment remains quite high, with main unemployment factor being the lack of available jobs.`,
        }) => `The percentage of surveyed individuals out of work and seeking employment remains quite high at <b>${outOfWork}</b> of responses, with main unemployment factor being the lack of available jobs. As a result of the limited livelihood opportunities or challenges in accessing livelihoods, a considerable proportion of the surveyed population is currently dependent on social protection schemes and humanitarian assistance.`,
        needs: ({
          healthPn,
          damagedAcc,
        }: {
          healthPn?: string
          damagedAcc?: string
          // }) => `Health continues to be the first priority for the vast majority of households surveyed, cited by a total of <b>${healthPn}</b> of respondents as a priority need. <b>${damagedAcc}</b> of respondents reported damage to their accommodation.`,
        }) => `<b>${healthPn}</b> of respondents indicated health as a priority need. <b>${damagedAcc}</b> of respondents reported damage to their accommodation.`,
        safety: ({
          fearOfShelling,
          barrierToMovement,
        }: {
          fearOfShelling?: string
          barrierToMovement?: string
        }) => `<b>${fearOfShelling}</b> of respondents indicating feeling unsafe or very unsafe reported shelling/threat of shelling as the main factor. Fear of conscription was reported by <b>${barrierToMovement}</b> of respondents indicating facing barriers to freedom of movement.`,
        registration: ({
          hrkLackPersonalDoc
        }: {
          hrkLackPersonalDoc?: string
        }) => `<b>${hrkLackPersonalDoc}</b> of individuals surveyed in Kharkivska oblast lack personal documentation and face subsequent challenges in accessing services as well as  limitations to their freedom of movement. Most of the respondents who reported lacking HLP documentation indicated not possessing property ownership for their apartment/house or land, which can prevent them from accessing compensation, resolving property disputes (which may pose the long-term threat of eviction for IDPs), or exercising their rights in relation to their land or property.`,
        displacement: `Majority of the IDPs surveyed during the monitoring period reported having left their place of habitual residence in June 2023, following the Nova Kakhova dam damage. The attack on the Kakhova dam on 6<sup>th</sup> June caused massive flooding, affecting both government controlled and non-government controlled  parts of Khersonska oblast including the city of Kherson, and Mykolaivska oblast, resulting in thousands of individuals being displaced in both oblasts. Majority of families affected by the flooding opted to remain near their places of origin to be able to return home as soon as the water levels reduced.`,
        desc: 'This snapshot summarizes the findings of <b>Protection Monitoring</b> (PM) implemented through household surveys in Mykolaivska oblast between June and July 2023. DRC protection monitoring targeted Internally Displaced Persons (IDPs) and people directly exposed to and affected by the current armed conflict in order to understand the protection needs facing affected populations; informing DRC and the protection communities\' response.',
      },
      basicNeeds: `Basic Needs`,
      livelihood: `Livelihoods & Coping mechanisms`,
      safetyProtectionIncidents: 'Safety & Major Stress Factors',
      displacementDesc: `Majority of the IDPs surveyed during the monitoring period reported having left their place of habitual residence between February and May 2022. Main factors influencing departure reported included shelling and attacks on civilians, destruction or damage of housing, land or property due to conflict, as well as occupation of property, exposure to UXOs/landmines and lack of access to livelihoods.`,
      integrateIntoTheLocalCommunity: 'Integrate into the local community',
      monitoredHhByOblast: 'Monitored HH By Oblast',
    },
    protHHSnapshot: {
      male1860: `Males 18-60 years old`,
      avgHhSize: (n: number) => `Average HH size: ${n.toFixed(1)}`,
      noAccommodationDocument: 'HHs without formal lease agreement',
      maleWithoutIDPCert: 'Unregistered IDPs',
      titles: {
        document: 'Registration & Documentation',
        livelihood: 'Livelihood',
        needs: 'Specific needs and priorities',
        safety: `Safety & Security`
      },
      title: 'Protection Monitoring Snapshot',
      title2: 'Ukraine',
    },
    sort: 'Sort',
    hardRefresh: 'Hard refresh',
    amount: 'Amount',
    target: 'Target',
    amountUAH: 'Amount UAH',
    amountUSD: 'Amount USD',
    date: 'Date',
    validFrom: 'Valid from',
    expiry: 'Expiry',
    departureFromAreaOfOrigin: `Displacement from area of origin`,
    displacementAndReturn: 'Displacement and Return Figures',
    returnToOrigin: `Return to area of origin`,
    dateOfDeparture: `Date of departure`,
    pin: 'Pin',
    warehouse: 'Warehouse',
    year: 'Year',
    vehicule: 'Vehicule',
    koboForm: 'Kobo form',
    koboForms: 'Kobo forms',
    disability: 'Disability',
    otherKoboForms: 'Other Kobo forms',
    _wfpDeduplication: {},
    _partner: {
      residualRisk: 'Residual Risk',
      vetting: 'Vetting',
      rapidMobilization: 'Rapid mobilization',
      relationship: 'Relationship',
      percentByTypeOfOrg: '% of Partner types',
      targetedMinorities: 'Targeted Minorities',
      benefReached: 'Total beneficiaries reached',
      benefPwdReached: 'Beneficiaries PwD reached',
      totalBudget: 'Total budget allocated',
      partners: 'Partners',
      sgas: 'SGAs',
      ongoingGrant: 'Ongoing grants',
      workingOblast: 'Working oblast',
      equitable: 'Equitable partnerships',
      partiallyEquitable: 'Partially equitable partnerships',
      womenLedOrganization: `Focused on women's right out of women-led org`,
      youthLedOrganization: `Focused on children out of youth-led org`,
      elderlyLedOrganization: `Focused on elders or PwD`,
    },
    mpca: {
      duplicationCheck: 'Duplication check',
      pullLastDataDesc: 'Get last Kobo submissions and rebuild the database.',
      committed: 'Committed',
      commit: 'Commit',
      projectOverride: 'Project override',
      projectFinal: 'Project Final',
      assistanceByLocation: 'Assistance by location',
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
      tagNotUpdated: 'Failed to update tag. Reloading clean data set...',
      downloadAsXLS: 'Download <b>filtered data</b> as XLS',
      registerNewForm: 'Register new form',
      repeatGroupsAsColumns: `Display repeat groups as new columns (also visible in XLS exports).`,
      title: (form?: string) => `Kobo Database${form ? `: <b>${form}</b>` : ``}`,
      showAllQuestions: 'Show unanswered questions',
      pullData: `Synchronize last Kobo data.`,
      pullDataAt: (lastUpdate: Date) => `Synchronize Kobo data.<br/>Last synchronization: <b>${formatDateTime(lastUpdate)}</b>.`,
      valueNoLongerInOption: 'This value is no longer in the options list',
      noAccessToForm: `You don't have access to any database.`,
      openKoboForm: 'Open Kobo form',
    },
    _cfm: {
      requestByOblast: 'Requests by Oblast',
      additionalInformation: 'Details',
      deleteWarning: `In case of mistake, you can still recover deleted data by contacting ${appConfig.contact}.`,
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
    _admin: {
      createGroup: 'Create group',
    },
    _shelter: {
      updatingTag: (rowsCount: number, key: string, value: string) => `Updating ${key}=${value} on ${rowsCount} rows...`,
      cannotUpdateTag: (rowsCount: number, key: string, value: string) => `Update failed for ${key}=${value} on ${rowsCount} rows. Table not edited.`,
      assignedContractor: 'Assigned contractors',
      assessmentLocations: 'Assessments locations',
      repairCost: 'Total repairs cost',
      repairCostByHh: 'Repairs cost by HH',
      workDoneAt: 'Work done at',
      workDoneStart: 'Work done start',
      scoreLevel: 'Price level',
      priceLevel: 'Price level',
      roofSum: 'Σ Roof',
      windowsSum: 'Σ Window',
      agreement: 'Agreement',
      workOrder: 'Work order',
      contractor: 'Contractor',
      contractor1: 'Contractor lot 1',
      contractor2: 'Contractor lot 2',
      lot1: 'Lot 1',
      lot2: 'Lot 2',
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
      settlement: 'Settlement',
      street: 'Street',
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
    note: 'Note',
    projectCode: 'Project Code',
    form: 'Form',
    koboId: 'Kobo _id',
    desc: 'Desc',
    viewNMore: (n: number) => `View ${n} more`,
    viewNLess: (n: number) => `View ${n} less`,
    viewMore: 'More',
    viewLess: 'Less',
    timeConsumingOperation: 'Time consuming operation.',
    sector: 'Sector',
    showDummyAccounts: 'Show dummy accounts',
    filterBlanks: 'Filter blanks',
    total: 'Total',
    shouldDelete: 'Delete?',
    remove: 'Delete',
    sync: 'Sync',
    pullLast: 'Pull last',
    pullLastTitle: 'Pull last',
  },
})
