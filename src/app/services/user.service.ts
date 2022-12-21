import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {User} from '../entity/user';
import {LoginRequest} from '../entity/login-request';
import {LoginResponse} from '../entity/login-response';
import {JwtHelperService} from "@auth0/angular-jwt";
import {AppData} from "../settings/app-data";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/authenticate', loginRequest).pipe(
      map(res => {
        return new LoginResponse(res);
      })
    )
      .pipe(catchError(this.handleError));
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>('rest/user/add', user)
      .pipe(catchError(this.handleError));
  }
  isUserRoleAdmin(): boolean {
    const helper = new JwtHelperService();
    const token = localStorage.getItem('token');
    if (token == null || helper.isTokenExpired(token)) {
      this.logout();
      return false;
    }
    const role =  helper.decodeToken(token).role[0].authority;
    return role === 'ADMIN';
  }

  saveUserInLocalStorage(token: string) {
    const tokenDecoded = new JwtHelperService().decodeToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('userId', tokenDecoded.userId);
    localStorage.setItem('username', tokenDecoded.username);
  }
  setLoginDetails(token: string): void {
    const tokenDecoded = new JwtHelperService().decodeToken(token);
    AppData.userId = +tokenDecoded.userId;
    AppData.username = tokenDecoded.username;
    AppData.role = tokenDecoded.role[0].authority;
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
  }

  forgetPassword(email: string): Observable<any> {
    const data = new FormData();
    data.append('email', email);
    return this.http.post<any>( 'rest/user/forget-password', data);
  }


  private handleError(errorResponse: HttpErrorResponse): Observable<any> {
    console.error('An error occurred', errorResponse);
    return throwError(errorResponse.error);
  }


}
