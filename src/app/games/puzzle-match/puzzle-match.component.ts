import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { questions } from './questions';
import { QuestionsComponent } from './questions/questions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LIST_GAME } from './common/config';
import { ModalCommonComponent } from '../../components/modal-common/modal-common.component';
import { MODAL_ID } from '../../components/modal-common/modal-id.const';
import { ModalCommonService } from '../../components/modal-common/modal-common.service';

@Component({
  selector: 'app-puzzle-match',
  standalone: true,
  imports: [
    QuestionsComponent,
    FormsModule,
    ReactiveFormsModule,
    ModalCommonComponent
],
  templateUrl: './puzzle-match.component.html',
  styleUrls: ['./puzzle-match.component.scss'],
})
export class PuzzleMatchComponent implements OnInit {
  isCheckShowHide = false;
  listQuestion = questions;

  listGame = LIST_GAME;

  idPickGame = MODAL_ID.GAMES.PUZZLE_MATCH.PICK_GAME;

  constructor(
    private changeDef: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalCommonService: ModalCommonService
  ) { }

  ngOnInit(): void {
    console.log('list-game!');

  }

  pickGame(game) {
    if (game.code) {
      localStorage.removeItem(`${game.code}-match-config`);
      this.router.navigate([`./${game.code}`], { relativeTo: this.activatedRoute });
    }
  }

  playMatch() {
    this.modalCommonService.openModal(this.idPickGame);
  }

  onShowHide() {
    this.isCheckShowHide = !this.isCheckShowHide;
    this.changeDef.detectChanges();
    // this.listQuestion = this.mapQuestions(this.listQuestion, this.isCheckShowHide);
  }

  mapQuestions(quesList, state) {
    return quesList.map(x => {
      x.dataStandard['showAnswer'] = state;
      return x;
    });
  }

  closeOpenCard() {
    this.modalCommonService.closeModal(this.idPickGame);
  }
}
