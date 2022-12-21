import {ProductHistory} from "./product-history";

export class ProductDetail {
    id:number;
    reference:string;
    color:string;
    size:string;
    quantity:number;
    purchasePrice:number;
    limit:number;
    productId:number;
    history: ProductHistory[];


    public setDetails(detail :ProductDetail){
      this.id=detail.id
      this.reference = detail.reference;
      this.color = detail.color;
      this.size = detail.size;
      this.purchasePrice = detail.purchasePrice;
      this.limit = detail.limit;
      this.history=detail.history
    }
   public validate(): string {
        if (this.reference === undefined || this.reference.length === 0){
            return 'Le réference n\'est peut pas être vide';
        } else if (this.size === undefined || this.size.length === 0)  {
            return 'La taille n\'est peut pas être vide';
        }else if (this.color === undefined || this.color.length === 0)  {
            return 'le Couleur n\'est peut pas être vide';
        } else if (this.quantity === undefined)  {
            return 'La Quantity n\'est peut pas être vide';
        } else if (this.purchasePrice === undefined)  {
            return 'Le Prix d\'achat n\'est peut pas être vide';
        }else if (this.limit === undefined)  {
            return 'Le Seuil n\'est peut pas être vide';
        }
        return '';
    }
}