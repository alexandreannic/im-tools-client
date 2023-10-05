import {ApiPaginate} from '@/core/type'
import {KoboQuestionSchema} from '@/core/sdk/server/kobo/KoboApi'
import {Enum} from '@alexandreannic/ts-utils'

export type KoboId = string

export type KoboAnswerId = string

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

export class KoboFormHelper {
  static readonly map = (_: Record<keyof KoboForm, any>): KoboForm => {
    _.updatedAt = new Date(_.updatedAt)
    _.createdAt = new Date(_.createdAt)
    return _
  }
}

export type KoboAttachment = {
  download_url: string
  filename: string
  download_small_url: string
  id: string
}

export type KoboAnswerMetaData<TTag = any> = {
  start: Date
  end: Date
  version: string
  submissionTime: Date
  submittedBy?: string
  id: KoboAnswerId
  uuid: string
  validationStatus?: 'validation_status_approved'
  validatedBy?: string
  lastValidatedTimestamp?: number
  geolocation?: [number, number]
  tags?: TTag
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
}

export type KoboMappedAnswerType = string | string[] | Date | number | undefined | KoboAnswer<any>[]

export type KoboAnswer<
  TQuestion extends Record<string, any> = Record<string, string | undefined>,
  TTags extends Record<string, any> | undefined = undefined
> = (KoboAnswerMetaData<TTags> & TQuestion)

export type KoboMappedAnswer<T extends Record<string, any> = Record<string, KoboMappedAnswerType>> = (KoboAnswerMetaData & T)

export class Kobo {

  static readonly mapPaginateAnswerMetaData = <TAnswer extends Record<string, any>, TTag extends Record<string, any> | undefined = undefined>(
    fnMap: (x: any) => TAnswer,
    fnMapTags: (x: any) => TTag
  ) => (_: ApiPaginate<Record<string, any>>): ApiPaginate<KoboAnswer<TAnswer, TTag>> => {
    return ({
      ..._,
      data: _.data.map(({answers, ...meta}) => ({
        ...Kobo.mapAnswerMetaData(meta, fnMapTags),
        ...fnMap(answers),
      }))
    })
  }

  static readonly mapAnswerBySchema = (indexedSchema: Record<string, KoboQuestionSchema>, answers: KoboAnswer): KoboMappedAnswer => {
    const mapped: KoboMappedAnswer = {...answers}
    Enum.entries(mapped).forEach(([question, answer]) => {
      const type = indexedSchema[question]?.type
      if (!type || !answer) return
      switch (type) {
        case 'today':
        case 'date': {
          (mapped as any)[question] = new Date(answer as Date)
          break
        }
        case 'select_multiple': {
          mapped[question] = (answer as string).split(' ')
          break
        }
        default:
          break
      }
    })
    return mapped
  }

  static readonly mapAnswerMetaData = (
    k: Partial<Record<keyof KoboAnswerMetaData, any>>,
    fnMapTags: (x: any) => any = _ => _
  ): KoboAnswer<any> => {
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
      tags: fnMapTags(k.tags),
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
