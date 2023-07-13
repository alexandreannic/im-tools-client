export type KoboApiColType = KoboApiForm['content']['survey'][0]['type']

export type KoboQuestionSchema = KoboApiForm['content']['survey'][0]

export type KoboQuestionType = KoboQuestionSchema['type']

export type KoboQuestionChoice = KoboApiForm['content']['choices'][0]

export interface KoboApiForm {
  name: string
  content: {
    choices: {
      $autovalue: string,
      $kuid: string,
      label: string[],
      list_name: string,
      name: string,
    }[]
    schema: string
    settings: {version: string, default_language: string}
    survey: {
      $autoname: string
      $kuid: string
      $qpath: string
      $xpath: string
      label?: string[]
      name: string
      type:
        'deviceid' |
        'end_repeat' |
        'begin_repeat' |
        'begin_group' |
        'select_one' |
        'note' |
        'end_group' |
        'image' |
        'text' |
        'calculate' |
        'integer' |
        'select_multiple' |
        'select_one_from_file' |
        'date' |
        'start' |
        'end'
      select_from_list_name?: string
    }[]
    translated: ['hint', 'label', 'media::image']
    translations: string[]
  }
}
