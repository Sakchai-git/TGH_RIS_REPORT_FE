import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ReportModule } from '../report/report.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),
    InlineSVGModule,

    FormsModule,
    NgbTooltipModule,

    NgbDatepickerModule,ReportModule
  ],
})
export class DashboardModule {}
