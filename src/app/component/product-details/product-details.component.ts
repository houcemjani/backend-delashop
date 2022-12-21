import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {SelectItem} from 'primeng/api';
import {Product} from 'src/app/entity/product';
import {ProductService} from 'src/app/services/product.service';
import {AppData} from 'src/app/settings/app-data';
import {ProductCartItem} from "../../entity/product-cart-item";
import {Util} from "../../utils/util";
import {ProductCart} from "../../entity/product-cart";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  id: number;
  product: Product = new Product();
  sizeOptions: SelectItem[] = [];
  colorOptions: SelectItem[] = [];
  selectedSize: string;
  selectedColor: string;
  quantity = 0;
  maxQuantity = 0;
  images:string[]=[];
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.getProduct();
  }

  getProduct() {
    if (this.id === undefined) {
      return;
    }
    this.productService.loadProductById(this.id).subscribe({
      next: (data) => {
        this.product = data;
        this.getSizeOptions();
        if (!Util.isNullOrUndefined(this.product.imgPath)) {
          const imgPath=this.product.imgPath.slice(0,-1)
          this.images=imgPath.split("|")
        }
      },
      error: (err: any) => {
        console.log('product load failed.');
      }

    })
  }

  getSizeOptions(): void {
    this.sizeOptions = [];
    this.product.details.forEach(d => {
      const index = this.sizeOptions.findIndex((item) => item.value === d.size)
      if ((index === -1) && (d.quantity > 0)) {
        this.sizeOptions.push({label: d.size, value: d.size});
      }
    });
  }

  getColorOptions(): void {
    this.quantity = 0;
    this.maxQuantity = 0;
    this.selectedColor = '';
    this.colorOptions = [];
    this.product.details.forEach(d => {
      const index = this.colorOptions.findIndex((items) => items.value === d.color)
      if ((index === -1) && (d.quantity > 0)) {
        if (d.size === this.selectedSize) {
          this.colorOptions.push({label: d.color, value: d.color});
        }
      }
    });

  }

  getMaxQuantity(): void {
    this.quantity = 0;
    const index = this.product.details.findIndex((detail) => detail.color === this.selectedColor && detail.size === this.selectedSize)
    if ((index !== -1)) {
      this.maxQuantity = this.product.details[index].quantity;
    } else {
      this.quantity = 0;
      this.maxQuantity = 0;
    }
  }

  addToCart(): void {
    if (AppData.userId === undefined) {
      this.router.navigate(['/Sign-in'], {queryParams: {idProduct: this.product.id}});
      return;
    }
    if (this.quantity == 0) {
      alert("Ajouter une quantité avant de mettre le produit dans le  Panier")
      return;
    }
    if (AppData.userCart===undefined) AppData.userCart=new ProductCart();
    AppData.userCart?.addProductToCart(new ProductCartItem(this.product, this.quantity,this.selectedSize,this.selectedColor));
    localStorage.setItem('CartBadge', AppData.userCart ? AppData.userCart.getProductCount().toString() : JSON.parse(JSON.stringify(localStorage.getItem('CartBadge'))));
    this.router.navigate(['/details/' + this.product.id]);
  }

}
