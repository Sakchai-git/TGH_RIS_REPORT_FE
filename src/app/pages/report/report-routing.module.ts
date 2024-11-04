import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportTbc11Component } from './report-tbc11/report-tbc11.component';
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


const routes: Routes = [

  {
    path: 'report-tbc11',
    component: ReportTbc11Component,
  },
  {
    path: 'report-tbc14',
    component: ReportTbc14Component,
  },
  {
    path: 'report-tbc311',
    component: ReportTbc311Component,
  },
  {
    path: 'report-tbc312',
    component: ReportTbc312Component,
  },
  {
    path: 'report-tbc31',
    component: ReportTbc31Component,
  },
  {
    path: 'report-tbc32',
    component: ReportTbc32Component,
  },
  {
    path: 'report-tbc33',
    component: ReportTbc33Component,
  },
  {
    path: 'report-tbc34',
    component: ReportTbc34Component,
  },
  {
    path: 'report-tbc35',
    component: ReportTbc35Component,
  },
  {
    path: 'report-tbc36',
    component: ReportTbc36Component,
  },
  {
    path: 'report-tbc37',
    component: ReportTbc37Component,
  },

];

@NgModule({
  //imports: [RouterModule.forChild(routes)],
  //exports: [RouterModule],
})
export class ReportRoutingModule { }
