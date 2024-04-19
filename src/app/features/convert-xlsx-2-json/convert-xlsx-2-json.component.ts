import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as XLSX from 'xlsx';
type AOA = any[][];


@Component({
  selector: 'app-convert-xlsx-2-json',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './convert-xlsx-2-json.component.html',
  styleUrl: './convert-xlsx-2-json.component.scss'
})
export class ConvertXlsx2JsonComponent {

  localWorkBook: XLSX.WorkBook;
  sheetNameForTab: Array<string> = ['excel tab 1', 'excel tab 2'];
  totalPage = this.sheetNameForTab.length;
  selectDefault: any;
  localwSheet: XLSX.WorkSheet;
  sheetCellRange: XLSX.Range;
  sheetMaxRow: any;
  origExcelData: AOA = [];
  refExcelData = [];
  fileName;

  importFile(event, index = 0) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    this.fileName = target.files[0].name;
    const reader: FileReader = new FileReader();
    reader.readAsArrayBuffer(target.files[0]);
    reader.onload = (e: any) => {
      const binarystr: string = e.target.result;
      const wBook: XLSX.WorkBook = XLSX.read(binarystr, { type: 'array' });
      this.localWorkBook = wBook;
      const wsname: string = wBook.SheetNames[index];
      this.sheetNameForTab = wBook.SheetNames;
      this.totalPage = this.sheetNameForTab.length;
      this.selectDefault = this.sheetNameForTab[index];
      const wSheet: XLSX.WorkSheet = wBook.Sheets[wsname];
      this.localwSheet = wSheet;
      this.sheetCellRange = XLSX.utils.decode_range(wSheet['!ref']);
      this.sheetMaxRow = this.sheetCellRange.e.r;
      this.origExcelData = <AOA>XLSX.utils.sheet_to_json(wSheet, {
        header: 1,
        range: wSheet['!ref'],
        raw: true,
      });
      if (this.origExcelData) {
        this.fileName = event.target.files[0].name;
        this.refExcelData = this.origExcelData
          .slice(1)
          .map((value) => {
            return {
              stt: value[0],
              typeSchool: value[1],
              nameSchool: value[2],
            };
          }).filter((item) => { return item.stt });
        console.log(this.refExcelData);
      }
    };
  }
}
