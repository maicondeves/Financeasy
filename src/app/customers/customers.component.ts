import { CepService } from './../shared/services/cep.service';
import { Customer } from './models/customer';
import { CustomerPost } from './models/customer-post';
import { CustomerPut } from './models/customer-put';
import { ResponseModel } from './../utils/response-model';
import { CustomerList } from './models/customer-list';
import { CustomersService } from './services/customers.service';
import { Component, OnInit } from '@angular/core';
import { MzToastService } from 'ng2-materialize';
import { CepDto } from '../shared/models/cep-dto';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers: CustomerList[];
  customer: Customer = {
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
    private cepService: CepService,
    private toaster: MzToastService
  ) {}

  ngOnInit() {
    this.customers = this.getAll();
  }

  limpaTela() {
    this.customer = {
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
  }

  getCep() {
    this.cepService.getCep(this.customer.CEP).subscribe(
      (data: CepDto) => {
        this.customer.CEP = data.cep;
        this.customer.StreetAddress = data.logradouro;
        this.customer.Complement = data.complemento;
        this.customer.District = data.bairro;
        this.customer.City = data.localidade;
        this.customer.State = data.uf;
      }
    );
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
    this.customer = this.getById(customerId);
  }

  onSubmitEditForm() {
    // Validações do front-end
    let formIsValid: Boolean = true;

    if (this.IsNullOrWhiteSpace(this.customer.Name)) {
      this.toaster.show('Nome inválido.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.Name.length < 2 || this.customer.Name.length > 30) {
      this.toaster.show('Nome deve conter no mínimo 2 caracteres e no máximo 30.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.Email.length > 200) {
      this.toaster.show('Email deve conter no máximo 200 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.RG.length > 14) {
      this.toaster.show('RG deve conter no máximo 14 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.CPF.length > 14) {
      this.toaster.show('CPF deve conter no máximo 14 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.CNPJ.length > 18) {
      this.toaster.show('CNPJ deve conter no máximo 14 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.HomePhone.length > 15) {
      this.toaster.show('Telefones devem conter no máximo 15 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.CellPhone.length > 15) {
      this.toaster.show('Telefones devem conter no máximo 15 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.CommercialPhone.length > 15) {
      this.toaster.show('Telefones devem conter no máximo 15 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.CEP.length > 14) {
      this.toaster.show('CEP devem conter no máximo 14 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.StreetAddress.length > 50) {
      this.toaster.show('Endereço devem conter no máximo 50 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.Complement.length > 20) {
      this.toaster.show('Complemento devem conter no máximo 20 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.District.length > 50) {
      this.toaster.show('Bairro devem conter no máximo 50 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.City.length > 50) {
      this.toaster.show('Cidade devem conter no máximo 50 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (formIsValid) {
      this.edit(this.customer);
      this.limpaTela();
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
            this.toaster.show('Houve um erro ao atualizar o registro.', 4000, 'toast-danger');
          } else {
            this.toaster.show(data.Content, 4000, 'toast-danger');
          }
        }
      },
      () => {
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
            if (data.StatusCode === 500) {
              this.toaster.show('Houve um erro ao deletar o registro.', 4000, 'toast-danger');
            } else {
              this.toaster.show(data.Content, 4000, 'toast-danger');
            }
          }
        },
        () => {
          this.toaster.show('Houve um erro ao conectar com o servidor.', 4000, 'toast-danger');
        }
      );
      this.deleteId = 0;
    }
  }

  onSubmitAddForm() {
    // Validações do front-end
    let formIsValid: Boolean = true;

    if (this.IsNullOrWhiteSpace(this.customer.Name)) {
      this.toaster.show('Nome inválido.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.Name.length < 2 || this.customer.Name.length > 30) {
      this.toaster.show('Nome deve conter no mínimo 2 caracteres e no máximo 30.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.Email.length > 200) {
      this.toaster.show('Email deve conter no máximo 200 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.RG.length > 14) {
      this.toaster.show('RG deve conter no máximo 14 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.CPF.length > 14) {
      this.toaster.show('CPF deve conter no máximo 14 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.CNPJ.length > 18) {
      this.toaster.show('CNPJ deve conter no máximo 14 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.HomePhone.length > 15) {
      this.toaster.show('Telefones devem conter no máximo 15 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.CellPhone.length > 15) {
      this.toaster.show('Telefones devem conter no máximo 15 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.CommercialPhone.length > 15) {
      this.toaster.show('Telefones devem conter no máximo 15 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.CEP.length > 14) {
      this.toaster.show('CEP devem conter no máximo 14 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.StreetAddress.length > 50) {
      this.toaster.show('Endereço devem conter no máximo 50 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.Complement.length > 20) {
      this.toaster.show('Complemento devem conter no máximo 20 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.District.length > 50) {
      this.toaster.show('Bairro devem conter no máximo 50 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.customer.City.length > 50) {
      this.toaster.show('Cidade devem conter no máximo 50 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (formIsValid) {
      this.insert(this.customer);
      this.limpaTela();
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
            this.toaster.show('Houve um erro ao inserir o registro.', 4000, 'toast-danger');
          } else {
            this.toaster.show(data.Content, 4000, 'toast-danger');
          }
        }
      },
      () => {
        this.toaster.show('Houve um erro ao conectar com o servidor.', 4000, 'toast-danger');
      }
    );
  }

  IsNullOrWhiteSpace(str) {
    return str === null || str.match(/^ *$/) !== null;
  }
}
