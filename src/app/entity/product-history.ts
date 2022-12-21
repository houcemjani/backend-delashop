import {ProductActionEnum} from "./product-action-enum";
import {AppData} from "../settings/app-data";

export class ProductHistory {
  id: number;
  action: string;
  buySell: number;
  quantity: number;
  purchasePrice: number;
  historyDate: Date;
  userId: number | undefined;
  productDetailId: number;

  public setHistory(action: ProductActionEnum,buySell: number,quantity: number, purchasePrice:number ): void {
    this.action = action
    this.buySell = buySell
    this.quantity = quantity;
    this.purchasePrice=purchasePrice;
    this.historyDate = new Date();
    this.userId = AppData.userId;
  }



}