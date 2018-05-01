import { UserAuthenticate } from './../user/models/user-authenticate';
import { HttpErrorResponse } from '@angular/common/http';
import { UserEditProfile } from './../user/models/user-edit-profile';
import { UserRegister } from './../user/models/user-register';
import { UserViewProfile } from './../user/models/user-view-profile';
import { ResponseModel } from './../utils/response-model';
import { UserService } from './../user/services/user.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  isLoggedIn$: Boolean;

  formName: String;
  formEmail: String;
  formPassword: String;
  formPasswordConfirm: String;

  userProfileName: String = '';

  userProfile: UserViewProfile = {
    Name: '',
    Email: '',
    RegisterDate: new Date(),
    UpdateDate: new Date()
  };

  editarPerfil = new EventEmitter<string | MaterializeAction>();
  constructor(
    private router: Router,
    private userService: UserService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.getName();
  }

  getName() {
    this.spinner.show();
    this.userService.getName().subscribe((data: ResponseModel) => {
      this.userProfileName = data.Content.substr(0, 20);
      this.spinner.hide();
    });
  }

  editProfile() {
    this.getProfile();
    this.openModalPerfil();
  }

  getProfile() {
    this.spinner.show();
    this.userService.getProfile().subscribe((data: ResponseModel) => {
      Object.assign(this.userProfile, data.Content);
      this.formName = this.userProfile.Name;
      this.formEmail = this.userProfile.Email;
      this.spinner.hide();
    });
  }

  /* Editar Perfil */
  openModalPerfil() {
    this.editarPerfil.emit({ action: 'modal', params: ['open'] });
  }

  closeModalPerfil() {
    this.editarPerfil.emit({ action: 'modal', params: ['close'] });
  }

  onSubmit(name, email, password, confirmPassword) {
    this.spinner.show();

    // Validações do front-end
    let formIsValid: Boolean = true;

    if (this.IsNullOrWhiteSpace(email)) {
      this.toaster.error('Email inválido.');
      this.formEmail = this.userProfile.Email;
      formIsValid = false;
      this.spinner.hide();
      return;
    }

    if (this.IsNullOrWhiteSpace(name)) {
      this.toaster.error('Nome inválido.');
      this.formName = this.userProfile.Name;
      formIsValid = false;
      this.spinner.hide();
      return;
    }

    if (name.Length < 2 || name.Length > 30) {
      this.toaster.error('Nome deve conter no mínimo 2 caracteres e no máximo 30.');
      this.formName = this.userProfile.Name;
      formIsValid = false;
      this.spinner.hide();
      return;
    }

    if (!this.IsNullOrWhiteSpace(password) || !this.IsNullOrWhiteSpace(confirmPassword)) {
      if (password !== confirmPassword) {
        this.toaster.error('As senhas informadas não são iguais.');
        this.formPassword = '';
        this.formPasswordConfirm = '';
        formIsValid = false;
        this.spinner.hide();
        return;
      }
    }

    if (formIsValid) {
      let updateCredential: Boolean = false;
      if (email !== this.userProfile.Email) {
        updateCredential = true;
      }

      if (!this.IsNullOrWhiteSpace(password)) {
        updateCredential = true;
      }

      const userEditProfile: UserEditProfile = {
        Name: name,
        Email: email,
        Password: password,
        PasswordConfirm: confirmPassword
      };

      const userAuthenticate: UserAuthenticate = {
        Email: email,
        Password: password
      };

      this.userService.userEditProfile(userEditProfile).subscribe(
        (data: ResponseModel) => {
          if (data.StatusCode === 200) {
            if (updateCredential) {
              this.userService.updateToken(userAuthenticate);
            }
            this.toaster.success(data.Content);
            this.userProfileName = userEditProfile.Name.substr(0, 20);
            this.spinner.hide();
            this.closeModalPerfil();
          } else {
            if (data.StatusCode === 401) {
              this.closeModalPerfil();
              this.spinner.hide();
              this.logout();
            } else {
              this.toaster.error(data.Content);
              this.spinner.hide();
            }
          }
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
          this.toaster.error(err.statusText);
        }
      );
    }
  }

  logout() {
    this.userService.logout();
  }

  IsNullOrWhiteSpace(str) {
    return str === null || str.match(/^ *$/) !== null;
  }
}

