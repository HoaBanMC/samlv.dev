import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { checkAnswer, EnumTypeNotQues, shuffleArray, SOUND_MATCH, STORE_NAME } from '../common/config';
import { questions } from '../questions';
import { QuestionsComponent } from '../questions/questions.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MathjaxModule } from '../../../components/mathjax/mathjax.module';
import { ModalCommonComponent } from '../../../components/modal-common/modal-common.component';
import { ModalCommonService } from '../../../components/modal-common/modal-common.service';
import { MODAL_ID } from '../../../components/modal-common/modal-id.const';

@Component({
  selector: 'app-tic-tac-toe',
  standalone: true,
  imports: [CommonModule, ModalCommonComponent, QuestionsComponent, FormsModule, MathjaxModule],
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss']
})
export class TicTacToeComponent implements OnInit {
  matchInfo;
  EnumTypeNotQues = EnumTypeNotQues;

  showReplayBtn = false;

  cardSize = {
    row: 3,
    col: 3
  };

  optionPickTeam;
  listQuestion;
  winnerTeam;
  selectedCard;
  idOpenCard = MODAL_ID.GAMES.PUZZLE_MATCH.OPEN_CARD;
  idWinCard = MODAL_ID.GAMES.PUZZLE_MATCH.WIN_CARD;
  idEditTeam = MODAL_ID.GAMES.PUZZLE_MATCH.EDIT_TEAM;

  correctSrc = '/assets/audios/correct.wav';
  incorrectSrc = '/assets/audios/incorrect.wav';
  doneSrc = '/assets/audios/done.mp3';
  audio;

  isSoundOn = true;

  constructor(
    private modalCommonService: ModalCommonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initGame();
    if (localStorage.getItem(SOUND_MATCH)) {
      this.isSoundOn = JSON.parse(localStorage.getItem(SOUND_MATCH));
    } else {
      this.isSoundOn = true;
      localStorage.setItem(SOUND_MATCH, JSON.stringify(this.isSoundOn));
    }
  }

  initGame() {
    const localInfo = JSON.parse(localStorage.getItem(STORE_NAME.TIC_TAC_TOE)) || {};
    if (localInfo && (!localInfo['listCard']?.length || localInfo['state'] === 1)) {
      this.matchInfo = {
        team: 2,
        size: 9,
        teamInfo: [{
          id: 1,
          name: 'Team 1',
        },
        {
          id: 2,
          name: 'Team 2'
        }],
        currentTeam: 1,
        state: 0
      };

      this.listQuestion = questions?.map(x => {
        x.dataStandard['userOptionText'] = [];
        return x;
      });
      const _tempArr = this.shufferCards();
      let idCount = 0;
      this.matchInfo['listCard'] = [...Array(this.cardSize.row).keys()].map(() => {
        return [...Array(this.cardSize.col).keys()].map(() => {
          idCount++;
          return {
            ..._tempArr[idCount - 1],
            id: idCount
          }
        });
      });
      localStorage.setItem(STORE_NAME.TIC_TAC_TOE, JSON.stringify(this.matchInfo));
    } else {
      this.matchInfo = localInfo;
    }
    console.log(this.matchInfo.listCard);
  }

  replayMatch() {
    this.modalCommonService.closeModal(this.idWinCard);
    this.showReplayBtn = false;
    this.initGame();
  }

  soundConfig() {
    this.isSoundOn = !this.isSoundOn;
    localStorage.setItem(SOUND_MATCH, JSON.stringify(this.isSoundOn));
  }

  saveEditTeam() {
    localStorage.setItem(STORE_NAME.TIC_TAC_TOE, JSON.stringify(this.matchInfo));
    this.modalCommonService.closeModal(this.idEditTeam);
  }

  userAnswer(event) {
    this.selectedCard.question.dataStandard.userOptionText = event.answer;
    this.matchInfo.listCard.forEach(x => x.map(y => {
      if (y.id === this.selectedCard.id) {
        y.question.dataStandard.userOptionText = event.answer;
      }
      return y;
    }));
  }

  checkRow(x, y, z, _team) {
    const _tempArr = [].concat(...this.matchInfo.listCard);
    if (_tempArr[x]?.teamAnswer === _team &&
      _tempArr[y]?.teamAnswer === _team &&
      _tempArr[z]?.teamAnswer === _team) {
      return true;
    }
    return false;
  }

  checkDraw() {
    const _tempArr = [].concat(...this.matchInfo.listCard);
    const _allDone = _tempArr.every(x => x.hasFlip);
    if (_allDone) {
      return true;
    }
    return false;
  }

