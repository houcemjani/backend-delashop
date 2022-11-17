import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SignInComponent} from './component/sign-in/sign-in.component';
import {SignUpComponent} from './component/sign-up/sign-up.component';
import {HomePageComponent} from './component/home-page/home-page.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import {NgbCarouselModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import {FieldsetModule} from 'primeng/fieldset';
import {ProductDetailsComponent} from './component/product-details/product-details.component';
import {DropdownModule} from "primeng/dropdown";
import {ProductTileComponent} from './component/product-tile/product-tile.component';
import {CarouselModule} from 'primeng/carousel';
import {DataViewModule} from 'primeng/dataview';
import {ButtonModule} from 'primeng/button';
import {PasswordModule} from 'primeng/password';
import {ProductListComponent} from './component/product-list/product-list.component';
import {ProductCategoryComponent} from './component/product-category/product-category.component';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputTextModule} from 'primeng/inputtext';
import {DividerModule} from 'primeng/divider';
import {AuthInterceptor} from './entity/auth-interceptor';
import {MatBadgeModule} from '@angular/material/badge';
import {BadgeModule} from "primeng/badge";
import {ProductCartComponent} from './component/product-cart/product-cart.component';
import {TableModule} from "primeng/table";
import {CheckboxModule} from "primeng/checkbox";
import {ProductManagerComponent} from './component/product-manager/product-manager.component';
import {DialogModule} from 'primeng/dialog';
import { ProductManagerDialogComponent } from './component/product-manager-dialog/product-manager-dialog.component';
import { ProductHistoryComponent } from './component/product-history/product-history.component';


@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    HomePageComponent,
    ProductDetailsComponent,
    ProductTileComponent,
    ProductListComponent,
    ProductCategoryComponent,
    ProductCartComponent,
    ProductManagerComponent,
    ProductManagerDialogComponent,
    ProductHistoryComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    MatIconModule,
    NgbCarouselModule,
    FieldsetModule,
    DropdownModule,
    CarouselModule,
    DataViewModule,
    ButtonModule,
    PasswordModule,
    RadioButtonModule,
    DividerModule,
    InputTextModule,
    MatBadgeModule,
    BadgeModule,
    TableModule,
    CheckboxModule,
    DialogModule
  ],

  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
