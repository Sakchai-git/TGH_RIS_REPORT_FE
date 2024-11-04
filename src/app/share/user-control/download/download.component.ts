import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent {
 //  @Input() date: any ;
  private _date: Date ;
  @Input() get date(): Date {
    return this._date;
  }
  @Output() dateChange: EventEmitter<Date> = new EventEmitter<Date>();
  set date(value: Date) {
    this._date = value;
    this.dateChange.emit(this._date);
  }

  private _fromDate: NgbDate | null;
  private _toDate: NgbDate | null;

  @Input() get fromDate(): any {
    return this._fromDate;
  }
  @Output() fromDateChange: EventEmitter<any> = new EventEmitter<any>();
  set fromDate(value: any) {
    this._fromDate = value;
    this.fromDateChange.emit(this._fromDate);
  }

  @Input() get toDate(): any {
    return this._toDate;
  }
  @Output() toDateChange: EventEmitter<any> = new EventEmitter<any>();
  set toDate(value: any) {
    this._toDate = value;
    this.toDateChange.emit(this._toDate);
  }

  @Input() reportName: any = '';
  @Input() reportShortName: any = '';

  @Output() onEventClick = new EventEmitter();
  isLoading$: Observable<boolean>;
  @Input() isLoadingSubject: BehaviorSubject<boolean>;
  isLoad = false;
  constructor() {
    moment.locale('th')

    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable()
  }

  downloadClick(event: any) {
    if (this.isLoadingSubject.value === true) {
      return;
    }
    Swal.fire({
      title: 'Download Excel',
      html: `ต้องการ Download Excel Report<br/> ${this.reportName}(${this.reportShortName}) หรือไม่`,
      icon: 'question',
      //html: textConfirmSave,
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      cancelButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoadingSubject.next(true);
        //this.isLoad = true;
        this.onEventClick.emit();
        // setTimeout(() => {
        //   this.isLoadingSubject.next(false);

        // }, 100);
      } else {
      }
    });


  }
}
