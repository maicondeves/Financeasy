import { CustomerPost } from './../models/customer-post';
import { CustomerPut } from './../models/customer-put';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CustomerList } from './../models/customer-list';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class CustomersService {
  readonly rootUrl = 'http://api.financeasy.com.br';
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getAll() {
    const token = sessionStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    return this.http.get(this.rootUrl + '/customers', {headers : reqHeaders});
  }

  getById(id: Number) {
    const token = sessionStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    return this.http.get(this.rootUrl + '/customers/' + id.toString(), {headers : reqHeaders});
  }

  delete(id: Number) {
    const token = sessionStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    return this.http.delete(this.rootUrl + '/customers/' + id.toString(), {headers : reqHeaders});
  }

  update(customerPut: CustomerPut) {
    const token = sessionStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    return this.http.put(this.rootUrl + '/customers/' + customerPut.Id.toString(), customerPut, {headers : reqHeaders});
  }

  insert(customerPost: CustomerPost) {
    const token = sessionStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    return this.http.post(this.rootUrl + '/customers/', customerPost, {headers : reqHeaders});
  }

}
