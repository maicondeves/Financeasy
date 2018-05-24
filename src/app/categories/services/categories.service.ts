import { CategoryPost } from './../models/category-post';
import { CategoryPut } from './../models/category-put';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class CategoriesService {
  private readonly rootUrl = 'http://api.financeasy.com.br';
  constructor(
    private http: HttpClient
  ) { }


  getAll() {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    return this.http.get(this.rootUrl + '/categories', {headers : reqHeaders});
  }

  getById(id: Number) {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    return this.http.get(this.rootUrl + '/categories/' + id.toString(), {headers : reqHeaders});
  }

  delete(id: Number) {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    return this.http.delete(this.rootUrl + '/categories/' + id.toString(), {headers : reqHeaders});
  }

  update(categoryPut: CategoryPut) {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    return this.http.put(this.rootUrl + '/categories/' + categoryPut.Id.toString(), categoryPut, {headers : reqHeaders});
  }

  insert(categoryPost: CategoryPost) {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    return this.http.post(this.rootUrl + '/categories/', categoryPost, {headers : reqHeaders});
  }
}
