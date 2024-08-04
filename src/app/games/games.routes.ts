import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { GameWordleComponent } from './game-wordle/game-wordle.component';
import { MyFarmComponent } from './my-farm/my-farm.component';
import { SimpleRPGComponent } from './simple-rpg/simple-rpg.component';
import { PuzzleSlideComponent } from './puzzle-slide/puzzle-slide.component';
import { PlantTreeComponent } from './plant-tree/plant-tree.component';
import { GamesComponent } from './games.component';

export const routes: Routes = [
    {
        path: '',
        component: GamesComponent
    },
];
