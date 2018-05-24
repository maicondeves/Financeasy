import { MzToastService } from 'ng2-materialize';
import { UserAuthenticate } from './../user/models/user-authenticate';
import { HttpErrorResponse } from '@angular/common/http';
import { UserEditProfile } from './../user/models/user-edit-profile';
import { UserRegister } from './../user/models/user-register';
import { UserViewProfile } from './../user/models/user-view-profile';
import { ResponseModel } from './../utils/response-model';
import { UserService } from './../user/services/user.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  mostrarMenu = false;

  formName: String = ' ';
  formEmail: String = ' ';
  formPassword: String = '';
  formPasswordConfirm: String = '';

  userProfileName: String = '';

  userProfile: UserViewProfile = {
    Name: '',
    Email: '',
    RegisterDate: new Date(),
    UpdateDate: new Date()
  };

  constructor(
    private router: Router,
    private userService: UserService,
    private toaster: MzToastService
  ) {  }

  ngOnInit() {
    this.userService.mostrarMenuEmitter.subscribe(
      mostrar => {
        this.mostrarMenu = mostrar;
        if (this.mostrarMenu) {
          this.getName();
        }
      }
    );
  }

  getName() {
    this.userService.getName().subscribe((data: ResponseModel) => {
      this.userProfileName = data.Content.substr(0, 20);
    });
  }

  editProfile() {
    this.getProfile();
  }

  getProfile() {
    this.userService.getProfile().subscribe((data: ResponseModel) => {
      Object.assign(this.userProfile, data.Content);
      this.formName = this.userProfile.Name;
      this.formEmail = this.userProfile.Email;
    });
  }

  onSubmit(name, email, password, confirmPassword) {
    // Validações do front-end
    let formIsValid: Boolean = true;

    if (this.IsNullOrWhiteSpace(email)) {
      this.toaster.show('Email inválido.', 4000, 'toast-danger');
      this.formEmail = this.userProfile.Email;
      formIsValid = false;
      return;
    }

    if (this.IsNullOrWhiteSpace(name)) {
      this.toaster.show('Nome inválido.', 4000, 'toast-danger');
      this.formName = this.userProfile.Name;
      formIsValid = false;
      return;
    }

    if (name.Length < 2 || name.Length > 30) {
      this.toaster.show('Nome deve conter no mínimo 2 caracteres e no máximo 30.', 4000, 'toast-danger');
      this.formName = this.userProfile.Name;
      formIsValid = false;
      return;
    }

    if (!this.IsNullOrWhiteSpace(password) || !this.IsNullOrWhiteSpace(confirmPassword)) {
      if (password !== confirmPassword) {
        this.toaster.show('As senhas informadas não são iguais.', 4000, 'toast-danger');
        this.formPassword = '';
        this.formPasswordConfirm = '';
        formIsValid = false;
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
            this.toaster.show(data.Content, 4000, 'toast-success');
            this.userProfileName = userEditProfile.Name.substr(0, 20);
          } else {
            if (data.StatusCode === 401) {
              this.logout();
            } else {
              this.toaster.show(data.Content, 4000, 'toast-danger');
            }
          }
        },
        (err: HttpErrorResponse) => {
          this.toaster.show(err.statusText, 4000, 'toast-danger');
        }
      );
    }
  }

  logout() {
    this.userService.logout();
    this.toaster.show('Logout efetuado com sucesso.', 4000, 'toast-success');
  }

  IsNullOrWhiteSpace(str) {
    return str === null || str.match(/^ *$/) !== null;
  }
}
