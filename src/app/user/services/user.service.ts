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
    const body: UserRegister = user;

    const reqHeaders = new HttpHeaders({ 'Content-Type' : 'application/json' });
    return this.http.post(this.rootUrl + '/accounts/register', body, {headers : reqHeaders});
  }

  userAuthentication(email, password) {
    const body: UserAuthenticate = {
      email: email,
      password: password
    };

    const reqHeaders = new HttpHeaders({ 'Content-Type' : 'application/json' });
    return this.http.post(this.rootUrl + '/accounts/authenticate', body, { headers : reqHeaders});
  }

}
