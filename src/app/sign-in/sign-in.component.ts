import { UserService } from './../user/services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseModel } from '../utils/response-model';
import { ToastrService } from 'ngx-toastr';
import { UserAuthenticate } from './../user/models/user-authenticate';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})

export class SignInComponent implements OnInit {
  isAuthenticationError: Boolean = false;
  constructor(
    private userService: UserService,
    private router: Router,
    private toaster: ToastrService
  ) {}

  ngOnInit() {
  }

  onSubmit(email, password) {
    const userAuthenticate: UserAuthenticate = {
      Email: email,
      Password: password
    };

    this.userService.userAuthentication(userAuthenticate).subscribe((data: ResponseModel) => {
      if (data.StatusCode === 200) {
        const userToken = btoa(email + ':' + password);
        sessionStorage.setItem('token', userToken);
        this.toaster.success(data.Content);
        this.router.navigate(['/home']);
      } else {
        this.toaster.error(data.Content);
      }
    },
    (err: HttpErrorResponse) => {
      this.isAuthenticationError = true;
    });
  }
}
