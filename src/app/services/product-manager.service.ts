import { Injectable } from '@angular/core';
import {Observable, throwError} from "rxjs";
import {DetailedProduct} from "../entity/detailed-product";
import {catchError, map} from "rxjs/operators";
import {Product} from "../entity/product";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {LoginResponse} from "../entity/login-response";
import {PathResponse} from "../entity/path-response";
import {Resource} from "@angular/compiler-cli/src/ngtsc/metadata";
import * as url from "url";
import {ProductCartItem} from "../entity/product-cart-item";

@Injectable({
  providedIn: 'root'
})
export class ProductManagerService {

  constructor(private http: HttpClient) { }

  loadProductById(productId: number|null): Observable<Product> {
    return this.http.get<Product>('rest/product/load/' + productId)
        .pipe(catchError(this.handleError));
  }
  loadProductList(filters: any, limit: number, offset: number): Observable<{list:DetailedProduct[], totalRecords: number}> {
    return this.http.post<{list:DetailedProduct[], totalRecords: number}>('rest/product-manager/load-product-list/',
        {filters: filters, limit: limit, offset: offset})
        .pipe(
            map(res => {
              return {list: res.list, totalRecords: res.totalRecords};
            }),
            catchError(this.handleError)
        );
  }

  loadDetailByReference(reference: string): Observable<boolean> {
    return this.http.get<boolean>('rest/product-manager/load-detail-by-reference/' + reference)
        .pipe(catchError(this.handleError));
  }

  loadProductByReference(reference: string): Observable<boolean> {
    return this.http.get<boolean>('rest/product-manager/load-by-reference/' + reference)
        .pipe(catchError(this.handleError));
  }

  saveProduct(product: Product): Observable<void> {
    return this.http.post<void>('rest/product-manager/save/',product)
        .pipe(catchError(this.handleError));
  }

  checkIfExistDetail(reference: string,size: string,color: string):Observable<boolean>{
    return this.http.post<boolean>('rest/product-manager/checkDetail/',{reference: reference, size: size, color: color})
        .pipe(catchError(this.handleError));
  }

  uploadImages(files: any):Observable<PathResponse>{

    const formData: FormData = new FormData();
    for(let file of files) {
      formData.append("images", file, file.name)
    }
    return this.http.post<PathResponse>('/rest/product-manager/upload', formData).pipe(
        map(res => {
          return new PathResponse(res);
        })
    )
        .pipe(catchError(this.handleError));
  }
  sellProduct(items:any ):Observable<void>{
    return this.http.post<void>('rest/product-manager/sell',items)
        .pipe(catchError(this.handleError));
  }

  private handleError(errorResponse: HttpErrorResponse): Observable<any> {
    console.error('An error occurred', errorResponse);
    return throwError(errorResponse.error);
  }
}
