import * as ExcelJS from 'exceljs'
import {downloadBufferAsFile} from '@/utils/utils'

export interface GenerateXlsFromArrayParams<T = any> {
  sheetName: string
  data: T[]
  schema: {
    head: string
    render: (_: T) => string | number | undefined | Date
  }[]
}

export const generateXLSFromArray = async <T>(fileName: string, params: GenerateXlsFromArrayParams<T>[] | GenerateXlsFromArrayParams<T>) => {
  const workbook = new ExcelJS.Workbook();
  [params].flatMap(_ => _).map(({
    data, schema, sheetName
  }) => {
    const sheet = workbook.addWorksheet(sheetName)
    const header = sheet.addRow(schema.map(_ => _.head))
    // header.fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    // bgColor: {argb: '#f2f2f2'},
    // }
    data.forEach(d => {
      sheet.addRow(schema.map(_ => {
        return _.render?.(d)
      }))
    })
    sheet.views = [
      {state: 'frozen', xSplit: 0, ySplit: 1}
    ]
  })
  const buffer = await workbook.xlsx.writeBuffer()
  downloadBufferAsFile(buffer as any, fileName + '.xlsx')
}