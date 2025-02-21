import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { AddformComponent } from './admin/dashboard/addform/addform.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './admin/login/login.component';
import { AuthGuard } from './auth.guard';
import { EditformComponent } from './admin/dashboard/editform/editform.component';
import { BodyComponent } from './home/body/body.component';
import { CartComponent } from './home/cart/cart.component';
import { ProductDetailComponent } from './home/product-detail/product-detail.component';
import { OrderComponent } from './home/order/order.component';
import { CancelPageComponent } from './cancel-page/cancel-page.component';
import { SuccessComponent } from './success/success.component';
import { MyorderComponent } from './home/myorder/myorder.component';
import { InfoComponent } from './info/info.component';
import { ConfirmpasswordComponent } from './auth/confirmpassword/confirmpassword.component';
import { ForgotpasswordComponent } from './auth/forgotpassword/forgotpassword.component';

const routes: Routes = [
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: "admin/login", component: LoginComponent },
  {
    path: "home",
    component: HomeComponent,
    children: [
      { path: '', component: BodyComponent },
      { path: 'cart', component: CartComponent },
      { path: 'myorder', component: MyorderComponent },
      { path: 'order', component: OrderComponent },
      { path: 'info', component: InfoComponent },
      { path: 'product/:id', component: ProductDetailComponent }
    ]
  },
  { path: "addform", component: AddformComponent },
  { path: "success", component: SuccessComponent },
  { path: 'reset-password', component: ConfirmpasswordComponent },
  { path: "cancel", component: CancelPageComponent },
  { path: "signin", component: SigninComponent },
  { path: "signup", component: SignupComponent },
  { path: "forgot", component: ForgotpasswordComponent },
  { path: "edit", component: EditformComponent },
  { path: "**", redirectTo: "home" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
