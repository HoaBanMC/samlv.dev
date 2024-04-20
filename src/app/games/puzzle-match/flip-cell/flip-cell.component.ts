import { Component, OnDestroy, OnInit } from '@angular/core';
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
  selector: 'app-flip-cell',
  standalone: true,
  imports: [CommonModule, ModalCommonComponent, QuestionsComponent, FormsModule, MathjaxModule],
  templateUrl: './flip-cell.component.html',
  styleUrls: ['./flip-cell.component.scss']
})
export class FlipCellComponent implements OnInit, OnDestroy {
  matchInfo;
  EnumTypeNotQues = EnumTypeNotQues;
  EnumTypeCard = EnumTypeCard;

  showReplayBtn = false;

  cardSize = {
    width: 16.66,
    height: 25,
    row: 0,
    col: 0
  };

  listOption = listOption;
  teamCount = 2;
  gridSizes = this.listOption[1];
  gridSizeSelected;

  listTeam = [];
  optionPickTeam;
  listQuestion = questions;
  winnerTeam;
  selectedCard;
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

  constructor(
    private modalCommonService: ModalCommonService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.queryParams.subscribe((q: any) => {
      if (q['team'] && q['size']) {
        const localInfo = JSON.parse(localStorage.getItem(STORE_NAME.FLIP_CELL)) || {};
        if (!localInfo?.listCard?.length) {
          const data = {
            team: this.teamCount,
            size: this.gridSizes?.size[this.gridSizeSelected]
          };
          localStorage.setItem(STORE_NAME.FLIP_CELL, JSON.stringify(data));
        }
        this.initGame();
      } else {
        const localInfo = JSON.parse(localStorage.getItem(STORE_NAME.FLIP_CELL)) || {};
        if (localInfo && (!localInfo['listCard']?.length || localInfo['state'] === 1)) {
          if (this.listQuestion?.length >= this.gridSizes?.size[0]) {
            this.gridSizeSelected = 0;
            const data = {
              team: this.teamCount,
              size: this.gridSizes?.size[this.gridSizeSelected]
            };
            localStorage.setItem(STORE_NAME.FLIP_CELL, JSON.stringify(data));
          } else {
            this.gridSizeSelected = null;
          }
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
    if ((this.listQuestion?.length + 3) < this.gridSizes?.size[0]) {
      console.log('listQuestion must large than size!');
      return;
    }
    const data = {
      team: this.teamCount,
      size: this.gridSizes?.size[this.gridSizeSelected]
    };
    localStorage.setItem(STORE_NAME.FLIP_CELL, JSON.stringify(data));
    this.initGame();
    this.modalCommonService.closeModal(this.idInitGameFlip);
  }

  changeTeam(opt) {
    this.teamCount = opt.team;
    this.gridSizes = opt;
    if (this.gridSizeSelected > this.gridSizes?.size.length - 1) {
      this.gridSizeSelected = this.gridSizes?.size.length - 1;
    }
  }

  changeSize(index) {
    this.gridSizeSelected = index;
  }

  initGame() {
    const localInfo = JSON.parse(localStorage.getItem(STORE_NAME.FLIP_CELL)) || {};
    if (localInfo && (!localInfo['listCard']?.length || localInfo['state'] === 1)) {
      this.matchInfo = {
        team: localInfo.team,
        size: localInfo.size
      };
      this.matchInfo['teamInfo'] = [...Array(this.matchInfo.team).keys()].map((x: any) => {
        return {
          id: x + 1,
          score: 0,
          oldScore: 0,
          name: 'Team ' + (x + 1)
        }
      });
      this.matchInfo['currentTeam'] = 1;
      switch (this.matchInfo.size) {
        case 8:
          this.cardSize = {
            width: 100 / 4,
            height: 50,
            row: 2,
            col: 4
          }
          break
        case 9:
          this.cardSize = {
            width: 100 / 3,
            height: 100 / 3,
            row: 3,
            col: 3
          }
          break
        case 15:
          this.cardSize = {
            width: 100 / 5,
            height: 100 / 3,
            row: 3,
            col: 5
          }
          break
        case 16:
          this.cardSize = {
            width: 100 / 4,
            height: 100 / 4,
            row: 4,
            col: 4
          }
          break
        case 24:
          this.cardSize = {
            width: 100 / 6,
            height: 100 / 4,
            row: 4,
            col: 6
          }
          break
        default:
          break
      }

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
            id: idCount,
            zIndex: idCount
          }
        });
      });
      this.listTeam = this.matchInfo.teamInfo;
      this.matchInfo.state = 0;
      localStorage.setItem(STORE_NAME.FLIP_CELL, JSON.stringify(this.matchInfo));
    } else {
      this.matchInfo = localInfo;
      switch (this.matchInfo.size) {
        case 8:
          this.cardSize = {
            width: 100 / 4,
            height: 50,
            row: 2,
            col: 4
          }
          break
        case 9:
          this.cardSize = {
            width: 100 / 3,
            height: 100 / 3,
            row: 3,
            col: 3
          }
          break
        case 15:
          this.cardSize = {
            width: 100 / 5,
            height: 100 / 3,
            row: 3,
            col: 5
          }
          break
        case 16:
          this.cardSize = {
            width: 100 / 4,
            height: 100 / 4,
            row: 4,
            col: 4
          }
          break
        case 24:
          this.cardSize = {
            width: 100 / 6,
            height: 100 / 4,
            row: 4,
            col: 6
          }
          break
        default:
          break
      }
      this.listTeam = this.matchInfo.teamInfo;
    }
    // console.log(this.matchInfo);
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
    this.matchInfo.teamInfo = this.listTeam;
    localStorage.setItem(STORE_NAME.FLIP_CELL, JSON.stringify(this.matchInfo));
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

