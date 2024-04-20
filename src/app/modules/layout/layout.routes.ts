import { Routes } from "@angular/router";
import { LayoutComponent } from "./layout.component";

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                redirectTo: '/dashboard',
                pathMatch: 'full'
            },
            {
                path: 'home',
                title: 'Trang chủ',
                loadComponent: () => import('../home/home.component').then(m => m.HomeComponent)
            },
            {
                path: 'dashboard',
                title: 'Trang chủ',
                loadComponent: () => import('../dashboard/dashboard.component').then(m => m.DashboardComponent)
            }
        ]
    }
]