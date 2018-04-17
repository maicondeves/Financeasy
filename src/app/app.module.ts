import { UserService } from './user/services/user.service';

import { FormsModule, NgForm } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ToastrModule, ToastNoAnimation, ToastNoAnimationModule} from 'ngx-toastr';

import { MaterializeModule } from 'angular2-materialize';
import { APP_ROUTES } from './app.routing';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './auth/auth.guard';
import { CustomersComponent } from './customers/customers.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProjectsComponent } from './projects/projects.component';
import { RevenuesComponent } from './revenues/revenues.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

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
    ToastNoAnimationModule,
    ToastrModule.forRoot({
      toastComponent: ToastNoAnimation,
    }),
    MaterializeModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(APP_ROUTES)
  ],
  exports: [
    NgForm
  ],
  providers: [
    UserService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
