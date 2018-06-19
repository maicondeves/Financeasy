import { DashboardService } from './home/services/dashboard.service';
import { RevenueService } from './revenues/services/revenue.service';
import { ExpenseService } from "./expenses/services/expense.service";
import { CepService } from "./shared/services/cep.service";
import { ProjectsService } from "./projects/services/projects.service";
import { CategoriesService } from "./categories/services/categories.service";
import { UserService } from "./user/services/user.service";

import { ReactiveFormsModule, FormsModule, NgForm } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule, LOCALE_ID } from "@angular/core";
import { RouterModule } from "@angular/router";

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
  MzDatepickerModule,
  MzTooltipModule,
  MzModalService,
  MzTabModule
} from "ng2-materialize";

import { MaterializeModule } from "angular2-materialize";
import { NgxSpinnerModule } from "ngx-spinner";

import { APP_ROUTES } from "./app.routing";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { UserComponent } from "./user/user.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthGuard } from "./auth/auth.guard";
import { CustomersComponent } from "./customers/customers.component";
import { CategoriesComponent } from "./categories/categories.component";
import { ProjectsComponent } from "./projects/projects.component";
import { RevenuesComponent } from "./revenues/revenues.component";
import { ExpensesComponent } from "./expenses/expenses.component";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { CustomersService } from "./customers/services/customers.service";
import { SpinnerIntercept } from "./spinner/spinner-intercept";
import { ProjectDetailComponent } from "./project-detail/project-detail.component";

import { CurrencyMaskModule } from "ng2-currency-mask";
import {
  CurrencyMaskConfig,
  CURRENCY_MASK_CONFIG
} from "ng2-currency-mask/src/currency-mask.config";

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  decimal: ",",
  precision: 2,
  prefix: "R$ ",
  suffix: "",
  thousands: "."
};

import { ChartsModule } from 'ng2-charts';

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
    LandingPageComponent,
    ProjectDetailComponent
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
    MzTooltipModule,
    MzTabModule,
    HttpClientModule,
    NgxSpinnerModule,
    CurrencyMaskModule,
    ChartsModule,
    RouterModule.forRoot(APP_ROUTES)
  ],
  exports: [NgForm],
  providers: [
    MzModalService,
    CepService,
    CustomersService,
    CategoriesService,
    UserService,
    ProjectsService,
    ExpenseService,
    RevenueService,
    DashboardService,
    {
      provide: CURRENCY_MASK_CONFIG,
      useValue: CustomCurrencyMaskConfig
    },
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerIntercept,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