  checkEndGame() {
    const _tempArr = [].concat(...this.matchInfo.listCard);
    const state = _tempArr.every(x => x.hasFlip);
    const _checkTier = this.matchInfo.teamInfo.every(x => x.score === _tempArr[0].score);
    if (state && !_checkTier) {
      console.log('end!');
      this.winnerTeam = this.matchInfo.teamInfo?.reduce((minTeam, currentTeam) => {
        return currentTeam.score >= minTeam.score ? currentTeam : minTeam;
      });
      this.matchInfo.state = 1;
      localStorage.setItem(STORE_NAME.FLIP_CELL, JSON.stringify(this.matchInfo));

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
      localStorage.setItem(STORE_NAME.FLIP_CELL, JSON.stringify(this.matchInfo));

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

  submitNotQues(_options) {
    if (this.matchInfo.state === 1) return;

    this.matchInfo.listCard.forEach(x => x.forEach(y => {
      if (y.id === this.selectedCard.id) {
        y.teamAnswer = this.matchInfo.currentTeam;
        y.hasFlip = true;
        y.zIndex = 0;
      }
    }));
    if (!_options && this.matchInfo.teamInfo?.length === 2) {
      _options = { pickTeam: this.selectedCard.teamAnswer === 1 ? 2 : 1 };
    }
    this.optionPickTeam = _options;
    switch (this.selectedCard.code) {
      case EnumTypeNotQues.WIN_POINT: {
        this.matchInfo.teamInfo = this.matchInfo.teamInfo.map(x => {
          const updatedScore = x.id === this.selectedCard.teamAnswer ? (x.score + this.selectedCard.bonusPoint) : x.score;
          return {
            ...x,
            score: updatedScore,
            oldScore: x.score
          }
        });
        break;
      }
      case EnumTypeNotQues.OTHER_TEAM_LOSE_POINT:
        {
          this.matchInfo.teamInfo = this.matchInfo.teamInfo.map(x => {
            const updatedScore = x.id === this.optionPickTeam.pickTeam ? (x.score - this.selectedCard.bonusPoint) : x.score;
            return {
              ...x,
              score: updatedScore,
              oldScore: x.score
            }
          });
          break;
        }
      case EnumTypeNotQues.SWAP_POINT_WITH_TEAM:
        {
          const _t1 = this.matchInfo.teamInfo.findIndex(x => x.id === this.selectedCard.teamAnswer);
          const _t2 = this.matchInfo.teamInfo.findIndex(x => x.id === this.optionPickTeam.pickTeam);
          const _tempScore = this.matchInfo.teamInfo[_t1].score;
          this.matchInfo.teamInfo[_t1].score = this.matchInfo.teamInfo[_t2].score;
          this.matchInfo.teamInfo[_t2].score = _tempScore;
          break;
        }
      case EnumTypeNotQues.TAKE_POINT_FROM_TEAM:
        {
          this.matchInfo.teamInfo.forEach(x => {
            if (x.id === this.selectedCard.teamAnswer) {
              x.score += this.selectedCard.bonusPoint;
            }
            if (x.id === this.optionPickTeam.pickTeam) {
              x.score -= this.selectedCard.bonusPoint;
            }
          });
          break;
        }
      case EnumTypeNotQues.GIVE_POINT_TO_TEAM:
        {
          this.matchInfo.teamInfo.forEach(x => {
            if (x.id === this.selectedCard.teamAnswer) {
              x.score -= this.selectedCard.bonusPoint;
            }
            if (x.id === this.optionPickTeam.pickTeam) {
              x.score += this.selectedCard.bonusPoint;
            }
          });
          break;
        }
      case EnumTypeNotQues.LOSE_POINT:
        {
          this.matchInfo.teamInfo = this.matchInfo.teamInfo.map(x => {
            const updatedScore = x.id === this.selectedCard.teamAnswer ? (x.score - this.selectedCard.bonusPoint) : x.score;
            return {
              ...x,
              score: updatedScore,
              oldScore: x.score
            }
          });
          break;
        }
      case EnumTypeNotQues.OTHER_TEAM_WIN_POINT:
        {
          this.matchInfo.teamInfo = this.matchInfo.teamInfo.map(x => {
            const updatedScore = x.id === this.optionPickTeam.pickTeam ? (x.score + this.selectedCard.bonusPoint) : x.score;
            return {
              ...x,
              score: updatedScore,
              oldScore: x.score
            }
          });
          break;
        }
      case EnumTypeNotQues.GO_LAST_PLACE:
        {
          const _findLastTeam = this.matchInfo.teamInfo?.reduce((minTeam, currentTeam) => {
            return currentTeam.score < minTeam.score ? currentTeam : minTeam;
          });
          if (_findLastTeam.id !== this.selectedCard.teamAnswer) {
            this.matchInfo.teamInfo = this.matchInfo.teamInfo.map(x => {
              const updatedScore = x.id === this.selectedCard.teamAnswer ? _findLastTeam.score - 5 : x.score;
              return {
                ...x,
                score: updatedScore,
                oldScore: x.score
              }
            });
          } else if (this.matchInfo.teamInfo.every(x => x.score === this.matchInfo.teamInfo[0].score)) {
            this.matchInfo.teamInfo = this.matchInfo.teamInfo.map(x => {
              const updatedScore = x.id === this.selectedCard.teamAnswer ? x.score - 5 : x.score;
              return {
                ...x,
                score: updatedScore,
                oldScore: x.score
              }
            });
          }
          break;
        }
      case EnumTypeNotQues.GO_FIRST_PLACE:
        {
          const _findFirstTeam = this.matchInfo.teamInfo?.reduce((minTeam, currentTeam) => {
            return currentTeam.score >= minTeam.score ? currentTeam : minTeam;
          });
          if (_findFirstTeam.id !== this.selectedCard.teamAnswer) {
            this.matchInfo.teamInfo = this.matchInfo.teamInfo.map(x => {
              const updatedScore = x.id === this.selectedCard.teamAnswer ? _findFirstTeam.score + 5 : x.score;
              return {
                ...x,
                score: updatedScore,
                oldScore: x.score
              }
            });
          } else if (this.matchInfo.teamInfo.every(x => x.score === this.matchInfo.teamInfo[0].score)) {
            this.matchInfo.teamInfo = this.matchInfo.teamInfo.map(x => {
              const updatedScore = x.id === this.selectedCard.teamAnswer ? x.score + 5 : x.score;
              return {
                ...x,
                score: updatedScore,
                oldScore: x.score
              }
            });
          }
          break;
        }
      default:
        break;
    }

    if (this.isSoundOn) {
      if (this.audio) {
        this.audio.pause();
        this.audio.currentTime = 0;
      } else {
        this.audio = new Audio();
      }
      this.audio.src = this.correctSrc;
      this.audio.play();
    }

    this.changeScoreEffect(this.selectedCard.teamAnswer);
    this.changeScoreEffect(this.optionPickTeam.pickTeam);

    if (this.matchInfo.currentTeam === this.matchInfo.team) {
      this.matchInfo.currentTeam = 1;
    } else {
      this.matchInfo.currentTeam++;
    }

    this.modalCommonService.closeModal(this.idOpenCard);
    this.checkEndGame();
    localStorage.setItem(STORE_NAME.FLIP_CELL, JSON.stringify(this.matchInfo));
  }

  submitAnswer() {
    if (this.matchInfo.state === 1) return;
    const _checkDoing = checkAnswer(this.selectedCard.question.dataStandard.answerFreeText,
      this.selectedCard.question.dataStandard.userOptionText);
    this.matchInfo.listCard.forEach(x => x.forEach(y => {
      if (y.id === this.selectedCard.id) {
        y.teamAnswer = this.matchInfo.currentTeam;
        y.hasFlip = true;
        y.question.dataStandard.showAnswer = true;
        y.zIndex = 0;
        y.doRight = _checkDoing;
      }
    }));

    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    } else {
      this.audio = new Audio();
    }
    if (_checkDoing) {
      this.audio.src = this.correctSrc;
      this.matchInfo.teamInfo = this.matchInfo.teamInfo.map(x => {
        const updatedScore = x.id === this.selectedCard.teamAnswer ? (x.score + this.selectedCard.score) : x.score;
        return {
          ...x,
          score: updatedScore,
          oldScore: x.score
        }
      });
    } else {
      this.audio.src = this.incorrectSrc;
    }

    if (this.isSoundOn) {
      this.audio.play();
    }

    localStorage.setItem(STORE_NAME.FLIP_CELL, JSON.stringify(this.matchInfo));
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
    this.selectedCard = card;
    this.modalCommonService.openModal(this.idOpenCard);
  }

  shufferCards() {
    const _listQues = [];
    let _notQuesCount = 3;
    if (this.matchInfo.size === 15 || this.matchInfo.size === 16) {
      _notQuesCount = 4;
    } else if (this.matchInfo.size === 24) {
      _notQuesCount = 6;
    }
    for (let index = 0; index < this.matchInfo.size - _notQuesCount; index++) {
      _listQues.push(this.pickQuestion());
    }
    const _listNotQues = this.pickNotQues(_notQuesCount);
    const _tmpArr = shuffleArray([..._listQues, ..._listNotQues]);
    return _tmpArr;
  }

  pickNotQues(_notQuesCount) {
    const listOptionNoQues = [];
    const _bonusPoint = [10, 15, 20, 25, 30, 35];
    let _enum2Object = Object.entries(EnumTypeNotQues).map(([value, id]) => ({ id: +id, value: value })).filter(x => !isNaN(+x.id));
    if (this.matchInfo.team === 1) {
      _enum2Object = _enum2Object.filter(x => x.id === EnumTypeNotQues.WIN_POINT || x.id === EnumTypeNotQues.LOSE_POINT);
    }

    for (let index = 0; index < _notQuesCount; index++) {
      const _randT = _enum2Object[this.getRandomNumber(_enum2Object)];
      switch (_randT.id) {
        case EnumTypeNotQues.WIN_POINT: {
          const _bP = _bonusPoint[this.getRandomNumber(_bonusPoint)];
          listOptionNoQues.push({
            id: index,
            question: null,
            text: `Được cộng ${_bP} điểm`,
            image: '',
            bonusPoint: _bP,
            code: EnumTypeNotQues.WIN_POINT,
            type: EnumTypeCard.NOT_QUES
          });
          break;
        }
        case EnumTypeNotQues.OTHER_TEAM_LOSE_POINT:
          {
            const _bP = _bonusPoint[this.getRandomNumber(_bonusPoint)];
            listOptionNoQues.push({
              id: index,
              question: null,
              text: `Đội khác bị trừ ${_bP} điểm`,
              bonusPoint: _bP,
              image: '',
              code: EnumTypeNotQues.OTHER_TEAM_LOSE_POINT,
              type: EnumTypeCard.NOT_QUES
            });
            break;
          }
        case EnumTypeNotQues.SWAP_POINT_WITH_TEAM:
          {
            listOptionNoQues.push({
              id: index,
              question: null,
              text: `Hoán đổi điểm của đội khác`,
              image: '',
              code: EnumTypeNotQues.SWAP_POINT_WITH_TEAM,
              type: EnumTypeCard.NOT_QUES
            });
            break;
          }
        case EnumTypeNotQues.TAKE_POINT_FROM_TEAM:
          {
            const _bP = _bonusPoint[this.getRandomNumber(_bonusPoint)];
            listOptionNoQues.push({
              id: index,
              question: null,
              text: `Nhận ${_bP} điểm từ đội khác`,
              bonusPoint: _bP,
              image: '',
              code: EnumTypeNotQues.TAKE_POINT_FROM_TEAM,
              type: EnumTypeCard.NOT_QUES
            });
            break;
          }
        case EnumTypeNotQues.GIVE_POINT_TO_TEAM:
          {
            const _bP = _bonusPoint[this.getRandomNumber(_bonusPoint)];
            listOptionNoQues.push({
              id: index,
              question: null,
              text: `Tặng ${_bP} điểm cho đội khác`,
              bonusPoint: _bP,
              image: '',
              code: EnumTypeNotQues.GIVE_POINT_TO_TEAM,
              type: EnumTypeCard.NOT_QUES
            });
            break;
          }
        case EnumTypeNotQues.LOSE_POINT:
          {
            const _bP = _bonusPoint[this.getRandomNumber(_bonusPoint)];
            listOptionNoQues.push({
              id: index,
              question: null,
              text: `Bị trừ ${_bP} điểm`,
              bonusPoint: _bP,
              image: '',
              code: EnumTypeNotQues.LOSE_POINT,
              type: EnumTypeCard.NOT_QUES
            });
            break;
          }
        case EnumTypeNotQues.OTHER_TEAM_WIN_POINT:
          {
            const _bP = _bonusPoint[this.getRandomNumber(_bonusPoint)];
            listOptionNoQues.push({
              id: index,
              question: null,
              text: `Đội khác được cộng ${_bP} điểm`,
              bonusPoint: _bP,
              image: '',
              code: EnumTypeNotQues.OTHER_TEAM_WIN_POINT,
              type: EnumTypeCard.NOT_QUES
            });
            break;
          }
        case EnumTypeNotQues.GO_LAST_PLACE:
          {
            listOptionNoQues.push({
              id: index,
              question: null,
              text: `Xếp hạng bét`,
              image: '',
              code: EnumTypeNotQues.GO_LAST_PLACE,
              type: EnumTypeCard.NOT_QUES
            });
            break;
          }
        case EnumTypeNotQues.GO_FIRST_PLACE:
          {
            listOptionNoQues.push({
              id: index,
              question: null,
              text: `Xếp hạng nhất`,
              image: '',
              code: EnumTypeNotQues.GO_FIRST_PLACE,
              type: EnumTypeCard.NOT_QUES
            });
            break;
          }
        default:
          break;
      }
    }
    return listOptionNoQues;
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
      if (this.selectedCard?.teamAnswer &&
        this.selectedCard.hasFlip &&
        this.selectedCard.type === EnumTypeCard?.QUESTION) {
        this.changeScoreEffect(this.selectedCard?.teamAnswer);

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
        localStorage.setItem(STORE_NAME.FLIP_CELL, JSON.stringify(this.matchInfo));
      }

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
