import {DrcDonor, DrcProject} from '@/core/drcUa'

export interface ProtectionCommunityMonitoring {
  project?: DrcProject
}
export interface ProtectionHhsTags {
  projects?: DrcProject[]
  ai: DrcDonor,
  ipt: DrcDonor[]
}

/** @deprecated */
export const projects = [
  DrcProject['ECHO2 (UKR-000322)'],
  DrcProject['UHF4 (UKR-000314)'],
  DrcProject['UHF6 (UKR-000336)'],
  DrcProject['SDC (UKR-000226)'],
  DrcProject['OKF (UKR-000309)'],
]