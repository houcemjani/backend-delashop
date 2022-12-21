import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Product} from "../../entity/product";
import {ProductCategory} from "../../entity/product-category-enum";
import {ProductType} from "../../entity/product-type-enum";
import {ProductStatus} from "../../entity/product-status-enum";
import {ProductDetail} from "../../entity/product-detail";
import {NgForm} from "@angular/forms";
import {Util} from "../../utils/util";
import {ProductHistory} from "../../entity/product-history";
import {ProductManagerService} from "../../services/product-manager.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {ProductActionEnum} from "../../entity/product-action-enum";


@Component({
  selector: 'app-product-manager-dialog',
  templateUrl: './product-manager-dialog.component.html',
  styleUrls: ['./product-manager-dialog.component.css']
})
export class ProductManagerDialogComponent implements OnInit {
  @ViewChild('productForm') productForm: NgForm;
  @ViewChild('refInput', {read: ElementRef}) refInput: ElementRef;
  @ViewChild('fileUpload') fileUpload: any;
  @Input() product: Product;
  @Input() isNew: boolean;
  productDetail: ProductDetail = new ProductDetail();
  productHistory: ProductHistory = new ProductHistory();
  cols: any[] = [];
  categoryOptions = ProductCategory.options;
  typeOptions = ProductType.options;
  statusOptions = ProductStatus.options;
  showHistory: boolean = false;
  submitted: boolean = false;
  showAddDetailDialog: boolean = false;
  matchedProductReference: boolean = false;
  matchedDetailReference: boolean = false;
  matchedDetail: boolean = false;
  uploadedFiles: any[] = [];
  images: string[] = [];
  isNewDetail: boolean;
  quantity: number;

  constructor(private productManagerService: ProductManagerService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService

  ) {
  }

  ngOnInit(): void {
    this.cols = [
      {field: 'reference', header: 'Réference', width: '80px'},
      {field: 'size', header: 'Taille', width: '80px'},
      {field: 'color', header: 'Couleur', width: '80px'},
      {field: 'quantity', header: 'Quantité', width: '80px'},
      {field: 'purchasePrice', header: 'Prix d\'achat', width: '110px', type: 'price'},
      {field: 'limit', header: 'Seuil', width: '80px'}
    ]
  }

