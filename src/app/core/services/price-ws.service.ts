import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import { PriceUpdate } from '../models/price-update.model';
import SockJS from 'sockjs-client';

// @Injectable({ providedIn: 'root' })
// export class PriceWsService  {
//
//     private prices$ = new BehaviorSubject<Record<string, number>>({});
//     private stompClient!: Client;
//
//         constructor(private http: HttpClient) {}
//
//         loadInitialPrices() {
//           this.http.get<Record<string, number>>('http://localhost:8080/api/prices').subscribe(prices => this.prices$.next(prices));
//           }
//
//         connectWebSocket() {
//           this.stompClient = new Client({ brokerURL: 'ws://localhost:8080/ws' });
//           this.stompClient.onConnect = () =>
//           { this.stompClient.subscribe('/topic/prices', (msg: IMessage) => {
//             const update: PriceUpdate = JSON.parse(msg.body);
//             console.log('WS PRICE:', update);
//              const current = { ...this.prices$.value };
//              current[update.stock] = update.price;
//               this.prices$.next(current); });
//               }; this.stompClient.activate();
//             }
//
//           getPrices() { return this.prices$.asObservable(); } }


// @Injectable({ providedIn: 'root' })
// export class PriceWsService {
//
//   private pricesSubject = new BehaviorSubject<PriceUpdate | null>(null);
//
//   /** Read-only observable for components */
//   prices$ = this.pricesSubject.asObservable();
//
//   private stompClient!: Client;
//
//   connectWebSocket() {
//     this.stompClient = new Client({
//       brokerURL: 'ws://localhost:8083/ws'
//     });
//
//     this.stompClient.onConnect = () => {
//       this.stompClient.subscribe('/topic/prices', msg => {
//         console.log('Order received');
//         const update: PriceUpdate = JSON.parse(msg.body);
//         this.pricesSubject.next(update);
//       });
//     };
//
//     this.stompClient.activate();
//   }
//
//   disconnect() {
//     this.stompClient?.deactivate();
//   }
// }


@Injectable({ providedIn: 'root' })
export class PriceWsService {

  private priceSubject = new BehaviorSubject<PriceUpdate | null>(null);
  public prices$ = this.priceSubject.asObservable();

  private stompClient!: Client;

  connectWebSocket(): void {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8083/ws'),
      reconnectDelay: 5000,
      debug: (msg) => console.log('[STOMP]', msg)
    });

    this.stompClient.onConnect = () => {
      console.log('✅ STOMP CONNECTED');

      this.stompClient.subscribe('/topic/prices', (msg: IMessage) => {
        const update: PriceUpdate = JSON.parse(msg.body);
        console.log('🔥 PRICE RECEIVED IN UI:', update);
        this.priceSubject.next(update);
      });
    };

    this.stompClient.onStompError = frame => {
      console.error('❌ STOMP ERROR', frame);
    };

    this.stompClient.activate();
  }

  disconnect(): void {
    this.stompClient?.deactivate();
  }
}
