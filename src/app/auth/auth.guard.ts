import { UserService } from './../user/services/user.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): boolean {
      const isLogged = this.userService.isLoggedIn();
      if (isLogged) {
        return true;
      } else {
        this.router.navigate(['/signin']);
        return false;
      }
  }
}
