import {MicrosoftGraphClient, MPCADeduplicationOffice, MPCASheetDeduplication, MPCASheetTransaction} from '../../core/sdk/microsoftGraph/microsoftGraphClient'
import * as Loki from 'lokijs'

export type MPCADeduplication = MPCASheetTransaction & Partial<MPCASheetDeduplication> & {
  office: MPCADeduplicationOffice
}

interface MPCADeduplicationFilter {
  office?: MPCADeduplicationOffice[]
  start?: Date
  end?: Date
  taxId?: string[]
  list?: string[]
}

export class MPCADeduplicationDb {

  constructor(
    _db: Loki = new (Loki as any)('test.db'),
    private db = _db.addCollection<MPCADeduplication>('dedup')
  ) {

  }

  readonly insertTransaction = (row: MPCASheetTransaction & {office: MPCADeduplicationOffice}) => {
    return this.db.insert(row)
    // return Promise.resolve(this.db.insert({test: row.tentativeStart}))
  }

  readonly insertDeduplication = (row: MPCASheetDeduplication & {office: MPCADeduplicationOffice}) => {
    this.db.findAndUpdate({list: row.list, taxId: row.taxId}, _ => ({
      ..._,
      ...row,
    }))
  }

  readonly getAll = () => {
    return this.db.find()
  }

  readonly search = (filters: MPCADeduplicationFilter = {}) => {
    return this.db.find({
      // ...filters.office && {office: {$in: filters.office}},
      ...filters.taxId && {taxId: {$in: filters.taxId}},
      // ...filters.list && {list: {$in: filters.list}},
      // tentativeStart: {$lt: filters.end, $gt: filters.start},
    })
  }

  static readonly build = async ({
    sdk = new MicrosoftGraphClient(),
    db
  }: {
    db: MPCADeduplicationDb
    sdk: MicrosoftGraphClient,
  }) => {
    const transactions = await Promise.all([
      sdk.fetchMPCATransaction('CEJ').then(r => r.map(_ => ({..._, office: 'CEJ'} as const))),
      sdk.fetchMPCATransaction('DNK').then(r => r.map(_ => ({..._, office: 'DNK'} as const))),
      sdk.fetchMPCATransaction('HRK').then(r => r.map(_ => ({..._, office: 'HRK'} as const))),
    ])
      .then(([cej, dnk, hrk]) => [...cej, ...dnk, ...hrk])
      .then(_ => _.map(db.insertTransaction))

    const deduplications = await Promise.all([
      sdk.fetchMPCADeduplication('CEJ').then(r => r.map(_ => ({..._, office: 'CEJ'} as const))),
      sdk.fetchMPCADeduplication('DNK').then(r => r.map(_ => ({..._, office: 'DNK'} as const))),
      sdk.fetchMPCADeduplication('HRK').then(r => r.map(_ => ({..._, office: 'HRK'} as const))),
    ]).then(([cej, dnk, hrk]) => [...cej, ...dnk, ...hrk])
      .then(_ => _.map(db.insertDeduplication))
  }

}