import { Component, OnInit, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  modalContato = new EventEmitter<string|MaterializeAction>();
  anoAtual: Number = new Date().getFullYear();
  constructor() { }

  ngOnInit() {

  }

  /* Modal Adicionar Categoria */
  openModal() {
    this.modalContato.emit({action: 'modal', params: ['open']});
  }

  closeModal() {
    this.modalContato.emit({action: 'modal', params: ['close']});
  }

}
