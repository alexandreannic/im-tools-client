import {ApiPaginate} from '@/core/type'

export type KoboId = string

export type KoboServer = {
  id: string
  url: string
  token: string
}

export interface KoboForm {
  server: KoboServer
  createdAt: Date
  updatedAt: Date
  id: KoboId
  name: string
  serverId: string
  uploadedBy?: string
}

export type KoboAttachment = {
  download_url: string
  filename: string
  download_small_url: string
  id: string
}

export type KoboAnswerMetaData = {
  start: Date
  end: Date
  version: string
  submissionTime: Date
  submittedBy?: string
  id: string
  uuid: string
  validationStatus?: 'validation_status_approved'
  validatedBy?: string
  lastValidatedTimestamp?: number
  geolocation?: [number, number]
  //
  // _id: number,
  // // 'formhub/uuid': string,
  // start: Date,
  // end: Date,
  // // __version__: string,
  // // 'meta/instanceID': string,
  // // _xform_id_string: string,
  // _uuid: UUID,
  attachments: KoboAttachment[],
  // // _status: KoboAnswerStatus,
  // _geolocation: [number, number],
  // _submission_time: Date,
  // // _tags: KoboAnswerTags[],
  // // _notes: KoboAnswerNotes[],
  // // _validation_status: any,
  // // _submitted_by: any
  tags: any,
}

export type KoboAnswer<T extends Record<string, any> = Record<string, string | undefined>> = (KoboAnswerMetaData & T)

export class Kobo {

  static readonly mapPaginateAnswerMetaData = (fnMap: (x: any) => any) => (_: ApiPaginate<Record<string, any>>): ApiPaginate<KoboAnswer<any>> => {
    return ({
      ..._,
      data: _.data.map(({answers, ...meta}) => ({
        ...Kobo.mapAnswerMetaData(meta),
        ...fnMap(answers) as any
      }))
    })
  }

  static readonly mapAnswerMetaData = (k: Partial<Record<keyof KoboAnswerMetaData, any>>): KoboAnswer<any> => {
    delete (k as any)['deviceid']
    return {
      ...k,
      start: new Date(k.start),
      end: new Date(k.end),
      submissionTime: new Date(k.submissionTime),
      version: k.version,
      id: k.id,
      validationStatus: k.validationStatus,
      validatedBy: k.validatedBy,
      lastValidatedTimestamp: k.lastValidatedTimestamp,
      geolocation: k.geolocation,
      tags: k.tags
    }
  }
}

export interface ApiKoboForm {
  // access_types: null
  // asset_type: "survey"
  // children: {count: 0}
  // data: "https://kobo.humanitarianresponse.info/api/v2/assets/aRHsewShwZhXiy8jrBj9zf/data/"
  // data_sharing: {}
  date_created: Date
  date_modified: Date
  deployed_version_id: string
  deployment__active: boolean
  // deployment__identifier: "https://kc.humanitarianresponse.info/alexandre_annic_drc/forms/aRHsewShwZhXiy8jrBj9zf"
  deployment__submission_count: 0
  // downloads: [,…]
  // export_settings: []
  has_deployment: boolean
  // kind: "asset"
  name: string
  // owner: "https://kobo.humanitarianresponse.info/api/v2/users/alexandre_annic_drc/"
  owner__username: string
  // parent: null
  // permissions: [{,…}, {,…}, {,…}, {,…}, {,…}, {,…}, {,…}, {,…}]
  // settings: {sector: {label: "Humanitarian - Coordination / Information Management",…},…}
  // status: "private"
  subscribers_count: 0
  // summary: {geo: false,…}
  // tag_string: ""
  uid: string
  // url: "https://kobo.humanitarianresponse.info/api/v2/assets/aRHsewShwZhXiy8jrBj9zf/"
  version_id: string
}
