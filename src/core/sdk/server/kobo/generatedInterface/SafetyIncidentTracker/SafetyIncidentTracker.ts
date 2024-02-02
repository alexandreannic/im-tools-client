import {SafetyIncidentTrackerOptions} from './SafetyIncidentTrackerOptions'

type Opt<T extends keyof typeof SafetyIncidentTrackerOptions> = keyof (typeof SafetyIncidentTrackerOptions)[T]

export interface SafetyIncidentTracker {
  start: string,
  end: string,
  // [datetime] Date, time
  date_time: Date | undefined,
  // [select_one] Oblast
  oblast: undefined | Opt<'oblast'>,
  // [select_one] Raion
  raion: undefined | Opt<'raion'>,
  // [select_one] Hromada
  hromada: undefined | Opt<'hromada'>,
  // [select_one] Attack
  attack: undefined | Opt<'zie_visit_person'>,
  // [select_multiple] Type of attack
  attack_type: undefined | Opt<'attack_type'>[],
  // [text] Attack details
  Attack_details: string | undefined,
  // [select_multiple] What was destroyed?
  what_destroyed: undefined | Opt<'what_destroyed'>[],
  // [select_multiple] Type of casualties
  type_casualties: undefined | Opt<'type_casualties'>[],
  // [note] Number of casualties:
  not_number_casualities: string,
  // [integer] Dead
  dead: number | undefined,
  // [integer] Injured
  injured: number | undefined,
  // [select_one] Was a foreign dignitary visiting?
  foreign_dignitary_visiting: undefined | Opt<'zie_visit_person'>,
  // [text] Who; what; where?
  foreign_dignitary_visiting_yes: string | undefined,
  // [select_one] Was there an advance by the UAF?
  wuaf: undefined | Opt<'drone_attack_activity'>,
  // [select_one] Was there an advance by the RAF?
  wraf: undefined | Opt<'drone_attack_activity'>,
  // [select_one] Was there a headline event: grain deal; sinking of a capital ship; mass surrenders of RAF; mass retreat of RAF; mass capture of RAF?
  headline_event: undefined | Opt<'zie_visit_person'>,
  // [select_one] -
  headline_event_rep: undefined | Opt<'drone_attack_activity'>,
  // [text] Where/what?
  headline_event_wh: string | undefined,
  // [select_one] Did Zielenskiy (or other cabinet minister) make a statement to an international body: foreign parliament; UN general assembly/security council/institution; prime minister; president; etc.?
  zie_statement: undefined | Opt<'zie_visit_person'>,
  // [select_one] -
  zie_statement_rep: undefined | Opt<'drone_attack_activity'>,
  // [text] Where/what?
  zie_statement_wh: string | undefined,
  // [select_one] Did Zielenskiy (or other cabinet minister) visit a high-profile location in Ukraine?
  zie_visit_location: undefined | Opt<'zie_visit_person'>,
  // [select_one] -
  zie_visit_location_rep: undefined | Opt<'drone_attack_activity'>,
  // [text] Where/what?
  zie_visit_location_wh: string | undefined,
  // [select_one] Did Zielenskiy (or other cabinet minister) visit a high-profile person in Ukraine?
  zie_visit_person: undefined | Opt<'zie_visit_person'>,
  // [select_one] -
  zie_visit_person_rep: undefined | Opt<'drone_attack_activity'>,
  // [text] Where/what?
  zie_visit_person_wh: string | undefined,
  // [select_one] Was there a drone attack or other partisan activity in the RF?
  drone_attack_activity: undefined | Opt<'drone_attack_activity'>,
}