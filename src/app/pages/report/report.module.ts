import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportTbc11Component } from './report-tbc11/report-tbc11.component';
import { ReportRoutingModule } from './report-routing.module';
import { ReportTbc14Component } from './report-tbc14/report-tbc14.component';
import { ReportTbc311Component } from './report-tbc311/report-tbc311.component';
import { ReportTbc312Component } from './report-tbc312/report-tbc312.component';
import { ReportTbc31Component } from './report-tbc31/report-tbc31.component';
import { ReportTbc32Component } from './report-tbc32/report-tbc32.component';
import { ReportTbc33Component } from './report-tbc33/report-tbc33.component';
import { ReportTbc34Component } from './report-tbc34/report-tbc34.component';
import { ReportTbc35Component } from './report-tbc35/report-tbc35.component';
import { ReportTbc36Component } from './report-tbc36/report-tbc36.component';
import { ReportTbc37Component } from './report-tbc37/report-tbc37.component';
import { NgbCalendar, NgbCalendarBuddhist, NgbDatepickerI18n, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from "ng-inline-svg-2";
import { FormsModule } from "@angular/forms";
import { UserControlModule } from "src/app/share/user-control/user-control.module";
import { NgbDatepickerI18nBuddhist } from 'src/app/share/user-control/month-picker/month-picker.component';


@NgModule({
  declarations: [ReportTbc11Component, ReportTbc14Component, ReportTbc311Component, ReportTbc312Component, ReportTbc31Component, ReportTbc32Component, ReportTbc33Component, ReportTbc34Component, ReportTbc35Component, ReportTbc36Component, ReportTbc37Component],
  imports: [
    CommonModule,
    ReportRoutingModule,
    InlineSVGModule,

    FormsModule,
    NgbDatepickerModule,
    UserControlModule
  ]
,
  exports:[
    ReportTbc11Component, ReportTbc14Component, ReportTbc311Component, ReportTbc312Component, ReportTbc31Component, ReportTbc32Component, ReportTbc33Component, ReportTbc34Component, ReportTbc35Component, ReportTbc36Component, ReportTbc37Component
  ],
  providers: [
    { provide: NgbCalendar, useClass: NgbCalendarBuddhist },
    { provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nBuddhist },
  ],
})
export class ReportModule { }
