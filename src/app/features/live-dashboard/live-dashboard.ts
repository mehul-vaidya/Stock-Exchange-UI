// import { Component } from '@angular/core';
//
// @Component({
//   selector: 'app-live-dashboard',
//   imports: [],
//   templateUrl: './live-dashboard.html',
//   styleUrl: './live-dashboard.scss',
// })
// export class LiveDashboard {
//
// }
//
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Chart, registerables } from 'chart.js';
// import { PriceService, PriceUpdate } from '../../core/services/price.service';
// import { OrderService } from '../../core/services/order.service';
//
// Chart.register(...registerables);
//
// @Component({
//   selector: 'app-live-dashboard',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './live-dashboard.html',
//   styleUrl: './live-dashboard.scss'
// })
// export class LiveDashboard implements OnInit {
//
//   stocks = ['AA', 'BB', 'CC', 'DD'];
//   charts: any = {};
//   selectedStock = 'AA';
//   orderType = 'BUY';
//   price!: number;
//
//   constructor(
//     private priceService: PriceService,
//     private orderService: OrderService
//   ) {}
//
//   ngOnInit() {
//     this.createCharts();
//
//     this.priceService.priceUpdates$.subscribe(update => {
//       if (update) {
//         this.updateChart(update);
//       }
//     });
//   }
//
//   createCharts() {
//     this.stocks.forEach(stock => {
//       const ctx = document.getElementById(stock) as HTMLCanvasElement;
//       this.charts[stock] = new Chart(ctx, {
//         type: 'line',
//         data: {
//           labels: [],
//           datasets: [{
//             label: stock,
//             data: [],
//             borderWidth: 2
//           }]
//         }
//       });
//     });
//   }
//
//   updateChart(update: PriceUpdate) {
//     const chart = this.charts[update.stock];
//     if (!chart) return;
//
//     chart.data.labels.push(new Date().toLocaleTimeString());
//     chart.data.datasets[0].data.push(update.price);
//     chart.update();
//   }
//
//   submitOrder() {
//     const order = {
//       stock: this.selectedStock,
//       type: this.orderType,
//       price: this.price
//     };
//
//     this.orderService.placeOrder(order)
//       .subscribe(() => alert('Order submitted'));
//   }
// }


import {
  Component,
  OnInit,
  AfterViewInit,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { PriceService, PriceUpdate } from '../../core/services/price.service';
import { OrderService } from '../../core/services/order.service';

Chart.register(...registerables);

@Component({
  selector: 'app-live-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './live-dashboard.html',
  styleUrl: './live-dashboard.scss'
})
export class LiveDashboard implements OnInit, AfterViewInit {

  stocks = ['AA', 'BB', 'CC', 'DD'];
  charts: any = {};
  selectedStock = 'AA';
  orderType = 'BUY';
  price!: number;

  constructor(
    private priceService: PriceService,
    private orderService: OrderService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.priceService.priceUpdates$.subscribe(update => {
      if (update) {
        this.updateChart(update);
      }
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.createCharts();
    }
  }

  createCharts() {
    this.stocks.forEach(stock => {

      const ctx = document.getElementById(stock) as HTMLCanvasElement;
      if (!ctx) return;

      this.charts[stock] = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: stock,
            data: [],
            borderWidth: 2
          }]
        }
      });

    });
  }

  updateChart(update: PriceUpdate) {

    if (!this.charts[update.stock]) return;

    const chart = this.charts[update.stock];

    chart.data.labels.push(new Date().toLocaleTimeString());
    chart.data.datasets[0].data.push(update.price);
    chart.update();
  }

  submitOrder() {

    const order = {
      stock: this.selectedStock,
      type: this.orderType,
      price: this.price
    };

    this.orderService.placeOrder(order)
      .subscribe(() => alert('Order submitted'));
  }
}
