import {UUID} from '../../../type'

export type KoboServer = {
  id: string
  url: string
  token: string
}

export enum KoboQuestionType {
  SelectOne = 'select_one',
  Text = 'text',
}

export type SelectFromListName = string

export interface KoboQuestion {
  name: string
  type: KoboQuestionType
  $kuid: string
  label: string[],
  $qpath: string,
  $xpath: string,
  required: boolean,
  $autoname: string,
  appearance: 'minimal' | 'horizontal',
  select_from_list_name: SelectFromListName
}

export interface KoboAnswerMetaData {
  _id: number,
  // 'formhub/uuid': string,
  start: Date,
  end: Date,
  // __version__: string,
  // 'meta/instanceID': string,
  // _xform_id_string: string,
  _uuid: UUID,
  // _attachments: KoboAnswerAttachements[],
  // _status: KoboAnswerStatus,
  _geolocation: [number, number],
  _submission_time: Date,
  // _tags: KoboAnswerTags[],
  // _notes: KoboAnswerNotes[],
  // _validation_status: any,
  // _submitted_by: any
}

export type KoboAnswer = (KoboAnswerMetaData & {[key: string]: any})

export class Kobo {
  static readonly mapAnswerMetaData = (k: Record<keyof KoboAnswerMetaData, any>): KoboAnswer => {
    return {
      ...k,
      start: new Date(k.start),
      end: new Date(k.end),
      _submission_time: new Date(k._submission_time),
    }
  }
}


export interface IKoboForm {
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
