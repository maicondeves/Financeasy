import { ResponseModel } from './../../utils/response-model';
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

  getAll(): CustomerList[] {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });

    const customerList = new Array<CustomerList>();
    this.http.get(this.rootUrl + '/customers', {headers : reqHeaders}).subscribe(
      (data: ResponseModel) => {
        if (data.StatusCode === 200) {
          Object.assign(customerList, data.Content);
        }
      }
    );
    return customerList;
  }

  getById(id: Number) {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    return this.http.get(this.rootUrl + '/customers/' + id.toString(), {headers : reqHeaders});
  }

  delete(id: Number) {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    return this.http.delete(this.rootUrl + '/customers/' + id.toString(), {headers : reqHeaders});
  }

  update(customerPut: CustomerPut) {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    return this.http.put(this.rootUrl + '/customers/' + customerPut.Id.toString(), customerPut, {headers : reqHeaders});
  }

  insert(customerPost: CustomerPost) {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    return this.http.post(this.rootUrl + '/customers/', customerPost, {headers : reqHeaders});
  }

}
