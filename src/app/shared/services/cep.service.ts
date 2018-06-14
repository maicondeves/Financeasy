import { HttpErrorResponse } from '@angular/common/http';
import { CepDto } from './../models/cep-dto';
import { HttpClient } from '@angular/common/http';
import { Cep } from './../models/cep';
import { Injectable } from '@angular/core';

@Injectable()
export class CepService {
  private readonly rootUrl = 'http://viacep.com.br';
  constructor(
    private http: HttpClient
  ) { }

  getCep(cepString: String) {
    return this.http.get(this.rootUrl + `/ws/${ cepString.toString().trim() }/json`);
  }
}
