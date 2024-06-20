import { Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";

export const routes: Routes = [
  {
    // To showcase bread crumbs in action
    path: 'dashboard/details',
    component: DashboardComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: '**',
    redirectTo: 'dashboard/details'
  }
];
