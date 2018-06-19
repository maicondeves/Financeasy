import { ExpensePut } from './models/expense-put';
import { CategoriesService } from './../categories/services/categories.service';
import { MzToastService } from 'ng2-materialize';
import { ExpenseList } from './models/expense-list';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ExpenseService } from './services/expense.service';
import { Expense } from './models/expense';
import { ExpenseStatus } from './models/expense-status';
import { ResponseModel } from '../utils/response-model';
import { CategoryList } from '../categories/models/category-list';
import { ExpensePost } from './models/expense-post';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit, OnChanges {
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

  status: ExpenseStatus[] = [
    { Id: 1, Description: "Em Aberto", Color: "red" },
    { Id: 2, Description: "Pago", Color: "green" }
  ];

  expenseCategories: CategoryList[] = [];
  expenses: ExpenseList[] = [];
  expense: Expense = {
    Id: 0,
    Description: '',
    Status: null,
    ExpirationDate: null,
    Amount: null,
    PaymentAmount: null,
    PaymentDate: null,
    MonthPeriod: null,
    YearPeriod: null,
    ProjectId: null,
    CategoryId: null
  };

  deleteId: Number;

  constructor(
    private expenseService: ExpenseService,
    private toaster: MzToastService
  ) { }

  ngOnInit() {
    this.expenses = this.getAll();
    this.expenseCategories = this.getCategories();
  }

  ngOnChanges() {
    this.expenses = this.getAll();
    this.expenseCategories = this.getCategories();
  }

  limpaTela() {
    this.expense = {
      Id: 0,
      Description: '',
      Status: null,
      ExpirationDate: null,
      Amount: null,
      PaymentAmount: null,
      PaymentDate: null,
      MonthPeriod: null,
      YearPeriod: null,
      ProjectId: null,
      CategoryId: null
    };
  }

  getById(id: Number) {
    return this.expenseService.getById(id);
  }

  getAll() {
    return this.expenseService.getAll(this.projectId, this.monthWork, this.yearWork);
  }

  getCategories() {
    return this.expenseService.getAllByType('expense');
  }

  getStatusDescription(statusId: Number): string {
    return this.status.find(x => x.Id === statusId).Description.toString();
  }

  getStatusColor(statusId: Number): string {
    return this.status.find(x => x.Id === statusId).Color.toString();
  }

  copyValue() {
    this.expense.PaymentAmount = this.expense.Amount;
  }

  onSubmitAddForm() {
    let formIsValid: Boolean = true;

    if (this.IsNullOrWhiteSpace(this.expense.Description)) {
      this.toaster.show('Descrição inválida.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.expense.Description.length < 2 || this.expense.Description.length > 30) {
      this.toaster.show('Descrição deve conter no mínimo 2 caracteres e no máximo 30.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.expense.CategoryId == null || this.expense.CategoryId === 0) {
      this.toaster.show('Selecione uma categoria para a despesa.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.expense.ExpirationDate == null) {
      this.toaster.show('Data de Vencimento inválida.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.expense.Amount == null || +this.expense.Amount === 0) {
      this.toaster.show('Valor inválido.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.expense.PaymentDate != null && this.expense.PaymentAmount > 0) {
      this.expense.Status = 2; // Pago
    } else {
      this.expense.Status = 1; // Em aberto.
    }

    if (formIsValid) {
      this.expense.ProjectId = this.projectId;
      this.insert(this.expense);
      this.limpaTela();
    }
  }

  insert(expensePost: ExpensePost) {
    this.expenseService.insert(expensePost).subscribe(
      (data: ResponseModel) => {
        if (data.StatusCode === 200) {
          this.expenses = this.getAll();
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

  editExpense(id: Number) {
    this.expense = this.getById(id);
  }

  onSubmitEditForm() {
    let formIsValid: Boolean = true;

    if (this.IsNullOrWhiteSpace(this.expense.Description)) {
      this.toaster.show('Descrição inválida.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.expense.Description.length < 2 || this.expense.Description.length > 30) {
      this.toaster.show('Descrição deve conter no mínimo 2 caracteres e no máximo 30.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.expense.CategoryId == null || this.expense.CategoryId === 0) {
      this.toaster.show('Selecione uma categoria para a despesa.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.expense.ExpirationDate == null) {
      this.toaster.show('Data de Vencimento inválida.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.expense.Amount == null || +this.expense.Amount === 0) {
      this.toaster.show('Valor inválido.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.expense.PaymentDate != null && this.expense.PaymentAmount > 0) {
      this.expense.Status = 2; // Pago
    } else {
      this.expense.Status = 1; // Em aberto.
    }

    if (formIsValid) {
      this.expense.ProjectId = this.projectId;
      this.edit(this.expense);
      this.limpaTela();
    }
  }

  edit(expensePut: ExpensePut) {
    this.expenseService.update(expensePut).subscribe(
      (data: ResponseModel) => {
        if (data.StatusCode === 200) {
          this.expenses = this.getAll();
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

  deleteExpense(expenseId: Number) {
    this.deleteId = expenseId;
  }

  delete() {
    if (this.deleteId > 0) {
      this.expenseService.delete(this.deleteId).subscribe(
        (data: ResponseModel) => {
          if (data.StatusCode === 200) {
            this.expenses = this.getAll();
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
