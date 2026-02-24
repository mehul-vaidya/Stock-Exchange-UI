import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import { Subscription } from 'rxjs';
// import { PriceWsService , PriceUpdate } from '../../core/services/price-ws.service';
// import { PriceWsService, PriceUpdate } from '../../core/services/price-ws.service';
import { PriceWsService } from '../../core/services/price-ws.service';
import { PriceUpdate } from '../../core/models/price-update.model';
import { filter } from 'rxjs/operators';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order.model';


@Component({
  selector: 'app-live-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">

      <div class="charts">
        <div class="chart-card" *ngFor="let s of stocks">
          <h4>{{ s }}</h4>
          <canvas [id]="s + '-chart'"></canvas>
        </div>
      </div>

      <div class="order-panel">
        <h3>Place Order</h3>

        <label>Stock</label>
        <select [(ngModel)]="order.stock">
          <option *ngFor="let s of stocks" [value]="s">{{ s }}</option>
        </select>

        <label>Type</label>
        <select [(ngModel)]="order.type">
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>

        <label>Price</label>
        <input type="number" [(ngModel)]="order.price" />

        <button (click)="submitOrder()">Submit</button>
      </div>

    </div>
  `,
  styles: [`
    .dashboard {
      display: grid;
      grid-template-columns: 3fr 1fr;
      gap: 16px;
      padding: 16px;
      height: 100vh;
      background: #f4f6f8;
      box-sizing: border-box;
    }

    .charts {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .chart-card {
      background: #fff;
      padding: 10px;
      border-radius: 8px;
      height: 260px;
    }

    canvas {
      width: 100% !important;
      height: 200px !important;
    }

    .order-panel {
      background: #fff;
      padding: 16px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    select, input, button {
      padding: 6px;
    }

    button {
      background: #1976d2;
      color: #fff;
      border: none;
      cursor: pointer;
    }
  `]
})
export class LiveDashboardComponent
  implements AfterViewInit, OnDestroy {

  stocks = ['AA', 'BB', 'CC', 'DD'];

  order: Order = {
    stock: 'AA',
    type: 'BUY',
    price: 100
  };

  private charts: Record<string, Chart> = {};
  private history: Record<string, number[]> = {
    AA: [], BB: [], CC: [], DD: []
  };
  private labels: Record<string, string[]> = {
    AA: [], BB: [], CC: [], DD: []
  };

  private priceSub!: Subscription;

  constructor(private priceWs: PriceWsService,  private orderService: OrderService) {}

  ngAfterViewInit(): void {
    this.stocks.forEach(s => this.createChart(s));

    this.priceWs.connectWebSocket();

//     this.priceSub = this.priceWs.prices$.subscribe(
//       (update: PriceUpdate) => {
//         this.updatePrice(update.stock, update.price);
//       }
//     );

      this.priceSub = this.priceWs.prices$
        .pipe(
          filter((u): u is PriceUpdate => u !== null)
        )
        .subscribe(update => {
          this.updatePrice(update.stock, update.price);
        });
  }

  private createChart(stock: string): void {
    const canvas = document.getElementById(stock + '-chart') as HTMLCanvasElement;

    this.charts[stock] = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.labels[stock],
        datasets: [{
          data: this.history[stock],
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 2
        }]
      },
      options: {
        animation: false,
        plugins: { legend: { display: false } },
        scales: { x: { display: false } }
      }
    });
  }

  private updatePrice(stock: string, price: number): void {
    const time = new Date().toLocaleTimeString();

    const labels = this.labels[stock];
    const history = this.history[stock];

    if (labels.length >= 20) {
      labels.shift();
      history.shift();
    }

    labels.push(time);
    history.push(price);

    this.charts[stock]?.update();
  }

//   submitOrder(): void {
//     console.log('Order submitted', this.order);
//     // next: POST /api/orders
//   }


    submitOrder(): void {
      this.orderService.placeOrder(this.order).subscribe({
        next: (res) => {
          console.log('✅ Order accepted:', res);
          alert('Order placed successfully');
        },
        error: (err) => {
          console.error('❌ Order failed', err);
          alert('Order placement failed');
        }
      });
    }


  ngOnDestroy(): void {
    this.priceSub?.unsubscribe();
    this.priceWs.disconnect();
    Object.values(this.charts).forEach(c => c.destroy());
  }
}
