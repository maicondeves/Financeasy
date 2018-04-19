import { MaterializeAction } from 'angular2-materialize';
import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  novaCategoria = new EventEmitter<string|MaterializeAction>();
  editarCategoria = new EventEmitter<string|MaterializeAction>();
  deletarCategoria = new EventEmitter<string|MaterializeAction>();
  constructor() { }

  ngOnInit() {
  }

  /* Modal Adicionar Categoria */
  openModal() {
    this.novaCategoria.emit({action: 'modal', params: ['open']});
  }

  closeModal() {
    this.novaCategoria.emit({action: 'modal', params: ['close']});
  }

  /* Modal Editar Categoria */
  openModal2() {
    this.editarCategoria.emit({action: 'modal', params: ['open']});
  }

  closeModal2() {
    this.editarCategoria.emit({action: 'modal', params: ['close']});
  }

  /* Modal Remover Categoria */
  openModal3() {
    this.deletarCategoria.emit({action: 'modal', params: ['open']});
  }

  closeModal3() {
    this.deletarCategoria.emit({action: 'modal', params: ['close']});
  }
}
