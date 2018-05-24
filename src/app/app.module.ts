import { ProjectsService } from './projects/services/projects.service';
import { CategoriesService } from './categories/services/categories.service';
import { UserService } from './user/services/user.service';

import { ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgMaskModule } from '@fagnerlima/ng-mask';

import {
  MzButtonModule,
  MzToastModule,
  MzModalModule,
  MzIconMdiModule,
  MzIconModule,
  MzCardModule,
  MzInputModule,
  MzSelectModule,
  MzTextareaModule,
  MzDatepickerModule
} from 'ng2-materialize';

import { MaterializeModule } from 'angular2-materialize';
import { NgxSpinnerModule } from 'ngx-spinner';
import { APP_ROUTES } from './app.routing';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './auth/auth.guard';
import { CustomersComponent } from './customers/customers.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProjectsComponent } from './projects/projects.component';
import { RevenuesComponent } from './revenues/revenues.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { CustomersService } from './customers/services/customers.service';
import { SpinnerIntercept } from './spinner/spinner-intercept';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserComponent,
    SignInComponent,
    SignUpComponent,
    NavBarComponent,
    CustomersComponent,
    CategoriesComponent,
    ProjectsComponent,
    RevenuesComponent,
    ExpensesComponent,
    LandingPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterializeModule,
    FormsModule,
    ReactiveFormsModule,
    MzButtonModule,
    MzDatepickerModule,
    MzToastModule,
    MzModalModule,
    MzIconMdiModule,
    MzIconModule,
    MzCardModule,
    MzInputModule,
    MzSelectModule,
    MzTextareaModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgMaskModule,
    RouterModule.forRoot(APP_ROUTES)
  ],
  exports: [
    NgForm
  ],
  providers: [
    CustomersService,
    CategoriesService,
    UserService,
    ProjectsService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerIntercept,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
