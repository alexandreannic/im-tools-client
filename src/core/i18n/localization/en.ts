import {formatDistance, formatDuration as formatDurationFns} from 'date-fns'
import {externalLinks} from '../../externalLinks'
import {KoboFormProtHH} from '../../koboForm/koboFormProtHH'
import Status = KoboFormProtHH.Status

const invalidDate = '-'

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
  return n !== undefined && n !== null ? n.toLocaleString('en-EN') : '-'
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
    area: 'Area',
    answers: 'Answers',
    noDataAtm: 'No data at the moment',
    seeResults: `See results`,
    select3Outcomes: `Please, select 3 outcomes`,
    oblast: 'Oblast',
    somethingWentWrong: 'Something went wrong',
    yes: 'Yes',
    no: 'No',
    previous: 'Previous',
    next: 'Next',
    nLines: (n: number) => `<b>${n}</b> lignes`,
    confirm: 'Confirm',
    toggleDatatableColumns: 'Toggle',
    areas: {
      north: 'North',
      east: 'East',
      south: 'South',
      west: 'West'
    },
    hhs: 'Households',
    individuals: 'Individuals',
    hhSize: 'Household size',
    decidingFactorsToReturn: 'Deciding factors to return',
    displacement: 'Displacement',
    origin: 'Oblast of origin',
    current: 'Current Oblast',
    socialCohesion: 'Safety & Social cohesion',
    age: 'Age',
    hohhOlder: 'HoHH 60+',
    hohhFemale: 'HoHH female',
    vulnerabilities: 'Vulnerabilities',
    selectAll: 'Select all',
    ageGroup: 'Age group',
    sex: 'Sex',
    status: 'Current status',
    male: 'Male',
    female: 'Female',
    undefined: 'Unknown',
    sample: 'Sample overview',
    propertyDamaged: 'Property damaged due to the conflict',
    intentionToReturn: 'Intention to return',
    hhCategoryType: {
      idp: 'IDP',
      hohh60: 'Elderly (60+) HoHH',
      hohhFemale: 'Female HoHH',
      memberWithDisability: 'Member with disability',
      all: 'Average'
    },
    statusType: {
      conflict_affected_person: 'Conflict affected person',
      idp: 'IDP',
      host_community_member: 'Host community member',
      idp_returnee: 'IDP returnee',
    } as Record<Status, string>,
    shelter: 'Shelter',
    health: 'Health',
    cash: 'Cash',
    levelOfPropertyDamaged: 'Level of property damaged',
    mainSourceOfIncome: 'Main source of income',
    employmentType: 'Type of employment',
    monthlyIncomePerHH: 'Monthly income per HH',
    lowIncome: 'HH',
    idp: 'IDP',
    noIdp: 'Non-IDP',
    idps: 'IDPs',
    noIdps: 'Non-IDPs',
    uaCitizenShip: 'Ukrainian citizenship',
    hhBarriersToPersonalDocument: 'Experienced barriers to obtain civil documents',
    atLeastOneMemberWorking: 'HHs with at least one member working',
    protHHSnapshot: {
      numberOfIdp: '# IDPs',
      numberOfHohh60: '# Elderly (60+) HoHH',
      numberOfHohhFemale: '# Female HoHH',
      numberOfMemberWithDisability: '# Member with disability',
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
          The conflict has made it difficult for people to earn a living, especially for those who have been displaced. 
          Many IDPs rely on state benefits and aid to get by, as only <b>${workingIdp}</b> of IDP households have at least one employed member, 
          compared to <b>${workingNoIdp}</b> for non-displaced households.
        </p>
        <p>
          A significant majority of IDP households (<b>${dependOfAidIdp}</b>) receive aid without any employed members, 
          compared to <b>${dependOfAidNotIdp}</b> for non-displaced households.
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
          <b>${hhIncomeBelow3000}</b> of the households being monitored are in poverty<sup>(1)</sup>, 
          and between <b>${avgHHIncomeBelow3000}</b> to <b>${avgHHIncomeBelow3000Max}</b> of all households are estimated to be in poverty based on household size.
        </p>
      `,
      // <b>${hhIncomeBelow3000}</b> of the monitored HHs are in the poverty range<sup>(1)</sup>.
      // If we consider the number of members by HH, we can estimate that between <b>${avgHHIncomeBelow3000}</b> and <b>${avgHHIncomeBelow3000Max}</b> of HHs are in the poverty range.
      livelihoodAboutNotes: `
        <sup>(1)</sup> The range for social protection is calculated by the Ministry of Finance.
        In January 2023, the living wage is <b>${formatLargeNumber(2589)}</b> UAH average and <b>${formatLargeNumber(2833)} UAH</b> for children (6-18 years old). <br/><u>https://index.minfin.com.ua</u>.`,
      allowanceStateOrHumanitarianAsMainSourceOfIncome: 'HHs Depending on state/humanitarian assistance',
      percentagePopulationByOblast: 'Percentage of peoples by oblast',
      incomeUnder6000ByCategory: `HH category with income below 6,000 UAH`,
      avgHhSize: (n: number) => `Average HH size: ${n.toFixed(1)}`,
      elderlyWithPension: 'Elderly with pension',
      idpWithAllowance: 'IDPs with allowance',
      hhWith3childrenWithPension: 'HHs with 3+ children and pension',
      noAccommodationDocument: 'HHs without accommodation document',
      documentationAboutIdp: ({
        maleWithoutIdpCert,
        femaleWithoutIdpCert,
      }: {
        maleWithoutIdpCert: string
        femaleWithoutIdpCert: string
      }) => `
        The monitoring indicated that most IDPs are registered. Registration is highly facilitated by the digital application Diya.
        However, a significantly higher percentage of men (<b>${maleWithoutIdpCert}</b>) than women (<b>${femaleWithoutIdpCert}</b>) have not registered.
        This gender gap can be attributed to the <b>fear of conscription</b>.
      `,
      enum: {
        _32_1_What_type_of_allowances_do_you: {
          idp_allowance_from_the_governm: 'IDP allowance from the government',
          pension: 'Pension',
          pension_for_disability: 'Pension for disability',
          pension_for_three_or_more_chil: 'Pension for three or more children in the household',
          compensation_for_the_lost_dama: 'Compensation for the lost/damaged house',
          cash__mpca__from_humanitarians: 'Cash (MPCA) from humanitarians',
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
          presence_of_armed_actors_and_or_military: 'Presence of armed actors and/or military',
          shelling_or_threat_of_shellnig: 'Shelling or threat of shelling',
          eviction_or_threat_of_eviction: 'Eviction or threat of eviction',
          crime: 'Crime',
          tensions_with_the_host_community: 'Tensions with the host community',
          threat_of_gbv__including_sexual_harrassm: 'Threat of GBV, including sexual harrassment and/or exploitation',
          presence_of_hazards__including_uxos: 'Presence of hazards, including UXOs',
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
          university_or_teritary_eduction: 'University or teritary eduction',
          education_for_children: 'Education for children',
          nfis: 'NFIS',
          wash: 'Wash',
        },
        factorsToReturn: {
          shelter_is_repaired: 'Shelter is repaired',
          improvement_in_security_situat: 'Improvement in security situation',
          increased_service_availability: 'Increased service availability',
          infrastructure__including_heat: 'Infrastructure is repaired',
          cessation_of_hostilities: 'Cessation of hostilities',
          health_facilties_are_accessibl: 'Health facilities accessible',
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
      senseOfSafetyByOblast: 'Bad or Very bad sense of safety by Oblast',
      elderlyWithoutPensionCertificate: 'Elderly without pensioner certificate',
      childWithoutBirthCertificate: 'Child without birth certificate',
      barriersToPersonalDocument: 'Barriers',
      maleWithoutIDPCertByOblast: 'Males IDP without IDP certificate by Oblast',
      maleWithoutIDPCert: 'IDPs without IDP certificate',
      femaleWithoutIDPCert: 'Female without IDP certificate',
      titles: {
        document: 'Civil status and registration',
        livelihood: 'Livelihood',
        needs: 'Specific needs and priorities',
      },
      first_priorty: '1st priority need',
      nfiNeededByOblast: 'NFIs needed by oblast',
      firstPriorityNeed: '1st priority need by category',
      _40_1_pn_shelter_byCategory: 'Shelter as 1st priority need by category',
      _40_1_pn_health_byCategory: 'Health as 1st priority need by category',
      _40_1_pn_cash_byCategory: 'Cash as 1st priority need by category',
      _29_nfiNeededByCategory: 'Need for NFI by category',
      title: 'Protection Snapshot',
      subTitle: 'Ukraine Response',
      factorInfluencingSenseOfSafety: 'Factors influencing the sense of safety',
      disclaimer: `
        This snapshot summarizes the findings of Protection Monitoring conducted in the regions/oblasts of 
        <b>Chernihiv</b>, <b>Dnipro</b>, <b>Lviv</b>, <b>Chernivtsi</b>, and <b>Kharkiv</b>. Protection monitoring has been mainly implemented 
        through household interviews, complemented by focus group discussions, observation checklists, 
        and Rapid Protection Assessments. DRC protection monitoring targeted Internally Displaced Persons (IDPs)
         and people directly exposed to and affected by the current armed conflict. 
      `,
      sample: {
        desc: `The conflict in Ukraine has generated various protection risks for IDPs and conflict-affected populations.
          While all areas where PM took place were directly or indirectly affected by the conflict,
          needs and protection risks vary in each monitored region and are different according to the
          monitored population group: internally displaced persons, communities directly exposed and 
          affected by the current armed conflict (from now on referred to as conflict-affected), and host communities.`
      },
      displacement: {
        desc: `Significant population movements were observed at the beginning of the crisisn reaching over 8 million IDPs in May 2022 according to the
          <a href="${externalLinks.iomDtm}" class="link">IOM's Displacement Tracking Matrix</a>.
          Displacement is widely associated with conflict and direct threats to life, 
          security, and safety.`,
      }
    },
    departureFromAreaOfOrigin: `Departure from area of origin`,
    dateOfDeparture: `Date of departure`,
    pin: 'Pin',
  },
})
