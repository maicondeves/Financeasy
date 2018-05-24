import { UserService } from './../user/services/user.service';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseModel } from '../utils/response-model';
import { UserAuthenticate } from './../user/models/user-authenticate';
import { MzToastService } from 'ng2-materialize';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  isAuthenticationError: Boolean = false;
  formEmail: String = '';
  formPassword: String = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private toaster: MzToastService
  ) {}

  ngOnInit() {}

  IsNullOrWhiteSpace(str) {
    return str === null || str.match(/^ *$/) !== null;
  }

  onSubmit(email, password) {

    // Validações do front-end
    let formIsValid: Boolean = true;

    if (
      this.IsNullOrWhiteSpace(email) ||
      email.length < 2 ||
      email.length > 100
    ) {
      this.toaster.show('Email ou senha inválidos.', 4000, 'toast-danger');
      this.formEmail = '';
      formIsValid = false;
      return;
    }

    if (
      this.IsNullOrWhiteSpace(password) ||
      password.length < 2 ||
      password.length > 20
    ) {
      this.toaster.show('Email ou senha inválidos.', 4000, 'toast-danger');
      this.formPassword = '';
      formIsValid = false;
      return;
    }

    if (formIsValid) {
      const userAuthenticate: UserAuthenticate = {
        Email: email,
        Password: password
      };

      this.userService.userAuthentication(userAuthenticate).subscribe(
        (data: ResponseModel) => {
          if (data.StatusCode === 200) {
            this.userService.createToken(userAuthenticate);
            this.toaster.show(data.Content, 4000, 'toast-success');
          } else {
            this.toaster.show(data.Content, 4000, 'toast-danger');
          }
        },
        (err: HttpErrorResponse) => {
          this.isAuthenticationError = true;
        }
      );
    }
  }
}
