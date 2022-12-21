import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Product} from 'src/app/entity/product';
import {ProductCategory} from 'src/app/entity/product-category-enum';
import {ProductStatus} from 'src/app/entity/product-status-enum';
import {ProductService} from 'src/app/services/product.service';
import {SelectItem} from "primeng/api/selectitem";


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  limit = 12;
  first = 0;
  sortDirection: number;
  totalRecords: number;
  status: string;
  category: string;

  sortOptions: SelectItem[] = [
    {label: 'Prix Décroissant', value: -1},
    {label: 'Prix Croissant', value: 1}
  ];

  constructor(
      private productService: ProductService,
      private route: ActivatedRoute,
      private _cdr: ChangeDetectorRef
  ) {
  }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.status = params['status'];
      this.loadProducts();
    });
  }


  loadProducts(event: any = null): void {
    this.productService.loadProductListByStatus(
        this.status,
        event && event.rows !== 0 ? event.rows : this.limit,
        event ? event.first : this.first,
        this.sortDirection
    ).subscribe({
      next: (res) => {
        this.products = res.list;
        this.totalRecords = res.totalRecords;
      },
      error: (err) => {
        console.log(err)
      }
    });
  }

  displayStatus(): string {
    return ProductStatus.display(this.status);
  }


}
