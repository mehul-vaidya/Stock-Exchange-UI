// import { Component } from '@angular/core';
//
// @Component({
//   selector: 'app-historical-dashboard',
//   imports: [],
//   templateUrl: './historical-dashboard.html',
//   styleUrl: './historical-dashboard.scss',
// })
// export class HistoricalDashboard {
//
// }


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historical-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historical-dashboard.html',
  styleUrl: './historical-dashboard.scss'
})
export class HistoricalDashboard {

  stocks = ['AA', 'BB', 'CC', 'DD'];
  selectedStock = 'AA';

  // You will later connect this to backend historical endpoint
  history: any[] = [];

}
