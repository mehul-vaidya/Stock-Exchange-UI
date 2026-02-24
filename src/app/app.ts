// import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
//
// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet],
//   templateUrl: './app.html',
//   styleUrl: './app.scss'
// })
// export class App {
//   protected readonly title = signal('stock-exchange-ui');
// }

import { Component } from '@angular/core';
import { LiveDashboardComponent } from './features/live-dashboard/live-dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LiveDashboardComponent],
  template: `<app-live-dashboard></app-live-dashboard>`
})
export class AppComponent {}
// export class App {}
