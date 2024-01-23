import {OblastISO, OblastName} from '@/shared/UkraineMap/oblastIndex'
import {DrcDonor, DrcSector} from '@/core/type/drc'
import {Partnership_partnersDatabase} from '@/core/generatedKoboInterface/Partnership_partnersDatabase/Partnership_partnersDatabase'
import {KoboId} from '@/core/sdk/server/kobo/Kobo'

export interface PartnershipData extends Partnership_partnersDatabase {
  id: KoboId
  computed: {
    name?: string
  }
  oblast?: OblastName[]
  oblastIso?: OblastISO[]
  donors?: DrcDonor[]
  sectors?: DrcSector[]
  relationWithDrc?: Partnership_partnersDatabase['Is_there_an_ongoing_relationsh']
  ownWarehouse?: boolean
  ownVehicle?: Partnership_partnersDatabase['Own_vehicles']
  recommendationActivities?: Partnership_partnersDatabase['The_organization_is_g_type_of_activities']
  rapidMobilization?: boolean
  hardToReachAccess?: boolean
  targetedMinorities?: Partnership_partnersDatabase['Select_if_the_organi_inorities_in_Ukraine']
  assistanceRequested?: Partnership_partnersDatabase['Which_assistance_would_the_CSO']
  dueDiligenceThreshold?: Partnership_partnersDatabase['Sub_Grant_Funding_Threshold']
  dueDiligenceFinalized?: Partnership_partnersDatabase['Has_due_diligence_been_finaliz']
  dueRisk?: Partnership_partnersDatabase['Overall_Residual_Risk']
}

// export interface PartnershipSga {
//   Amount_UAH: "1357374"
//   Amount_USD: "36603"
//   Cost_per_beneficiary_automatic_planned: "24.5"
//   Cost_per_beneficiary_automatic_reached: "10.683887915936953"
//   Donor: "echo"
//   Funding_reported_on_: "100"
//   Is_it_an_equitable_partnership: "yes"
//   Number_of_beneficiaries_planned: "1494"
//   Number_of_beneficiaries_reached_001: "3426"
//   Oblasts: "chernivtsi_oblast"
//   Partnership_type: "strategic_partnership"
//   Project_code: "269"
//   SGA_end_date: "2023-04-30"
//   SGA_number: "102"
//   SGA_start_date: "2022-06-01"
//   Sectors_funded: "protection"
//   Tranches_received_: "100"
//   group_hw2qn61: any
//   group_ii6wz51_equipment_1_column: "12 %"
//   group_ii6wz51_programme_supplies_2_column: "2,9 %"
//   group_ii6wz51_salaries_1_column: "72 %"
//   group_ii6wz51_support_1_column: "11,8"
//   group_ii6wz51_visibility_1_column: "1,3 %"
// }