  checkEndGame(_selectedCard) {
    if (this.checkRow(0, 1, 2, _selectedCard.teamAnswer) ||
      this.checkRow(3, 4, 5, _selectedCard.teamAnswer) ||
      this.checkRow(6, 7, 8, _selectedCard.teamAnswer) ||
      this.checkRow(0, 3, 5, _selectedCard.teamAnswer) ||
      this.checkRow(1, 4, 7, _selectedCard.teamAnswer) ||
      this.checkRow(2, 5, 8, _selectedCard.teamAnswer) ||
      this.checkRow(0, 4, 8, _selectedCard.teamAnswer) ||
      this.checkRow(2, 4, 6, _selectedCard.teamAnswer)) {
      console.log('end!');
      this.winnerTeam = this.matchInfo.teamInfo?.find(x => x.id === _selectedCard.teamAnswer);
      this.matchInfo.state = 1;
      localStorage.setItem(STORE_NAME.TIC_TAC_TOE, JSON.stringify(this.matchInfo));
      setTimeout(() => {
        this.modalCommonService.openModal(this.idWinCard);
        if (this.isSoundOn) {
          if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
          } else {
            this.audio = new Audio();
          }
          this.audio.src = this.doneSrc;
          this.audio.play();
        }
      }, 1000);
    } else {
      if (this.checkDraw()) {
        console.log('tier');
        this.winnerTeam = {};
        this.matchInfo.state = 1;
        localStorage.setItem(STORE_NAME.TIC_TAC_TOE, JSON.stringify(this.matchInfo));
        setTimeout(() => {
          this.modalCommonService.openModal(this.idWinCard);
          if (this.isSoundOn) {
            if (this.audio) {
              this.audio.pause();
              this.audio.currentTime = 0;
            } else {
              this.audio = new Audio();
            }
            this.audio.src = this.doneSrc;
            this.audio.play();
          }
        }, 1000);
      }
    }
  }

  submitAnswer() {
    if (this.matchInfo.state === 1) return;
    const _checkDoing = checkAnswer(this.selectedCard.question.dataStandard.answerFreeText,
      this.selectedCard.question.dataStandard.userOptionText);
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    } else {
      this.audio = new Audio();
    }
    if (_checkDoing) {
      this.matchInfo.listCard.forEach(x => x.forEach(y => {
        if (y.id === this.selectedCard.id) {
          y.teamAnswer = this.matchInfo.currentTeam;
          y.hasFlip = true;
          y.question.dataStandard.showAnswer = true;
          y.doRight = _checkDoing;
          y.answered = true;
        }
      }));
      this.audio.src = this.correctSrc;
    } else {
      this.matchInfo.listCard.forEach(x => x.forEach(y => {
        if (y.id === this.selectedCard.id) {
          y.answered = true;
        }
      }));
      this.audio.src = this.incorrectSrc;
    }
    if (this.isSoundOn) {
      this.audio.play();
    }
    localStorage.setItem(STORE_NAME.TIC_TAC_TOE, JSON.stringify(this.matchInfo));
  }

  selectCard(card) {
    if (this.matchInfo.state === 1) return;

    this.selectedCard = card;
    if (this.selectedCard.hasFlip) {
      this.selectedCard['isView'] = true;
      this.selectedCard['answered'] = true;
    } else {
      this.selectedCard['answered'] = false;
    }
    this.modalCommonService.openModal(this.idOpenCard);
  }

  shufferCards() {
    const _listQues = [];
    for (let index = 0; index < 9; index++) {
      _listQues.push(this.pickQuestion());
    }
    const _tmpArr = shuffleArray(_listQues);
    return _tmpArr;
  }


  pickQuestion() {
    const quesReturn = this.listQuestion[this.getRandomNumber(this.listQuestion)];
    this.listQuestion = this.listQuestion.filter(x => x.dataStandard.stepId !== quesReturn.dataStandard.stepId)
    return {
      question: quesReturn,
      hasFlip: false
    }
  }

  closeOpenCard(id) {
    if (id === 'idOpenCard') {
      if (this.selectedCard?.hasFlip && !this.selectedCard['isView']) {
        this.checkEndGame(this.selectedCard);
      }
      this.matchInfo.currentTeam = this.matchInfo.currentTeam === 1 ? 2 : 1;
      localStorage.setItem(STORE_NAME.TIC_TAC_TOE, JSON.stringify(this.matchInfo));
      this.modalCommonService.closeModal(this.idOpenCard);
    } else if (id === 'idWinCard') {
      this.modalCommonService.closeModal(this.idWinCard);
      this.showReplayBtn = true;
    } else if (id === 'idEditTeam') {
      this.modalCommonService.closeModal(this.idEditTeam);
    }
  }

  editTeam() {
    this.modalCommonService.openModal(this.idEditTeam);
  }

  getRandomNumber(arr) {
    return Math.floor(Math.random() * arr?.length)
  }

  exitMatch() {
    this.router.navigate(['./games/puzzle-match']);
  }
}
