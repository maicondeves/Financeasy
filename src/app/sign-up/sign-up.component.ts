import { ToastrService } from 'ngx-toastr';
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
  formName: String;
  formEmail: String;
  formPassword: String;
  formPasswordConfirm: String;
  constructor(
    private userService: UserService,
    private router: Router,
    private toaster: ToastrService
  ) {}

  ngOnInit() {}

  onSubmit(name, email, password, confirmPassword) {
    let formIsValid: Boolean = true;

    if (this.IsNullOrWhiteSpace(name)) {
      this.toaster.error('Nome inválido.');
      this.formName = '';
      formIsValid = false;
      return;
    }

    if (name.length < 2 || name.length > 30) {
      this.toaster.error('Nome deve conter no mínimo 2 caracteres e no máximo 30.');
      this.formName = '';
      formIsValid = false;
      return;
    }

    if (this.IsNullOrWhiteSpace(email)) {
      this.toaster.error('Email inválido.');
      this.formEmail = '';
      formIsValid = false;
      return;
    }

    if (
      !this.IsNullOrWhiteSpace(password) ||
      !this.IsNullOrWhiteSpace(confirmPassword)
    ) {
      if (password !== confirmPassword) {
        this.toaster.error('As senhas informadas não são iguais.');
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
            this.toaster.success(data.Content);
            this.router.navigate(['/signin']);
          } else {
            this.toaster.error(data.Content);
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
