import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Product} from 'src/app/entity/product';
import {AppData} from 'src/app/settings/app-data';
import {Util} from "../../utils/util";


@Component({
  selector: 'app-product-tile',
  templateUrl: './product-tile.component.html',
  styleUrls: ['./product-tile.component.css']
})
export class ProductTileComponent implements OnInit {

  @Input()
  product: Product;
  @Input()
  view: string;
  images:string[]=[];
  constructor(
      private router: Router) {
  }
  ngOnInit(): void {
    if (!Util.isNullOrUndefined(this.product.imgPath)) {
    const imgPath=this.product.imgPath.slice(0,-1)
    this.images=imgPath.split("|")
    }
  }
  goToProductDetails(): void {
    if (AppData.username !== undefined) {
      this.router.navigateByUrl("", {skipLocationChange: true}).then(() => {
        this.router.navigate(['/details/' + this.product.id], {queryParams: {user: AppData.username}});
      });
    } else {
      this.router.navigateByUrl("", {skipLocationChange: true}).then(() => {
        this.router.navigate(['/details/' + this.product.id]);
      });
    }
  }

}





