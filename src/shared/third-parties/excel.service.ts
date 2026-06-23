import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExcelService {
  async createExcel<T extends Record<string, any>>(
    data: T[],
    sheetName: string,
    columnNames: string[],
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.addRows(data);

    worksheet.insertRow(1, columnNames);

    worksheet.columns.forEach((column) => {
      column.width = 20;
    });

    worksheet.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
