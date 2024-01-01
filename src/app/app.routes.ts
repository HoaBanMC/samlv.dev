import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { HomeComponent } from './modules/home/home.component';
import { GameWordleComponent } from './components/game-wordle/game-wordle.component';
import { MyFarmComponent } from './components/my-farm/my-farm.component';
import { SimpleRPGComponent } from './components/simple-rpg/simple-rpg.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
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
    path: 'dodge-the-bombs',
    component: LandingPageComponent
  },
  {
    path: 'game-wordle',
    component: GameWordleComponent
  },
  {
    path: 'my-farm',
    component: MyFarmComponent
  },
  {
    path: 'simple-rpg',
    component: SimpleRPGComponent
  },
];
