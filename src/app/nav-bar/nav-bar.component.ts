import { UserService } from './../user/services/user.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, EventEmitter } from '@angular/core';
import {MaterializeAction} from 'angular2-materialize';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  isLoggedIn$: Boolean;
  editarPerfil = new EventEmitter<string|MaterializeAction>();
  constructor(private router: Router) { }

  ngOnInit() {
  }

  /* Editar Perfil */

  openModal() {
    this.editarPerfil.emit({action: 'modal', params: ['open']});
  }

  closeModal() {
    this.editarPerfil.emit({action: 'modal', params: ['close']});
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/signin']);
  }
}
