import { MaterializeAction } from 'angular2-materialize';
import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  /* Modal Adicionar Categoria */
  novaCategoria = new EventEmitter<string|MaterializeAction>();
  openModal() {
    this.novaCategoria.emit({action: 'modal', params: ['open']});
  }

  closeModal() {
    this.novaCategoria.emit({action: 'modal', params: ['close']});
  }

  /* Modal Editar Categoria */
  editarCategoria = new EventEmitter<string|MaterializeAction>();
  openModal2() {
    this.editarCategoria.emit({action: 'modal', params: ['open']});
  }

  closeModal2() {
    this.editarCategoria.emit({action: 'modal', params: ['close']});
  }

  /* Modal Remover Categoria */
  deletarCategoria = new EventEmitter<string|MaterializeAction>();
  openModal3() {
    this.deletarCategoria.emit({action: 'modal', params: ['open']});
  }

  closeModal3() {
    this.deletarCategoria.emit({action: 'modal', params: ['close']});
  }
}
