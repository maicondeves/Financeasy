import { UserService } from './../user/services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseModel } from '../utils/response-model';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})

export class SignInComponent implements OnInit {
  isAuthenticationError: Boolean = false;
  message: string;
  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit(email, password) {
    this.userService.userAuthentication(email, password).subscribe((data: ResponseModel) => {
      if (data.StatusCode === 200) {
        const userToken = btoa(email + ':' + password);
        sessionStorage.setItem('token', userToken);
        this.router.navigate(['/home']);
      } else {
        if (data.StatusCode === 401) {
          // Mostra mensagem de erro de authenticação.
          this.isAuthenticationError = true;
          this.message = data.Content;
        } else {
          // Ocorreu algum outro erro durante o processo.
          this.isAuthenticationError = true;
          this.message = data.Content;
        }
      }
    },
    (err: HttpErrorResponse) => {
      this.isAuthenticationError = true;
    });
  }
}
