import {UUID} from '../../type'

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
  // _id: number,
  // 'formhub/uuid': string,
  start: Date,
  end: Date,
  // __version__: string,
  // 'meta/instanceID': string,
  // _xform_id_string: string,
  _uuid: UUID,
  // _attachments: KoboAnswerAttachements[],
  // _status: KoboAnswerStatus,
  // _geolocation: KoboAnswerGeolocation[],
  _submission_time: Date,
  // _tags: KoboAnswerTags[],
  // _notes: KoboAnswerNotes[],
  // _validation_status: any,
  // _submitted_by: any
}

export type KoboAnswer = (KoboAnswerMetaData & {[key: string]: string})
