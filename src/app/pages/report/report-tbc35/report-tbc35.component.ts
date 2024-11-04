import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import * as moment from 'moment';
import { DashboardService } from '../../dashboard/dashboard.service';
import * as Excel from "exceljs";
import { DownloadComponent } from "src/app/share/user-control/download/download.component";
import { cloneDeep, each, filter, find, groupBy, includes, map, orderBy, padStart, replace, slice, uniq } from "lodash";
import Swal from "sweetalert2";
import { NgbCalendar, NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { AuthService, UserType } from "src/app/modules/auth";
import { MonthPickerComponent } from "src/app/share/user-control/month-picker/month-picker.component";
@Component({
  selector: 'app-report-tbc35',
  templateUrl: './report-tbc35.component.html',
  styleUrls: ['./report-tbc35.component.scss']
})
export class ReportTbc35Component {
  classColor: any = 'success';
  icon: any = './assets/media/icons/duotune/abstract/abs027.svg';
  date: any;
  public fromDate: NgbDate | null;
  public toDate: NgbDate | null;
  public branch: any = '0';
  private _reportFocus: any;

  currentUser$: Observable<UserType>;
  currentBranch$: Observable<any>;
  branchLogin: any = '0';
  @Input() get reportFocus(): any {
    return this._reportFocus;
  }
  @Output() reportFocusChange: EventEmitter<any> = new EventEmitter<any>();
  set reportFocus(value: any) {
    this._reportFocus = value;
    this.reportFocusChange.emit(this._reportFocus);
  }
  private _dataBranch: any;
  @Input() get dataBranch(): any {
    return this._dataBranch;
  }
  @Output() dataBranchChange: EventEmitter<any> = new EventEmitter<any>();
  set dataBranch(value: any) {
    this._dataBranch = value;
    this.dataBranchChange.emit(this._dataBranch);
  }
  reportName: any = 'สมุดทะเบียนการจ่ายเงินตามกรมธรรม์ประกันภัย-การประกันสุขภาพ';
  reportShortName: any = 'ทบ.ช.3.5';
  workbook: any = null;
  toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  isGetMaxDate = false;
  @ViewChild('download', { static: false }) download: DownloadComponent;
  @ViewChild('monthPicker', { static: false }) monthPicker: MonthPickerComponent;
  constructor(private auth: AuthService, private calendar: NgbCalendar, public dashboardService: DashboardService) {
    this.fromDate =  new NgbDate(calendar.getToday().year, 1, 1)
    this.toDate = calendar.getToday();
  }
  ngOnInit(): void {
    this.currentUser$ = this.auth.currentUser$;
    this.currentBranch$ = this.dashboardService.currentBranch$
    this.isGetMaxDate = false
    this.currentUser$.subscribe((user) => {
      this.branchLogin = user?.branchId;
    })
    this.currentBranch$.subscribe((res) => {
      let abbR_NAME = '0';
      if (res && res.length <= 1) {
        abbR_NAME = res[0].abbR_NAME;
      }
      if (res && res.length && abbR_NAME && !this.isGetMaxDate) {
        this.dashboardService.getReportDataOIC007MaxDate(!abbR_NAME ? '0' : abbR_NAME).subscribe((res: any) => {
          if (res && res.length && res[0].maX_DATE) {
            const maxDate = new Date(res[0].maX_DATE);
            this.toDate = new NgbDate(maxDate.getFullYear() + 543, maxDate.getMonth() + 1, maxDate.getDate());
            if (this.toDate.before(this.fromDate)) {
              this.toDate = this.fromDate;
            }
            this.monthPicker.toDate = this.toDate;
          } else {
            this.toDate = this.fromDate;
          }
        });
        this.isGetMaxDate = true
      }
    })
  }
  downloadClick(event: any) {
    this.reportFocus = this.reportShortName;
    this.dashboardService.getReportDataOIC007s(`${this.fromDate?.year! - 543}-${padStart(this.fromDate?.month + '', 2, '0')}-${padStart(this.fromDate?.day + '', 2, '0')}`, `${this.toDate?.year! - 543}-${padStart(this.toDate?.month + '', 2, '0')}-${padStart(this.toDate?.day + '', 2, '0')}`, this.branch).subscribe((res: any) => {
      //&& this.branch === '0'|| (this.branch !== '0' && find(res, (item) => { return item.brancH_RECEIVE_ABBR_NAME === item.abbR_NAME && item.abbR_NAME === this.branch }))
      if (res && res.length) {
        this.genExcel(res);
      } else {
        this.download.isLoadingSubject.next(false);
        this.toast.fire({
          icon: 'warning',
          title: `ขออภัย ช่วงเวลาที่ท่านเลือกไม่มีข้อมูลที่ Update กรุณาติดต่อฝ่ายเจ้าของทะเบียน ${this.reportName}(${this.reportShortName})<br/> เพื่อ Run Batch`,
          showConfirmButton: true,
          timer: 0
        })
      }

    }, (error) => {
      this.download.isLoadingSubject.next(false);

    })
  }

  headerMergeRow(worksheet: any, columnName: any, row: any, value: any, numberMerge: any) {
    if (numberMerge > 0) {
      worksheet.mergeCells(`${columnName}${row}:${columnName}${row + numberMerge}`);
    }

    let cell = worksheet.getCell(`${columnName}${row}`);
    cell.value = value;
    cell.alignment = { vertical: 'top', horizontal: 'center', wrapText: true };
    this.setBorderAll(cell);
    //cell.width = width;
  }
  headerMergeColumn(worksheet: any, columnName: any, row: any, value: any, columnMerge: any, width: any = 30) {
    if (columnMerge) {
      worksheet.mergeCells(`${columnName}${row}:${columnMerge}${row}`);
    }
    let cell = worksheet.getCell(`${columnName}${row}`);
    cell.value = value;
    cell.alignment = { vertical: 'top', horizontal: 'center' };
    this.setBorderAll(cell);
    //cell.width = width;
  }
  setBorderAll(cell: any) {
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  }
  setNumberFormat(cell: any) {
    cell.numFmt = '_-* #,##0.00_-;-* #,##0.00_-;_-* "-"??_-;_-@_-'
  }
  setDateFormat(cell: any) {
    cell.numFmt = '[$-,107]dd/mm/yyyy;@'
  }

  async genExcel(data: any) {
    this.workbook = new Excel.Workbook();
    this.workbook.calcProperties.fullCalcOnLoad = true;
    let row = 1;
    let cell;
    let columnMap = [{ excelColumn: 'A', dataColumn: 'casE_NO', width: 17, formula: false }
      , { excelColumn: 'B', dataColumn: 'notificatioN_DATE', isDate: true, width: 17 }
      , { excelColumn: 'C', dataColumn: 'evenT_DATE', isDate: true, width: 17 }
      , { excelColumn: 'D', dataColumn: 'claiM_REASON', width: 40, wrapText: true }
      , { excelColumn: 'E', dataColumn: 'policY_NO', width: 17 }
      , { excelColumn: 'F', dataColumn: 'commencemenT_DATE', isDate: true, width: 17 }
      , { excelColumn: 'G', dataColumn: 'coveragE_END_DATE', isDate: true, width: 17 }
      , { excelColumn: 'H', dataColumn: 'iD_NO_INSURED', width: 17 }
      , { excelColumn: 'I', dataColumn: 'insureD_NAME', width: 30 }

      , { excelColumn: 'J', dataColumn: 'sa', isNumber: true, width: 15 }
      , { excelColumn: 'K', dataColumn: 'paY_AMOUNT', isNumber: true, width: 15 }
      , { excelColumn: 'L', dataColumn: 'paymenT_DATE', isDate: true, width: 17 }
      // , { excelColumn: 'M', dataColumn: 'chequE_NO', width: 60 }
      // , { excelColumn: 'N', dataColumn: '', width: 17 }
      // , { excelColumn: 'O', dataColumn: '', isDate: true, width: 17 }
      // , { excelColumn: 'P', dataColumn: '', width: 17 }

      , { excelColumn: 'M', dataColumn: 'createD_BY', width: 15 }
      , { excelColumn: 'N', dataColumn: 'createD_BY_USERNAME', width: 18 }
      , { excelColumn: 'O', dataColumn: 'createD_DATE', width: 17, isDate: true }
      , { excelColumn: 'P', dataColumn: 'abbR_NAME', width: 15 }
      , { excelColumn: 'Q', dataColumn: 'companY_NAME', width: 30 }
      , { excelColumn: 'R', dataColumn: 'brancH_RECEIVE_ABBR_NAME', width: 15 }
      , { excelColumn: 'S', dataColumn: 'brancH_RECEIVE_NAME', width: 30 }
    ];

    // data = orderBy(data, ['brancH_RECEIVE_NAME', 'notificatioN_DATE', 'policY_CODE'], ['asc', 'asc', 'asc']);
    data = orderBy(data, ['notificatioN_DATE'], ['asc']);
    const dataBranch = orderBy(cloneDeep(data), ['brancH_RECEIVE_NAME'], ['asc']);
    const dataBranchs = groupBy(dataBranch, (item) => { return `${item.brancH_RECEIVE_ABBR_NAME}|-|${item.brancH_RECEIVE_NAME}` });
    let activeTab = 0;
    let activeTabFirst = 0;
    let indexVisible = 0;
    let dataBranchAll: any = {};
    let isExport: boolean = false;
    dataBranchAll[`|-|All`] = [1, 2];
    //console.log('dataBranchs',dataBranchs)
    dataBranchAll = { ...dataBranchAll, ...dataBranchs }
    for (var key in dataBranchAll) {
      if (dataBranchAll.hasOwnProperty(key)) {
        if (dataBranchAll[key].length > 0) {
          const dates = key.split('|-|');

          const element = dates[1];
          const elementCode = dates[0];
          let dataByBranch = dataBranchAll[key]
          let row = 1;
          let state = 'visible';
          let stateOUTPUT = 'visible';
          if (this.branchLogin && this.branchLogin !== 101) {
            state = 'hidden';
          } else {

          }
          let it = '';

          if (elementCode === '' && element === 'All') {
            dataByBranch = data;
            it = ' (IT)';
          }
          if (!element) {
            it = ' (IT)';
          }
          if (elementCode === '' && element === 'All') {
            dataByBranch = data;
          }
          let count = dataByBranch.length //filter(dataByBranch, (item) => { return it !== '' || (it === '' && item.applicatioN_BRANCH_ABBR_NAME === item.abbR_NAME) }).length;

          let sheetName = `${(element || 'ว่าง')} ${count}${it}`;
          if (count !== 0 && element === 'All') {
            this.createSheet(sheetName, columnMap, row, element, elementCode, state, it, dataByBranch, true, true)
            if (state === 'visible') {
              isExport = true;
              if (activeTabFirst === 0) {
                activeTab = indexVisible;
                activeTabFirst = 1;
              }
            }

            indexVisible++;
          }

          if (it === '') {
            count = dataByBranch.length;
            sheetName = `Rec Branch ${(element || 'ว่าง')} ${count}${it}`;
            if (count !== 0) {
              this.createSheet(sheetName, columnMap, row, element, elementCode, state, it, dataByBranch, true, true)
              if (state === 'visible') {
                isExport = true;
                if (activeTabFirst === 0) {
                  activeTab = indexVisible;
                  activeTabFirst = 1;
                }
              }
              indexVisible++;
              sheetName = `OUTPUT ${(element || 'ว่าง')} ${count}${it} OIC`;
              let countColumn = columnMap.length;
              let columnMapOUTPUT = slice(columnMap, 0, countColumn - 7)

              this.createSheet(sheetName, columnMapOUTPUT, row, element, elementCode, stateOUTPUT, it, dataByBranch, false, true)
              if (stateOUTPUT === 'visible') {
                isExport = true;
                if (activeTabFirst === 0) {
                  activeTab = indexVisible;
                  activeTabFirst = 1;
                }
              }
              indexVisible++;
            }

          }
        }
      }
    }
    if (isExport) {
      this.workbook.views = [{ activeTab: activeTab }];

      this.workbook.xlsx.writeBuffer().then((data: any) => {
        
        const blob = new Blob([data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.setAttribute("style", "display: none");
        a.href = url;
        a.download = `${this.reportName} (${this.reportShortName}).xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        this.download.isLoadingSubject.next(false);
        this.toast.fire({
          icon: 'success',
          title: `Download Excel ${this.reportName}(${this.reportShortName}) <br/> สำเร็จ`
        })
      });
    } else {
      this.download.isLoadingSubject.next(false);
      this.toast.fire({
        icon: 'warning',
        title: `ไม่มีข้อมูล ${this.reportName}(${this.reportShortName}) <br/> ตามช่วงเวลาที่เลือก`
      })
    }
  }

  createSheet(sheetName: any, columnMap: any, row: any, element: any, elementCode: any, state: any, it: any, dataByBranch: any, isOIC: any = true, isAllData = true) {
    
    if (state !== 'visible') {
      return;
    }
    let cell;
    //this.workbook
    const worksheetOld = this.workbook.getWorksheet(replace(sheetName, '/', ' '));
    if (worksheetOld) {
      sheetName += '_';
    }
    let worksheet = this.workbook.addWorksheet(replace(sheetName, '/', ' '), {
      properties: { tabColor: { argb: 'FF00FF00' } }, views: [
        { showGridLines: false, state: 'frozen', ySplit: 8, activeCell: 'A9', }
      ], state: state
    });
    if (!isOIC) {
      worksheet.protect('RIS-NEW')
    }
    each(columnMap, (item) => {
      worksheet.getColumn(item.excelColumn).width = item.width;
    })

    worksheet.mergeCells(`A${row}:U${row + 1}`);
    cell = worksheet.getCell(`A${row}`);
    cell.value = `${this.reportName} (${this.reportShortName})`;
    cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    row++;
    row++;

    worksheet.mergeCells(`A${row}:U${row}`);
    cell = worksheet.getCell(`A${row}`);
    cell.alignment = { vertical: 'middle', horizontal: 'left' };
    cell.value = `สาขาที่เลือก ${this.dataBranch?.companY_NAME || 'ทุกสาขา'}`;
    row++;
    worksheet.mergeCells(`A${row}:U${row}`);
    cell = worksheet.getCell(`A${row}`);
    cell.alignment = { vertical: 'middle', horizontal: 'left' };
    cell.value = `วันที่เรียกร้อง ${padStart(this.fromDate?.day + '', 2, '0')}/${padStart(this.fromDate?.month + '', 2, '0')}/${this.fromDate?.year} ถึง ${padStart(this.toDate?.day + '', 2, '0')}/${padStart(this.toDate?.month + '', 2, '0')}/${this.toDate?.year}`;
    row++;
    if (this.dataBranch?.companY_NAME === 'ทุกสาขา' && elementCode != -1) {
      cell = worksheet.getCell(`A${row}`);
      cell.value = elementCode;
      cell = worksheet.getCell(`B${row}`);
      cell.value = element;
    }

    row++;
    this.headerMergeRow(worksheet, 'A', row, 'เลขที่ใบรับเรื่อง\nหรือรับแจ้ง', 2);
    this.headerMergeRow(worksheet, 'B', row, 'วัน เดือน ปี\nที่รับเรื่อง\nหรือรับแจ้ง', 2);
    this.headerMergeRow(worksheet, 'C', row, 'วัน เดือน ปี\nที่รักษา', 2);
    this.headerMergeRow(worksheet, 'D', row, 'สาเหตุ', 2);
    this.headerMergeColumn(worksheet, 'E', row, 'กรมธรรม์ประกันภัย', 'G');
    this.headerMergeRow(worksheet, 'E', row + 1, 'เลขที่กรมธรรม์', 1);
    this.headerMergeRow(worksheet, 'F', row + 1, 'วันที่เริ่มคุ้มครอง', 1);
    this.headerMergeRow(worksheet, 'G', row + 1, 'วันสิ้นสุดการคุ้มครอง', 1);
    this.headerMergeRow(worksheet, 'H', row, 'เลขที่บัตรประชาชน', 2);
    this.headerMergeRow(worksheet, 'I', row, 'ชื่อ นามสกุลผู้เอาประกัน', 2);

    this.headerMergeRow(worksheet, 'J', row, 'จำนวนเงินเอาประกัน', 2);
    this.headerMergeRow(worksheet, 'K', row, 'จำนวนเงินที่จ่าย  ', 2);

    this.headerMergeRow(worksheet, 'L', row, 'วัน เดือน ปี ที่จ่าย ', 2);
    // this.headerMergeRow(worksheet, 'M', row, 'เลขที่เอกสารจ่าย ', 2);
    // this.headerMergeRow(worksheet, 'N', row, 'ผู้รับ', 2);
    // this.headerMergeRow(worksheet, 'O', row, 'วันที่รับเงิน', 2);
    // this.headerMergeRow(worksheet, 'P', row, 'หมายเหตุ ', 2);
    if (isOIC) {
      this.headerMergeRow(worksheet, 'M', row, 'User id', 2);
      this.headerMergeRow(worksheet, 'N', row, 'User name', 2);
      this.headerMergeRow(worksheet, 'O', row, 'Create date', 2);
      this.headerMergeRow(worksheet, 'P', row, 'User branch code', 2);
      this.headerMergeRow(worksheet, 'Q', row, 'User branch name', 2);
      this.headerMergeRow(worksheet, 'R', row, 'Received Branch code', 2);
      this.headerMergeRow(worksheet, 'S', row, 'Received Branch name', 2);
    }
    row++;
    row++;
    row++;

    let rowStart = row;
    each(dataByBranch, (item) => {
      if (it !== '' || (it === '' && (item.brancH_RECEIVE_ABBR_NAME === item.abbR_NAME || isAllData))) {
        each(columnMap, (itemColumn) => {
          cell = worksheet.getCell(`${itemColumn.excelColumn}${row}`);
          if (itemColumn.formula) {
            //  cell.value = { formula: itemColumn.formula.replace(new RegExp('0', "g"), row + ''), date1904: false };
          } else if (item.wrapText) {
            cell.value = item[itemColumn.dataColumn] ? item[itemColumn.dataColumn].replace(new RegExp(' ', "g"), '\n') : '';
          } else if (item[itemColumn.dataColumn]) {
            if (itemColumn.isDate) {
              const date = moment(item[itemColumn.dataColumn])// new Date(item[itemColumn.dataColumn]);
              const dateUTC = new Date(Date.UTC(date.year(), date.month(), date.date()))
              //console.log(date.day())
              // date.setFullYear(543);
              cell.value = dateUTC //moment(item[itemColumn.dataColumn]).add(543,'y').format('DD/MM/YYYY')  //new Date(date.getFullYear(), date.getMonth(), date.getDay(), 0, 0);
              this.setDateFormat(cell);
            } else {
              cell.value = item[itemColumn.dataColumn];
            }
          }
          if (itemColumn.isNumber) {
            if (!cell.value) {
              cell.value = 0;
            }
            this.setNumberFormat(cell);
          }

          if (itemColumn.isDate) {
            cell.alignment = { vertical: 'top', horizontal: 'center' };
          } else {
            cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
          }

          this.setBorderAll(cell);
        })

        row++;
      }
    })
    let columnSum = 'C';
    this.headerMergeColumn(worksheet, 'A', row, 'จำนวนกรมธรรม์', 'B');
    cell = worksheet.getCell(`${columnSum}${row}`);
    cell.value = { formula: `=COUNTA(${columnSum}${rowStart}:${columnSum}${row - 1})`, date1904: false };
    this.setBorderAll(cell);
    this.setNumberFormat(cell);

    columnSum = 'J';
    //this.headerMergeColumn(worksheet, 'J', row, 'จำนวนเงินรวมเงินเอาประกัน', 'L');
    cell = worksheet.getCell(`${columnSum}${row}`);
    cell.value = { formula: `=SUM(${columnSum}${rowStart}:${columnSum}${row - 1})`, date1904: false };
    this.setBorderAll(cell);
    this.setNumberFormat(cell);

    columnSum = 'K';
    //this.headerMergeColumn(worksheet, 'N', row, 'จำนวนเงินรวมเงินเบี้ยประกัน ', 'P');
    cell = worksheet.getCell(`${columnSum}${row}`);
    cell.value = { formula: `=SUM(${columnSum}${rowStart}:${columnSum}${row - 1})`, date1904: false };
    this.setBorderAll(cell);
    this.setNumberFormat(cell);

  }
  getColumnAZ(max: any = null) {
    const columnMonth = []

    for (var i = 65; i <= 90; i++) {
      const alphaText = String.fromCharCode(i);
      columnMonth.push(alphaText)
      if (max && max === alphaText) {
        break;
      }
    }

    return columnMonth;
  }
}

