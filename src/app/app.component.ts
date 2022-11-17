import {Component, OnInit, HostListener} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppData} from "./settings/app-data";
import {ProductCart} from './entity/product-cart';
import {Product} from "./entity/product";
import {ProductCartItem} from "./entity/product-cart-item";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  category: string;
  headerVisibility: boolean;
  username: string | undefined;
  iconLogoutVisibility: string = 'hidden';
  productItems: ProductCartItem[] = [];

  constructor(
      private router: Router,
      private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.headerVisibility = true
    if (localStorage.getItem('username') !== null) {
      AppData.username = JSON.parse(JSON.stringify(localStorage.getItem('username')));
      AppData.userId = +(JSON.parse(JSON.stringify(localStorage.getItem('userId'))));
    }
    if (localStorage.getItem('CartProducts') !== null) {
      AppData.userCart = new ProductCart();
      this.productItems = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem('CartProducts'))));
      for (let i = this.productItems.length - 1; i >= 0; i--) {
        AppData.userCart.addProductToCart(new ProductCartItem(this.productItems[i].product, this.productItems[i].quantity, this.productItems[i].size, this.productItems[i].color));
      }

    }

    this.route.queryParamMap.subscribe((params: any) => {
      this.username = params.params.user;
      if (params.params.idProduct !== undefined || window.location.pathname == "/admin" /*|| params.params.role == "ADMIN"*/ ) {
        this.headerVisibility = false
      } else {
        this.headerVisibility = true
      }
    })


  }

  @HostListener('window:popstate', ['$event'])
  onBrowserBackBtnClose(event: Event) {
    if (window.location.pathname == "/Sign-in" || window.location.pathname == "/Sign-up" /*|| window.location.pathname == "/admin"*/) {
      this.headerVisibility = false
    } else {
      this.headerVisibility = true
    }
  }

  navigateToLoginPage(): void {
    if (this.loginButtonCaption() === "Connexion") {
      this.headerVisibility = false;
      this.router.navigate(["/Sign-in"]);
    } else if (AppData.role === "ADMIN") {
      this.headerVisibility = false;
      this.router.navigate(["/admin"]);
    } else {
      this.headerVisibility = true
    }
  };

  loginButtonCaption(): string {
    if (AppData.username === undefined) {
      this.iconLogoutVisibility = 'hidden';
      return "Connexion";
    } else {
      this.iconLogoutVisibility = 'visible';
      return AppData.username;
    }
  }

  navigateToHomePage(): void {
    if (AppData.username !== undefined) {
      this.router.navigate([''], {queryParams: {user: AppData.username}})
      return
    }
    this.router.navigate(['']);
  }

  navigateToCategoryPage(category: string): void {
    this.category = category;
    if (AppData.username !== undefined) {
      this.router.navigateByUrl("", {skipLocationChange: true}).then(() => {
        this.router.navigate(['category/' + this.category], {queryParams: {user: AppData.username}});
      });
      return;
    }
    this.router.navigateByUrl("", {skipLocationChange: true}).then(() => {
      this.router.navigate(['category/' + this.category]);
    });

  }

  navigateToCart(): void {
    if (AppData.username !== undefined) {
      this.router.navigate(['product-cart/'], {queryParams: {user: AppData.username}});
      return
    }
    this.router.navigate(['product-cart/']);
  }

  logout(): void {
    this.headerVisibility = true;
    AppData.username = undefined;
    AppData.userId = undefined;
    AppData.userCart = new ProductCart();
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('CartProducts');
    localStorage.removeItem('CartBadge')
    this.router.navigate(['']);
  }

  getCartBadge(): number {
    if (AppData.userCart === undefined) {
      return 0;
    } else {
      return AppData.userCart != undefined ? AppData.userCart.getProductCount() : +JSON.parse(JSON.stringify(localStorage.getItem('CartBadge')));
    }
  }

}




