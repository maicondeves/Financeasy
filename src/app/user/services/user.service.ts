import { Router } from '@angular/router';
import { UserEditProfile } from './../models/user-edit-profile';
import { ResponseModel } from './../../utils/response-model';
import { HttpClient } from '@angular/common/http';
import { UserAuthenticate } from './../models/user-authenticate';
import { UserRegister } from './../models/user-register';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';


@Injectable()
export class UserService {

  mostrarMenuEmitter = new EventEmitter<boolean>();

  readonly rootUrl = 'http://api.financeasy.com.br';
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  isLoggedIn() {
    if (localStorage.getItem('token') != null) {
      this.mostrarMenuEmitter.emit(true);
      return true;
    } else {
      this.mostrarMenuEmitter.emit(false);
      return false;
    }
  }

  updateToken(user: UserAuthenticate) {
    let userToken = localStorage.getItem('token');
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
    localStorage.removeItem('token');
    localStorage.setItem('token', userToken);
  }

  createToken(user: UserAuthenticate) {
    const userToken = btoa(user.Email + ':' + user.Password);
    localStorage.removeItem('token');
    localStorage.setItem('token', userToken);
    this.mostrarMenuEmitter.emit(true);
    this.router.navigate(['/home']);
  }

  logout() {
    localStorage.removeItem('token');
    this.mostrarMenuEmitter.emit(false);
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
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    return this.http.put(this.rootUrl + '/accounts/profile', user, { headers : reqHeaders});
  }

  getName() {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    return this.http.get(this.rootUrl + '/accounts/profile/name', { headers : reqHeaders});
  }

  getProfile() {
    const token = localStorage.getItem('token');
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
