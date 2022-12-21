import { Component, OnInit} from '@angular/core';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {Product} from 'src/app/entity/product';
import {ProductService} from 'src/app/services/product.service';
import {AppData} from 'src/app/settings/app-data';

import {ProductCategory} from "../../entity/product-category-enum";
import {SelectItem} from "primeng/api/selectitem";

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {

  products: Product[] = [];
  category: string;
  color: string[] = [];
  type: string[] = [];
  priceRange: { min: number, max: number }[] = [];
  minPrice: number | null;
  maxPrice: number | null;
  options: any = [];
  status: string
  limit = 12;
  first = 0;
  sortDirection: number;
  totalRecords: number;

  sortOptions: SelectItem[] = [
    {label: 'Prix Décroissant', value: -1},
    {label: 'Prix Croissant', value: 1}
  ];

  constructor(
      private productService: ProductService,
      private route: ActivatedRoute,
      private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.category = params['category'];
    });
    this.loadProductFilterOptions();
  }

  loadProductFilterOptions(): void {
    this.productService.getAllProductCharacteristics(this.category).subscribe({
      next: (res) => {
        this.options = res
        this.loadProducts();
      },
      error: (err) => {
        console.log(err)
      }
    });
  }

  loadProducts(event: any = null): void {
    const filters = {
      "0": this.category,
      "1": this.type,
      "2": this.color,
      "3": this.minPrice,
      "4": this.maxPrice,
      "5": this.sortDirection
    }
    this.productService.loadFilteredList(
        filters,
        event && event.rows !== 0 ? event.rows : this.limit,
        event ? event.first : this.first).subscribe({
      next: (res) => {
        this.products = res.list;
        this.totalRecords = res.totalRecords;

      },
      error: (err) => {
        console.log(err)
      }
    });
  }

  selectPriceRange(minPrice: number, maxPrice: any): void {
    if (this.priceRange.length > 0) {
      if (this.priceRange[0].max < this.priceRange[this.priceRange.length - 1].min) {
        this.minPrice = this.priceRange[0].min;
        this.maxPrice = this.priceRange[this.priceRange.length - 1].max;
      } else {
        this.minPrice = this.priceRange[this.priceRange.length - 1].min;
        this.maxPrice = this.priceRange[0].max;
      }
      this.loadProducts();
    } else {
      this.minPrice = null;
      this.maxPrice = null;
      this.loadProducts();
    }
  }

  resetFilter() {
    this.type = [];
    this.color = [];
    this.priceRange = [];
    this.minPrice = null;
    this.maxPrice = null;
    this.loadProducts();
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

  displayCategory(): string {
    return ProductCategory.display(this.category);
  }


}
