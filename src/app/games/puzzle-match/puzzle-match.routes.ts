import { Routes } from "@angular/router";
import { PuzzleMatchComponent } from "./puzzle-match.component";
import { TicTacToeComponent } from "./tic-tac-toe/tic-tac-toe.component";
import { FlipCellComponent } from "./flip-cell/flip-cell.component";
import { PlayMemoryComponent } from "./play-memory/play-memory.component";
import { MagicDiceComponent } from "./magic-dice/magic-dice.component";

export const routes: Routes = [
  {
    path: '',
    component: PuzzleMatchComponent,
  },
  {
    path: 'flip-cell',
    component: FlipCellComponent,
  },
  {
    path: 'tic-tac-toe',
    component: TicTacToeComponent,
  },
  {
    path: 'play-memory',
    component: PlayMemoryComponent,
  },
  {
    path: 'the-magic-dice',
    component: MagicDiceComponent
  }
]