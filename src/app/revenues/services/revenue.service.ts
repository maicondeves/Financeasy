import { CategoryList } from './../../categories/models/category-list';
import { MzToastService } from 'ng2-materialize';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Revenue } from '../models/revenue';
import { ResponseModel } from '../../utils/response-model';
import { RevenueList } from '../models/revenue-list';
import { RevenuePut } from '../models/revenue-put';
import { RevenuePost } from '../models/revenue-post';

@Injectable()
export class RevenueService {
  readonly rootUrl = 'http://api.financeasy.com.br';
  constructor(
    private http: HttpClient,
    private toaster: MzToastService
  ) { }

  getAllByType(type: String) {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });

    const categoriesList = new Array<CategoryList>();
    this.http.get(this.rootUrl + '/categories/types/' + type.toString(), {headers : reqHeaders}).subscribe(
      (data: ResponseModel) => {
        if (data.StatusCode === 200) {
          Object.assign(categoriesList, data.Content);
        }
      }
    );
    return categoriesList;
  }

  getById(id: Number): Revenue {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });

    const revenue = new Revenue();

    this.http.get(this.rootUrl + "/revenues/" + id.toString(), { headers: reqHeaders }).subscribe(
      (data: ResponseModel) => {
        if (data.StatusCode === 200) {
          Object.assign(revenue, data.Content);
        }
      }
    );

    return revenue;
  }

  getAll(projectId: Number, monthWork: Number, yearWork: Number): RevenueList[] {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });

    const revenues = new Array<RevenueList>();
    const filter = {
      ProjectId: projectId,
      MonthWork: monthWork,
      YearWork: yearWork
    };

    this.http.post(this.rootUrl + "/revenues/project", filter, {headers: reqHeaders}).subscribe(
      (data: ResponseModel) => {
        if (data.StatusCode === 200) {
          Object.assign(revenues, data.Content);
        } else {
          this.toaster.show('Ocorreu um erro ao tentar conectar com o servidor.', 4000, 'toast-danger');
        }
      },
      (err: HttpErrorResponse) => this.toaster.show('Ocorreu um erro ao tentar conectar com o servidor', 4000, 'toast-danger')
    );

    return revenues;
  }

  delete(id: Number) {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });

    return this.http.delete(this.rootUrl + "/revenues/" + id.toString(), { headers: reqHeaders } );
  }

  update(revenuePut: RevenuePut) {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });

    return this.http.put(this.rootUrl + "/revenues/" + revenuePut.Id.toString(), revenuePut, { headers: reqHeaders } );
  }

  insert(revenuePost: RevenuePost) {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });

    return this.http.post(this.rootUrl + "/revenues", revenuePost, { headers: reqHeaders } );
  }
}
