import {KoboAnswer2} from '@/core/sdk/server/kobo/Kobo'
import {KoboApiForm, KoboQuestionType} from '@/core/sdk/server/kobo/KoboApi'
import ExcelJS from 'exceljs'
import {downloadBufferAsFile, downloadStringAsFile} from '@/utils/utils'

const koboQuestionType: KoboQuestionType[] = [
  'text',
  'start',
  'end',
  'integer',
  'select_one',
  'select_multiple',
  'date',
]

export const generateXLSFromArray = async <T>({
    schema,
    data,
  }: {
    data: T[],
    schema: {
      name: string
      render: (_: T) => string | number | undefined
    }[]
  }
) => {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('data')
  sheet.addRow(schema.map(_ => _.name))
  data.forEach(d => {
    sheet.addRow(schema.map(_ => _.render?.(d)))
  })
  sheet.views = [
    {state: 'frozen', xSplit: 0, ySplit: 1}
  ]
  const buffer = await workbook.xlsx.writeBuffer()
  downloadBufferAsFile(buffer as any, 'aa.xlsx')
}