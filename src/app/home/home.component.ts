import { NavBarComponent } from './../nav-bar/nav-bar.component';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  /* Modal Adicionar Receita */
  verReceita = new EventEmitter<string|MaterializeAction>();
  openModal() {
    this.verReceita.emit({action: 'modal', params: ['open']});
  }

  closeModal() {
    this.verReceita.emit({action: 'modal', params:['close']});
  }

  /* Modal ver Despesas */
  verDespesas = new EventEmitter<string|MaterializeAction>();
  openModal2() {
    this.verDespesas.emit({action: 'modal', params: ['open']});
  }

  closeModal2() {
    this.verDespesas.emit({action: 'modal', params: ['close']});
  }
  constructor() { }

  ngOnInit() {
  }
}
