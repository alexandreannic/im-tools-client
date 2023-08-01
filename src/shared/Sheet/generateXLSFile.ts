import {KoboQuestionType} from '@/core/sdk/server/kobo/KoboApi'
import * as ExcelJS from 'exceljs'
import {downloadBufferAsFile} from '@/utils/utils'

interface Params<T> {
  sheetName: string
  data: T[]
  schema: {
    name: string
    render: (_: T) => string | number | undefined | Date
  }[]
}

export const generateXLSFromArray = async <T>(fileName: string, params: Params<T>[] | Params<T>) => {
  const workbook = new ExcelJS.Workbook();
  [params].flatMap(_ => _).map(({
    data, schema, sheetName
  }) => {
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
    console.log(sheet)
  })
  const buffer = await workbook.xlsx.writeBuffer()
  downloadBufferAsFile(buffer as any, fileName + '.xlsx')
}