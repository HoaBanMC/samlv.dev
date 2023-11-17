import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { HomeComponent } from './modules/home/home.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
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
    path: 'dodge-the-bombs',
    component: LandingPageComponent
  },
];
