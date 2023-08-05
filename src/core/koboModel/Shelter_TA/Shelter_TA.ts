import {Shelter_TAOptions} from './Shelter_TAOptions'

type Opt<T extends keyof typeof Shelter_TAOptions> = keyof (typeof Shelter_TAOptions)[T]

export interface Shelter_TA {
  start: string,
  end: string,
  // NTA ID
  nta_id: string | undefined,
  // Tax ID
  drc_reference_number: string | undefined,
  // Specify the Oblast
  ben_det_oblast: Opt<'ben_det_oblast'>,
  // Specify the Rayon
  ben_det_raion: Opt<'ben_det_raion'>,
  // Specify the Hromada
  ben_det_hromada: Opt<'ben_det_hromada'>,
  // Specify the Settlement
  ben_det_settlement: string | undefined,
  // Specify the Address and house/apartment number
  ben_det_addres: string | undefined,
  // House or Apartment
  house_or_apartment: Opt<'house_or_apartment'>,
  // 1.1 Dismantling of structures (M3)
  dismantling_of_structures: string,
  // pc
  singleshutter_window_tripleglazed_pc: string,
  // m2
  singleshutter_window_tripleglazed_m: string,
  // pc
  singleshutter_windowdoubleglazed_pc: string,
  // m2
  singleshutter_windowdoubleglazed_m: string,
  // pc
  doubleshutter_window_tripleglazed_pc: string,
  // m2
  doubleshutter_window_tripleglazed_m: string,
  // pc
  doubleshutter_window_doubleglazed_pc: string,
  // m2
  doubleshutter_window_doubleglazed_m: string,
  // pc
  glass_replacement_doubleglazed_pc: string,
  // m2
  glass_replacement_doubleglazed_m: string,
  // pc
  glass_replacement_tripleglazed_pc: string,
  // m2
  glass_replacement_tripleglazed_m: string,
  // 1.8 Outer seels galvanized with PVC coating (lm)
  outer_seels_galvanized_with_pvc_coating_lm: string,
  // 1.9 Window slopes (m2)
  window_slopes_m: string,
  // 1.10 Minor window repairs (pc)
  minor_window_repairs_pc: string,
  // pc
  doubleglazed_upvc_door_pc: string,
  // m2
  doubleglazed_upvc_door_m: string,
  // 2.1 Dismantling of structures (M3)
  dismantling_of_structures2: string,
  // 2.2 Wall repair clay bricks (m3)
  wall_repair_clay_bricks_m: string,
  // 2.3 Wall repair concrete blocks (m3)
  wall_repair_concrete_blocks_m: string,
  // 2.4 Reinforced concrete lintels, foundations, columns, ring beam (m3)
  reinforced_concrete_lintels_foundations_columns_ring_beam_m: string,
  // 2.5 Reinforced floor screed (m2)
  reinforced_floor_screed_m: string,
  // 2.6 Floor base (m2)
  floor_base_m: string,
  // 2.7 Minor welding works (kg)
  minor_welding_works_kg: string,
  // 2.8 Mineral wool for external walls (m2)
  mineral_wool_for_external_walls_m: string,
  // 2.9 Mineral wool for the ceiling (m2)
  mineral_wool_for_the_ceiling_m: string,
  // 2.10 Plaster, primer and finishing painting (m2)
  plaster_primer_and_finishing_painting_m: string,
  // 2.11 Wooden lathing (20 mm x 200 mm) (ml)
  wooden_lathing__mm_x__mm_ml: string,
  // 2.12 Wooden beams (50 mm x 300 mm) (ml)
  wooden_beams__mm_x__mm_ml: string,
  // 2.13 Roof Shiffer (m2)
  roof_shiffer_m: string,
  // 2.14 Roof metal sheets (m2)
  roof_metal_sheets_m: string,
  // 2.15 Roof onduline sheets (m2)
  roof_onduline_sheets_m: string,
  // 2.16 Bitumen paint (m2)
  bitumen_paint_m: string,
  // 2.17 Gypsum boards for ceiling (m2)
  gypsum_boards_for_ceiling_m: string,
  // 2.18 Waterproofing barrier sheet (m2)
  waterproofing_barrier_sheet_m: string,
  // 2.19 Steam vapor barrier sheet (m2)
  steam_vapor_barrier_sheet_m: string,
  // 2.20 External doors (pc)
  external_doors_pc: string,
  // 2.21 Internal wooden doors (pc)
  internal_wooden_doors_pc: string,
  // 2.22 Electrical wiring (lm)
  electrical_wiring_lm: string,
  // 2.23 Double electrical sockets (pc)
  double_electrical_sockets_pc: string,
  // 2.23 Double switches. (pc)
  double_switches_pc: string,
  // 2.25 Circuit breaker box (pc)
  circuit_breaker_box_pc: string,
  // 2.26 PPr pipes cold and hot water supply (lm)
  ppr_pipes_cold_and_hot_water_supply_lm: string,
  // 2.27 PPr heating pipes (lm)
  ppr_heating_pipes_lm: string,
  // 2.28 Kitchen sink (pc)
  kitchen_sink_pc: string,
  // 2.29 Washing basin with mixer and sifon (pc)
  washing_basin_with_mixer_and_sifon_pc: string,
  // 2.30 Steel bathtub (pc)
  steel_bathtub_pc: string,
  // 2.31 Compact toilet bowl, including seat and lid (pc)
  compact_toilet_bowl_including_seat_and_lid_pc: string,
  // 2.32 Water heater of up to 50 liters dry ten (pc)
  water_heater_of_up_to__liters_dry_ten_pc: string,
  // 600 mm
  steel_radiator_600mm: string,
  // 800mm
  steel_radiator_800mm: string,
  // 1000mm
  steel_radiator_1000: string,
  // 1200mm
  steel_radiator_2000: string,
  // 2.35 Bimetallic radiator sections, length 800mm (pc)
  bimetallic_radiator_sections_length_mm_pc: string,
  // 2.36 Wall mountes cable wiring (lm)
  wall_mountes_cable_wiring_lm: string,
  // Other Comments
  comments: string | undefined,
}