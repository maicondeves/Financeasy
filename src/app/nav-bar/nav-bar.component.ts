import { HttpErrorResponse } from '@angular/common/http';
import { UserEditProfile } from './../user/models/user-edit-profile';
import { UserRegister } from './../user/models/user-register';
import { UserViewProfile } from './../user/models/user-view-profile';
import { ResponseModel } from './../utils/response-model';
import { UserService } from './../user/services/user.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, EventEmitter } from '@angular/core';
import {MaterializeAction} from 'angular2-materialize';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  isLoggedIn$: Boolean;
  userProfile: UserViewProfile = {
    Name: '',
    Email: '',
    RegisterDate: new Date(),
    UpdateDate: new Date()
  };
  editarPerfil = new EventEmitter<string|MaterializeAction>();
  constructor(
    private router: Router,
    private userService: UserService,
    private toaster: ToastrService
  ) { }

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    this.userService.getProfile().subscribe(
      (data: ResponseModel) => {
        this.userProfile = new UserViewProfile();
        Object.assign(this.userProfile, data.Content);
      });
  }

  /* Editar Perfil */
  openModal() {
    this.editarPerfil.emit({action: 'modal', params: ['open']});
  }

  closeModal() {
    this.editarPerfil.emit({action: 'modal', params: ['close']});
  }

  onSubmit(name, email, password, confirmPassword) {
    const userEditProfile: UserEditProfile = {
       Name: name,
       Email: email,
       Password: password,
       PasswordConfirm: confirmPassword
     };

     this.userService.userEditProfile(userEditProfile).subscribe(
       (data: ResponseModel) => {
          this.toaster.success(data.Content);
          this.closeModal();
       },
       (err: HttpErrorResponse) => {
          this.toaster.success(err.statusText);
       }
     );
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/signin']);
  }
}
