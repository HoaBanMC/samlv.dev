import { Routes } from '@angular/router';
import { GamesComponent } from './games.component';
import { MathplayComponent } from './mathplay/mathplay.component';

export const routes: Routes = [
    {
        path: '',
        component: GamesComponent
    },
    {
        path: 'mathplay',
        component: MathplayComponent
    },
];
