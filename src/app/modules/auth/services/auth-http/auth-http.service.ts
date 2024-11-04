import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../models/auth.model';

const API_USERS_URL = `${environment.apiLogin}`;
const apiAuthenToken = `${environment.apiAuthenToken}`;
const SECRET_APPTOKEN = `${environment.SECRET_APPTOKEN}`;
const APPID = `${environment.APPID}`;
const api = `${environment.api}`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) { }

  // public methods
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${API_USERS_URL}`, {
      "username": email,
      "password": password,
      "loginMode": "SQL"
    });
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${API_USERS_URL}/forgot-password`, {
      email,
    });
  }

  getUserByToken(token: string): Observable<any> {
    // console.log('token', token)
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(`${api}/Login/Singin`, { token:token }, {
      //headers: httpHeaders,
    });
  }


  getBranchByUserName(userName: string): Observable<any> {
    // console.log('token', token)
    // const httpHeaders = new HttpHeaders({
    //   Authorization: `Bearer ${token}`,
    // });
    return this.http.get(`${api}/report/BranchByUserName`, { params: { userName: userName } });
  }
}
