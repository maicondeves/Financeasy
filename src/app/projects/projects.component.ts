import { Component, OnInit, EventEmitter } from '@angular/core';
import {MaterializeAction} from 'angular2-materialize';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  novoProjeto = new EventEmitter<string|MaterializeAction>();
  editarProjeto = new EventEmitter<string|MaterializeAction>();
  deletarProjeto = new EventEmitter<string|MaterializeAction>();
  constructor() { }

  ngOnInit() {
  }

  /* Modal Adicionar Projeto */
  openModal() {
    this.novoProjeto.emit({action: 'modal', params: ['open']});
  }

  closeModal() {
    this.novoProjeto.emit({action: 'modal', params: ['close']});
  }

  /* Modal Editar Projeto */
  openModal2() {
    this.editarProjeto.emit({action: 'modal', params: ['open']});
  }

  closeModal2() {
    this.editarProjeto.emit({action: 'modal', params: ['close']});
  }

  /* Modal Remover Projeto */
  openModal3() {
    this.deletarProjeto.emit({action: 'modal', params: ['open']});
  }

  closeModal3() {
    this.deletarProjeto.emit({action: 'modal', params: ['close']});
  }
}
