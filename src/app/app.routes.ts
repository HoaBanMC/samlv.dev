import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/games',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./modules/layout/layout.routes').then(m => m.routes)
  },
  {
    path: 'games',
    component: LandingPageComponent
  },
];
