import { ProjectsComponent } from './projects/projects.component';
import { CategoriesComponent } from './categories/categories.component';
import { AuthGuard } from './auth/auth.guard';
import { Routes } from '@angular/router';
import { ModuleWithProviders, Component } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { CustomersComponent } from './customers/customers.component';

export const APP_ROUTES: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'signup', component: UserComponent,
    children: [{ path: '', component: SignUpComponent}]
  },
  {
    path: 'signin', component: UserComponent,
    children: [{ path: '', component: SignInComponent}]
  },
  { path: '', redirectTo: '/signin', pathMatch: 'full'},
  { path: 'categories', component: CategoriesComponent, canActivate: [AuthGuard] },
  { path: 'customers', component: CustomersComponent, canActivate: [AuthGuard] },
  { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard] }
];
