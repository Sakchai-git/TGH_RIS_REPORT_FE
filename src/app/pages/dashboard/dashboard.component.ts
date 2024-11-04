import { Component, ViewChild } from '@angular/core';

import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { DashboardService } from './dashboard.service';
import { Observable } from 'rxjs';
import { AuthService, UserType } from 'src/app/modules/auth';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],

  //encapsulation: ViewEncapsulation.None,
})

export class DashboardComponent {

  dataInfo: any = {};
  date: any;
  reportFocus: any;
  public dataBranch: any;
  user$: Observable<UserType>;
  constructor(
    private auth: AuthService, public dashboardService: DashboardService) {
    //dateAdapter.setLocale('th-th');
    moment.locale('th');
    //console.log(moment.monthsShort())


  }
  ngOnInit(): void {


    this.user$ = this.auth.currentUserSubject.asObservable();
    this.user$.subscribe((user) => {
      this.dashboardService.selectBranch(user?.branchId);
    })
  }


}
