import { UserService } from './../user/services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseModel } from '../utils/response-model';
import { ToastrService } from 'ngx-toastr';
import { UserAuthenticate } from './../user/models/user-authenticate';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  isAuthenticationError: Boolean = false;
  formEmail: String;
  formPassword: String;
  constructor(
    private userService: UserService,
    private router: Router,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {}

  IsNullOrWhiteSpace(str) {
    return str === null || str.match(/^ *$/) !== null;
  }

  onSubmit(email, password) {
    this.spinner.show();

    // Validações do front-end
    let formIsValid: Boolean = true;

    if (
      this.IsNullOrWhiteSpace(email) ||
      email.length < 2 ||
      email.length > 100
    ) {
      this.toaster.error('Email ou senha inválidos.');
      this.formEmail = '';
      this.spinner.hide();
      formIsValid = false;
      return;
    }

    if (
      this.IsNullOrWhiteSpace(password) ||
      password.length < 2 ||
      password.length > 20
    ) {
      this.toaster.error('Email ou senha inválidos.');
      this.formPassword = '';
      formIsValid = false;
      this.spinner.hide();
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
            this.toaster.success(data.Content);
            this.spinner.hide();
            this.router.navigate(['/home']);
          } else {
            this.spinner.hide();
            this.toaster.error(data.Content);
          }
        },
        (err: HttpErrorResponse) => {
          this.spinner.hide();
          this.isAuthenticationError = true;
        }
      );
    }
  }
}
