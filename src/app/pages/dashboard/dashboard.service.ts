import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter } from 'lodash';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  url = environment.api + '/report/';

  toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 10000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  currentBranch$: Observable<any>;
  currentBranchSubject: BehaviorSubject<any>;
  constructor(
    private http: HttpClient) {

    this.currentBranchSubject = new BehaviorSubject<any>(undefined);
    this.currentBranch$ = this.currentBranchSubject.asObservable();
  }

  errorMethod = (error: any): any => {
    //this.loaderService.hide();
    console.log(error)
    this.toast.fire({
      icon: 'error',
      title: `Error Message : ${error && error.message ? error.message : 'กรุณราติดต่อ Admin'}`
    })
    return throwError(error);
  }

  getReportDataOIC001s(fromDate: any, toDate: any, branch: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    if (!branch) {
      branch = '0';
    }
    return this.http
      .get(this.url + 'ReportDataOIC001s', { params: { fromDate: fromDate, toDate: toDate, branch: branch } })
      .pipe(catchError(this.errorMethod));
  }
  getReportDataOIC002s(fromDate: any, toDate: any, branch: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    if (!branch) {
      branch = '0';
    }
    return this.http
      .get(this.url + 'ReportDataOIC002s', { params: { fromDate: fromDate, toDate: toDate, branch: branch } })
      .pipe(catchError(this.errorMethod));
  }
  getReportDataOIC003s(fromDate: any, toDate: any, branch: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    if (!branch) {
      branch = '0';
    }
    return this.http
      .get(this.url + 'ReportDataOIC003s', { params: { fromDate: fromDate, toDate: toDate, branch: branch } })
      .pipe(catchError(this.errorMethod));
  }
  getReportDataOIC004s(fromDate: any, toDate: any, branch: any) {
    if (!branch) {
      branch = '0';
    }
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'ReportDataOIC004s', { params: { fromDate: fromDate, toDate: toDate, branch: branch } })
      .pipe(catchError(this.errorMethod));
  }
  getReportDataOIC005s(fromDate: any, toDate: any, branch: any) {
    if (!branch) {
      branch = '0';
    }
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'ReportDataOIC005s', { params: { fromDate: fromDate, toDate: toDate, branch: branch } })
      .pipe(catchError(this.errorMethod));
  }
  getReportDataOIC006s(fromDate: any, toDate: any, branch: any) {
    if (!branch) {
      branch = '0';
    }
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'ReportDataOIC006s', { params: { fromDate: fromDate, toDate: toDate, branch: branch } })
      .pipe(catchError(this.errorMethod));
  }
  getReportDataOIC007s(fromDate: any, toDate: any, branch: any) {
    if (!branch) {
      branch = '0';
    }
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'ReportDataOIC007s', { params: { fromDate: fromDate, toDate: toDate, branch: branch } })
      .pipe(catchError(this.errorMethod));
  }
  getReportDataOIC008s(fromDate: any, toDate: any, branch: any) {
    if (!branch) {
      branch = '0';
    }
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'ReportDataOIC008s', { params: { fromDate: fromDate, toDate: toDate, branch: branch } })
      .pipe(catchError(this.errorMethod));
  }
  getReportDataOIC009s(fromDate: any, toDate: any, branch: any) {
    if (!branch) {
      branch = '0';
    }
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'ReportDataOIC009s', { params: { fromDate: fromDate, toDate: toDate, branch: branch } })
      .pipe(catchError(this.errorMethod));
  }
  getReportDataOIC010s(fromDate: any, toDate: any, branch: any) {
    if (!branch) {
      branch = '0';
    }
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'ReportDataOIC010s', { params: { fromDate: fromDate, toDate: toDate, branch: branch } })
      .pipe(catchError(this.errorMethod));
  }
  getReportDataOIC011s(fromDate: any, toDate: any, branch: any) {
    if (!branch) {
      branch = '0';
    }
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'ReportDataOIC011s', { params: { fromDate: fromDate, toDate: toDate, branch: branch } })
      .pipe(catchError(this.errorMethod));
  }


  getReportDataOIC001MaxDate(branch: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    if (!branch) {
      branch = '0';
    }
    return this.http
      .get(this.url + 'ReportDataOIC001MaxDate', { params: { branch: branch } })
      .pipe(catchError(this.errorMethod));
  }
  getReportDataOIC002MaxDate(branch: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    if (!branch) {
      branch = '0';
    }
    return this.http
      .get(this.url + 'ReportDataOIC002MaxDate', { params: { branch: branch } })
      .pipe(catchError(this.errorMethod));
  }
  getReportDataOIC003MaxDate(branch: any) {
    // tslint:disable-next-line: arrow-return-shorthand
    if (!branch) {
      branch = '0';
    }
    return this.http
      .get(this.url + 'ReportDataOIC003MaxDate', { params: { branch: branch } })
      .pipe(catchError(this.errorMethod));
  }
  getReportDataOIC004MaxDate(branch: any) {
    if (!branch) {
      branch = '0';
    }
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'ReportDataOIC004MaxDate', { params: { branch: branch } })
      .pipe(catchError(this.errorMethod));
  }
  getReportDataOIC005MaxDate(branch: any) {
    if (!branch) {
      branch = '0';
    }
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'ReportDataOIC005MaxDate', { params: { branch: branch } })
      .pipe(catchError(this.errorMethod));
  }
  getReportDataOIC006MaxDate(branch: any) {
    if (!branch) {
      branch = '0';
    }
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'ReportDataOIC006MaxDate', { params: { branch: branch } })
      .pipe(catchError(this.errorMethod));
  }
  getReportDataOIC007MaxDate(branch: any) {
    if (!branch) {
      branch = '0';
    }
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'ReportDataOIC007MaxDate', { params: { branch: branch } })
      .pipe(catchError(this.errorMethod));
  }
  getReportDataOIC008MaxDate(branch: any) {
    if (!branch) {
      branch = '0';
    }
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'ReportDataOIC008MaxDate', { params: { branch: branch } })
      .pipe(catchError(this.errorMethod));
  }
  getReportDataOIC009MaxDate(branch: any) {
    if (!branch) {
      branch = '0';
    }
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'ReportDataOIC009MaxDate', { params: { branch: branch } })
      .pipe(catchError(this.errorMethod));
  }
  getReportDataOIC010MaxDate(branch: any) {
    if (!branch) {
      branch = '0';
    }
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'ReportDataOIC010MaxDate', { params: { branch: branch } })
      .pipe(catchError(this.errorMethod));
  }
  getReportDataOIC011MaxDate(branch: any) {
    if (!branch) {
      branch = '0';
    }
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'ReportDataOIC011MaxDate', { params: { branch: branch } })
      .pipe(catchError(this.errorMethod));
  }

  getBranch() {
    // tslint:disable-next-line: arrow-return-shorthand
    return this.http
      .get(this.url + 'Branch', { params: {} })
      .pipe(catchError(this.errorMethod));
  }

  selectBranch(branchId:any) {
    this.getBranch().subscribe((res: any) => {
      let branch = res;
      if (branchId && branchId !== 101) {
        branch = filter(branch, (item)=> { return item.orgaN_ID === branchId})
      } else {
        branch.splice(0, 0, {
          "abbR_NAME": "0",
          "companY_NAME": "ทุกสาขา"
        });
      }

      this.currentBranchSubject.next(branch);
    });
  }
}
