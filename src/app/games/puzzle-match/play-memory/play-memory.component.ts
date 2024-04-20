import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { checkAnswer, EnumTypeCard, EnumTypeNotQues, listOption, shuffleArray, SOUND_MATCH, STORE_NAME } from '../common/config';
import { questions } from '../questions';
import { QuestionsComponent } from '../questions/questions.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MathjaxModule } from '../../../components/mathjax/mathjax.module';
import { ModalCommonComponent } from '../../../components/modal-common/modal-common.component';
import { ModalCommonService } from '../../../components/modal-common/modal-common.service';
import { MODAL_ID } from '../../../components/modal-common/modal-id.const';

@Component({
  selector: 'app-play-memory',
  standalone: true,
  imports: [CommonModule, ModalCommonComponent, QuestionsComponent, FormsModule, MathjaxModule],
  templateUrl: './play-memory.component.html',
  styleUrls: ['./play-memory.component.scss']
})
export class PlayMemoryComponent implements OnInit, OnDestroy {
  @ViewChild('cardWrapperDiv') cardWrapperEl: ElementRef;

  matchInfo;
  EnumTypeNotQues = EnumTypeNotQues;
  EnumTypeCard = EnumTypeCard;

  showReplayBtn = false;

  listOption = listOption;
  teamCount = 2;
  gridSizeSelected = 4;

  listTeam = [];
  optionPickTeam;
  listQuestion = questions;
  winnerTeam;
  selectedQuestion;

  selectedCard = [];

  idOpenCard = MODAL_ID.GAMES.PUZZLE_MATCH.OPEN_CARD;
  idWinCard = MODAL_ID.GAMES.PUZZLE_MATCH.WIN_CARD;
  idEditTeam = MODAL_ID.GAMES.PUZZLE_MATCH.EDIT_TEAM;
  idInitGameFlip = MODAL_ID.GAMES.PUZZLE_MATCH.INIT_FLIP_GAME;

  correctSrc = '/assets/audios/correct.wav';
  incorrectSrc = '/assets/audios/incorrect.wav';
  doneSrc = '/assets/audios/done.mp3';
  audio;
  isSoundOn = true;
  subscription: Subscription;

  listImg = ['elephant', 'giraffe', 'hippo', 'monkey', 'panda', 'parrot', 'penguin', 'pig', 'rabbit', 'snake'];

  constructor(
    private modalCommonService: ModalCommonService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.gridSizeSelected = this.listQuestion?.length;
    this.subscription = this.activatedRoute.queryParams.subscribe((q: any) => {
      if (q['team'] && q['size']) {
        const localInfo = JSON.parse(localStorage.getItem(STORE_NAME.MEMORY)) || {};
        if (!localInfo?.listCard?.length) {
          const data = {
            team: this.teamCount,
            size: this.gridSizeSelected
          };
          localStorage.setItem(STORE_NAME.MEMORY, JSON.stringify(data));
        }
        this.initGame();
      } else {
        const localInfo = JSON.parse(localStorage.getItem(STORE_NAME.MEMORY)) || {};
        if (!localInfo?.listCard?.length) {
          const data = {
            team: this.teamCount,
            size: this.gridSizeSelected
          };
          localStorage.setItem(STORE_NAME.MEMORY, JSON.stringify(data));
          setTimeout(() => {
            this.modalCommonService.openModal(this.idInitGameFlip);
          }, 500);
        } else {
          this.initGame();
        }
      }
    });
    if (localStorage.getItem(SOUND_MATCH)) {
      this.isSoundOn = JSON.parse(localStorage.getItem(SOUND_MATCH));
    } else {
      this.isSoundOn = true;
      localStorage.setItem(SOUND_MATCH, JSON.stringify(this.isSoundOn));
    }
  }

  playMatch() {
    const data = {
      team: this.teamCount,
      size: this.gridSizeSelected
    };
    localStorage.setItem(STORE_NAME.MEMORY, JSON.stringify(data));
    this.initGame();
    this.modalCommonService.closeModal(this.idInitGameFlip);
  }

  changeTeam(opt) {
    this.teamCount = opt.team;
  }

  changeSize(index) {
    this.gridSizeSelected = index;
  }

