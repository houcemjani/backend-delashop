import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ProductDetail} from "../../entity/product-detail";
import {Table} from "primeng/table";


@Component({
  selector: 'app-product-history',
  templateUrl: './product-history.component.html',
  styleUrls: ['./product-history.component.css']
})
export class ProductHistoryComponent implements OnInit {
  @ViewChild('table') table: Table;
  @Input()
  productDetail: ProductDetail;
  cols: any[] = [];
  limit=10;
  first=0;
  totalRecords:number;
  constructor() { }

  ngOnInit(): void {
    this.cols = [
      {field: 'historyDate', header: 'Date' , width: '100px', type: 'date'},
      {field: 'action', header: 'Action', width: '80px'},
      {field: 'quantity', header: 'Quantity', width: '80px'},
      {field: 'purchasePrice', header: 'Prix d\'achat', width: '150px', type: 'price'},
      {field: 'userId', header: 'Admin', width: '70px'},
      {field: 'buySell', header: 'Opération', width: '80px'}
    ]
    if (this.productDetail.history !== undefined)
      this.totalRecords = this.productDetail.history.length;
    else
      this.totalRecords = 0;
  }



}
