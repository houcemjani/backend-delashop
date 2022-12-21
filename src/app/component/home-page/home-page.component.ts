import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Product} from 'src/app/entity/product';
import {ProductService} from 'src/app/services/product.service';
import {AppData} from 'src/app/settings/app-data';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  discountedProducts: Product[] = [];
  newProducts: Product[] = [];
  trendProducts: Product[] = [];
  responsiveOptions: Object[];
  status: string;
  totalRecords: number;



  constructor(
      private productService: ProductService,
      private router: Router
  ) {

  }

  ngOnInit(): void {
    this.getProductlist('Tendance');
    this.getProductlist('Nouveau');
    this.getProductlist('Soldé');
  }

  navigateToStatusPage(status: string): void {
    this.status = status;
    if (AppData.username !== undefined) {
      this.router.navigateByUrl("", {skipLocationChange: true}).then(() => {
        this.router.navigate(['/product-list/' + this.status], {queryParams: {user: AppData.username}});
      });
    } else {
      this.router.navigateByUrl("", {skipLocationChange: true}).then(() => {
        this.router.navigate(['/product-list/' + this.status]);
      });
    }
  }

  getProductlist(status: string): void {
    this.productService.loadProductListByStatus(
        status, 15,0).subscribe({
      next: (res) => {
        switch (status) {
          case 'Tendance':
            return this.trendProducts = res.list;
          case 'Nouveau':
            return this.newProducts = res.list;
          case 'Soldé':
            return this.discountedProducts = res.list;
          default:
            return '';
        }
      },
      error: (err) => {
        console.log(err)
        console.log('list product load failed.');
      }
    });
  }

}
