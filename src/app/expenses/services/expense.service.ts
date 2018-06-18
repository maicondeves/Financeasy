import { MzToastService } from 'ng2-materialize';
import { ResponseModel } from './../../utils/response-model';
import { ExpenseList } from './../models/expense-list';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExpensePost } from '../models/expense-post';
import { ExpensePut } from '../models/expense-put';
import { Expense } from '../models/expense';
import { CategoryList } from '../../categories/models/category-list';

@Injectable()
export class ExpenseService {
  readonly rootUrl = 'http://api.financeasy.com.br';
  readonly rootUrlHomolog = 'http://localhost:60666';
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

  getById(id: Number): Expense {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });

    const expense = new Expense();

    this.http.get(this.rootUrl + "/expenses/" + id.toString(), { headers: reqHeaders }).subscribe(
      (data: ResponseModel) => {
        if (data.StatusCode === 200) {
          Object.assign(expense, data.Content);
        }
      }
    );

    return expense;
  }

  getAll(projectId: Number, monthWork: Number, yearWork: Number): ExpenseList[] {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });

    const expenses = new Array<ExpenseList>();
    const filter = {
      ProjectId: projectId,
      MonthWork: monthWork,
      YearWork: yearWork
    };

    this.http.post(this.rootUrl + "/expenses/project", filter, {headers: reqHeaders}).subscribe(
      (data: ResponseModel) => {
        if (data.StatusCode === 200) {
          Object.assign(expenses, data.Content);
        } else {
          this.toaster.show('Ocorreu um erro ao tentar conectar com o servidor', 4000, 'toast-danger');
        }
      },
      (err: HttpErrorResponse) => this.toaster.show('Ocorreu um erro ao tentar conectar com o servidor', 4000, 'toast-danger')
    );

    return expenses;
  }

  delete(id: Number) {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });

    return this.http.delete(this.rootUrl + "/expenses/" + id.toString(), { headers: reqHeaders } );
  }

  update(expensePut: ExpensePut) {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });

    return this.http.put(this.rootUrl + "/expenses/" + expensePut.Id.toString(), expensePut, { headers: reqHeaders } );
  }

  insert(expensePost: ExpensePost) {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });

    return this.http.post(this.rootUrl + "/expenses", expensePost, { headers: reqHeaders } );
  }
}
