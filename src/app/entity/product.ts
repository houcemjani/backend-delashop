
import { ProductDetail } from "./product-detail";

export class Product {
    id:number;
    name:string ;
    reference:string;
    type:string;
    price:number;
    imgPath:string;
    description:string;
    status:string;
    discountedPrice:number;
    category:string;
    details: ProductDetail[];


    validate(): string {
        if (this.reference === undefined || this.reference.length === 0){
            return 'Le réference n\'est peut pas être vide';
        } else if (this.name === undefined || this.name.length === 0)  {
            return 'La Nom n\'est peut pas être vide';
        } else if (this.category === undefined || this.category.length === 0)  {
            return 'La Category n\'est peut pas être vide';
        }  else if (this.type === undefined || this.type.length === 0 ) {
            return 'La Type n\'est peut pas être vide';
        } else if (this.price === undefined ) {
            return 'La Prix n\'est peut pas être vide';
        }
        return '';
    }

}