import { HttpErrorResponse } from '@angular/common/http';
import { Customer } from './models/customer';
import { CustomerPost } from './models/customer-post';
import { CustomerPut } from './models/customer-put';
import { ResponseModel } from './../utils/response-model';
import { CustomerList } from './models/customer-list';
import { CustomersService } from './services/customers.service';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { createUrlResolverWithoutPackagePrefix } from '@angular/compiler';
import { debug } from 'util';
import { MzToastService } from 'ng2-materialize';
import { Mask } from '@fagnerlima/ng-mask';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers: CustomerList[];
  customerDetail: Customer = {
    Id: 0,
    Name: ' ',
    RG: ' ',
    CPF: ' ',
    CNPJ: ' ',
    Email: ' ',
    HomePhone: ' ',
    CommercialPhone: ' ',
    CellPhone: ' ',
    CEP: ' ',
    StreetAddress: ' ',
    Complement: ' ',
    District: ' ',
    City: ' ',
    State: ' '
  };

  deleteId: Number = 0;

  constructor(
    private customersService: CustomersService,
    private toaster: MzToastService
  ) {}

  ngOnInit() {
    this.customers = this.getAll();
  }

  getAll(): CustomerList[] {
    return this.customersService.getAll();
  }

  getById(customerId: Number): Customer {
    const customer = new Customer();
    this.customersService
      .getById(customerId)
      .subscribe((data: ResponseModel) => {
        if (data.StatusCode === 200) {
          Object.assign(customer, data.Content);
        }
      });
    return customer;
  }

  editCustomer(customerId: Number) {
    this.customerDetail = this.getById(customerId);
  }

  onSubmitEditForm(
    id: Number,
    name: String,
    rg: String,
    cpf: String,
    cnpj: String,
    email: String,
    homePhone: String,
    commercialPhone: String,
    cellPhone: String,
    cep: String,
    streetAddress: String,
    complement: String,
    district: String,
    city: String,
    state: String
  ) {
    // Validações do front-end
    let formIsValid: Boolean = true;

    if (this.IsNullOrWhiteSpace(name)) {
      this.toaster.show('Nome inválido.', 4000, 'toast-danger');
      this.customerDetail.Name = '';
      formIsValid = false;
      return;
    }

    if (name.length < 2 || name.length > 30) {
      this.toaster.show('Nome deve conter no mínimo 2 caracteres e no máximo 30.', 4000, 'toast-danger');
      this.customerDetail.Name = '';
      formIsValid = false;
      return;
    }

    if (formIsValid) {
      const customerPut: CustomerPut = {
        Id: id,
        Name: name,
        RG: rg,
        CPF: cpf,
        CNPJ: cnpj,
        Email: '',
        HomePhone: homePhone,
        CommercialPhone: commercialPhone,
        CellPhone: cellPhone,
        CEP: cep,
        StreetAddress: streetAddress,
        Complement: complement,
        District: district,
        City: city,
        State: state
      };

      this.edit(customerPut);
    }
  }

  edit(customerPut: CustomerPut) {
    this.customersService.update(customerPut).subscribe(
      (data: ResponseModel) => {
        if (data.StatusCode === 200) {
          this.customers = this.getAll();
          this.toaster.show(data.Content, 4000, 'toast-success');
        } else {
          if (data.StatusCode === 500) {
            this.toaster.show('Houve um erro ao conectar com o servidor.', 4000, 'toast-danger');
          } else {
            this.toaster.show(data.Content, 4000, 'toast-danger');
          }
        }
      },
      (err: HttpErrorResponse) => {
        this.toaster.show('Houve um erro ao conectar com o servidor.', 4000, 'toast-danger');
      }
    );
  }

  deleteCustomer(customerId: Number) {
    this.deleteId = customerId;
  }

  delete() {
    if (this.deleteId > 0) {
      this.customersService.delete(this.deleteId).subscribe(
        (data: ResponseModel) => {
          if (data.StatusCode === 200) {
            this.customers = this.getAll();
            this.toaster.show(data.Content, 4000, 'toast-success');
          } else {
            this.toaster.show(data.Content, 4000, 'toast-danger');
          }
        },
        (err: HttpErrorResponse) => {
          this.toaster.show('Houve um erro ao conectar com o servidor.', 4000, 'toast-danger');
        }
      );
      this.deleteId = 0;
    }
  }

  onSubmitAddForm(
    name: String,
    rg: String,
    cpf: String,
    cnpj: String,
    email: String,
    homePhone: String,
    commercialPhone: String,
    cellPhone: String,
    cep: String,
    streetAddress: String,
    complement: String,
    district: String,
    city: String,
    state: String
  ) {
    // Validações do front-end
    let formIsValid: Boolean = true;

    if (this.IsNullOrWhiteSpace(name)) {
      this.toaster.show('Nome inválido.', 4000, 'toast-danger');
      formIsValid = false;
      return;
    }

    if (name.length < 2 || name.length > 30) {
      this.toaster.show('Nome deve conter no mínimo 2 caracteres e no máximo 30.', 4000, 'toast-danger');
      formIsValid = false;
      return;
    }

    if (formIsValid) {
      const customerPost: CustomerPost = {
        Name: name,
        RG: rg,
        CPF: cpf,
        CNPJ: cnpj,
        Email: email,
        HomePhone: homePhone,
        CommercialPhone: commercialPhone,
        CellPhone: cellPhone,
        CEP: cep,
        StreetAddress: streetAddress,
        Complement: complement,
        District: district,
        City: city,
        State: state
      };

      this.insert(customerPost);
    }
  }

  insert(customerPost: CustomerPost) {
    this.customersService.insert(customerPost).subscribe(
      (data: ResponseModel) => {
        if (data.StatusCode === 200) {
          this.customers = this.getAll();
          this.toaster.show(data.Content, 4000, 'toast-success');
        } else {
          if (data.StatusCode === 500) {
            this.toaster.show('Houve um erro ao conectar com o servidor.', 4000, 'toast-danger');
          } else {
            this.toaster.show(data.Content, 4000, 'toast-danger');
          }
        }
      },
      (err: HttpErrorResponse) => {
        this.toaster.show('Houve um erro ao conectar com o servidor.', 4000, 'toast-danger');
      }
    );
  }

  IsNullOrWhiteSpace(str) {
    return str === null || str.match(/^ *$/) !== null;
  }
}
