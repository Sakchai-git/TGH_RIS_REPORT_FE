
import { registerLocaleData, getLocaleDayNames, FormStyle, TranslationWidth, getLocaleMonthNames, formatDate } from '@angular/common';
import { Component, EventEmitter, Injectable, Input, Output } from '@angular/core';
import { NgbCalendar, NgbCalendarBuddhist, NgbDate, NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import localeThai from '@angular/common/locales/th';
import { padStart } from 'lodash';
import { Observable } from 'rxjs';
import { AuthService, UserType } from 'src/app/modules/auth';

@Injectable()
export class NgbDatepickerI18nBuddhist extends NgbDatepickerI18n {
  private _locale = 'th';
  private _weekdaysShort: readonly string[];
  private _monthsShort: readonly string[];
  private _monthsFull: readonly string[];

  constructor() {
    super();

    registerLocaleData(localeThai);

    const weekdaysStartingOnSunday = getLocaleDayNames(this._locale, FormStyle.Standalone, TranslationWidth.Short);
    this._weekdaysShort = weekdaysStartingOnSunday.map((day, index) => weekdaysStartingOnSunday[(index + 1) % 7]);

    this._monthsShort = getLocaleMonthNames(this._locale, FormStyle.Standalone, TranslationWidth.Abbreviated);
    this._monthsFull = getLocaleMonthNames(this._locale, FormStyle.Standalone, TranslationWidth.Wide);
  }

  getMonthShortName(month: number): string {
    return this._monthsShort[month - 1] || '';
  }

  getMonthFullName(month: number): string {
    return this._monthsFull[month - 1] || '';
  }

  getWeekdayLabel(weekday: number) {
    return this._weekdaysShort[weekday - 1] || '';
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    return formatDate(jsDate, 'fullDate', this._locale);
  }

  getYearNumerals(year: number): string {
    return String(year);
  }
}

@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? padStart(date.day + '', 2, '0') + this.DELIMITER + padStart(date.month + '', 2, '0') + this.DELIMITER + padStart(date.year + '', 2, '0') : '';
  }
}

@Component({
  selector: 'app-month-picker',
  templateUrl: './month-picker.component.html',
  styleUrls: ['./month-picker.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class MonthPickerComponent {
  private _date: any;
  @Input() get date(): any {
    return this._date;
  }
  @Output() dateChange: EventEmitter<any> = new EventEmitter<any>();
  set date(value: any) {
    this._date = value;
    this.dateChange.emit(this._date);
  }
  monthList: any = [];
  yearList: any = [];

  hoveredDate: NgbDate | null = null;

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

  currentUser$: Observable<UserType>;
  branchLogin:any = '0';
  calendars: NgbCalendar | null;
  constructor(private auth: AuthService,private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    // this.fromDate = calendar.getToday();

    // this.toDate = calendar.getNext(calendar.getToday(), 'm', 1);
    this.calendars = calendar;
    // console.log('this.fromDate',this.fromDate);
    // console.log('calendar.getToday()',calendar.getToday());

  }
  ngOnInit(): void {
    this.currentUser$ = this.auth.currentUser$;

  }
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
  setMaxDate() {
    // this.fromDate = this.calendars.getToday();
    // this.toDate = this.calendars.getNext(this.calendars.getToday(), 'm', 1);
    let car = this.calendars?.getPrev(this.fromDate!, 'd', 1);
    return this.calendars?.getNext(car!, 'm', 3);
  }
}
