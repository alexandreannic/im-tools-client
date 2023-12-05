import {Partnership_partnersDatabaseOptions} from './Partnership_partnersDatabaseOptions'

type Opt<T extends keyof typeof Partnership_partnersDatabaseOptions> = keyof (typeof Partnership_partnersDatabaseOptions)[T]

// Form id: aLs32U5Qc9HfQ5mxQtsEML
export interface Partnership_partnersDatabase {
  start: string,
  end: string,
  // [text] Partner name (English)
  Partner_name_English: string | undefined,
  // [text] Partner name (Ukrainian)
  Partner_name_Ukrainian: string | undefined,
  // [select_one] Type of organization
  Type_of_organization: undefined | Opt<'Type_of_organization'>,
  // [select_one] Is this a women-led organization?
  Is_this_a_women_led_organization: undefined | Opt<'Is_this_a_women_led_organization'>,
  // [select_one] Is this a youth-led organization?
  Is_this_a_youth_led_organization: undefined | Opt<'Is_this_a_youth_led_organization'>,
  // [text] If other, detail
  If_other_detail: string | undefined,
  // [text] Name
  Name: string | undefined,
  // [text] Position
  Position: string | undefined,
  // [text] Phone number
  Phone_number: string | undefined,
  // [text] E-mail
  E_mail: string | undefined,
  // [text] Comments on contacts
  Comments_on_contacts: string | undefined,
  // [text] Name of the interviewer
  Name_of_the_interviewer: string | undefined,
  // [text] Position of the interviewer
  Position_of_the_interviewer: string | undefined,
  // [select_one] Assessment conducted with the focal point (information in previous questions)?
  Assessment_conducted_with_the_: undefined | Opt<'Assessment_conducted_with_the_'>,
  // [text] Name of the interviewee
  Name_of_the_interviewee: string | undefined,
  // [text] Position of the interviewee
  Position_of_the_interviewee: string | undefined,
  // [date] Date of assessment
  Date_of_assessment: Date | undefined,
  // [select_one] Interviewee consents to be contacted?
  Interviewee_consents_to_be_contacted: undefined | Opt<'Interviewee_consents_to_be_contacted'>,
  // [text] Other information provided that might be valuable and helpful
  Other_information_pr_valuable_and_helpful: string | undefined,
  // [text] Flag any other relevant information, red flags, overall comments and assessment
  Flag_any_other_relev_ments_and_assessment: string | undefined,
  // [text] Office address
  Office_address: string | undefined,
  // [text] Website
  Website: string | undefined,
  // [text] Social media
  Social_media: string | undefined,
  // [select_one] Is the organization registered
  Is_the_organization_registered: undefined | Opt<'Is_the_organization_registered'>,
  // [date] Date of registration
  Date_of_registration: Date | undefined,
  // [text] IATI code
  IATI_code: string | undefined,
  // [text] USREOU code
  USREOU_code: string | undefined,
  // [select_one] Is there an ongoing relationship between DRC and this organization?
  Is_there_an_ongoing_relationsh: undefined | Opt<'Is_there_an_ongoing_relationsh'>,
  // [text] If other, detail
  If_other_detail_001: string | undefined,
  // [text] What is the organization's mission?
  What_is_the_organization_s_mission: string | undefined,
  // [text] Provide a short description about the partner
  Provide_a_short_desc_on_about_the_partner: string | undefined,
  // [date] Year starting humanitarian work
  Year_starting_humanitarian_work: Date | undefined,
  // [select_multiple] Which oblasts does the organization work (is present and has experience)?
  Which_oblasts_does_t_t_and_has_experience: undefined | Opt<'Oblast_001'>[],
  // [text] Comment on areas of operation
  Comment_on_areas_of_operation: string | undefined,
  // [select_one] Is coordination done with other actors?
  Is_coordination_done_with_othe: undefined | Opt<'Is_coordination_done_with_othe'>,
  // [select_multiple] If yes, which types of actors?
  If_yes_which_types_of_actors: undefined | Opt<'If_yes_which_types_of_actors'>[],
  // [select_one] Established partnership/cooperation with other CSOs/local partners
  Established_partnership_cooper: undefined | Opt<'Established_partnership_cooper'>,
  // [text] If yes, please name the organizations
  If_yes_please_name_the_organizations: string | undefined,
  // [text] Nature of partnership/cooperation
  Nature_of_partnership_cooperation: string | undefined,
  // [select_one] Cooperation with private sector bodies
  Cooperation_with_private_secto: undefined | Opt<'Cooperation_with_private_secto'>,
  // [text] If yes, which
  If_yes_which_002: string | undefined,
  // [select_one] Cooperation with UN Agencies and INGOs
  Cooperation_with_UN_Agencies_a: undefined | Opt<'Cooperation_with_UN_Agencies_a'>,
  // [select_multiple] If yes, which
  If_yes_which: undefined | Opt<'If_yes_which_001'>[],
  // [text] If other, detail
  If_other_detail_002: string | undefined,
  // [select_one] Participation in Humanitarian Cluster System (Shelter, Protection, WASH Cluster etc.)
  Participation_in_Humanitarian_: undefined | Opt<'Participation_in_Humanitarian_'>,
  // [text] If yes, which
  If_yes_which_003: string | undefined,
  // [integer] Number of offices
  Number_of_offices: number | undefined,
  // [begin_repeat] Offices details
  group_ts4rc87: {Oblast: undefined | Opt<'Oblast_001'>[] | undefined, Settlement: string | undefined | undefined, Google_maps_link: string | undefined | undefined}[] | undefined,
  // [select_multiple] Which sectors does the organization have experience with?
  Which_sectors_does_the_organiz: undefined | Opt<'Sectors_funded'>[],
  // [text] Examples of projects with NFI (if possible with beneficiary number)
  Examples_of_projects_h_beneficiary_number: string | undefined,
  // [text] Examples of projects with WaSH (if possible with beneficiary number)
  Examples_of_projects_h_beneficiary_number_001: string | undefined,
  // [text] Examples of projects with Protection (if possible with beneficiary number)
  Examples_of_projects_h_beneficiary_number_002: string | undefined,
  // [text] Examples of projects with PSS (if possible with beneficiary number)
  Examples_of_projects_h_benefic_001: string | undefined,
  // [text] Examples of projects with Education (if possible with beneficiary number)
  Examples_of_projects_h_beneficiary_number_003: string | undefined,
  // [text] Examples of projects with Livelihoods (if possible with beneficiary number)
  Examples_of_projects_h_beneficiary_number_004: string | undefined,
  // [text] Examples of projects with MPCA (if possible with beneficiary number)
  Examples_of_projects_h_benefic_016: string | undefined,
  // [text] Examples of projects with Food Security (if possible with beneficiary number)
  Examples_of_projects_h_beneficiary_number_005: string | undefined,
  // [text] Examples of projects with Health (if possible with beneficiary number)
  Examples_of_projects_h_beneficiary_number_006: string | undefined,
  // [text] Examples of projects with Nutrition (if possible with beneficiary number)
  Examples_of_projects_h_beneficiary_number_007: string | undefined,
  // [text] Examples of projects with Shelter (if possible with beneficiary number)
  Examples_of_projects_h_beneficiary_number_008: string | undefined,
  // [text] Examples of projects with Evacuations (if possible with beneficiary number)
  Examples_of_projects_h_beneficiary_number_009: string | undefined,
  // [text] Examples of projects with GBV (if possible with beneficiary number)
  Examples_of_projects_h_beneficiary_number_010: string | undefined,
  // [text] Examples of projects with EORE (if possible with beneficiary number)
  Examples_of_projects_h_benefic: string | undefined,
  // [select_one] Is rapid volunteer mobilization possible?
  Is_rapid_volunteer_mobilization_possible: undefined | Opt<'Is_rapid_volunteer_mobilization_possible'>,
  // [select_one] Is access possible by the organization to areas of typically restricted access (hard-to-reach)?
  Is_access_possible_by_the_orga: undefined | Opt<'Is_access_possible_by_the_orga'>,
  // [select_multiple] If yes, how?
  If_yes_how: undefined | Opt<'If_yes_how'>[],
  // [text] If other, detail
  If_other_detail_003: string | undefined,
  // [text] General comments on experience
  General_comments_on_experience: string | undefined,
  // [select_multiple] Select if the organization has projects specifically targeting specific vulnerable communities or minorities in Ukraine
  Select_if_the_organi_inorities_in_Ukraine: undefined | Opt<'Minority_group'>[],
  // [text] Examples of projects with Children (if possible with beneficiary number)
  Examples_of_projects_h_benefic_015: string | undefined,
  // [text] Examples of projects with Elderly (if possible with beneficiary number)
  Examples_of_projects_h_benefic_018: string | undefined,
  // [text] Examples of projects with People with disabilities (if possible with beneficiary number)
  Examples_of_projects_h_benefic_019: string | undefined,
  // [text] Examples of projects with IDPs from a particular location (if possible with beneficiary number)
  Examples_of_projects_h_benefic_002: string | undefined,
  // [text] Examples of projects with Armenians (if possible with beneficiary number)
  Examples_of_projects_h_benefic_003: string | undefined,
  // [text] Examples of projects with Greeks (if possible with beneficiary number)
  Examples_of_projects_h_benefic_004: string | undefined,
  // [text] Examples of projects with Jews (if possible with beneficiary number)
  Examples_of_projects_h_benefic_005: string | undefined,
  // [text] Examples of projects with Turkic-speaking Urums (if possible with beneficiary number)
  Examples_of_projects_h_benefic_006: string | undefined,
  // [text] Examples of projects with Roma (if possible with beneficiary number)
  Examples_of_projects_h_benefic_007: string | undefined,
  // [text] Examples of projects with People of African descent (if possible with beneficiary number)
  Examples_of_projects_h_benefic_008: string | undefined,
  // [text] Examples of projects with Russians and Russian speakers (if possible with beneficiary number)
  Examples_of_projects_h_benefic_009: string | undefined,
  // [text] Examples of projects with Refugees and asylum seekers in Ukraine (if possible with beneficiary number)
  Examples_of_projects_h_benefic_010: string | undefined,
  // [text] Examples of projects with LGBTQIA+ (if possible with beneficiary number)
  Examples_of_projects_h_benefic_011: string | undefined,
  // [text] Examples of projects with Stateless persons and persons at risk of statelessness (if possible with beneficiary number)
  Examples_of_projects_h_benefic_012: string | undefined,
  // [text] Examples of projects with HIV+ (if possible with beneficiary number)
  Examples_of_projects_h_benefic_013: string | undefined,
  // [text] Examples of projects which are focused on women's rights (if possible with beneficiary number)
  Examples_of_projects_h_benefic_017: string | undefined,
  // [text] If other, please provide a simple word or short description of what type of other
  If_other_please_pro_f_what_type_of_other: string | undefined,
  // [text] Examples of projects with Other (if possible with beneficiary number)
  Examples_of_projects_h_benefic_014: string | undefined,
  // [select_multiple] Own vehicles
  Own_vehicles: undefined | Opt<'Own_vehicles'>[],
  // [select_one] Own warehouse (belonging to the organization)
  Own_warehouse_belonging_to_th: undefined | Opt<'Own_warehouse_belonging_to_th'>,
  // [select_multiple] If not, how are items stored?
  If_not_how_are_items_stored: undefined | Opt<'If_not_how_are_items_stored'>[],
  // [text] Other warehouse details
  Other_warehouse_details: string | undefined,
  // [select_multiple] Safety & security management items in place
  Safety_security_management_i: undefined | Opt<'Safety_security_management_i'>[],
  // [select_multiple] Safety & security trainings conducted
  Safety_security_trainings_co: undefined | Opt<'Safety_security_trainings_co'>[],
  // [text] If other, specify
  If_other_specify: string | undefined,
  // [select_multiple] Safety & security equipment available
  Safety_equipment_available: undefined | Opt<'Safety_equipment_available'>[],
  // [text] If other, specify
  If_other_specify_001: string | undefined,
  // [select_one] Are different standards applied between volunteers and paid staff members?
  Are_different_standa_d_paid_staff_members: undefined | Opt<'Are_different_standa_d_paid_staff_members'>,
  // [text] Comments on safety
  Comments_on_safety: string | undefined,
  // [select_multiple] The organization is recommended for the following type of activities
  The_organization_is_g_type_of_activities: undefined | Opt<'The_organization_is_g_type_of_activities'>[],
  // [select_one] Are recommendation letters from other INGOs available?
  Are_recommendation_letters_fro: undefined | Opt<'Are_recommendation_letters_fro'>,
  // [text] If yes, detail
  If_yes_detail: string | undefined,
  // [select_multiple] Operational challenges
  Operational_challenges: undefined | Opt<'Operational_challenges'>[],
  // [text] If other, specify
  If_other_specify_002: string | undefined,
  // [text] Provide details (coordination)
  Provide_details_coordination: string | undefined,
  // [text] Provide details (communication)
  Provide_details_communication: string | undefined,
  // [text] Provide details (access, physical)
  Provide_details_access_physical: string | undefined,
  // [text] Provide details (access, information)
  Provide_details_access_information: string | undefined,
  // [text] Provide details (logistics, supply chain)
  Provide_details_logistics_supply_chain: string | undefined,
  // [text] Provide details (risk mitigation)
  Provide_details_risk_mitigation: string | undefined,
  // [text] Provide details (HR, administrative)
  Provide_details_HR_administrative: string | undefined,
  // [text] Provide details (other)
  Provide_details_other: string | undefined,
  // [select_multiple] Which assistance would the CSO require to increase its efficiency in the provision of urgent humanitarian assistance?
  Which_assistance_would_the_CSO: undefined | Opt<'Which_assistance_would_the_CSO'>[],
  // [text] If other, specify
  If_other_specify_003: string | undefined,
  // [select_one] Are partner staff members receiving psycho-social support (PSS)?
  Are_partner_staff_me_social_support_PSS: undefined | Opt<'Are_partner_staff_me_social_support_PSS'>,
  // [select_one] Is staff trained on psychological first aid (PFA)?
  Is_staff_trained_on_gical_first_aid_PFA: undefined | Opt<'Is_staff_trained_on_gical_first_aid_PFA'>,
  // [select_one] Has the partner participated in capacity-building trainings, sessions, workshops etc. after 24 February 2022?
  Has_the_partner_participated_i: undefined | Opt<'Has_the_partner_participated_i'>,
  // [text] If yes, please mention what kind of training sessions and which topics were provided, when and how many partner staff members participated
  If_yes_please_menti_members_participated: string | undefined,
  // [select_multiple] What kind of capacity needs to be addressed?
  What_kind_of_capacity_needs_to: undefined | Opt<'What_kind_of_capacity_needs_to'>[],
  // [text] If other, specify
  If_other_specify_004: string | undefined,
  // [integer] Number of agreements with DRC
  Number_of_agreements_with_DRC: number | undefined,
  // [begin_repeat] SGA information
  group_vi2hh32: {
    SGA_number: number | undefined | undefined,
    Partnership_type: undefined | Opt<'Partnership_type'> | undefined,
    Is_it_an_equitable_partnership: undefined | Opt<'Is_it_an_equitable_partnership'> | undefined,
    SGA_start_date: Date | undefined | undefined,
    SGA_end_date: Date | undefined | undefined,
    Amount_UAH: number | undefined | undefined, Amount_USD: number | undefined | undefined,
    Funding_provided_in_ding_activities_USD: number | undefined | undefined,
    Funding_provided_in_in_kind_support_USD: number | undefined | undefined,
    group_ii6wz51_header: string | undefined,
    group_ii6wz51_header_note: string | undefined,
    group_ii6wz51_header_column: string | undefined,
    group_ii6wz51_salaries_1: string | undefined,
    group_ii6wz51_salaries_1_note: string | undefined,
    group_ii6wz51_salaries_1_column: string | undefined | undefined,
    group_ii6wz51_programme_supplies_1: string | undefined,
    group_ii6wz51_programme_supplies_1_note: string | undefined,
    group_ii6wz51_programme_supplies_1_column: string | undefined | undefined,
    group_ii6wz51_programme_supplies_2: string | undefined,
    group_ii6wz51_programme_supplies_2_note: string | undefined,
    group_ii6wz51_programme_supplies_2_column: string | undefined | undefined,
    group_ii6wz51_equipment_1: string | undefined,
    group_ii6wz51_equipment_1_note: string | undefined,
    group_ii6wz51_equipment_1_column: string | undefined | undefined,
    group_ii6wz51_visibility_1: string | undefined,
    group_ii6wz51_visibility_1_note: string | undefined,
    group_ii6wz51_visibility_1_column: string | undefined | undefined,
    group_ii6wz51_support_1: string | undefined,
    group_ii6wz51_support_1_note: string | undefined,
    group_ii6wz51_support_1_column: string | undefined | undefined,
    Only_show_the_2_ques_end_date_30_days: string | undefined,
    group_ol5wn75: string | undefined,
    Date_received_letter_Request_for_Payment: Date | undefined | undefined,
    Date_payment_confirmed: Date | undefined | undefined,
    Amount_UAH_001: number | undefined | undefined,
    Tranches_received_: number | undefined | undefined,
    Funding_reported_on_: number | undefined | undefined,

    Donor: undefined | Opt<'Donor'> | undefined,

    Project_code: number | undefined | undefined,
    Total_budget_of_the_project_USD: number | undefined | undefined,
    Sectors_funded: undefined | Opt<'Sectors_funded'>[] | undefined,
    Oblasts: undefined | Opt<'Oblast_001'>[] | undefined,
    group_zn5zo38: string | undefined,
    Number_of_beneficiaries_planned: number | undefined | undefined,
    Number_of_beneficiaries_PwD_planned: number | undefined | undefined,
    group_zn5zo38_001: string | undefined,
    Number_of_beneficiaries_reached_001: number | undefined | undefined,
    Number_of_beneficiaries_PwD_reached_001: number | undefined | undefined,
    group_eq2ox56_header: string | undefined,
    group_eq2ox56_header_note: string | undefined,
    group_eq2ox56_header_column: string | undefined,
    group_eq2ox56_header_column_1: string | undefined,
    group_eq2ox56_row: string | undefined,
    group_eq2ox56_row_note: string | undefined,
    group_eq2ox56_row_column: string | undefined | undefined,
    group_eq2ox56_row_column_1: string | undefined | undefined,
    group_eq2ox56_row_1: string | undefined,
    group_eq2ox56_row_1_note: string | undefined,
    group_eq2ox56_row_1_column: string | undefined | undefined,
    group_eq2ox56_row_1_column_1: string | undefined | undefined,
    group_eq2ox56_row_2: string | undefined,
    group_eq2ox56_row_2_note: string | undefined,
    group_eq2ox56_row_2_column: string | undefined | undefined,
    group_eq2ox56_row_2_column_1: string | undefined | undefined,
    group_hw2qn61: string | undefined,
    Oblast_001: undefined | Opt<'Oblast_001'>[] | undefined,
    Type: undefined | Opt<'Type'> | undefined,
    // Minority_group: undefined | Opt<'Minority_group'>[] | undefined,
    group_th3ei68_header: string | undefined,
    group_th3ei68_header_note: string | undefined,
    group_th3ei68_header_column: string | undefined,
    group_th3ei68_header_column_1: string | undefined,
    group_th3ei68_row: string | undefined,
    group_th3ei68_row_note: string | undefined,
    group_th3ei68_row_column: string | undefined | undefined,
    group_th3ei68_row_column_1: string | undefined | undefined,
    group_th3ei68_row_1: string | undefined,
    group_th3ei68_row_1_note: string | undefined,
    group_th3ei68_row_1_column: string | undefined | undefined,
    group_th3ei68_row_1_column_1: string | undefined | undefined,
    group_th3ei68_row_2: string | undefined,
    group_th3ei68_row_2_note: string | undefined,
    group_th3ei68_row_2_column: string | undefined | undefined,
    group_th3ei68_row_2_column_1: string | undefined | undefined,
    group_hg5yh63: string | undefined,
    Activity_summary: string | undefined | undefined,
    group_xo3ho32_header: string | undefined,
    group_xo3ho32_header_note: string | undefined,
    group_xo3ho32_header_column: string | undefined,
    group_xo3ho32_header_column_1: string | undefined,
    group_xo3ho32_row: string | undefined,
    group_xo3ho32_row_note: string | undefined,
    group_xo3ho32_row_column: string | undefined | undefined,
    group_xo3ho32_row_column_1: string | undefined | undefined,
    group_xo3ho32_row_1: string | undefined,
    group_xo3ho32_row_1_note: string | undefined,
    group_xo3ho32_row_1_column: string | undefined | undefined,
    group_xo3ho32_row_1_column_1: string | undefined | undefined,
    group_xo3ho32_row_2: string | undefined,
    group_xo3ho32_row_2_note: string | undefined,
    group_xo3ho32_row_2_column: string | undefined | undefined,
    group_xo3ho32_row_2_column_1: string | undefined | undefined,
    group_bj8rq59_header: string | undefined,
    group_bj8rq59_header_note: string | undefined,
    group_bj8rq59_header_column: string | undefined,
    group_bj8rq59_header_column_1_1: string | undefined,
    group_bj8rq59_row: string | undefined, group_bj8rq59_row_note: string | undefined, group_bj8rq59_row_column: string | undefined | undefined, group_bj8rq59_row_column_1_1: string | undefined | undefined, group_bj8rq59_row_1: string | undefined, group_bj8rq59_row_1_note: string | undefined, group_bj8rq59_row_1_column: string | undefined | undefined, group_bj8rq59_row_1_column_1_1: string | undefined | undefined, group_bj8rq59_row_2: string | undefined, group_bj8rq59_row_2_note: string | undefined, group_bj8rq59_row_2_column: string | undefined | undefined, group_bj8rq59_row_2_column_1_1: string | undefined | undefined, Cost_per_beneficiary_automatic_planned: string | undefined, Cost_per_beneficiary_automatic_reached: string | undefined, Was_reporting_done_in_a_timely_way: undefined | Opt<'Was_reporting_done_in_a_timely_way'> | undefined, Scale_in_which_furth_ation_is_recommended: string | undefined, Comments: string | undefined | undefined
  }[] | undefined,
  // [note] Sum (USD) with all SGAs
  Add_sum_in_USD_of_ho_have_even_given_them: string,
  // [note] Sum (beneficiaries) with all SGAs
  Add_sum_of_beneficiaries_reached: string,
  // [select_one] Has vetting been conducted?
  Has_vetting_been_conducted: undefined | Opt<'Has_vetting_been_conducted'>,
  // [select_one] Are results positive?
  Are_results_positive: undefined | Opt<'Are_results_positive'>,
  // [select_one] Is the match declared openly unfounded?
  Is_the_match_declared_openly_u: undefined | Opt<'Is_the_match_declared_openly_u'>,
  // [select_one] Select the reasoning applied
  Select_the_reasoning_applied: undefined | Opt<'Select_the_reasoning_applied'>,
  // [date] Date of last vetting check
  Date_of_last_vetting_check: Date | undefined,
  // [select_one] Sub-Grant Funding Threshold
  Sub_Grant_Funding_Threshold: undefined | Opt<'Sub_Grant_Funding_Threshold'>,
  // [select_one] Has due diligence been finalized?
  Has_due_diligence_been_finaliz: undefined | Opt<'Has_due_diligence_been_finaliz'>,
  // [select_one] Overall Residual Risk
  Overall_Residual_Risk: undefined | Opt<'Overall_Residual_Risk'>,
  // [select_one] Accountability risks
  Accountability_risks: undefined | Opt<'Accountability_risks'>,
  // [select_one] Code of Conduct risks
  Code_of_Conduct_risks: undefined | Opt<'Code_of_Conduct_risks'>,
  // [select_one] PSEAH risks
  PSEAH_risks: undefined | Opt<'PSEAH_risks'>,
  // [select_one] Corruption and Fraud risks
  Corruption_and_Fraud_risks: undefined | Opt<'Corruption_and_Fraud_risks'>,
  // [select_one] Human Resources risks
  Human_Resources_risks: undefined | Opt<'Human_Resources_risks'>,
  // [select_one] Experience risks
  Experience_risks: undefined | Opt<'Experience_risks'>,
  // [select_one] Needs assessments risks
  Needs_assessments_risks: undefined | Opt<'Needs_assessments_risks'>,
  // [select_one] Monitoring risks
  Monitoring_risks: undefined | Opt<'Monitoring_risks'>,
  // [select_one] Involved of PoC risks
  Involved_of_PoC_risks: undefined | Opt<'Involved_of_PoC_risks'>,
  // [select_one] Coordination risks
  Coordination_risks: undefined | Opt<'Coordination_risks'>,
  // [select_one] Financial policies risks
  Financial_policies_risks: undefined | Opt<'Financial_policies_risks'>,
  // [select_one] Procurement policies risks
  Procurement_policies_risks: undefined | Opt<'Procurement_policies_risks'>,
  // [select_one] Unverified financial accounts risks
  Unverified_financial_accounts_risks: undefined | Opt<'Unverified_financial_accounts_risks'>,
  // [select_one] Security procedures risks
  Security_procedures_risks: undefined | Opt<'Security_procedures_risks'>,
  // [select_one] Support to partners risks
  Support_to_partners_risks: undefined | Opt<'Support_to_partners_risks'>,
  // [begin_repeat] Staffing and financial growth per year
  group_kd9el87: {Year: Date | undefined | undefined, Annual_budget_USD: number | undefined | undefined, Full_time_staff: number | undefined | undefined, Part_time_staff: number | undefined | undefined, Volunteers: number | undefined | undefined, Total_team: string | undefined, Total_staff: string | undefined, Budget_per_team: string | undefined, Budget_per_staff: string | undefined, If_yes_which_001: undefined | Opt<'If_yes_which_001'>[] | undefined}[] | undefined,
  // [begin_repeat] Policies, Protocols and Written Procedures
  group_rr27n40: {Year_001: Date | undefined | undefined, Staffing_table_or_Organogram: undefined | Opt<'Staffing_table_or_Organogram'> | undefined, Statute: undefined | Opt<'Statute'> | undefined, Financial_policy: undefined | Opt<'Financial_policy'> | undefined, Procurement_policy: undefined | Opt<'Safety_and_security_policy'> | undefined, Safety_and_security_policy: undefined | Opt<'Safety_and_security_policy'> | undefined}[] | undefined,
}