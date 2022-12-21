import {Component, OnInit} from '@angular/core';
import {Product} from "../../entity/product";
import {AppData} from "../../settings/app-data";
import {Router} from "@angular/router";
import {ProductCartItem} from "../../entity/product-cart-item";
import {Util} from "../../utils/util";
import {ProductManagerService} from "../../services/product-manager.service";
import {MessageService} from "primeng/api";


@Component({
  selector: 'app-product-cart',
  templateUrl: './product-cart.component.html',
  styleUrls: ['./product-cart.component.css']
})
export class ProductCartComponent implements OnInit {

  productItems: ProductCartItem[] = [];
  images:string[]=[];
  constructor(private router: Router,
              private productManagerService:ProductManagerService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    if (AppData.userCart !== undefined)
      this.productItems = AppData.userCart?.items;

  }

  goToProductDetails(product: Product): void {
    if (AppData.username !== undefined) {
      this.router.navigateByUrl("", {skipLocationChange: true}).then(() => {
        this.router.navigate(['/details/' + product.id], {queryParams: {user: AppData.username}});
      });
    } else {
      this.router.navigateByUrl("", {skipLocationChange: true}).then(() => {
        this.router.navigate(['/details/' + product.id]);
      });
    }
  }

  delete(row: number): void {
    AppData.userCart?.items.splice(row, 1)
    localStorage.setItem('CartProducts', JSON.stringify(AppData.userCart?.items));
  }
  getImage(path: string): string {
    if (!Util.isNullOrUndefined(path)) {
      const imgPath = path.slice(0, -1)
      this.images = imgPath.split("|")
      return this.images[0];
    }
    return '';
  }
  commander():void{

    this.productManagerService.sellProduct(AppData.userCart?.items).subscribe({
      next: (res) => {
        this.productItems=[];
        AppData.userCart.items=[];
        localStorage.removeItem('CartProducts');

      },
      error: (err) => {
        console.log(err)
        return;
      }
    })
    this.messageService.add({severity: 'success', summary: 'Opération effectuée avec succès ', detail: ''});
  }
}
