// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class OrderService {
//
//   constructor(private http: HttpClient) {}
//
//   placeOrder(order: any) {
//     return this.http.post(
//       'http://localhost:8084/api/orders',
//       order
//     );
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {

  constructor(private http: HttpClient) {}

  placeOrder(order: Order) {
    return this.http.post(
      'http://localhost:8082/api/orders',
      order,
      { responseType: 'text' }
    );
  }
}