  initGame() {
    const localInfo = JSON.parse(localStorage.getItem(STORE_NAME.MEMORY)) || {};
    if (localInfo && (!localInfo['listCard']?.length || localInfo['state'] === 1)) {
      this.matchInfo = {
        team: localInfo.team,
        size: localInfo.size
      };
      this.matchInfo['teamInfo'] = [...Array(this.matchInfo.team).keys()].map((x: any) => {
        return {
          id: x + 1,
          score: 0,
          name: 'Team ' + (x + 1)
        }
      });
      this.matchInfo['currentTeam'] = 1;
      const _wrapperRect = this.cardWrapperEl?.nativeElement?.getBoundingClientRect();
      if (_wrapperRect) {
        let _colCount = 2;
        if (this.matchInfo.size < 8) {
          _colCount = this.matchInfo.size / 2;
        } else {
          _colCount = 4;
        }
        const _rowCount = Math.floor(this.matchInfo.size / _colCount) + (this.matchInfo.size % _colCount > 0 ? 1 : 0);
        if (_rowCount > _colCount) {
          const _w = (((_wrapperRect.width > _wrapperRect.height) ? _wrapperRect.height : _wrapperRect.width) - 30) / _rowCount;
          this.matchInfo['cardSize'] = {
            width: _w,
            wrapperWidth: _w * _colCount
          };
        } else if (_rowCount < _colCount) {
          const _w = (((_wrapperRect.width > _wrapperRect.height) ? _wrapperRect.height : _wrapperRect.width) - 30) / _colCount;
          this.matchInfo['cardSize'] = {
            width: _w,
            wrapperWidth: _w * _colCount
          };
        } else {
          if (_wrapperRect.width > _wrapperRect.height) {
            this.matchInfo['cardSize'] = {
              width: (_wrapperRect.height - 30) / _colCount,
              wrapperWidth: ((_wrapperRect.height - 30) / _colCount) * _colCount
            };
          } else {
            this.matchInfo['cardSize'] = {
              width: (_wrapperRect.width - 30) / _colCount,
              wrapperWidth: ((_wrapperRect.width - 30) / _colCount) * _colCount
            };
          }
        }
        const _tempArr = [...Array(this.matchInfo.size / 2).keys()].map((x) => {
          return {
            code: x + 1,
            img: this.pickImg()
          }
        });
        this.matchInfo.listCard = [..._tempArr, ..._tempArr].map((x, index) => {
          return {
            ...x,
            id: index + 1
          }
        });
        this.matchInfo.listCard = shuffleArray(this.matchInfo.listCard);
        this.matchInfo['listCard'] = this.matchInfo.listCard.map((x, index) => {
          return {
            ...x,
            id: index + 1
          }
        });
      }
      this.listTeam = this.matchInfo.teamInfo;
      this.matchInfo.state = 0;
      localStorage.setItem(STORE_NAME.MEMORY, JSON.stringify(this.matchInfo));
    } else {
      this.matchInfo = localInfo;
      // this.matchInfo.listCard = shuffleArray(this.matchInfo.listCard);
      this.listTeam = this.matchInfo.teamInfo;
    }
    // console.log(this.matchInfo.listCard);
  }

  pickImg() {
    const _img = this.listImg[this.getRandomNumber(this.listImg)];
    this.listImg = this.listImg.filter(x => x !== _img);
    return _img
  }

  replayMatch() {
    this.modalCommonService.closeModal(this.idWinCard);
    this.showReplayBtn = false;
    this.selectedCard = [];
    this.selectedQuestion = null;
    this.listQuestion = questions?.map(x => {
      x.dataStandard['userOptionText'] = [];
      return x;
    });
    this.initGame();
  }

  soundConfig() {
    this.isSoundOn = !this.isSoundOn;
    localStorage.setItem(SOUND_MATCH, JSON.stringify(this.isSoundOn));
  }

  saveEditTeam() {
    this.matchInfo.teamInfo = this.listTeam;
    localStorage.setItem(STORE_NAME.MEMORY, JSON.stringify(this.matchInfo));
    this.modalCommonService.closeModal(this.idEditTeam);
  }

  userAnswer(event) {
    this.selectedQuestion.question.dataStandard.userOptionText = event.answer;
  }

