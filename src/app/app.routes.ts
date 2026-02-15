// import { Routes } from '@angular/router';
//
// export const routes: Routes = [];
import { Routes } from '@angular/router';
import { LiveDashboard } from './features/live-dashboard/live-dashboard';
import { HistoricalDashboard } from './features/historical-dashboard/historical-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'live', pathMatch: 'full' },
  { path: 'live', component: LiveDashboard  },
  { path: 'history', component: HistoricalDashboard  }
];
