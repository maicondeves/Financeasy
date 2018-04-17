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
  constructor(private http: HttpClient) { }

  isLogged() {
    if (sessionStorage.getItem('token') == null) {
      return true;
    } else {
      return true;
    }
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

  getProfile() {
    const token = sessionStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    return this.http.get(this.rootUrl + '/accounts/profile', { headers : reqHeaders});
  }

}
