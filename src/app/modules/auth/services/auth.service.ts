import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize, first } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  // public methods
  login(email: string, password: string): Observable<UserType> {
    console.log('login')
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(email, password).pipe(
      map((auth: any) => {
        //console.log('auth', auth);
        const result = this.setAuthFromLocalStorage(auth);
        return result;
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    console.log('logout')
    localStorage.removeItem(this.authLocalStorageToken);
    if (environment.isLocal) {

      this.login('somkidk', 'password').pipe(first())
        .subscribe((user: UserModel | undefined) => {
          if (user) {
            this.router.navigate(['/']);
          } else {
          }
        });
    } else {
      if (environment.urlLogin.includes('http')) {
         window.location.href = environment.urlLogin
      } else {
        this.router.navigate([environment.urlLogin], {
          queryParams: {},
        });
      }
    }


  }

  getUserByToken(): Observable<UserType> {
    console.log('getUserByToken')
    const auth = this.getAuthFromLocalStorage();
    if (!auth) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    return this.authHttpService.getUserByToken(auth).pipe(
      map((user: any) => {
        //console.log('user', user)
        if (user && user.userId) {
          this.currentUserSubject.next(user);
        }

        // if (user && user.userItem) {
        //   const users = user.userItem;
        //   const userDetail = users.Users.length ? users.Users[0] : {};
        //   let userModels: any = {
        //     userId: users.userId,
        //     memberId: users.memberId,
        //     username: users.username,
        //     Email: userDetail.Email,
        //     FirstName: userDetail.FirstName,
        //     LastName: userDetail.LastName,
        //     NameTH: userDetail.NameTH,
        //   };
        //   this.authHttpService.getBranchByUserName(users.username).subscribe(res => {
        //     if ((res && res.length && this.branch === '0') || (this.branch !== '0' && find(res, (item) => { return item.applicatioN_BRANCH_ABBR_NAME === item.abbR_NAME && item.abbR_NAME === this.branch }))) {
        //       userModels.branchId = res[0].orgaN_ID;
        //       userModels.abbrName = res[0].abbR_NAME;
        //       userModels.companyName = res[0].companY_NAME;
        //     }

        //     this.currentUserSubject.next(userModels);
        //   }, () => {
        //     this.currentUserSubject.next(userModels);
        //   });

        // } else {
        //   this.logout();
        // }
        return user;
      }),

      finalize(() => {

        this.isLoadingSubject.next(false)
      })
    );
  }

  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.username, user.username)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.accessToken) {
      localStorage.setItem(this.authLocalStorageToken, auth.accessToken);
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): any | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      //  const authData = JSON.parse(lsValue);
      return lsValue;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
