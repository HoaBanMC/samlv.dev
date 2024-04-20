import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { GameWordleComponent } from './game-wordle/game-wordle.component';
import { MyFarmComponent } from './my-farm/my-farm.component';
import { SimpleRPGComponent } from './simple-rpg/simple-rpg.component';
import { PuzzleSlideComponent } from './puzzle-slide/puzzle-slide.component';
import { PlantTreeComponent } from './plant-tree/plant-tree.component';

export const routes: Routes = [
    {
        path: 'dodge-the-bombs',
        component: LandingPageComponent
    },
    {
        path: 'game-wordle',
        component: GameWordleComponent
    },
    {
        path: 'simple-rpg',
        component: SimpleRPGComponent
    },
    {
        path: 'puzzle-slide',
        component: PuzzleSlideComponent
    },
    {
        path: 'goldminer',
        component: PlantTreeComponent
    },
    {
        path: 'clawmachine',
        component: MyFarmComponent
    },
    {
        path: 'puzzle-match',
        loadChildren: () => import('./puzzle-match/puzzle-match.routes').then(m => m.routes)
    },
];
