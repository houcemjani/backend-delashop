import {Product} from "./product";
import {AppData} from "../settings/app-data";

export class ProductCartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
  userId: number | undefined;


  constructor(product: Product, quantity: number, size: string, color: string) {
    this.product = product;
    this.quantity = quantity;
    this.size = size;
    this.color = color;
    this.userId = AppData.userId;
  }

  getTotalPrice(): number {
    return this.product.price * this.quantity;
  }
}
