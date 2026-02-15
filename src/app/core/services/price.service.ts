// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Client } from '@stomp/stompjs';
// // import * as SockJS from 'sockjs-client';
// import SockJS from 'sockjs-client';
// import { BehaviorSubject } from 'rxjs';
//
// export interface PriceUpdate {
//   stock: string;
//   price: number;
// }
//
// @Injectable({
//   providedIn: 'root'
// })
// export class PriceService {
//
//   private wsClient!: Client;
//   private priceSubject = new BehaviorSubject<PriceUpdate | null>(null);
//
//   priceUpdates$ = this.priceSubject.asObservable();
//
//   constructor(private http: HttpClient) {
//     this.connectWebSocket();
//   }
//
//   // REST call (initial load)
//   getCurrentPrices() {
//     return this.http.get<any>('http://localhost:8083/api/prices');
//   }
//
//   // WebSocket connection
//   private connectWebSocket() {
//
//     this.wsClient = new Client({
//       webSocketFactory: () => new SockJS('http://localhost:8083/ws'),
//       reconnectDelay: 5000
//     });
//
//     this.wsClient.onConnect = () => {
//       this.wsClient.subscribe('/topic/prices', message => {
//         const update: PriceUpdate = JSON.parse(message.body);
//         this.priceSubject.next(update);
//       });
//     };
//
//     this.wsClient.activate();
//   }
// }

import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';

export interface PriceUpdate {
  stock: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  private wsClient!: Client;
  private priceSubject = new BehaviorSubject<PriceUpdate | null>(null);
  priceUpdates$ = this.priceSubject.asObservable();

  constructor() {
    this.connectWebSocket();
  }

  private connectWebSocket() {

    this.wsClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8083/ws'),
      reconnectDelay: 5000,
      debug: (msg) => console.log(msg)
    });

    this.wsClient.onConnect = () => {

      console.log("STOMP Connected");

      this.wsClient.subscribe('/topic/prices', message => {
        const update: PriceUpdate = JSON.parse(message.body);
        console.log("Price received:", update);
        this.priceSubject.next(update);
      });
    };

    this.wsClient.activate();
  }
}

