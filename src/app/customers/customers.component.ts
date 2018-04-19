import {Component, OnInit, EventEmitter} from '@angular/core';
import {MaterializeAction} from 'angular2-materialize';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  novaCliente = new EventEmitter<string|MaterializeAction>();
  editarCliente = new EventEmitter<string|MaterializeAction>();
  deletarCliente = new EventEmitter<string|MaterializeAction>();
  constructor() { }

  ngOnInit() {
  }

  /* Modal Adicionar Cliente */
  openModal() {
    this.novaCliente.emit({action: 'modal', params: ['open']});
  }

  closeModal() {
    this.novaCliente.emit({action: 'modal', params: ['close']});
  }

  /* Modal Editar Cliente */
  openModal2() {
    this.editarCliente.emit({action: 'modal', params: ['open']});
  }

  closeModal2() {
    this.editarCliente.emit({action: 'modal', params: ['close']});
  }

  /* Modal Remover Cliente */
  openModal3() {
    this.deletarCliente.emit({action: 'modal', params: ['open']});
  }

  closeModal3() {
    this.deletarCliente.emit({action: 'modal', params: ['close']});
  }
}
