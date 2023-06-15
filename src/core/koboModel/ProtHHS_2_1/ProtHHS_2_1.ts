import {ProtHHS_2_1Options} from './ProtHHS_2_1Options'

type Opt<T extends keyof typeof ProtHHS_2_1Options> = keyof (typeof ProtHHS_2_1Options)[T]

export interface ProtHHS_2_1 {
  start: string,
  end: string,
  deviceid: string,
  // 1.1. Staff to insert their DRC office
  staff_to_insert_their_DRC_office: Opt<'staff_to_insert_their_DRC_office'>,
  // 1.2. Staff code
  staff_code: Opt<'staff_code'>,
  // 1.3. Type of site
  type_of_site: Opt<'type_of_site'>,
  // 1.4. Introduce yourself and ask to speak to whoever is best placed to answer questions on behalf of the household
  present_yourself: Opt<'present_yourself'>,
  // 1.4.1. Have you filled out this form before?
  have_you_filled_out_this_form_before: Opt<'have_you_filled_out_this_form_before'>,
  // <span style="font-size:.875em;font-weight:normal">   2.2. Oblast</span>
  where_are_you_current_living_oblast: Opt<'what_is_your_area_of_origin_oblast'>,
  // <span style="font-size:.875em;font-weight:normal">   2.3. Raion</span>
  where_are_you_current_living_raion: Opt<'what_is_your_area_of_origin_raion'>,
  // <span style="font-size:.875em;font-weight:normal">   2.4. Hromada</span>
  where_are_you_current_living_hromada: Opt<'what_is_your_area_of_origin_hromada'>,
  // <span style="font-weight:normal">   2.5. Settlement</span>
  settlement: string | undefined,
  // 2.6. What is your citizenship?
  what_is_your_citizenship: Opt<'what_is_your_citizenship'>,
  // 2.6.1. If non-Ukrainian, what is your citizenship?
  if_nonukrainian_what_is_your_citizenship: Opt<'if_nonukrainian_what_is_your_citizenship'>,
  // 2.6.1.1. Please specify
  please_specifyif_nonukrainian_what_is_your_citizenship: string | undefined,
  // 2.6.2. Do you or your household members identify as member(s) of a minority group?
  if_ukrainian_do_you_or_your_household_members_identify_as_member_of_a_minority_group: Opt<'if_ukrainian_do_you_or_your_household_members_identify_as_member_of_a_minority_group'>,
  // 2.6.2.1. Please specify
  please_specifyif_ukrainian_do_you_or_your_household_members_identify_as_member_of_a_minority_group: string | undefined,
  // 2.7. What is the primary language spoken in your household?
  what_is_the_primary_language_spoken_in_your_household: Opt<'what_is_the_primary_language_spoken_in_your_household'>,
  // 3.1. What is the type of your household?
  what_is_the_type_of_your_household: Opt<'what_is_the_type_of_your_household'>,
  // 3.2. How many individuals, including the respondent, are in the household?
  how_many_ind: number | undefined,
  // <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.1. Member 1 (the respondent) registered?</span>
  hh_sex_1: Opt<'hh_sex_1'>,
  // <span style="font-size:.875em;font-weight:normal">   3.2.2. Member 1 (the respondent) registered?</span>
  hh_age_1: number | undefined,
  // <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.3. Member 2 registered?</span>
  hh_sex_2: Opt<'hh_sex_2'>,
  // <span style="font-size:.875em;font-weight:normal">   3.2.4. Member 2 registered?</span>
  hh_age_2: number | undefined,
  // <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.5. Member 3 registered?</span>
  hh_sex_3: Opt<'hh_sex_3'>,
  // <span style="font-size:.875em;font-weight:normal">   3.2.6. Member 3 registered?</span>
  hh_age_3: number | undefined,
  // <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.7. Member 4 registered?</span>
  hh_sex_4: Opt<'hh_sex_4'>,
  // <span style="font-size:.875em;font-weight:normal">   3.2.8. Member 4 registered?</span>
  hh_age_4: number | undefined,
  // <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.9. Member 5 registered?</span>
  hh_sex_5: Opt<'hh_sex_5'>,
  // <span style="font-size:.875em;font-weight:normal">   3.2.10. Member 5 registered?</span>
  hh_age_5: number | undefined,
  // <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.11. Member 6 registered?</span>
  hh_sex_6: Opt<'hh_sex_6'>,
  // <span style="font-size:.875em;font-weight:normal">   3.2.12. Member 6 registered?</span>
  hh_age_6: number | undefined,
  // <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.13. Member 7 registered?</span>
  hh_sex_7: Opt<'hh_sex_7'>,
  // <span style="font-size:.875em;font-weight:normal">   3.2.14. Member 7 registered?</span>
  hh_age_7: number | undefined,
  // <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.15. Member 8 registered?</span>
  hh_sex_8: Opt<'hh_sex_8'>,
  // <span style="font-size:.875em;font-weight:normal">   3.2.16. Member 8 registered?</span>
  hh_age_8: number | undefined,
  // <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.17. Member 9 registered?</span>
  hh_sex_9: Opt<'hh_sex_9'>,
  // <span style="font-size:.875em;font-weight:normal">   3.2.18. Member 9 registered?</span>
  hh_age_9: number | undefined,
  // <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.19. Member 10 registered?</span>
  hh_sex_10: Opt<'hh_sex_10'>,
  // <span style="font-size:.875em;font-weight:normal">   3.2.20. Member 10 registered?</span>
  hh_age_10: number | undefined,
  // <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.21. Member 11 registered?</span>
  hh_sex_11: Opt<'hh_sex_11'>,
  // <span style="font-size:.875em;font-weight:normal">   3.2.22. Member 11 registered?</span>
  hh_age_11: number | undefined,
  // <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12);font-size:.875em;font-weight:normal">   3.2.23. Member 12 registered?</span>
  hh_sex_12: Opt<'hh_sex_12'>,
  // <span style="font-size:.875em;font-weight:normal">   3.2.24. Member 12 registered?</span>
  hh_age_12: number | undefined,
  // 3.3. Are you separated from any of your households members?
  are_you_separated_from_any_of_your_households_members: Opt<'are_you_separated_from_any_of_your_households_members'>[],
  // 3.3.1. Where is your Partner?
  where_is_your_partner: Opt<'where_is_your_partner'>,
  // 3.3.1.1. Please specify
  please_specifywhere_is_your_partner: string | undefined,
  // 3.3.1.2. Why did the Partner remain behind in the area of origin?
  where_is_your_partner_remain_behind_in_the_area_of_origin: Opt<'where_is_your_partner_remain_behind_in_the_area_of_origin'>,
  // 3.3.1.2.1. Please specify
  please_specifywhere_is_your_partner_remain_behind_in_the_area_of_origin: string | undefined,
  // 3.3.2. Where is your Child < 18?
  where_is_your_child_lt_18: Opt<'where_is_your_child_lt_18'>,
  // 3.3.2.1. Please specify
  please_specifywhere_is_your_child_lt_18: string | undefined,
  // 3.3.2.2. Why did the Child < 18 remain behind in the area of origin?
  where_is_your_child_lt_18_remain_behind_in_the_area_of_origin: Opt<'where_is_your_child_lt_18_remain_behind_in_the_area_of_origin'>,
  // 3.3.2.2.1. Please specify
  please_specifywhere_is_your_child_lt_18_remain_behind_in_the_area_of_origin: string | undefined,
  // 3.3.3. Where is your Child ≥ 18?
  where_is_your_child_gte_18: Opt<'where_is_your_child_gte_18'>,
  // 3.3.3.1. Please specify
  please_specifywhere_is_your_child_gte_18: string | undefined,
  // 3.3.3.2. Why did the Child ≥ 18 remain behind in the area of origin?
  where_is_your_child_gte_18_remain_behind_in_the_area_of_origin: Opt<'where_is_your_child_gte_18_remain_behind_in_the_area_of_origin'>,
  // 3.3.3.2.1. Please specify
  please_specifywhere_is_your_child_gte_18_remain_behind_in_the_area_of_origin: string | undefined,
  // 3.3.4. Where is your Mother?
  where_is_your_mother: Opt<'where_is_your_mother'>,
  // 3.3.4.1. Please specify
  please_specifywhere_is_your_mother: string | undefined,
  // 3.3.4.2. Why did the Mother remain behind in the area of origin?
  where_is_your_mother_remain_behind_in_the_area_of_origin: Opt<'where_is_your_mother_remain_behind_in_the_area_of_origin'>,
  // 3.3.4.2.1. Please specify
  please_specifywhere_is_your_mother_remain_behind_in_the_area_of_origin: string | undefined,
  // 3.3.5. Where is your Father?
  where_is_your_father: Opt<'where_is_your_father'>,
  // 3.3.5.1. Please specify
  please_specifywhere_is_your_father: string | undefined,
  // 3.3.5.2. Why did the Father remain behind in the area of origin?
  where_is_your_father_remain_behind_in_the_area_of_origin: Opt<'where_is_your_father_remain_behind_in_the_area_of_origin'>,
  // 3.3.5.2.1. Please specify
  please_specifywhere_is_your_father_remain_behind_in_the_area_of_origin: string | undefined,
  // 3.3.6. Where is your Caregiver?
  where_is_your_caregiver: Opt<'where_is_your_caregiver'>,
  // 3.3.6.1. Please specify
  please_specifywhere_is_your_caregiver: string | undefined,
  // 3.3.6.2. Why did the Caregiver remain behind in the area of origin?
  where_is_your_caregiver_remain_behind_in_the_area_of_origin: Opt<'where_is_your_caregiver_remain_behind_in_the_area_of_origin'>,
  // 3.3.6.2.1. Please specify
  please_specifywhere_is_your_caregiver_remain_behind_in_the_area_of_origin: string | undefined,
  // 3.3.7. Where is your other relative?
  where_is_your_other_relative: Opt<'where_is_your_other_relative'>,
  // 3.3.7.1. Please specify
  please_specifywhere_is_your_other_relative: string | undefined,
  // 3.3.7.2. Why did the other relative remain behind in the area of origin?
  where_is_your_other_relative_remain_behind_in_the_area_of_origin: Opt<'where_is_your_other_relative_remain_behind_in_the_area_of_origin'>,
  // 3.3.7.2.1. Please specify
  please_specifywhere_is_your_other_relative_remain_behind_in_the_area_of_origin: string | undefined,
  // 4.1. Do any of these specifics needs categories apply to the head(s) of this household?
  do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household: Opt<'do_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household'>[],
  // 4.1.1. Please specify
  please_specifydo_any_of_these_specific_needs_categories_apply_to_the_head_of_this_household: string | undefined,
  // 4.2. Do you have a household member that has a lot of difficulty (or cannot do at all) any of the following?
  do_you_have_a_household_member_that_has_a_lot_of_difficulty: Opt<'do_you_have_a_household_member_that_has_a_lot_of_difficulty'>[],
  // 4.3. How many children of your housefold have one or more of the functional limitations?
  how_many_children_have_one_or_more_of_the_functional_limitations: number | undefined,
  // 4.4. How many adults members of your household have one or more of the functional limitations?
  how_many_adults_members_have_one_or_more_of_the_functional_limitations: number | undefined,
  // 4.2.1. Do household members with functional limitations have a disability status from the Government of Ukraine?
  do_you_or_anyone_in_your_household_have_a_disability_status_from_the_gov: Opt<'do_you_or_anyone_in_your_household_have_a_disability_status_from_the_gov'>,
  // 4.2.1.1. Why don't they have a disability status?
  why_dont_they_have_status: Opt<'why_dont_they_have_status'>,
  // 4.2.1.1.1. Please specify
  please_specifywhy_dont_they_have_status: string | undefined,
  // 4.2.1.2. Do you or anyone in your household receive State allowance for disability?
  do_you_or_anyone_in_your_household_receive_state_allowance_for_disability: Opt<'do_you_or_anyone_in_your_household_receive_state_allowance_for_disability'>,
  // 4.5. Does the household host children who are relatives?
  does_the_household_host_children_who_are_relatives: Opt<'does_the_household_host_children_who_are_relatives'>,
  // 4.6. Does the household host children who are not relatives?
  does_the_household_host_children_who_are_not_relatives: Opt<'does_the_household_host_children_who_are_not_relatives'>,
  // 5.1. Do you identify as any of the following:
  do_you_identify_as_any_of_the_following: Opt<'do_you_identify_as_any_of_the_following'>,
  // 5.1.1. Are you:
  are_you: Opt<'are_you'>,
  // <span style="font-size:.875em;font-weight:normal">   5.1.3. Oblast</span>
  what_is_your_area_of_origin_oblast: Opt<'what_is_your_area_of_origin_oblast'>,
  // <span style="font-size:.875em;font-weight:normal">   5.1.4. Raion</span>
  what_is_your_area_of_origin_raion: Opt<'what_is_your_area_of_origin_raion'>,
  // <span style="font-size:.875em;font-weight:normal">   5.1.5. Hromada</span>
  what_is_your_area_of_origin_hromada: Opt<'what_is_your_area_of_origin_hromada'>,
  // 5.1.6. What main factors forced you to leave?
  why_did_you_leave_your_area_of_origin: Opt<'why_did_you_leave_your_area_of_origin'>[],
  // 5.1.6.1. Please specify
  please_specifywhy_did_you_leave_your_area_of_origin: string | undefined,
  // 5.1.7. When did you leave your place of habitual residence?
  when_did_you_leave_your_area_of_origin: Date | undefined,
  // 5.1.8. How did you travel to your displacement location?
  how_did_you_travel_to_your_displacement_location: Opt<'how_did_you_travel_to_your_displacement_location'>[],
  // 5.1.8.1. Please specify
  please_specifyhow_did_you_travel_to_your_displacement_location: string | undefined,
  // 5.1.9. When did you first leave your place of habitual residence?
  when_did_you_first_leave_your_area_of_origin: Date | undefined,
  // 5.1.10. When did you return to your place of habitual residence?
  when_did_you_return_to_your_area_of_origin: Date | undefined,
  // 5.1.11. Why did you decide to return to your place of habitual residence?
  why_did_you_decide_to_return_to_your_area_of_origin: Opt<'why_did_you_decide_to_return_to_your_area_of_origin'>[],
  // 5.1.11.1. Please specify
  please_specifywhy_did_you_decide_to_return_to_your_area_of_origin: string | undefined,
  // 5.1.12. Have you received any form of compensation for leaving your place of habitual residence?
  have_you_received_any_form_of_compensation_for_leaving_your_area_of_origin: Opt<'have_you_received_any_form_of_compensation_for_leaving_your_area_of_origin'>,
  // 5.1.13. Have you received any form of compensation for returning to your place of habitual residence?
  have_you_received_any_form_of_compensation_for_returnee_your_area_of_origin: Opt<'have_you_received_any_form_of_compensation_for_returnee_your_area_of_origin'>,
  // 5.1.14. Was your movement to return to your place of habitual residence supported or facilitated by any of the following?
  was_your_movement_to_return_to_your_area_of_origin_supported_or_facilitated_by_any_of_the_following: Opt<'was_your_movement_to_return_to_your_area_of_origin_supported_or_facilitated_by_any_of_the_following'>[],
  // 5.1.14.1. Please specify
  please_specifywas_your_movement_to_return_to_your_area_of_origin_supported_or_facilitated_by_any_of_the_following: string | undefined,
  // 5.1.15. Did you or any member of your household experience safety or security concerns on your displacement journey?
  did_you_or_any_member_of_your_household_on_your_displacement_journey_experience_safety_or_security_concerns: Opt<'did_you_or_any_member_of_your_household_on_your_displacement_journey_experience_safety_or_security_concerns'>[],
  // 5.1.15.1. Please specify
  please_specifydid_you_or_any_member_of_your_household_on_your_displacement_journey_experience_safety_or_security_concerns: string | undefined,
  // 5.1.16. Have you been displaced prior to your current displacement?
  have_you_been_displaced_prior_to_your_current_displacement: Opt<'have_you_been_displaced_prior_to_your_current_displacement'>,
  // 5.2. What are your current household's intentions in terms of place of residence?
  what_are_your_households_intentions_in_terms_of_place_of_residence: Opt<'what_are_your_households_intentions_in_terms_of_place_of_residence'>,
  // 5.2.1. What factors would be key to support your successful integration into the local community?
  what_factors_would_be_key_to_support_your_successful_integration_into_the_local_community: Opt<'what_factors_would_be_key_to_support_your_successful_integration_into_the_local_community'>[],
  // 5.2.1.1. Please specify
  please_specifywhat_factors_would_be_key_to_support_your_successful_integration_into_the_local_community: string | undefined,
  // 5.2.2. What would be the deciding factor in your return to your place of habitual residence??
  what_would_be_the_deciding_factor_in_your_return_to_your_area_of_origin: Opt<'what_would_be_the_deciding_factor_in_your_return_to_your_area_of_origin'>[],
  // 5.2.3. Why are you planning to relocate from your current place of residence?
  why_are_planning_to_relocate_from_your_current_place_of_residence: Opt<'why_are_planning_to_relocate_from_your_current_place_of_residence'>[],
  // 5.2.3.1. Please specify
  please_specifywhy_are_planning_to_relocate_from_your_current_place_of_residence: string | undefined,
  // 6.1. As non-Ukrainian, do you have documentation?
  as_nonUkrainian_do_you_have_documentation: Opt<'as_nonUkrainian_do_you_have_documentation'>[],
  // 6.2. As stateless person/household, do you have a stateless registration certificate?
  as_stateless_person_household_do_you_have_a_stateless_registration_certificate: Opt<'as_stateless_person_household_do_you_have_a_stateless_registration_certificate'>,
  // 6.3. Are you and your household members registered as IDPs?
  are_you_and_your_hh_members_registered_as_idps: Opt<'are_you_and_your_hh_members_registered_as_idps'>,
  // 6.3.1. Is member 1 registered?
  is_member_1_registered: Opt<'is_member_1_registered'>,
  // 6.4. Does member 1 lack any of these pieces of personal documentation?
  does_1_lack_doc: Opt<'does_1_lack_doc'>[],
  // 6.4.1. Please specify
  please_specifydoes_1_lack_doc: string | undefined,
  // 6.3.2. Is member 2 registered?
  is_member_2_registered: Opt<'is_member_2_registered'>,
  // 6.5. Does member 2 lack any of these pieces of personal documentation?
  does_2_lack_doc: Opt<'does_2_lack_doc'>[],
  // 6.5.1. Please specify
  please_specifydoes_2_lack_doc: string | undefined,
  // 6.3.3. Is member 3 registered?
  is_member_3_registered: Opt<'is_member_3_registered'>,
  // 6.6. Does member 3 lack any of these pieces of personal documentation?
  does_3_lack_doc: Opt<'does_3_lack_doc'>[],
  // 6.6.1. Please specify
  please_specifydoes_3_lack_doc: string | undefined,
  // 6.3.4. Is member 4 registered?
  is_member_4_registered: Opt<'is_member_4_registered'>,
  // 6.7. Does member 4 lack any of these pieces of personal documentation?
  does_4_lack_doc: Opt<'does_4_lack_doc'>[],
  // 6.7.1. Please specify
  please_specifydoes_4_lack_doc: string | undefined,
  // 6.3.5. Is member 5 registered?
  is_member_5_registered: Opt<'is_member_5_registered'>,
  // 6.8. Does member 5 lack any of these pieces of personal documentation?
  does_5_lack_doc: Opt<'does_5_lack_doc'>[],
  // 6.8.1. Please specify
  please_specifydoes_5_lack_doc: string | undefined,
  // 6.3.6. Is member 6 registered?
  is_member_6_registered: Opt<'is_member_6_registered'>,
  // 6.9. Does member 6 lack any of these pieces of personal documentation?
  does_6_lack_doc: Opt<'does_6_lack_doc'>[],
  // 6.9.1. Please specify
  please_specifydoes_6_lack_doc: string | undefined,
  // 6.3.7. Is member 7 registered?
  is_member_7_registered: Opt<'is_member_7_registered'>,
  // 6.10. Does member 7 lack any of these pieces of personal documentation?
  does_7_lack_doc: Opt<'does_7_lack_doc'>[],
  // 6.10.1. Please specify
  please_specifydoes_7_lack_doc: string | undefined,
  // 6.3.8. Is member 8 registered?
  is_member_8_registered: Opt<'is_member_8_registered'>,
  // 6.11. Does member 8 lack any of these pieces of personal documentation?
  does_8_lack_doc: Opt<'does_8_lack_doc'>[],
  // 6.11.1. Please specify
  please_specifydoes_8_lack_doc: string | undefined,
  // 6.3.9. Is member 9 registered?
  is_member_9_registered: Opt<'is_member_9_registered'>,
  // 6.12. Does member 9 lack any of these pieces of personal documentation?
  does_9_lack_doc: Opt<'does_9_lack_doc'>[],
  // 6.12.1. Please specify
  please_specifydoes_9_lack_doc: string | undefined,
  // 6.3.10. Is member 10 registered?
  is_member_10_registered: Opt<'is_member_10_registered'>,
  // 6.13. Does member 10 lack any of these pieces of personal documentation?
  does_10_lack_doc: Opt<'does_10_lack_doc'>[],
  // 6.13.1. Please specify
  please_specifydoes_10_lack_doc: string | undefined,
  // 6.3.11. Is member 11 registered?
  is_member_11_registered: Opt<'is_member_11_registered'>,
  // 6.14. Does member 11 lack any of these pieces of personal documentation?
  does_11_lack_doc: Opt<'does_11_lack_doc'>[],
  // 6.14.1. Please specify
  please_specifydoes_11_lack_doc: string | undefined,
  // 6.3.12. Is member 12 registered?
  is_member_12_registered: Opt<'is_member_12_registered'>,
  // 6.15. Does member 12 lack any of these pieces of personal documentation?
  does_12_lack_doc: Opt<'does_12_lack_doc'>[],
  // 6.15.1. Please specify
  please_specifydoes_12_lack_doc: string | undefined,
  // 6.3.13. Do you have any of the following:
  do_you_have_any_of_the_following: Opt<'do_you_have_any_of_the_following'>[],
  // 6.3.14. Do you and your HH members receive the IDP allowance?
  do_you_and_your_hh_members_receive_the_idp_allowance: Opt<'do_you_and_your_hh_members_receive_the_idp_allowance'>,
  // 6.3.14.1. Why don’t you receive the IDP allowance?
  why_they_do_not_receive: Opt<'why_they_do_not_receive'>,
  // 6.3.14.1.1. Please specify
  please_specifywhy_they_do_not_receive: string | undefined,
  // 6.3.15. Why are you not registered?
  why_are_you_not_registered: Opt<'why_are_you_not_registered'>[],
  // 6.3.15.1. Please specify
  please_specifywhy_are_you_not_registered: string | undefined,
  // 6.3.15.2. Why registration was rejected/Not entitled to register as an IDP?
  why_not_registered: Opt<'why_not_registered'>,
  // 6.3.15.2.1. Please specify
  please_specifywhy_not_registered: string | undefined,
  // 6.16. What housing, land and property documents do you lack?
  what_housing_land_and_property_documents_do_you_lack: Opt<'what_housing_land_and_property_documents_do_you_lack'>[],
  // 6.16.1. Please specify
  please_specifywhat_housing_land_and_property_documents_do_you_lack: string | undefined,
  // 6.17. Have you experienced any barriers in obtaining or accessing identity documentation and/or HLP documentation?
  have_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation: Opt<'have_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation'>[],
  // 6.17.1. Please specify
  please_specifyhave_you_experienced_any_barriers_in_obtaining_or_accessing_identity_documentation_and_or_hlp_documentation: string | undefined,
  // 7.1. Please rate your sense of safety in this location?
  please_rate_your_sense_of_safety_in_this_location: Opt<'please_rate_your_sense_of_safety_in_this_location'>,
  // 7.1.1. What are the main factors that make this location feel unsafe?
  what_are_the_main_factors_that_make_this_location_feel_unsafe: Opt<'what_are_the_main_factors_that_make_this_location_feel_unsafe'>[],
  // 7.1.1.1. Please specify
  please_specifywhat_are_the_main_factors_that_make_this_location_feel_unsafe: string | undefined,
  // 7.2. How would you describe the relationship between members of the host community, IDPs and/or returnees in this location?
  how_would_you_describe_the_relationship_between_member_of_the_host_community: Opt<'how_would_you_describe_the_relationship_between_member_of_the_host_community'>,
  // 7.2.1. What factors are affecting the relationship between communities in this location?
  what_factors_are_affecting_the_relationship_between_communities_in_this_location: Opt<'what_factors_are_affecting_the_relationship_between_communities_in_this_location'>[],
  // 7.2.1.1. Please specify
  please_specifywhat_factors_are_affecting_the_relationship_between_communities_in_this_location: string | undefined,
  // 7.2.2. Have you or your household members experienced incidents with host community members/IDPs/returnees?
  have_you_or_your_household_members_experienced_incidents_with_host_community_members_idps_returnees: Opt<'have_you_or_your_household_members_experienced_incidents_with_host_community_members_idps_returnees'>[],
  // 7.2.2.1. Please specify
  please_specifyhave_you_or_your_household_members_experienced_incidents_with_host_community_members_idps_returnees: string | undefined,
  // 7.3. Do you or your household members experience any barriers to movements in and around the area?
  do_you_or_your_household_members_experience_any_barriers_to_movements_in_and_around_the_area: Opt<'do_you_or_your_household_members_experience_any_barriers_to_movements_in_and_around_the_area'>[],
  // 7.3.1. Please specify
  please_specifydo_you_or_your_household_members_experience_any_barriers_to_movements_in_and_around_the_area: string | undefined,
  // <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12)">   8.1. Has any adult male member of your household experienced any form of violence within the last 6 months?</span>
  has_any_adult_male_member_experienced_violence: Opt<'has_any_adult_male_member_experienced_violence'>,
  // <span style="font-weight:normal">   8.1.1. What type of incidents took place?</span>
  what_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence: Opt<'what_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence'>[],
  // 8.1.1.1. Please specify
  please_specifywhat_type_of_incidents_took_place_has_any_adult_male_member_experienced_violence: string | undefined,
  // <span style="font-weight:normal">   8.1.2. When did the incident(s) occur? </span>
  when_did_the_incidents_occur_has_any_adult_male_member_experienced_violence: Opt<'when_did_the_incidents_occur_has_any_adult_male_member_experienced_violence'>[],
  // <span style="font-weight:normal">   8.1.3. Who were the perpetrators of the incident(s)? </span>
  who_were_the_perpetrators_of_the_incident_has_any_adult_male_member_experienced_violence: Opt<'who_were_the_perpetrators_of_the_incident_has_any_adult_male_member_experienced_violence'>[],
  // 8.1.3.1. Please specify
  please_specifywho_were_the_perpetrators_of_the_incident_has_any_adult_male_member_experienced_violence: string | undefined,
  // <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12)">   8.2. Has any adult female member of your household experienced any form of violence within the last 6 months?</span>
  has_any_adult_female_member_experienced_violence: Opt<'has_any_adult_female_member_experienced_violence'>,
  // <span style="font-weight:normal">   8.2.1. What type of incidents took place?</span>
  what_type_of_incidents_took_place_has_any_adult_female_member_experienced_violence: Opt<'what_type_of_incidents_took_place_has_any_adult_female_member_experienced_violence'>[],
  // 8.2.1.1. Please specify
  please_specifywhat_type_of_incidents_took_place_has_any_adult_female_member_experienced_violence: string | undefined,
  // <span style="font-weight:normal">   8.2.2. When did the incident(s) occur? </span>
  when_did_the_incidents_occur_has_any_adult_female_member_experienced_violence: Opt<'when_did_the_incidents_occur_has_any_adult_female_member_experienced_violence'>[],
  // <span style="font-weight:normal">   8.2.3. Who were the perpetrators of the incident(s)? </span>
  who_were_the_perpetrators_of_the_incident_has_any_adult_female_member_experienced_violence: Opt<'who_were_the_perpetrators_of_the_incident_has_any_adult_female_member_experienced_violence'>[],
  // 8.2.3.1. Please specify
  please_specifywho_were_the_perpetrators_of_the_incident_has_any_adult_female_member_experienced_violence: string | undefined,
  // <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12)">   8.3. Has any boy in your household experienced any form of violence within the last 6 months?</span>
  has_any_boy_member_experienced_violence: Opt<'has_any_boy_member_experienced_violence'>,
  // <span style="font-weight:normal">   8.3.1. What type of incidents took place?</span>
  what_type_of_incidents_took_place_has_any_boy_member_experienced_violence: Opt<'what_type_of_incidents_took_place_has_any_boy_member_experienced_violence'>[],
  // 8.3.1.1. Please specify
  please_specifywhat_type_of_incidents_took_place_has_any_boy_member_experienced_violence: string | undefined,
  // <span style="font-weight:normal">   8.3.2. When did the incident(s) occur? </span>
  when_did_the_incidents_occur_has_any_boy_member_experienced_violence: Opt<'when_did_the_incidents_occur_has_any_boy_member_experienced_violence'>[],
  // <span style="font-weight:normal">   8.3.3. Who were the perpetrators of the incident(s)? </span>
  who_were_the_perpetrators_of_the_incident_has_any_boy_member_experienced_violence: Opt<'who_were_the_perpetrators_of_the_incident_has_any_boy_member_experienced_violence'>[],
  // 8.3.3.1. Please specify
  please_specifywho_were_the_perpetrators_of_the_incident_has_any_boy_member_experienced_violence: string | undefined,
  // <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12)">   8.4. Has any girl in your household experienced any form of violence within the last 6 months?</span>
  has_any_girl_member_experienced_violence: Opt<'has_any_girl_member_experienced_violence'>,
  // <span style="font-weight:normal">   8.4.1. What type of incidents took place?</span>
  what_type_of_incidents_took_place_has_any_girl_member_experienced_violence: Opt<'what_type_of_incidents_took_place_has_any_girl_member_experienced_violence'>[],
  // 8.4.1.1. Please specify
  please_specifywhat_type_of_incidents_took_place_has_any_girl_member_experienced_violence: string | undefined,
  // <span style="font-weight:normal">   8.4.2. When did the incident(s) occur? </span>
  when_did_the_incidents_occur_has_any_girl_member_experienced_violence: Opt<'when_did_the_incidents_occur_has_any_girl_member_experienced_violence'>[],
  // <span style="font-weight:normal">   8.4.3. Who were the perpetrators of the incident(s)? </span>
  who_were_the_perpetrators_of_the_incident_has_any_girl_member_experienced_violence: Opt<'who_were_the_perpetrators_of_the_incident_has_any_girl_member_experienced_violence'>[],
  // 8.4.3.1. Please specify
  please_specifywho_were_the_perpetrators_of_the_incident_has_any_girl_member_experienced_violence: string | undefined,
  // <span style="display:block;width:630px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.12)">   8.5. Has any other unspecified (Age/Gender) member of your household experienced any form of violence within the last 6 months?</span>
  has_any_other_member_experienced_violence: Opt<'has_any_other_member_experienced_violence'>,
  // <span style="font-weight:normal">   8.5.1. What type of incidents took place?</span>
  what_type_of_incidents_took_place_has_any_other_member_experienced_violence: Opt<'what_type_of_incidents_took_place_has_any_other_member_experienced_violence'>[],
  // 8.5.1.1. Please specify
  please_specifywhat_type_of_incidents_took_place_has_any_other_member_experienced_violence: string | undefined,
  // <span style="font-weight:normal">   8.5.2. When did the incident(s) occur? </span>
  when_did_the_incidents_occur_has_any_other_member_experienced_violence: Opt<'when_did_the_incidents_occur_has_any_other_member_experienced_violence'>[],
  // <span style="font-weight:normal">   8.5.3. Who were the perpetrators of the incident(s)? </span>
  who_were_the_perpetrators_of_the_incident_has_any_other_member_experienced_violence: Opt<'who_were_the_perpetrators_of_the_incident_has_any_other_member_experienced_violence'>[],
  // 8.5.3.1. Please specify
  please_specifywho_were_the_perpetrators_of_the_incident_has_any_other_member_experienced_violence: string | undefined,
  // 8.6. Do you or members of your household experience discrimination or stigmatization in your current area of residence?
  do_you_or_members_of_your_household_experience_discrimination_or_stigmatization_in_your_current_area_of_residence: Opt<'do_you_or_members_of_your_household_experience_discrimination_or_stigmatization_in_your_current_area_of_residence'>,
  // 8.6.1. On what ground?
  on_what_ground: Opt<'on_what_ground'>[],
  // 8.6.1.1. Please specify
  please_specifyon_what_ground: string | undefined,
  // 8.7. Is/are any adult member(s) of your household displaying any of the following signs?
  is_are_any_adult_memberof_your_household_displaying_any_of_the_following_signs: Opt<'is_are_any_adult_memberof_your_household_displaying_any_of_the_following_signs'>[],
  // 8.7.1. Please specify
  please_specifyis_are_any_adult_memberof_your_household_displaying_any_of_the_following_signs: string | undefined,
  // 8.8. Is/are any child member(s) of your household displaying any of the following signs?
  is_are_any_child_member_of_your_household_displaying_any_of_the_following_signs: Opt<'is_are_any_child_member_of_your_household_displaying_any_of_the_following_signs'>[],
  // 8.8.1. Please specify
  please_specifyis_are_any_child_member_of_your_household_displaying_any_of_the_following_signs: string | undefined,
  // 8.7.2. Do household members experiencing distress have access to relevant care and services?
  do_household_members_experiencing_distress_have_access_to_relevant_care_and_services: Opt<'do_household_members_experiencing_distress_have_access_to_relevant_care_and_services'>,
  // 8.7.2.1. What are the barriers to access services?
  what_are_the_barriers_to_access_services: Opt<'what_are_the_barriers_to_access_services'>[],
  // 8.7.2.1.1. Please specify
  please_specifywhat_are_the_barriers_to_access_services: string | undefined,
  // 8.9. What do you think/feel are the major stress factors for you and your household members?
  what_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members: Opt<'what_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members'>[],
  // 8.9.1. Please specify
  please_specifywhat_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members: string | undefined,
  // 9.1. What are the main resources coming into the household?
  what_are_the_main_sources_of_income_of_your_household: Opt<'what_are_the_main_sources_of_income_of_your_household'>[],
  // 9.1.1. Please specify
  please_specifywhat_are_the_main_sources_of_income_of_your_household: string | undefined,
  // 9.1.2. What type of social protection do you receive?
  what_type_of_allowances_do_you_receive: Opt<'what_type_of_allowances_do_you_receive'>[],
  // 9.1.2.1. Please specify
  please_specifywhat_type_of_allowances_do_you_receive: string | undefined,
  // 9.2. What is the average monthly income of your household?
  what_is_the_average_month_income_per_household: Opt<'what_is_the_average_month_income_per_household'>,
  // 9.3. Including yourself, are there members of your household who are out of work and seeking employment?
  including_yourself_are_there_members_of_your_household_who_are_out_of_work_and_seeking_employment: Opt<'including_yourself_are_there_members_of_your_household_who_are_out_of_work_and_seeking_employment'>,
  // 9.3.1. What are the reasons for being out of work?
  what_are_the_reasons_for_being_out_of_work: Opt<'what_are_the_reasons_for_being_out_of_work'>[],
  // 9.3.1.1. Please specify
  please_specifywhat_are_the_reasons_for_being_out_of_work: string | undefined,
  // 9.4. Are there gaps in meeting your basic needs?
  are_there_gaps_in_meeting_your_basic_needs: Opt<'are_there_gaps_in_meeting_your_basic_needs'>,
  // 9.4.1. What are the strategies that your household uses to cope with these challenges?
  what_are_the_strategies_that_your_household_uses_to_cope_with_these_challenges: Opt<'what_are_the_strategies_that_your_household_uses_to_cope_with_these_challenges'>[],
  // 9.4.1.1. Please specify
  please_specifywhat_are_the_strategies_that_your_household_uses_to_cope_with_these_challenges: string | undefined,
  // 10.1. Are school-aged children (aged 6 to 15) in your household regularly attending primary or secondary education?
  are_schoolaged_children_in_your_household_regularly_attending_primary_or_secondary_education: Opt<'are_schoolaged_children_in_your_household_regularly_attending_primary_or_secondary_education'>,
  // 10.1.1. Is it:
  is_it: Opt<'is_it'>,
  // 10.1.2. What are the reasons preventing children in your household from regularly attending education services?
  what_are_the_reasons_preventing_children_in_your_household_from_regularly_attending_education_services: Opt<'what_are_the_reasons_preventing_children_in_your_household_from_regularly_attending_education_services'>[],
  // 10.1.2.1. Please specify
  please_specifywhat_are_the_reasons_preventing_children_in_your_household_from_regularly_attending_education_services: string | undefined,
  // 11.1. What is your current accommodation structure ?
  what_is_your_current_housing_structure: Opt<'what_is_your_current_housing_structure'>,
  // 11.1.1. Do you pay for the use of the accommodation?
  what_is_the_tenure_status_of_your_accommodation_private: Opt<'what_is_the_tenure_status_of_your_accommodation_private'>,
  // 11.1.1.1. Please specify
  please_specifywhat_is_the_tenure_status_of_your_accommodation_private: string | undefined,
  // 11.1.2. Do you pay for the use of the accommodation?
  what_is_the_tenure_status_of_your_accommodation_public: Opt<'what_is_the_tenure_status_of_your_accommodation_public'>,
  // 11.1.2.1. Please specify
  please_specifywhat_is_the_tenure_status_of_your_accommodation_public: string | undefined,
  // 11.1.1.2. Do you have formal rental documents to stay in your accommodation?
  do_you_have_formal_rental_documents_to_stay_in_your_accommodation: Opt<'do_you_have_formal_rental_documents_to_stay_in_your_accommodation'>,
  // 11.1.3. What is the general condition of your current accommodation?
  what_is_the_general_condition_of_your_accommodation: Opt<'what_is_the_general_condition_of_your_accommodation'>,
  // 11.1.4. What are your main concerns regarding your current accommodation?
  what_are_your_main_concerns_regarding_your_accommodation: Opt<'what_are_your_main_concerns_regarding_your_accommodation'>[],
  // 12.1. Do you have access to health care in your current location?
  do_you_have_access_to_health_care_in_your_current_location: Opt<'do_you_have_access_to_health_care_in_your_current_location'>,
  // 12.1.1. What are the barriers to accessing health services?
  what_are_the_barriers_to_accessing_health_services: Opt<'what_are_the_barriers_to_accessing_health_services'>[],
  // 12.1.1.1. Please specify
  please_specifywhat_are_the_barriers_to_accessing_health_services: string | undefined,
  // 13.1. What is your 1st priority?
  what_is_your_1_priority: Opt<'what_is_your_1_priority'>,
  // 13.1.1. Please specify
  please_specifywhat_is_your_1_priority: string | undefined,
  // 13.1.2. What is your 2nd priority?
  what_is_your_2_priority: Opt<'what_is_your_2_priority'>,
  // 13.1.2.1. Please specify
  please_specifywhat_is_your_2_priority: string | undefined,
  // 13.1.2.2. What is your 3rd priority?
  what_is_your_3_priority: Opt<'what_is_your_3_priority'>,
  // 13.1.2.2.1. Please specify
  please_specifywhat_is_your_3_priority: string | undefined,
  // 14.1. Additional information shared by respondent
  additional_information_shared_by_respondent: string | undefined,
  // 14.2. Comments/observations of the protection monitor
  comments_observations_of_the_protection_monitor: string | undefined,
  // 15.1. Need for assistance?
  need_for_assistance: Opt<'need_for_assistance'>,
}