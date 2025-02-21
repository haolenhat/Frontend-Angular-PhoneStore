import { AngularFireStorageReference } from './../../node_modules/@angular/fire/compat/storage/ref.d';
import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Thêm ReactiveFormsModule
import { HomeComponent } from './home/home.component';
import { AddformComponent } from './admin/dashboard/addform/addform.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './admin/login/login.component';
import { EditformComponent } from './admin/dashboard/editform/editform.component';
import { HeaderComponent } from './home/header/header.component';
import { FooterComponent } from './home/footer/footer.component';
import { BodyComponent } from './home/body/body.component';
import { CartComponent } from './home/cart/cart.component';
import { ProductDetailComponent } from './home/product-detail/product-detail.component';
import { CurrencyFormatPipe } from './currency-format.pipe';
import { UniquePipe } from './unique.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { OrderComponent } from './home/order/order.component';
import { CancelPageComponent } from './cancel-page/cancel-page.component';
import { SuccessComponent } from './success/success.component';
import { MyorderComponent } from './home/myorder/myorder.component';
import { InfoComponent } from './info/info.component';
import { AuthComponent } from './auth/auth.component';
import { ConfirmpasswordComponent } from './auth/confirmpassword/confirmpassword.component';
import { ForgotpasswordComponent } from './auth/forgotpassword/forgotpassword.component';
import { SpnewComponent } from './home/body/spnew/spnew.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    DashboardComponent,
    HomeComponent,
    AddformComponent,
    SigninComponent,
    SignupComponent,
    LoginComponent,
    EditformComponent,
    HeaderComponent,
    FooterComponent,
    BodyComponent,
    CartComponent,
    ProductDetailComponent,
    CurrencyFormatPipe,
    UniquePipe,
    OrderComponent,
    CancelPageComponent,
    SuccessComponent,
    MyorderComponent,
    InfoComponent,
    AuthComponent,
    ConfirmpasswordComponent,
    ForgotpasswordComponent,
    SpnewComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),


  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
