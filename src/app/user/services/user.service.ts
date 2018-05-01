import { Router } from '@angular/router';
import { UserEditProfile } from './../models/user-edit-profile';
import { ResponseModel } from './../../utils/response-model';
import { HttpClient } from '@angular/common/http';
import { UserAuthenticate } from './../models/user-authenticate';
import { UserRegister } from './../models/user-register';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';


@Injectable()
export class UserService {
  readonly rootUrl = 'http://api.financeasy.com.br';
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  isLogged() {
    if (sessionStorage.getItem('token') == null) {
      return true;
    } else {
      return true;
    }
  }

  updateToken(user: UserAuthenticate) {
    let userToken = sessionStorage.getItem('token');
    let authString = atob(userToken);
    const index = authString.indexOf(':', 1);
    let email = authString.substring(0, index);
    let password = authString.substring(index + 1, authString.length);

    if (user.Email !== email) {
      email = user.Email;
    }

    if (!this.IsNullOrWhiteSpace(user.Password) && user.Password !== password) {
      password = user.Password;
    }

    authString = email + ':' + password;
    userToken = btoa(authString);
    sessionStorage.removeItem('token');
    sessionStorage.setItem('token', userToken);
  }

  createToken(user: UserAuthenticate) {
    const userToken = btoa(user.Email + ':' + user.Password);
    sessionStorage.removeItem('token');
    sessionStorage.setItem('token', userToken);
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/signin']);
  }

  userRegister(user: UserRegister) {
    const reqHeaders = new HttpHeaders({ 'Content-Type' : 'application/json' });
    return this.http.post(this.rootUrl + '/accounts/register', user, {headers : reqHeaders});
  }

  userAuthentication(user: UserAuthenticate) {
    const reqHeaders = new HttpHeaders({ 'Content-Type' : 'application/json' });
    return this.http.post(this.rootUrl + '/accounts/authenticate', user, { headers : reqHeaders});
  }

  userEditProfile(user: UserEditProfile) {
    const token = sessionStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    return this.http.put(this.rootUrl + '/accounts/profile', user, { headers : reqHeaders});
  }

  getName() {
    const token = sessionStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    return this.http.get(this.rootUrl + '/accounts/profile/name', { headers : reqHeaders});
  }

  getProfile() {
    const token = sessionStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    return this.http.get(this.rootUrl + '/accounts/profile', { headers : reqHeaders});
  }

  IsNullOrWhiteSpace(str) {
    return str === null || str.match(/^ *$/) !== null;
  }
}
