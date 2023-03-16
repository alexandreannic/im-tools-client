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
  _geolocation: [number, number],
  _submission_time: Date,
  // _tags: KoboAnswerTags[],
  // _notes: KoboAnswerNotes[],
  // _validation_status: any,
  // _submitted_by: any
}

export type KoboAnswer = (KoboAnswerMetaData & {[key: string]: any})

export class KoboType {
  static readonly mapAnswerMetaData = (k: Record<keyof KoboAnswerMetaData, any>): KoboAnswer => {
    return {
      ...k,
      start: new Date(k.start),
      end: new Date(k.end),
      _submission_time: new Date(k._submission_time),
    }
  }
}
