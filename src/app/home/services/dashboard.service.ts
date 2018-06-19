import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class DashboardService {
  readonly rootUrl = 'http://api.financeasy.com.br';

  constructor(
    private http: HttpClient
  ) { }

  getDashboardData() {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });

    return this.http.get(this.rootUrl + "/dashboard", { headers: reqHeaders});
  }
}
