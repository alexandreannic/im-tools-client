import {DrcDonor, DrcProject} from '@/core/drcUa'

export interface ProtectionCommunityMonitoring {
  project?: DrcProject
}
export interface ProtectionHhsTags {
  projects?: DrcProject[]
  ai: DrcDonor,
  ipt: DrcDonor[]
}

export const currentProtectionProjects = [
  DrcProject['UKR-000322 ECHO2'],
  DrcProject['UKR-000314 UHF4'],
  DrcProject['UKR-000336 UHF6'],
  DrcProject['UKR-000226 SDC'],
  DrcProject['UKR-000309 OKF'],
]