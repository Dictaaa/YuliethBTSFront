import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, of } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ShopService {
  private http = inject(HttpClient);

  products$ = this.http
    .get<Product[]>('assets/data/products.json')
    .pipe(catchError(() => of([] as Product[])));
}