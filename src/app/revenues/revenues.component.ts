import { RevenuePost } from './models/revenue-post';
import { RevenuePut } from './models/revenue-put';
import { RevenueList } from './models/revenue-list';
import { CategoryList } from './../categories/models/category-list';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { MzToastService } from 'ng2-materialize';
import { RevenueService } from './services/revenue.service';
import { Revenue } from './models/revenue';
import { RevenueStatus } from './models/revenue-status';
import { ResponseModel } from '../utils/response-model';

@Component({
  selector: 'app-revenues',
  templateUrl: './revenues.component.html',
  styleUrls: ['./revenues.component.css']
})
export class RevenuesComponent implements OnInit, OnChanges {
  @Input() projectId: Number;
  @Input() monthWork: Number;
  @Input() yearWork: Number;

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

  status: RevenueStatus[] = [
    { Id: 1, Description: "Em Aberto", Color: "red" },
    { Id: 2, Description: "Recebido", Color: "green" }
  ];

  revenueCategories: CategoryList[] = [];
  revenues: RevenueList[] = [];
  revenue: Revenue = {
    Id: 0,
    Description: '',
    Status: null,
    ReceivableAmount: null,
    ReceivedAmount: null,
    ReceivedDate: null,
    MonthPeriod: null,
    YearPeriod: null,
    ProjectId: null,
    CategoryId: null
  };

  deleteId: Number;

  constructor(
    private revenueService: RevenueService,
    private toaster: MzToastService
  ) { }

  ngOnInit() {
    this.revenues = this.getAll();
    this.revenueCategories = this.getCategories();
  }

  ngOnChanges() {
    this.revenues = this.getAll();
    this.revenueCategories = this.getCategories();
  }

  limpaTela() {
    this.revenue = {
      Id: 0,
      Description: '',
      Status: null,
      ReceivableAmount: null,
      ReceivedAmount: null,
      ReceivedDate: null,
      MonthPeriod: null,
      YearPeriod: null,
      ProjectId: null,
      CategoryId: null
    };
  }

  getById(id: Number) {
    return this.revenueService.getById(id);
  }

  getAll() {
    return this.revenueService.getAll(this.projectId, this.monthWork, this.yearWork);
  }

  getCategories() {
    return this.revenueService.getAllByType('revenue');
  }

  getStatusDescription(statusId: Number): string {
    return this.status.find(x => x.Id === statusId).Description.toString();
  }

  getStatusColor(statusId: Number): string {
    return this.status.find(x => x.Id === statusId).Color.toString();
  }

  copyValue() {
    this.revenue.ReceivedAmount = this.revenue.ReceivableAmount;
  }

  onSubmitAddForm() {
    let formIsValid: Boolean = true;

    if (this.IsNullOrWhiteSpace(this.revenue.Description)) {
      this.toaster.show('Descrição inválida.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.revenue.Description.length < 2 || this.revenue.Description.length > 30) {
      this.toaster.show('Descrição deve conter no mínimo 2 caracteres e no máximo 30.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.revenue.CategoryId == null || this.revenue.CategoryId === 0) {
      this.toaster.show('Selecione uma categoria para a despesa.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.revenue.ReceivableAmount == null || +this.revenue.ReceivableAmount === 0) {
      this.toaster.show('Valor inválido.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.revenue.ReceivedDate != null && this.revenue.ReceivedAmount > 0) {
      this.revenue.Status = 2; // Recebido
    } else {
      this.revenue.Status = 1; // Em aberto.
    }

    if (formIsValid) {
      this.revenue.ProjectId = this.projectId;
      this.revenue.MonthPeriod = this.monthWork;
      this.revenue.YearPeriod = this.yearWork;
      this.insert(this.revenue);
      this.limpaTela();
    }
  }

  insert(revenuePost: RevenuePost) {
    this.revenueService.insert(revenuePost).subscribe(
      (data: ResponseModel) => {
        if (data.StatusCode === 200) {
          this.revenues = this.getAll();
          this.toaster.show(data.Content, 4000, 'toast-success');
        } else {
          if (data.StatusCode === 500) {
            this.toaster.show('Houve um erro ao tentar inserir o registro.', 4000, 'toast-danger');
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

  editRevenue(id: Number) {
    this.revenue.ProjectId = this.projectId;
    this.revenue = this.getById(id);
  }

  onSubmitEditForm() {
    let formIsValid: Boolean = true;

    if (this.IsNullOrWhiteSpace(this.revenue.Description)) {
      this.toaster.show('Descrição inválida.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.revenue.Description.length < 2 || this.revenue.Description.length > 30) {
      this.toaster.show('Descrição deve conter no mínimo 2 caracteres e no máximo 30.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.revenue.CategoryId == null || this.revenue.CategoryId === 0) {
      this.toaster.show('Selecione uma categoria para a despesa.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.revenue.ReceivableAmount == null || +this.revenue.ReceivableAmount === 0) {
      this.toaster.show('Valor inválido.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.revenue.ReceivedDate != null && this.revenue.ReceivedAmount > 0) {
      this.revenue.Status = 2; // Recebido
    } else {
      this.revenue.Status = 1; // Em aberto.
    }

    if (formIsValid) {
      this.revenue.MonthPeriod = this.monthWork;
      this.revenue.YearPeriod = this.yearWork;
      this.edit(this.revenue);
      this.limpaTela();
    }
  }

  edit(revenuePut: RevenuePut) {
    this.revenueService.update(revenuePut).subscribe(
      (data: ResponseModel) => {
        if (data.StatusCode === 200) {
          this.revenues = this.getAll();
          this.toaster.show(data.Content, 4000, 'toast-success');
        } else {
          if (data.StatusCode === 500) {
            this.toaster.show('Houve um erro ao tentar alterar o registro.', 4000, 'toast-danger');
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

  deleteRevenue(revenueId: Number) {
    this.deleteId = revenueId;
  }

  delete() {
    if (this.deleteId > 0) {
      this.revenueService.delete(this.deleteId).subscribe(
        (data: ResponseModel) => {
          if (data.StatusCode === 200) {
            this.revenues = this.getAll();
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

  IsNullOrWhiteSpace(str) {
    return str === null || str.match(/^ *$/) !== null;
  }
}
