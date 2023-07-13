import {KoboQuestionType} from '@/core/sdk/server/kobo/KoboApi'
import ExcelJS from 'exceljs'
import {downloadBufferAsFile} from '@/utils/utils'

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
  filename,
  data,
}: {
  filename: string
  data: T[]
  schema: {
    name: string
    render: (_: T) => string | number | undefined | Date
  }[]
}) => {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('data')
  const header = sheet.addRow(schema.map(_ => _.name))
  // header.fill = {
  //   type: 'pattern',
  //   pattern: 'solid',
  // bgColor: {argb: '#f2f2f2'},
  // }
  data.forEach(d => {
    sheet.addRow(schema.map(_ => _.render?.(d)))
  })
  sheet.views = [
    {state: 'frozen', xSplit: 0, ySplit: 1}
  ]
  const buffer = await workbook.xlsx.writeBuffer()
  downloadBufferAsFile(buffer as any, filename + '.xlsx')
}