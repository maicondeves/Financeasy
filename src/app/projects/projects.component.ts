import { CustomerList } from './../customers/models/customer-list';
import { CustomersService } from './../customers/services/customers.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectsService } from './services/projects.service';
import { ProjectList } from './models/project-list';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { MzToastService } from 'ng2-materialize';
import { Project } from './models/project';
import { ProjectPut } from './models/project-put';
import { ResponseModel } from '../utils/response-model';
import { ProjectPost } from './models/project-post';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  customers: CustomerList[] = [];
  projects: ProjectList[] = [];
  projectDetail: Project = {
    Id: 0,
    Name: ' ',
    Description: ' ',
    ProjectStatus: 0,
    ConclusionDate: new Date(),
    StartDate: new Date(),
    CategoryId: 0,
    CustomerId: 0,
    CEP: ' ',
    StreetAddress: ' ',
    Complement: ' ',
    District: ' ',
    City: ' ',
    State: ' '
  };

  deleteId: Number;

  constructor(
    private projectsService: ProjectsService,
    private customersService: CustomersService,
    private toaster: MzToastService
  ) { }

  ngOnInit() {
    this.projects = this.getAll();
    this.customers = this.getCustomers();
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

  onSubmitAddForm(
    name: String,
    descritption: String,
    projectStatus: Number,
    startDate: Date,
    conclusionDate: Date,
    categoryId: Number,
    customerId: Number,
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
      const projectPost: ProjectPost = {
        Name: name,
        Description: descritption,
        ProjectStatus: projectStatus,
        StartDate: startDate,
        ConclusionDate: conclusionDate,
        CategoryId: categoryId,
        CustomerId: customerId,
        CEP: cep,
        StreetAddress: streetAddress,
        Complement: complement,
        District: district,
        City: city,
        State: state
      };

      this.insert(projectPost);
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

  editProject(projectId: Number) {
    this.projectDetail = this.getById(projectId);
  }

  onSubmitEditForm(
    id: Number,
    name: String,
    descritption: String,
    projectStatus: Number,
    startDate: Date,
    conclusionDate: Date,
    categoryId: Number,
    customerId: Number,
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
      this.projectDetail.Name = '';
      formIsValid = false;
      return;
    }

    if (name.length < 2 || name.length > 30) {
      this.toaster.show('Nome deve conter no mínimo 2 caracteres e no máximo 30.', 4000, 'toast-danger');
      this.projectDetail.Name = '';
      formIsValid = false;
      return;
    }

    if (formIsValid) {
      const projectPut: ProjectPut = {
        Id: id,
        Name: name,
        Description: descritption,
        ProjectStatus: projectStatus,
        StartDate: startDate,
        ConclusionDate: conclusionDate,
        CategoryId: categoryId,
        CustomerId: customerId,
        CEP: cep,
        StreetAddress: streetAddress,
        Complement: complement,
        District: district,
        City: city,
        State: state
      };

      this.edit(projectPut);
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
            this.toaster.show('Houve um erro ao conectar com o servidor.', 4000, 'toast-danger');
          } else {
            this.toaster.show(data.Content, 4000, 'toast-danger');
          }
        }
      },
      (err: HttpErrorResponse) => {
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
        (err: HttpErrorResponse) => {
          this.toaster.show('Houve um erro ao conectar com o servidor.', 4000, 'toast-danger');
        }
      );
      this.deleteId = 0;
    }
  }

  IsNullOrWhiteSpace(str) {
    return str === null || str.match(/^ *$/) !== null;
  }
}
