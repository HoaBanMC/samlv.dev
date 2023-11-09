import { Routes } from "@angular/router";
import { LayoutComponent } from "./layout.component";

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                redirectTo: '/home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                title: 'Trang chủ',
                loadComponent: () => import('../home/home.component').then(m => m.HomeComponent)
            }
        ]
    }
]