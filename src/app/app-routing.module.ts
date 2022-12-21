import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './component/home-page/home-page.component';
import { SignInComponent } from './component/sign-in/sign-in.component';
import { SignUpComponent } from './component/sign-up/sign-up.component';
import { ProductDetailsComponent } from './component/product-details/product-details.component';
import { ProductListComponent } from './component/product-list/product-list.component';
import { ProductCategoryComponent } from './component/product-category/product-category.component';
import {ProductCartComponent} from "./component/product-cart/product-cart.component";
import{ProductManagerComponent} from "./component/product-manager/product-manager.component";

const routes: Routes = [
  { path: '', component: HomePageComponent},
  { path: 'Sign-in', component: SignInComponent},
  { path: 'Sign-up', component: SignUpComponent},
  { path: 'product-list/:status', component: ProductListComponent},
  { path: 'details/:id', component: ProductDetailsComponent},
  { path: 'category/:category', component: ProductCategoryComponent},
  { path: 'product-cart', component: ProductCartComponent},
  { path: 'product-manager', component: ProductManagerComponent},

];
@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
