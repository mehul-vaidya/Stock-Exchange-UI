import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) {}

  placeOrder(order: any) {
    return this.http.post(
      'http://localhost:8084/api/orders',
      order
    );
  }
}