  checkEndGame() {
    const state = this.matchInfo.listCard.every(x => x.hasFlip);
    const _checkTier = this.matchInfo.teamInfo.every(x => x.score === this.matchInfo.teamInfo[0].score);
    if (state && !_checkTier) {
      console.log('end!');
      this.winnerTeam = this.matchInfo.teamInfo?.reduce((minTeam, currentTeam) => {
        return currentTeam.score >= minTeam.score ? currentTeam : minTeam;
      });
      this.matchInfo.state = 1;
      localStorage.setItem(STORE_NAME.MEMORY, JSON.stringify(this.matchInfo));

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
      }, 2000);
    } else if (state && _checkTier) {
      console.log('tier');
      this.winnerTeam = {};
      this.matchInfo.state = 1;
      localStorage.setItem(STORE_NAME.MEMORY, JSON.stringify(this.matchInfo));

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
      }, 2000);
    }
  }

  submitAnswer() {
    if (this.matchInfo.state === 1) return;
    const _checkDoing = checkAnswer(this.selectedQuestion.question.dataStandard.answerFreeText,
      this.selectedQuestion.question.dataStandard.userOptionText);

    this.selectedQuestion.hasFlip = true;
    this.selectedQuestion.question.dataStandard.showAnswer = true;
    this.selectedQuestion.doRight = _checkDoing;
    this.selectedQuestion.teamAnswer = this.matchInfo.currentTeam;

    this.matchInfo.listCard.forEach(y => {
      if (y.id === this.selectedCard[0].id || y.id === this.selectedCard[1].id) {
        y.hasFlip = true;
        y.doRight = _checkDoing;
      }
    });

    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    } else {
      this.audio = new Audio();
    }
    if (_checkDoing) {
      this.audio.src = this.correctSrc;
      this.matchInfo.teamInfo = this.matchInfo.teamInfo.map(x => {
        const updatedScore = x.id === this.selectedQuestion.teamAnswer ? (x.score + this.selectedQuestion.score) : x.score;
        return {
          ...x,
          score: updatedScore,
        }
      });
    } else {
      this.audio.src = this.incorrectSrc;
    }

    if (this.isSoundOn) {
      this.audio.play();
    }
    localStorage.setItem(STORE_NAME.MEMORY, JSON.stringify(this.matchInfo));
  }

  changeScoreEffect(_teamId) {
    const _targetT = this.listTeam.find(x => x.id === _teamId);
    const _changedT = this.matchInfo.teamInfo.find(x => x.id === _teamId);

    if (_targetT.score < _changedT.score) {
      const _interval = setInterval(() => {
        if (this.listTeam.find(x => x.id === _teamId)?.score >= _changedT.score) {
          clearInterval(_interval);
        } else {
          this.listTeam = this.listTeam.map(x => {
            return {
              ...x,
              score: x.id === _teamId ? x.score + 1 : x.score
            }
          });
        }
      }, 35);
    } else if (_targetT.score > _changedT.score) {
      const _interval = setInterval(() => {
        if (this.listTeam.find(x => x.id === _teamId)?.score <= _changedT.score) {
          clearInterval(_interval);
        } else {
          this.listTeam = this.listTeam.map(x => {
            return {
              ...x,
              score: x.id === _teamId ? x.score - 1 : x.score
            }
          });
        }
      }, 35);
    }
  }

  selectCard(card) {
    if (this.selectedCard?.length > 1 || this.selectedCard?.findIndex(x => x.id === card.id) !== -1) return;
    this.selectedCard.push(card);
    if (this.selectedCard.length === 2) {
      const _checkSame = this.selectedCard.every(x => x.code === this.selectedCard[0].code);
      if (_checkSame) {
        setTimeout(() => {
          this.selectedQuestion = this.pickQuestion();
          this.modalCommonService.openModal(this.idOpenCard);
        }, 1000);
      } else {
        setTimeout(() => {
          this.selectedCard = [];
          if (this.matchInfo.currentTeam === this.matchInfo.team) {
            this.matchInfo.currentTeam = 1;
          } else {
            this.matchInfo.currentTeam++;
          }
        }, 2500);
      }
    }
  }

  pickQuestion() {
    const quesReturn = this.listQuestion[this.getRandomNumber(this.listQuestion)];
    this.listQuestion = this.listQuestion.filter(x => x.dataStandard.stepId !== quesReturn.dataStandard.stepId)
    return {
      question: quesReturn,
      hasFlip: false,
      text: '',
      image: '',
      options: [],
      score: 20,
      type: EnumTypeCard.QUESTION
    }
  }

  closeOpenCard(id) {
    if (id === 'idOpenCard') {
      this.selectedCard = [];
      this.changeScoreEffect(this.selectedQuestion.teamAnswer);
      this.selectedQuestion = null;

      if (this.matchInfo.state !== 1) {
        this.checkEndGame();
      }

      setTimeout(() => {
        if (this.matchInfo.currentTeam === this.matchInfo.team) {
          this.matchInfo.currentTeam = 1;
        } else {
          this.matchInfo.currentTeam++;
        }
      }, 500);

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

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
