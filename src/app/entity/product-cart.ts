
import {ProductCartItem} from "./product-cart-item";

export class ProductCart {

  public items: ProductCartItem[]  = [];

  getProductCount(): number {
    return this.items.length;
  }

  addProductToCart(item: ProductCartItem): void {
    let index =0
    if (this.items !== undefined) {
      this.items.forEach(element => {
        if (item.product.id === element.product.id && element.size===item.size && element.color===item.color  ) {
          element.quantity=element.quantity+item.quantity;
          localStorage.setItem('CartProducts', JSON.stringify(this.items))
          index=1
          return;
        }
      })
    }
    if (index===0 && item.quantity > 0){
      this.items.unshift(item);
      localStorage.setItem('CartProducts', JSON.stringify(this.items))
    }
  }


}
