import { MzToastService } from 'ng2-materialize';
import { UserRegister } from './../user/models/user-register';
import { ResponseModel } from './../utils/response-model';
import { Router } from '@angular/router';
import { UserService } from './../user/services/user.service';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  isRegisterError: Boolean = false;
  formName: String = '';
  formEmail: String = '';
  formPassword: String = '';
  formPasswordConfirm: String = '';
  constructor(
    private userService: UserService,
    private router: Router,
    private toaster: MzToastService
  ) {}

  ngOnInit() {}

  onSubmit(name, email, password, confirmPassword) {

    let formIsValid: Boolean = true;

    if (this.IsNullOrWhiteSpace(name)) {
      this.toaster.show('Nome inválido.', 4000, 'toast-danger');
      this.formName = '';
      formIsValid = false;
      return;
    }

    if (name.length < 2 || name.length > 30) {
      this.toaster.show('Nome deve conter no mínimo 2 caracteres e no máximo 30.', 4000, 'toast-danger');
      this.formName = '';
      formIsValid = false;
      return;
    }

    if (this.IsNullOrWhiteSpace(email)) {
      this.toaster.show('Email inválido.', 4000, 'toast-danger');
      this.formEmail = '';
      formIsValid = false;
      return;
    }

    if (
      !this.IsNullOrWhiteSpace(password) ||
      !this.IsNullOrWhiteSpace(confirmPassword)
    ) {
      if (password !== confirmPassword) {
        this.toaster.show('As senhas informadas não são iguais.', 4000, 'toast-danger');
        this.formPassword = '';
        this.formPasswordConfirm = '';
        formIsValid = false;
        return;
      }
    }

    if (formIsValid) {
      const userRegister: UserRegister = {
        Name: name,
        Email: email,
        Password: password,
        PasswordConfirm: confirmPassword
      };

      this.userService.userRegister(userRegister).subscribe(
        (data: ResponseModel) => {
          if (data.StatusCode === 200) {
            this.toaster.show(data.Content, 4000, 'toast-success');
            this.router.navigate(['/signin']);
          } else {
            this.toaster.show(data.Content, 4000, 'toast-danger');
            this.isRegisterError = true;
          }
        },
        (err: HttpErrorResponse) => {
          this.isRegisterError = true;
        }
      );
    }
  }

  IsNullOrWhiteSpace(str) {
    return str === null || str.match(/^ *$/) !== null;
  }
}
