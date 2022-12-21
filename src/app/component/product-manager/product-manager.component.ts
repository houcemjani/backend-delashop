import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Product} from "../../entity/product";
import {ProductListFilterEnum} from "../../entity/product-list-filter-enum";
import {Table} from "primeng/table";
import {ConfirmationService, FilterMetadata, MessageService} from "primeng/api";
import {ProductManagerDialogComponent} from "../product-manager-dialog/product-manager-dialog.component";
import {DetailedProduct} from "../../entity/detailed-product";
import {Util} from "../../utils/util";
import {ProductManagerService} from "../../services/product-manager.service";
import {ProductType} from "../../entity/product-type-enum";
import {ProductCategory} from "../../entity/product-category-enum";
import {ProductStatus} from "../../entity/product-status-enum";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-product-manager',
  templateUrl: './product-manager.component.html',
  styleUrls: ['./product-manager.component.css']
})
export class ProductManagerComponent implements OnInit {

  @ViewChild('productManager') productManager: ProductManagerDialogComponent;
  @ViewChild('dt') table: Table;

  product: Product = new Product();
  products: DetailedProduct[] = [];
  cols: any[] = [];
  loading = false;
  totalRecords: number;
  limit = 250;
  first = 0;
  display: boolean;
  isNew: boolean;
  categoryOptions = ProductCategory.options;
  typeOptions = ProductType.options;
  statusOptions = ProductStatus.options;
  images: string[] = [];

  constructor(private productManagerService: ProductManagerService,
              private userService: UserService,
              private router: Router,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    if (!this.userService.isUserRoleAdmin()) {
      this.router.navigate(['']);
      window.location.pathname = '';
    }

    this.cols = [
      {
        field: 'name',
        header: 'Article',
        width: '90px',
        filter: ProductListFilterEnum.NAME,
        filterType: 'string',
        type: 'name'
      },
      {
        field: 'price',
        header: 'Prix',
        width: '90px',
        filter: ProductListFilterEnum.PRICE,
        filterType: 'number',
        type: 'price'
      },
      {
        field: 'category',
        header: 'Categorie',
        width: '90px',
        filter: ProductListFilterEnum.CATEGORY,
        filterType: 'dropdown',
        options: this.categoryOptions
      },
      {
        field: 'type',
        header: 'Type',
        width: '90px',
        filter: ProductListFilterEnum.TYPE,
        filterType: 'dropdown',
        options: this.typeOptions
      },
      {
        field: 'status',
        header: 'Status',
        width: '90px',
        filter: ProductListFilterEnum.STATUS,
        filterType: 'dropdown',
        options: this.statusOptions
      },
      {
        field: 'reference',
        header: 'Réference',
        width: '90px',
        filter: ProductListFilterEnum.REFERENCE,
        filterType: 'string'
      },
      {field: 'size', header: 'Taille', width: '90px', filter: ProductListFilterEnum.SIZE, filterType: 'string'},
      {field: 'color', header: 'Couleur', width: '90px', filter: ProductListFilterEnum.COLOR, filterType: 'string'},
      {
        field: 'quantity',
        header: 'Quantité',
        width: '90px',
        filter: ProductListFilterEnum.QUANTITY,
        filterType: 'number'
      }
    ]
    this.loadProducts()
  }

  loadProducts(event: any = null): void {

    this.productManagerService.loadProductList(
        event ? Util.readFilters(event.filters) : {},
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

  getValue(event: any) {
    if (event.target === undefined)
      return event.value;
    return event.target.value;
  }


  getFilter(col: any) {
    return (this.table.filters[col.filter] as FilterMetadata).value;
  }

  displayProductDialog(isNew: boolean, id: number | null) {
    if (isNew) {
      this.product = new Product();
      this.isNew = isNew;
      this.productManager.images = [];
      this.productManager.matchedProductReference = false;
      this.display = true;

    } else {
      this.productManagerService.loadProductById(id).subscribe({
        next: (res) => {
          this.product = res;
          this.isNew = isNew;
          this.productManager.matchedProductReference = false;
          this.display = true;
          if (Util.isNullOrUndefined(this.product.imgPath)) {
            this.productManager.images = [];
            return;
          }
          const imgPath = this.product.imgPath.slice(0, -1);
          this.productManager.images = imgPath.split("|");
        },
        error: (err) => {
          console.log(err)
        }
      });
    }
  }



  getImage(path: string): string {
    if (!Util.isNullOrUndefined(path)) {
      const imgPath = path.slice(0, -1)
      this.images = imgPath.split("|")
      return this.images[0];
    }
    return '';
  }
  save() {
    if (Util.isNullOrUndefined(this.productManager.product.details)) {
      alert("Il faut saisir Au moins un detail")
      return;
    }
    this.confirmationService.confirm({
      message: 'Vous êtes sûr d\'enregistrer le Produit ? ',
      header: 'Confirmation ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel:'oui',
      rejectLabel:'non',
      accept: () => {
        this.productManager.saveProduct();
        if (this.productManager.productForm.valid && !this.productManager.matchedProductReference && !Util.isNullOrUndefined(this.productManager.product.details)) {
          this.loadProducts();
          this.table.value = this.products;
          this.display = false;
        }
      },
    });
  }
  cancel() {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr d\'annuler l\'opération ? ',
      header: 'Annulation ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel:'oui',
      rejectLabel:'non',
      accept: () => {
        this.productManager.hideHistory();
        this.display = false;
        this.productManager.uploadedFiles = [];
        this.messageService.add({severity:'warn', summary:'Opération Annuler', detail:''});
      },
    });
  }
  outOfStock(product:DetailedProduct):boolean{
    if(product.limit!==undefined)
    return product.quantity<product.limit;
    return false;
  }
}
