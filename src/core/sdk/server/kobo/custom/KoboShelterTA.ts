import {Shelter_TA} from '@/core/koboModel/Shelter_TA/Shelter_TA'

export enum ShelterProgress {
  ContractorVisitDone = 'ContractorVisitDone',
  WorkEstimatesReceived = 'WorkEstimatesReceived',
  PurchaseRequestDone = 'PurchaseRequestDone',
  WorkOrderDone = 'WorkOrderDone',
  RepairWorksStarted = 'RepairWorksStarted',
  RepairWorksCompleted = 'RepairWorksCompleted',
  ContractorInvoiceReceived = 'ContractorInvoiceReceived',
  HandoverCertificateOfCompletionSigned = 'HandoverCertificateOfCompletionSigned',
  InvoicePaymentProcessed = 'InvoicePaymentProcessed',
}

export enum ShelterTagValidation {
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Pending = 'Pending',
}

export interface ShelterNtaTags {
  validation?: ShelterTagValidation
}

export interface ShelterTaTags {
  progress?: ShelterProgress
  contractor1?: ShelterProgress
  contractor2?: ShelterProgress
}

export enum ShelterContractor {
  'Zhilvest' = 'Zhilvest',
  'Artbudservice' = 'Artbudservice',
  'Osnova-R' = 'Osnova-R',
  'PGS Group' = 'PGS Group',
  'Donmegastroy' = 'Donmegastroy',
  'Ukr Bud Tekhnolohiyi' = 'Ukr Bud Tekhnolohiyi',
  'Interbud' = 'Interbud',
  'Megalit' = 'Megalit',
  'Kramelitbud' = 'Kramelitbud',
  'Skytown' = 'Skytown',
  'Dom 2007' = 'Dom 2007',
  'Dosvid 2002' = 'Dosvid 2002',
}

const prices: Partial<Record<NonNullable<Shelter_TA['ben_det_oblast']>,
  Partial<Record<ShelterContractor,
    Partial<Record<keyof Shelter_TA, number>>
  >>
>> = {
  kharkivska: {
    [ShelterContractor.Artbudservice]: {
      dismantling_of_structures: 0.05,
      singleshutter_window_tripleglazed_m: 325.00,
      singleshutter_windowdoubleglazed_m: 305.00,
      doubleshutter_window_tripleglazed_m: 325.00,
      doubleshutter_window_doubleglazed_m: 305.00,
      glass_replacement_doubleglazed_m: 130.00,
      glass_replacement_tripleglazed_m: 170.00,
      outer_seels_galvanized_with_pvc_coating_lm: 0,
    }
  }
}
//
// 1.1 Dismantling of structures (M3)
// 1.2 SINGLE-SHUTTER WINDOW, TRIPLE-GLAZED pc
// 1.2 SINGLE-SHUTTER WINDOW, TRIPLE-GLAZED m2
// 1.3 SINGLE-SHUTTER WINDOW,DOUBLE-GLAZED pc
// 1.3 SINGLE-SHUTTER WINDOW,DOUBLE-GLAZED m2
// 1.4 DOUBLE-SHUTTER WINDOW TRIPLE-GLAZED pc
// 1.4 DOUBLE-SHUTTER WINDOW TRIPLE-GLAZED m2
// 1.5 DOUBLE-SHUTTER WINDOW DOUBLE-GLAZED pc
// 1.5 DOUBLE-SHUTTER WINDOW DOUBLE-GLAZED m2
// 1.6 GLASS REPLACEMENT DOUBLE-GLAZED pc
// 1.6 GLASS REPLACEMENT DOUBLE-GLAZED m2
// 1.7 GLASS REPLACEMENT TRIPLE-GLAZED pc
// 1.7 GLASS REPLACEMENT TRIPLE-GLAZED m2
// 1.8 Outer seels galvanized with PVC coating (lm)
// 1.9 Window slopes (m2)
// 1.10 Minor window repairs (pc)
// 1.11 DOUBLE-GLAZED UPVC DOOR (PC) pc
// 1.11 DOUBLE-GLAZED UPVC DOOR (PC) m2
// 2.1 Dismantling of structures (M3)
// 2.2 Wall repair clay bricks (m3)
// 2.3 Wall repair concrete blocks (m3)
// 2.4 Reinforced concrete lintels, foundations, columns, ring beam (m3)
// 2.5 Reinforced floor screed (m2)
// 2.6 Floor base (m2)
// 2.7 Minor welding works (kg)
// 2.8 Mineral wool for external walls (m2)
// 2.9 Mineral wool for the ceiling (m2)
// 2.10 Plaster, primer and finishing painting (m2)
// 2.11 Wooden lathing (20 mm x 200 mm) (ml)
// 2.12 Wooden beams (50 mm x 300 mm) (ml)
// 2.13 Roof Shiffer (m2)
// 2.14 Roof metal sheets (m2)
// 2.15 Roof onduline sheets (m2)
// 2.16 Bitumen paint (m2)
// 2.17 Gypsum boards for ceiling (m2)
// 2.18 Waterproofing barrier sheet (m2)
// 2.19 Steam vapor barrier sheet (m2)
// 2.20 External doors (pc)
// 2.21 Internal wooden doors (pc)
// 2.22 Electrical wiring (lm)
// 2.23 Double electrical sockets (pc)
// 2.23 Double switches. (pc)
// 2.25 Circuit breaker box (pc)
// 2.26 PPr pipes cold and hot water supply (lm)
// 2.27 PPr heating pipes (lm)
// 2.28 Kitchen sink (pc)
// 2.29 Washing basin with mixer and sifon (pc)
// 2.30 Steel bathtub (pc)
// 2.31 Compact toilet bowl, including seat and lid (pc)
// 2.32 Water heater of up to 50 liters dry ten (pc)
// 2.33 STEEL RADIATOR 600 mm
// 2.33 STEEL RADIATOR 800mm
// 2.34 STEEL RADIATOR 1000mm
// 2.34 STEEL RADIATOR 1200mm
// 2.35 Bimetallic radiator sections, length 800mm (pc)
// 2.36 Wall mountes cable wiring (lm)
//
