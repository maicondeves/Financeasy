import { Router } from '@angular/router';
import { CepDto } from './../shared/models/cep-dto';
import { Cep } from './../shared/models/cep';
import { CepService } from './../shared/services/cep.service';
import { CategoriesService } from './../categories/services/categories.service';
import { CategoryList } from './../categories/models/category-list';
import { CustomerList } from './../customers/models/customer-list';
import { CustomersService } from './../customers/services/customers.service';
import { ProjectsService } from './services/projects.service';
import { ProjectList } from './models/project-list';
import { Component, OnInit } from '@angular/core';
import { MzToastService } from 'ng2-materialize';
import { Project } from './models/project';
import { ProjectPut } from './models/project-put';
import { ResponseModel } from '../utils/response-model';
import { ProjectPost } from './models/project-post';
import { ProjectStatus } from './models/project-status';
import { debug } from 'util';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  public DatePickerTraducaoBr: Pickadate.DateOptions = {
    format: 'dd/mm/yyyy',
    formatSubmit: 'yyyy/mm/dd',
    firstDay: 0,
    showMonthsShort: false,
    showWeekdaysFull: false,
    closeOnClear: false,
    closeOnSelect: true,
    selectMonths: true,
    selectYears: 10,
    clear: 'Limpar',
    close: 'Fechar',
    today: 'Hoje',
    monthsFull: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    weekdaysFull: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
    weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    weekdaysLetter: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
  };

  status: ProjectStatus[] = [
    { Id: 1, Description: 'Aguardando Início'},
    { Id: 2, Description: 'Em Andamento'},
    { Id: 3, Description: 'Concluído'}
  ];

  customers: CustomerList[] = [];
  categories: CategoryList[] = [];
  projects: ProjectList[] = [];

  project: Project = {
    Id: 0,
    Name: '',
    Description: '',
    Status: null,
    ConclusionDate: null,
    StartDate: null,
    CategoryId: null,
    CustomerId: null,
    CEP: '',
    StreetAddress: '',
    Complement: '',
    District: '',
    City: '',
    State: ''
  };

  deleteId: Number;

  cep = new Cep();

  constructor(
    private projectsService: ProjectsService,
    private customersService: CustomersService,
    private categoriesService: CategoriesService,
    private cepService: CepService,
    private router: Router,
    private toaster: MzToastService
  ) { }

  ngOnInit() {
    this.projects = this.getAll();
    this.customers = this.getCustomers();
    this.categories = this.getCategories();
  }

  getCep() {
    this.cepService.getCep(this.project.CEP).subscribe(
      (data: CepDto) => {
        this.project.CEP = data.cep;
        this.project.StreetAddress = data.logradouro;
        this.project.Complement = data.complemento;
        this.project.District = data.bairro;
        this.project.City = data.localidade;
        this.project.State = data.uf;
      }
    );
  }

  getAll(): ProjectList[] {
    return this.projectsService.getAll();
  }

  getById(projectId: Number): Project {
    return this.projectsService.getById(projectId);
  }

  getCustomers() {
    return this.customersService.getAll();
  }

  getCategories() {
    return this.categoriesService.getAllByType('project');
  }

  limpaTela() {
    this.project = {
      Id: 0,
      Name: '',
      Description: '',
      Status: null,
      ConclusionDate: null,
      StartDate: null,
      CategoryId: null,
      CustomerId: null,
      CEP: '',
      StreetAddress: '',
      Complement: '',
      District: '',
      City: '',
      State: ''
    };
  }

  onSubmitAddForm() {
    // Validações do front-end
    let formIsValid: Boolean = true;
    if (this.IsNullOrWhiteSpace(this.project.Name)) {
      this.toaster.show('Nome inválido.', 4000, 'toast-danger');
      formIsValid = false;

    } else if (this.project.Name.length < 2 || this.project.Name.length > 30) {
        this.toaster.show('Nome deve conter no mínimo 2 caracteres e no máximo 30.', 4000, 'toast-danger');
        formIsValid = false;
    }

    if (this.project.CustomerId == null || this.project.CustomerId === 0) {
      this.toaster.show('Selecione um cliente para o projeto.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.project.CategoryId == null || this.project.CategoryId === 0) {
      this.toaster.show('Selecione uma categoria para o projeto.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.project.Status == null || this.project.Status === 0) {
      this.toaster.show('Selecione um status para o projeto.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.project.ConclusionDate != null && this.project.StartDate != null) {
      this.project.ConclusionDate = new Date(this.project.ConclusionDate);
      this.project.StartDate = new Date(this.project.StartDate);
      if (this.project.StartDate > this.project.ConclusionDate) {
        this.toaster.show('Data de Início do projeto não pode ser maior que a Data de Conclusão.', 4000, 'toast-danger');
        formIsValid = false;
      }
    }

    if (this.project.Description.length > 100) {
      this.toaster.show('Descrição deve possuir no máximo 100 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.project.CEP.length > 14) {
      this.toaster.show('CEP devem conter no máximo 14 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.project.StreetAddress.length > 50) {
      this.toaster.show('Endereço devem conter no máximo 50 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.project.Complement.length > 20) {
      this.toaster.show('Complemento devem conter no máximo 20 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.project.District.length > 50) {
      this.toaster.show('Bairro devem conter no máximo 50 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.project.City.length > 50) {
      this.toaster.show('Cidade devem conter no máximo 50 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (formIsValid) {
      this.insert(this.project);
      this.limpaTela();
    }
  }

  insert(projectPost: ProjectPost) {
    this.projectsService.insert(projectPost).subscribe(
      (data: ResponseModel) => {
        if (data.StatusCode === 200) {
          this.projects = this.getAll();
          this.toaster.show(data.Content, 4000, 'toast-success');
        } else {
          if (data.StatusCode === 500) {
            this.toaster.show(
              'Houve um erro ao conectar com o servidor.',
              4000,
              'toast-danger'
            );
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

  editProject(projectId: Number) {
    this.project = this.getById(projectId);
  }

  onSubmitEditForm() {
    // Validações do front-end
    let formIsValid: Boolean = true;

    if (this.IsNullOrWhiteSpace(this.project.Name)) {
      this.toaster.show('Nome inválido.', 4000, 'toast-danger');
      formIsValid = false;

    } else if (this.project.Name.length < 2 || this.project.Name.length > 30) {
        this.toaster.show('Nome deve conter no mínimo 2 caracteres e no máximo 30.', 4000, 'toast-danger');
        formIsValid = false;
    }

    if (this.project.CustomerId == null || this.project.CustomerId === 0) {
      this.toaster.show('Selecione um cliente para o projeto.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.project.CategoryId == null || this.project.CategoryId === 0) {
      this.toaster.show('Selecione uma categoria para o projeto.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.project.Status == null || this.project.Status === 0) {
      this.toaster.show('Selecione um status para o projeto.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.project.ConclusionDate != null && this.project.StartDate != null) {
      this.project.ConclusionDate = new Date(this.project.ConclusionDate);
      this.project.StartDate = new Date(this.project.StartDate);
      if (this.project.StartDate > this.project.ConclusionDate) {
        this.toaster.show('Data de Início do projeto não pode ser maior que a Data de Conclusão.', 4000, 'toast-danger');
        formIsValid = false;
      }
    }

    if (this.project.Description.length > 100) {
      this.toaster.show('Descrição deve possuir no máximo 100 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.project.CEP.length > 14) {
      this.toaster.show('CEP devem conter no máximo 14 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.project.StreetAddress.length > 50) {
      this.toaster.show('Endereço devem conter no máximo 50 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.project.Complement.length > 20) {
      this.toaster.show('Complemento devem conter no máximo 20 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.project.District.length > 50) {
      this.toaster.show('Bairro devem conter no máximo 50 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.project.City.length > 50) {
      this.toaster.show('Cidade devem conter no máximo 50 caracteres.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (formIsValid) {
      this.edit(this.project);
      this.limpaTela();
    }
  }

  edit(projectPut: ProjectPut) {
    this.projectsService.update(projectPut).subscribe(
      (data: ResponseModel) => {
        if (data.StatusCode === 200) {
          this.projects = this.getAll();
          this.toaster.show(data.Content, 4000, 'toast-success');
        } else {
          if (data.StatusCode === 500) {
            this.toaster.show(
              'Houve um erro ao conectar com o servidor.',
              4000,
              'toast-danger'
            );
          } else {
            this.toaster.show(data.Content, 4000, 'toast-danger');
          }
        }
      },
      () => {
        this.toaster.show('Houve um erro ao conectar com o servidor.', 4000, 'toast-error');
      }
    );
  }

  deleteProject(projectId: Number) {
    this.deleteId = projectId;
  }

  delete() {
    if (this.deleteId > 0) {
      this.projectsService.delete(this.deleteId).subscribe(
        (data: ResponseModel) => {
          if (data.StatusCode === 200) {
            this.projects = this.getAll();
            this.toaster.show(data.Content, 4000, 'toast-success');
          } else {
            this.toaster.show(data.Content, 4000, 'toast-danger');
          }
        },
        () => {
          this.toaster.show('Houve um erro ao conectar com o servidor.', 4000, 'toast-danger');
        }
      );
      this.deleteId = 0;
    }
  }

  detailProject(projectId: Number) {
    this.router.navigate(['/project-detail', projectId]);
  }

  IsNullOrWhiteSpace(str) {
    return str === null || str.match(/^ *$/) !== null;
  }
}
