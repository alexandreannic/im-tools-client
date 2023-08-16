import {DrcOffice} from '@/core/drcJobTitle'

export enum KoboMealCfmStatus {
  Open = 'Open',
  Close = 'Close',
  Processing = 'Processing'
}

export enum KoboMealCfmArea {
  GCA = 'GCA',
  NGCA = 'NGCA',
}

export interface KoboMealCfmTag {
  gca?: KoboMealCfmArea
  office?: DrcOffice
  program?: string
  notes?: string
  focalPointEmail?: string
  status?: KoboMealCfmStatus
}

export class KoboMealCfmTag {
  static readonly map = (_?: any): KoboMealCfmTag => {
    const tag = (_ ?? {}) as KoboMealCfmTag
    if (!tag.status) tag.status = KoboMealCfmStatus.Open
    return tag
  }
}