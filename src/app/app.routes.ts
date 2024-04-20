import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  // {
  //   path: '',
  //   loadChildren: () => import('./modules/layout/layout.routes').then(m => m.routes)
  // },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'games',
    loadChildren: () => import('./games/games.routes').then(m => m.routes)
  },
  {
    path: 'features',
    loadChildren: () => import('./features/features.routes').then(m => m.routes)
  },
];
