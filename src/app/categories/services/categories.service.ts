import { CategoryList } from './../models/category-list';
import { CategoryType } from './../models/category-type';
import { CategoryPost } from './../models/category-post';
import { CategoryPut } from './../models/category-put';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseModel } from '../../utils/response-model';

@Injectable()
export class CategoriesService {
  private readonly rootUrl = 'http://api.financeasy.com.br';

  private categoriesList: CategoryList[] = [];

  private types: CategoryType[] = [{
    Id: 1,
    Description: 'Projeto'
  },
  {
    Id: 2,
    Description: 'Receita'
  },
  {
    Id: 3,
    Description: 'Despesa'
  }];

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

  getAllByType(type: String) {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    this.http.get(this.rootUrl + '/categories/types/' + type.toString(), {headers : reqHeaders}).subscribe(
      (data: ResponseModel) => {
        if (data.StatusCode === 200) {
          Object.assign(this.categoriesList, data.Content);
        }
      }
    );
    return this.categoriesList;
  }

  getTypes(): CategoryType[] {
    return this.types;
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
