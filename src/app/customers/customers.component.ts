import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Customer } from './models/customer';
import { CustomerPost } from './models/customer-post';
import { CustomerPut } from './models/customer-put';
import { ResponseModel } from './../utils/response-model';
import { CustomerList } from './models/customer-list';
import { CustomersService } from './services/customers.service';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { createUrlResolverWithoutPackagePrefix } from '@angular/compiler';
import { debug } from 'util';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  novaCliente = new EventEmitter<string | MaterializeAction>();
  editarCliente = new EventEmitter<string | MaterializeAction>();
  deletarCliente = new EventEmitter<string | MaterializeAction>();

  customer: Customer;
  customers: CustomerList[];
  customerDetail: Customer = {
    Id: 0,
    Name: '',
    RG: '',
    CPF: '',
    CNPJ: '',
    Email: '',
    HomePhone: '',
    CommercialPhone: '',
    CellPhone: '',
    CEP: '',
    StreetAddress: '',
    Complement: '',
    District: '',
    City: '',
    State: ''
  };

  deleteId: Number;

  constructor(
    private customersService: CustomersService,
    private toaster: ToastrService
  ) {}

  ngOnInit() {
    this.customers = this.getAll();
  }

  getAll(): CustomerList[] {
    this.customers = new Array<CustomerList>();
    this.customersService.getAll().subscribe((data: ResponseModel) => {
      if (data.StatusCode === 200) {
        Object.assign(this.customers, data.Content);
      }
    });

    return this.customers;
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
    this.customer = this.customerDetail;
    return customer;
  }

  editCustomer(customerId: Number) {
    this.openModal2();
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
      this.toaster.error('Nome inválido.');
      this.customerDetail.Name = '';
      formIsValid = false;
      return;
    }

    if (name.length < 2 || name.length > 30) {
      this.toaster.error('Nome deve conter no mínimo 2 caracteres e no máximo 30.');
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
          this.toaster.success(data.Content);
        } else {
          if (data.StatusCode === 500) {
            this.toaster.error('Houve um erro ao conectar com o servidor.');
          } else {
            this.toaster.error(data.Content);
          }
        }
      },
      (err: HttpErrorResponse) => {
        this.toaster.error('Houve um erro ao conectar com o servidor.');
      }
    );

    this.closeModal2();
  }

  deleteCustomer(customerId: Number) {
    this.openModal3();
    this.deleteId = customerId;
  }

  delete() {
    if (this.deleteId > 0) {
      this.customersService.delete(this.deleteId).subscribe(
        (data: ResponseModel) => {
          if (data.StatusCode === 200) {
            this.customers = this.getAll();
            this.toaster.success(data.Content);
          } else {
            this.toaster.error(data.Content);
          }
        },
        (err: HttpErrorResponse) => {
          this.toaster.error('Houve um erro ao conectar com o servidor.');
        }
      );
    }

    this.closeModal3();
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
      this.toaster.error('Nome inválido.');
      this.customerDetail.Name = '';
      formIsValid = false;
      return;
    }

    if (name.length < 2 || name.length > 30) {
      this.toaster.error('Nome deve conter no mínimo 2 caracteres e no máximo 30.');
      this.customerDetail.Name = '';
      formIsValid = false;
      return;
    }

    if (formIsValid) {
      const customerPost: CustomerPost = {
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

      this.insert(customerPost);
    }
  }

   insert(customerPost: CustomerPost) {
    this.customersService.insert(customerPost).subscribe(
      (data: ResponseModel) => {
        if (data.StatusCode === 200) {
          this.customers = this.getAll();
          this.toaster.success(data.Content);
        } else {
          if (data.StatusCode === 500) {
            this.toaster.error('Houve um erro ao conectar com o servidor.');
          } else {
            this.toaster.error(data.Content);
          }
        }
      },
      (err: HttpErrorResponse) => {
        this.toaster.error('Houve um erro ao conectar com o servidor.');
      }
    );

    this.closeModal();
   }

  /* Modal Adicionar Cliente */
  openModal() {
    this.novaCliente.emit({ action: 'modal', params: ['open'] });
  }

  closeModal() {
    this.novaCliente.emit({ action: 'modal', params: ['close'] });
  }

  /* Modal Editar Cliente */
  openModal2() {
    this.editarCliente.emit({ action: 'modal', params: ['open'] });
  }

  closeModal2() {
    this.editarCliente.emit({ action: 'modal', params: ['close'] });
  }

  /* Modal Remover Cliente */
  openModal3() {
    this.deletarCliente.emit({ action: 'modal', params: ['open'] });
  }

  closeModal3() {
    this.deletarCliente.emit({ action: 'modal', params: ['close'] });
  }

  IsNullOrWhiteSpace(str) {
    return str === null || str.match(/^ *$/) !== null;
  }
}
