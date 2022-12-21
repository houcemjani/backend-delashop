import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Product} from '../entity/product';
import {catchError, map} from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ProductService {


  constructor(private http: HttpClient) {
  }

  loadProductById(productId: number|null): Observable<Product> {
    return this.http.get<Product>('rest/product/load/' + productId)
        .pipe(catchError(this.handleError));
  }

  loadFilteredList(filters: any, limit: number, offset: number): Observable<{ list: Product[], totalRecords: number }> {
    return this.http.post<{ list: Product[], totalRecords: number }>('rest/product/load-list/',
        {filters: filters, limit: limit, offset: offset})
        .pipe(
            map(res => {
              return {list: res.list, totalRecords: res.totalRecords};
            }),
            catchError(this.handleError)
        );
  }

  loadProductListByStatus(status: string, limit: number, offset: number, sort?: number): Observable<{ list: Product[], totalRecords: number }> {
    return this.http.post<{ list: Product[], totalRecords: number }>('rest/product/load-list-by-status/',
        {status: status, limit: limit, offset: offset, sort: sort})
        .pipe(
            map(res => {
              return {list: res.list, totalRecords: res.totalRecords};
            }),
            catchError(this.handleError)
        );
  }

  getAllProductCharacteristics(category: string): Observable<any> {
    return this.http.get<any>('rest/product/get-products-characteristics/' + category)
        .pipe(catchError(this.handleError));
  }

  private handleError(errorResponse: HttpErrorResponse): Observable<any> {
    console.error('An error occurred', errorResponse);
    return throwError(errorResponse.error);
  }

}
