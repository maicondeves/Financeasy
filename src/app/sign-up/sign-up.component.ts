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
  constructor(
    private userService: UserService,
    private router: Router,
    private toaster: ToastrService
  ) { }

  ngOnInit() {
  }

  onSubmit(name, email, password, confirmPassword) {
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
      });
  }
}
