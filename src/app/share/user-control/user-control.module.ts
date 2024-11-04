import { MonthPickerComponent } from "./month-picker/month-picker.component";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InlineSVGModule } from "ng-inline-svg-2";
import { FormsModule } from "@angular/forms";
import { DownloadComponent } from "./download/download.component";
import { SelectMonthComponent } from './select-month/select-month.component';
import { SelectYearComponent } from './select-year/select-year.component';
import { NgbInputDatepicker,  } from "@ng-bootstrap/ng-bootstrap";
import { BranchComponent } from './branch/branch.component';
import { NgSelect2Module } from "ng-select2";
import { DxSelectBoxModule } from "devextreme-angular";

@NgModule({
  declarations: [DownloadComponent, MonthPickerComponent, SelectMonthComponent, SelectYearComponent, BranchComponent],
  imports: [
    FormsModule,
    CommonModule,
    InlineSVGModule,
    NgbInputDatepicker,
    NgSelect2Module,
    DxSelectBoxModule
  ]
  ,
  exports: [DownloadComponent, MonthPickerComponent, BranchComponent
  ]
})
export class UserControlModule { }