  saveProduct(): void {
    this.submitted = true;
    if (Util.isNullOrUndefined(this.product.reference)) {
      this.matchedProductReference = true;
      return;
    }
    if (this.matchedProductReference)
      return;
    if (this.productForm.invalid)
      return;

    this.productManagerService.saveProduct(this.product).subscribe({
      next: (res) => {
        this.messageService.add({severity: 'success', summary: 'Opération effectuée avec succès  ', detail: ''});
        this.product = new Product();
        this.submitted = false;
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  matchProductReference(): void {
    if (!this.isNew) {
      this.matchedProductReference = false;
      return;
    }
    if (Util.isNullOrUndefined(this.product.reference)) {
      this.matchedProductReference = false;
      return;
    }
    this.matchedProductReference = this.isExistProductReference();
  }

  isExistProductReference(): boolean {
    this.productManagerService.loadProductByReference(this.product.reference.trim()).subscribe({
      next: (res) => {
        this.matchedProductReference = res;
        this.submitted = false
      },
      error: (err) => {
        console.log(err)
      }
    })
    return this.matchedProductReference;
  }

  matchDetailReference(): void {
    if (!this.isNewDetail) return;
    if (Util.isNullOrUndefined(this.productDetail.reference)) {
      this.matchedDetailReference = false;
      return;
    }
    const index = this.product.details?.findIndex((item) => this.productDetail?.reference === item.reference)
    if (index !== -1 && index !== undefined) {
      this.matchedDetailReference = false;
      return;
    }
    this.matchedDetailReference = this.isExistDetailReference();
  }

  isExistDetailReference(): boolean {
    this.productManagerService.loadDetailByReference(this.productDetail.reference.trim()).subscribe({
      next: (res) => {
        this.matchedDetailReference = res
      },
      error: (err) => {
        console.log(err)
      }
    })
    return this.matchedDetailReference;
  }

  matchDetail(): void {
    if (!this.isNewDetail) return;
    if (Util.isNullOrUndefined(this.productDetail.color) || Util.isNullOrUndefined(this.productDetail.size)) {
      this.matchedDetail = false;
      return;
    }
    const index = this.product.details?.findIndex((item) => this.productDetail.size.trim() === item.size.trim() && this.productDetail.color.trim() === item.color.trim())
    if (index !== -1 && index !== undefined) {
      this.matchedDetail = true;
      return;
    }
    this.matchedDetail = this.isDetailExist();
  }

  isDetailExist(): boolean {

    if (Util.isNullOrUndefined(this.product.reference))
      return false;
    this.productManagerService.checkIfExistDetail(
        this.product.reference.trim(),
        this.productDetail.size.trim(),
        this.productDetail.color.trim()).subscribe({
      next: (res) => {
        this.matchedDetail = res
      },
      error: (err) => {
        console.log(err)
      }
    })
    return this.matchedDetail;
  }

  addDetailDialog(): void {
    this.isNewDetail = true;
    this.productDetail = new ProductDetail();
    this.showAddDetailDialog = true;
  }

  updateDetailDialog(detail: ProductDetail): void {
    if (detail.id===undefined) {
      alert("Cette Detail n'\est pas encore enregistrer dans la base de données")
      return;
    }
    this.isNewDetail = false;
    this.productDetail = new ProductDetail();
    this.quantity = detail.quantity;
    this.productDetail.setDetails(detail)
    this.showAddDetailDialog = true;
  }

  addProductDetail(): void {
    const validationMsg = this.productDetail.validate();
    if (validationMsg !== '') {
      alert(validationMsg);
      return;
    }

    if (!this.isNewDetail) {
      this.productHistory.setHistory(ProductActionEnum.UPDATE, 1, this.productDetail.quantity , this.productDetail.purchasePrice)
      this.productDetail.quantity+= this.quantity;
      if (this.productDetail.history === undefined) this.productDetail.history = [];
      this.productDetail.history.push(this.productHistory)
      const index = this.product.details?.findIndex((item) => this.productDetail.reference === item.reference.trim())
      if (index !== -1 && index !== undefined) {
        this.product.details[index] = this.productDetail;
        this.resetProductDetail();
        this.messageService.add({severity: 'success', summary: 'Opération effectuée avec succès  ', detail: ''});
        return;
      }
      return;
    }
    if (this.matchedDetailReference) return;
    if (this.matchedDetail) return;
    if (this.product.details === undefined) this.product.details = [];
    if (this.productDetail.history === undefined) this.productDetail.history = [];
    this.productHistory.setHistory(ProductActionEnum.ADD, 1, this.productDetail.quantity, this.productDetail.purchasePrice)
    this.productDetail.history.push(this.productHistory)
    this.product.details.push(this.productDetail)
    this.resetProductDetail();
  }

  resetProductDetail(): void {
    this.productDetail = new ProductDetail();
    this.productHistory = new ProductHistory();
    this.showAddDetailDialog = false;
  }

  displayHistory(detail: ProductDetail): void {
    this.productDetail = detail;
    this.showHistory = true;

  }

  public hideHistory(): void {
    this.showHistory = false;
    this.submitted = false;
  }

  delete(row: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de supprimer cet detail ? ',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel:'oui',
      rejectLabel:'non',
      accept: () => {
        this.product.details.splice(row, 1);
        this.showHistory = false;
        this.messageService.add({severity:'success', summary:'la suppression de détail à été effectuer ', detail:''});
      },
    });
  }

  cancel(): void {
    this.productDetail = new ProductDetail();
    this.showAddDetailDialog = false;
  }


  onUpload(event: any = null): void {
    const files = event.files;
    this.productManagerService.uploadImages(files).subscribe({
      next: (res) => {
        if (Util.isNullOrUndefined(this.product.imgPath)) {
          this.product.imgPath = res.path;
          const imgPath = this.product.imgPath.slice(0, -1)
          this.images = imgPath.split("|")
          return;
        }
        this.product.imgPath += res.path;
        const imgPath = this.product.imgPath.slice(0, -1)
        this.images = imgPath.split("|")
      },
      error: (err) => {
        console.log(err)
      }
    })
    this.messageService.add({severity: 'info', summary: 'Images téléchargés avec succés ', detail: ''});
    this.fileUpload.clear();
  }

  deleteImg(fileName: string): void {
    const index = this.images.findIndex((item) => item === fileName)
    this.images.splice(index, 1)
    this.product.imgPath = ''
    for (let image of this.images) {
      this.product.imgPath += image + "|"
    }
  }
}




