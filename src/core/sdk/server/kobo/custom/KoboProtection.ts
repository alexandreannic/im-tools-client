import {DrcDonor, DrcProject} from '@/core/typeDrc'
import {KoboBaseTags} from '@/core/sdk/server/kobo/Kobo'

export interface ProtectionCommunityMonitoringTags extends KoboBaseTags {
  project?: DrcProject
}

export interface ProtectionHhsTags extends KoboBaseTags {
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