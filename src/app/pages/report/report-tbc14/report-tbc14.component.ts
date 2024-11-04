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
  selector: 'app-report-tbc14',
  templateUrl: './report-tbc14.component.html',
  styleUrls: ['./report-tbc14.component.scss']
})
export class ReportTbc14Component {
  classColor: any = 'secondary';
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
  reportName: any = 'สมุดทะเบียนการรับประกันภัยอุบัติเหตุส่วนบุคคล';
  reportShortName: any = 'ทบ.ช.1.4';
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
        this.dashboardService.getReportDataOIC002MaxDate(!abbR_NAME ? '0' : abbR_NAME).subscribe((res: any) => {
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
    this.dashboardService.getReportDataOIC002s(`${this.fromDate?.year! - 543}-${padStart(this.fromDate?.month + '', 2, '0')}-${padStart(this.fromDate?.day + '', 2, '0')}`, `${this.toDate?.year! - 543}-${padStart(this.toDate?.month + '', 2, '0')}-${padStart(this.toDate?.day + '', 2, '0')}`, this.branch).subscribe((res: any) => {
      if ((res && res.length)) {
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

    let cell;
    let column = this.getColumnAZ();

    let columnMap = [{ excelColumn: 'A', dataColumn: 'issuE_DATE', isDate: true, width: 17 }
      , { excelColumn: 'B', dataColumn: 'policY_CODE', width: 17 }
      , { excelColumn: 'C', dataColumn: 'commencemenT_DATE', isDate: true, width: 17 }
      , { excelColumn: 'D', dataColumn: 'coveragE_END_DATE', isDate: true, width: 17 }
      , { excelColumn: 'E', dataColumn: 'insureD_DOB', isDate: true, width: 17 }
      // , { excelColumn: 'F', dataColumn: 'entrY_AGE', width: 12 }//5
      , { excelColumn: 'F', dataColumn: 'insureD_ID_NO', width: 17 }
      , { excelColumn: 'G', dataColumn: 'insureD_NAME', width: 30 }

      , { excelColumn: 'H', dataColumn: 'amount', isNumber: true, width: 15, formula: false }
      , { excelColumn: 'I', dataColumn: 'premium', isNumber: true, width: 15 }
      , { excelColumn: 'J', dataColumn: 'stamP_DUTY', isNumber: true, width: 15 }
      // , { excelColumn: 'L', dataColumn: 'tR_NO', isNumber: true, width: 15 } //11
      , { excelColumn: 'K', dataColumn: 'firsT_COL_DATE', isDate: true, width: 17 }
      , { excelColumn: 'L', dataColumn: 'commissioN_AMOUNT', isNumber: true, width: 15 }
      , { excelColumn: 'M', dataColumn: 'agenT_NAME', isNumber: true, width: 25 }
      , { excelColumn: 'N', dataColumn: 'licensE_NO', isNumber: true, width: 15 }
      // , { excelColumn: 'Q', dataColumn: '', width: 15 }
      // , { excelColumn: 'R', dataColumn: '', width: 15 }
      , { excelColumn: 'O', dataColumn: '', width: 15 }

      , { excelColumn: 'P', dataColumn: 'inserT_BY', width: 15 }
      , { excelColumn: 'Q', dataColumn: 'createD_BY_USERNAME', width: 18 }
      , { excelColumn: 'R', dataColumn: 'createD_DATE', width: 17, isDate: true }
      , { excelColumn: 'S', dataColumn: 'abbR_NAME', width: 15 }
      , { excelColumn: 'T', dataColumn: 'companY_NAME', width: 30 }
      , { excelColumn: 'U', dataColumn: 'applicatioN_BRANCH_ABBR_NAME', width: 15 }
      , { excelColumn: 'V', dataColumn: 'applicatioN_BRANCH_NAME', width: 30 }
    ];

    // data = orderBy(data, ['applicatioN_BRANCH_NAME', 'issuE_DATE', 'policY_CODE'], ['asc', 'asc', 'asc']);
    data = orderBy(data, ['issuE_DATE'], ['asc']);
    const dataBranch = orderBy(cloneDeep(data), ['applicatioN_BRANCH_NAME'], ['asc']);
    const dataBranchs = groupBy(dataBranch, (item) => { return `${item.applicatioN_BRANCH_ABBR_NAME}|-|${item.applicatioN_BRANCH_NAME}` });

    let activeTab = 0;
    let activeTabFirst = 0;
    let indexVisible = 0;
    let dataBranchAll: any = {};
    let isExport: boolean = false;
    dataBranchAll[`|-|All`] = [1, 2];
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
            this.createSheet(sheetName, columnMap, row, element, elementCode, column, state, it, dataByBranch, true, false)
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
            sheetName = `App Branch ${(element || 'ว่าง')} ${count}${it}`;
            if (count !== 0) {
              this.createSheet(sheetName, columnMap, row, element, elementCode, column, state, it, dataByBranch, true, true)
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

              this.createSheet(sheetName, columnMapOUTPUT, row, element, elementCode, column, stateOUTPUT, it, dataByBranch, false, true)
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

  createSheet(sheetName: any, columnMap: any, row: any, element: any, elementCode: any, column: any, state: any, it: any, dataByBranch: any, isOIC: any = true, isAllData = true) {

    if (state !== 'visible') {
      return;
    }
    let cell;
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

    worksheet.mergeCells(`A${row}:X${row + 1}`);
    cell = worksheet.getCell(`A${row}`);
    cell.value = `${this.reportName} (${this.reportShortName})`;
    cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    row++;
    row++;

    worksheet.mergeCells(`A${row}:X${row}`);
    cell = worksheet.getCell(`A${row}`);
    cell.alignment = { vertical: 'middle', horizontal: 'left' };
    cell.value = `สาขาที่เลือก ${this.dataBranch?.companY_NAME || 'ทุกสาขา'}`;
    row++;
    worksheet.mergeCells(`A${row}:X${row}`);
    cell = worksheet.getCell(`A${row}`);
    cell.alignment = { vertical: 'middle', horizontal: 'left' };
    cell.value = `วันที่ออกกรมธรรม์ ${padStart(this.fromDate?.day + '', 2, '0')}/${padStart(this.fromDate?.month + '', 2, '0')}/${this.fromDate?.year} ถึง ${padStart(this.toDate?.day + '', 2, '0')}/${padStart(this.toDate?.month + '', 2, '0')}/${this.toDate?.year}`;
    row++;
    if (this.dataBranch?.companY_NAME === 'ทุกสาขา' && elementCode != -1) {
      cell = worksheet.getCell(`A${row}`);
      cell.value = elementCode;
      cell = worksheet.getCell(`B${row}`);
      cell.value = element;
    }

    row++;
    this.headerMergeRow(worksheet, column[0], row, 'วันทำสัญญา', 2);
    this.headerMergeColumn(worksheet, column[1], row, 'กรมธรรม์ประกันภัย', column[1 + 2]);
    this.headerMergeRow(worksheet, column[1], row + 1, 'เลขที่กรมธรรม์', 1);
    this.headerMergeRow(worksheet, column[2], row + 1, 'วันที่เริ่ม\nการคุ้มครอง', 1);
    this.headerMergeRow(worksheet, column[3], row + 1, 'วันสิ้นสุด\nการคุ้มครอง ', 1);
    this.headerMergeRow(worksheet, column[4], row, 'วันเดือนปีเกิด', 2);
    // this.headerMergeRow(worksheet, column[5], row, 'อายุทำประกัน', 2);
    this.headerMergeRow(worksheet, column[5], row, 'เลขที่บัตรประชาชน', 2);
    this.headerMergeRow(worksheet, column[6], row, 'ชื่อ นามสกุลผู้เอาประกัน', 2);
    this.headerMergeRow(worksheet, column[7], row, 'จำนวนเงินเอาประกัน', 2);
    this.headerMergeRow(worksheet, column[8], row, 'จำนวนเงินเบี้ยประกัน', 2);
    this.headerMergeRow(worksheet, column[9], row, 'ภาษีอากร', 2);
    // this.headerMergeRow(worksheet, column[11], row, 'เลขที่\nใบรับเงิน\nชั่วคราว', 2);
    this.headerMergeRow(worksheet, column[10], row, 'วัน เดือน ปี\nรับชำระเบี้ย', 2);
    this.headerMergeRow(worksheet, column[11], row, 'ค่าจ้างหรือคำบำเหน็จ\nตัวแทน', 2);
    this.headerMergeColumn(worksheet, column[12], row, 'นายหน้า/ตัวแทน', column[13]);
    this.headerMergeRow(worksheet, column[12], row + 1, 'ชื่อ นามสกุล', 1);
    this.headerMergeRow(worksheet, column[13], row + 1, 'เลขที่ใบอนุญาต', 1);
    // this.headerMergeRow(worksheet, column[16], row, 'ผู้รับกรมธรรม์', 2);
    // this.headerMergeRow(worksheet, column[17], row, 'วันที่รับกรมธรรม์', 2);
    this.headerMergeRow(worksheet, column[14], row, 'หมายเหตุ', 2);
    if (isOIC) {
      this.headerMergeRow(worksheet, column[15], row, 'User id', 2);
      this.headerMergeRow(worksheet, column[16], row, 'User name', 2);
      this.headerMergeRow(worksheet, column[17], row, 'Create date', 2);
      this.headerMergeRow(worksheet, column[18], row, 'User branch code', 2);
      this.headerMergeRow(worksheet, column[19], row, 'User branch name', 2);
      this.headerMergeRow(worksheet, column[20], row, (includes(sheetName, 'Ser Branch')  ? 'Service ' : 'App ') + 'Branch code', 2);
      this.headerMergeRow(worksheet, column[21], row, (includes(sheetName, 'Ser Branch')  ? 'Service ' : 'App ') + 'Branch name', 2);

    }
    row++;
    row++;
    row++;



    let rowStart = row;
    each(dataByBranch, (item) => {
      if (it !== '' || (it === '' && (item.applicatioN_BRANCH_ABBR_NAME === item.abbR_NAME || isAllData))) {
        each(columnMap, (itemColumn) => {
          cell = worksheet.getCell(`${itemColumn.excelColumn}${row}`);
          if (itemColumn.formula) {
            // cell.value = { formula: itemColumn.formula.replace(new RegExp('0', "g"), row + ''), date1904: false };
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

    this.headerMergeColumn(worksheet, column[1], row, 'จำนวนกรมธรรม์', column[2]);
    //this.headerMergeColumn(worksheet, column[3], row, '', column[4]);
    cell = worksheet.getCell(`${column[3]}${row}`);
    cell.alignment = { vertical: 'top', horizontal: 'center' };
    cell.value = { formula: `=COUNTA(${column[3]}${rowStart}:${column[3]}${row - 1})` };
    this.setBorderAll(cell);
    this.setNumberFormat(cell);


    // this.headerMergeColumn(worksheet, column[10], row, 'จำนวนเงินรวมเงินเอาประกัน', column[13]);
    cell = worksheet.getCell(`${column[7]}${row}`);
    cell.value = { formula: `=SUM(${column[7]}${rowStart}:${column[7]}${row - 1})`, date1904: false };
    this.setBorderAll(cell);
    this.setNumberFormat(cell);

    // this.headerMergeColumn(worksheet, column[15], row, 'จำนวนเงินรวมเงินเบี้ยประกัน ', column[18]);
    cell = worksheet.getCell(`${column[8]}${row}`);
    cell.value = { formula: `=SUM(${column[8]}${rowStart}:${column[8]}${row - 1})`, date1904: false };
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
