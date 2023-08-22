import {Shelter_TAOptions} from './Shelter_TAOptions'

type Opt<T extends keyof typeof Shelter_TAOptions> = keyof (typeof Shelter_TAOptions)[T]

export interface Shelter_TA {
  start: string,
  end: string,
  // [text] NTA ID
  nta_id: string | undefined,
  // [select_one] Specify the Oblast
  ben_det_oblast: undefined | Opt<'ben_det_oblast'>,
  // [select_one] Specify the Rayon
  ben_det_raion: undefined | string,
  // [select_one] Specify the Hromada
  ben_det_hromada: undefined | string,
  // [text] Specify the Settlement
  ben_det_settlement: string | undefined,
  // [text] Specify the Address and house/apartment number
  ben_det_addres: string | undefined,
  // [select_one] House or Apartment
  house_or_apartment: undefined | Opt<'house_or_apartment'>,
  // [decimal] 1.1 Dismantling of structures (M3)
  dismantling_of_structures: number | undefined,
  // [note] 1.2 Single-shutter window, triple-glazed
  singleshutter_window_tripleglazed: string,
  // [decimal] pc
  singleshutter_window_tripleglazed_pc: number | undefined,
  // [decimal] m2
  singleshutter_window_tripleglazed_m: number | undefined,
  // [note] 1.3 Single-shutter window,double-glazed
  singleshutter_windowdoubleglazed: string,
  // [decimal] pc
  singleshutter_windowdoubleglazed_pc: number | undefined,
  // [decimal] m2
  singleshutter_windowdoubleglazed_m: number | undefined,
  // [note] 1.4 Double-shutter window triple-glazed
  doubleshutter_window_tripleglazed: string,
  // [decimal] pc
  doubleshutter_window_tripleglazed_pc: number | undefined,
  // [decimal] m2
  doubleshutter_window_tripleglazed_m: number | undefined,
  // [note] 1.5 Double-shutter window double-glazed
  doubleshutter_window_doubleglazed: string,
  // [decimal] pc
  doubleshutter_window_doubleglazed_pc: number | undefined,
  // [decimal] m2
  doubleshutter_window_doubleglazed_m: number | undefined,
  // [note] 1.6 Glass replacement double-glazed
  glass_replacement_doubleglazed: string,
  // [decimal] pc
  glass_replacement_doubleglazed_pc: number | undefined,
  // [decimal] m2
  glass_replacement_doubleglazed_m: number | undefined,
  // [note] 1.7 Glass replacement triple-glazed
  glass_replacement_tripleglazed: string,
  // [decimal] pc
  glass_replacement_tripleglazed_pc: number | undefined,
  // [decimal] m2
  glass_replacement_tripleglazed_m: number | undefined,
  // [decimal] 1.8 Outer seels galvanized with PVC coating (lm)
  outer_seels_galvanized_with_pvc_coating_lm: number | undefined,
  // [decimal] 1.9 Window slopes (m2)
  window_slopes_m: number | undefined,
  // [decimal] 1.10 Minor window repairs (pc)
  minor_window_repairs_pc: number | undefined,
  // [note] 1.11 Double-glazed UPVC door (pc)
  doubleglazed_upvc_door: string,
  // [decimal] pc
  doubleglazed_upvc_door_pc: number | undefined,
  // [decimal] m2
  doubleglazed_upvc_door_m: number | undefined,
  // [decimal] 2.1 Dismantling of structures (M3)
  dismantling_of_structures2: number | undefined,
  // [decimal] 2.2 Wall repair clay bricks (m3)
  wall_repair_clay_bricks_m: number | undefined,
  // [decimal] 2.3 Wall repair concrete blocks (m3)
  wall_repair_concrete_blocks_m: number | undefined,
  // [decimal] 2.4 Reinforced concrete lintels, foundations, columns, ring beam (m3)
  reinforced_concrete_lintels_foundations_columns_ring_beam_m: number | undefined,
  // [decimal] 2.5 Reinforced floor screed (m2)
  reinforced_floor_screed_m: number | undefined,
  // [decimal] 2.6 Floor base (m2)
  floor_base_m: number | undefined,
  // [decimal] 2.7 Minor welding works (kg)
  minor_welding_works_kg: number | undefined,
  // [decimal] 2.8 Mineral wool for external walls (m2)
  mineral_wool_for_external_walls_m: number | undefined,
  // [decimal] 2.9 Mineral wool for the ceiling (m2)
  mineral_wool_for_the_ceiling_m: number | undefined,
  // [decimal] 2.10 Plaster, primer and finishing painting (m2)
  plaster_primer_and_finishing_painting_m: number | undefined,
  // [decimal] 2.11 Wooden lathing (20 mm x 200 mm) (ml)
  wooden_lathing__mm_x__mm_ml: number | undefined,
  // [decimal] 2.12 Wooden beams (50 mm x 300 mm) (ml)
  wooden_beams__mm_x__mm_ml: number | undefined,
  // [decimal] 2.13 Roof Shiffer (m2)
  roof_shiffer_m: number | undefined,
  // [decimal] 2.14 Roof metal sheets (m2)
  roof_metal_sheets_m: number | undefined,
  // [decimal] 2.15 Roof onduline sheets (m2)
  roof_onduline_sheets_m: number | undefined,
  // [decimal] 2.16 Bitumen paint (m2)
  bitumen_paint_m: number | undefined,
  // [decimal] 2.17 Gypsum boards for ceiling (m2)
  gypsum_boards_for_ceiling_m: number | undefined,
  // [decimal] 2.18 Waterproofing barrier sheet (m2)
  waterproofing_barrier_sheet_m: number | undefined,
  // [decimal] 2.19 Steam vapor barrier sheet (m2)
  steam_vapor_barrier_sheet_m: number | undefined,
  // [decimal] 2.20 External doors (pc)
  external_doors_pc: number | undefined,
  // [decimal] 2.21 Internal wooden doors (pc)
  internal_wooden_doors_pc: number | undefined,
  // [decimal] 2.22 Electrical wiring (lm)
  electrical_wiring_lm: number | undefined,
  // [decimal] 2.23 Double electrical sockets (pc)
  double_electrical_sockets_pc: number | undefined,
  // [decimal] 2.23 Double switches. (pc)
  double_switches_pc: number | undefined,
  // [decimal] 2.25 Circuit breaker box (pc)
  circuit_breaker_box_pc: number | undefined,
  // [decimal] 2.26 PPr pipes cold and hot water supply (lm)
  ppr_pipes_cold_and_hot_water_supply_lm: number | undefined,
  // [decimal] 2.27 PPr heating pipes (lm)
  ppr_heating_pipes_lm: number | undefined,
  // [decimal] 2.28 Kitchen sink (pc)
  kitchen_sink_pc: number | undefined,
  // [decimal] 2.29 Washing basin with mixer and sifon (pc)
  washing_basin_with_mixer_and_sifon_pc: number | undefined,
  // [decimal] 2.30 Steel bathtub (pc)
  steel_bathtub_pc: number | undefined,
  // [decimal] 2.31 Compact toilet bowl, including seat and lid (pc)
  compact_toilet_bowl_including_seat_and_lid_pc: number | undefined,
  // [decimal] 2.32 Water heater of up to 50 liters dry ten (pc)
  water_heater_of_up_to__liters_dry_ten_pc: number | undefined,
  // [note] 2.33 Steel radiator
  steel_radiator: string,
  // [decimal] 600 mm
  steel_radiator_600mm: number | undefined,
  // [decimal] 800mm
  steel_radiator_800mm: number | undefined,
  // [note] 2.34 Steel radiator
  steel_radiator2: string,
  // [decimal] 1000mm
  steel_radiator_1000: number | undefined,
  // [decimal] 1200mm
  steel_radiator_2000: number | undefined,
  // [decimal] 2.35 Bimetallic radiator sections, length 800mm (pc)
  bimetallic_radiator_sections_length_mm_pc: number | undefined,
  // [decimal] 2.36 Wall mountes cable wiring (lm)
  wall_mountes_cable_wiring_lm: number | undefined,
  // [text] Other Comments
  comments: string | undefined,
}