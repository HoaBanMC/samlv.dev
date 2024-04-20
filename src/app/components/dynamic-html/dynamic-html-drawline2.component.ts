import {
  Component, ElementRef, Input, Output,
  OnDestroy, DoCheck, EventEmitter, Renderer2
} from '@angular/core';
import { jsPlumb } from 'jsplumb';
import { MathplayAudioService } from './mathlay-audio';
import { DynamicHTMLRef } from './renderer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-drawline2-dynamic-html',
  template: '<div [mathJax]="content" (loadComplete)="loadComplete()"></div>',
})

export class DynamicHTMLDrawline2Component implements DoCheck, OnDestroy {
  @Input() isViewAnswer = false;
  @Input() hiddenReset = false;
  @Input() typeAnswer = false;
  @Input() content: string;
  @Input() question: any;
  @Input() answer: any;
  @Output() userResponse = new EventEmitter<object>();
  @Input() questionId;
  jsPlumbInstance: any;
  showConnectionToggle = false;
  arrayData = [];
  idLeft: any;
  idRight: any;
  private ref: DynamicHTMLRef = null;
  arrayReconnect = [];
  position = false;
  flagConnect = true;
  audioSubscription: Subscription;

  constructor(
    private elementRef: ElementRef,
    private mathplayAudioService: MathplayAudioService,
    private renderer: Renderer2
  ) {
  }

  loadComplete() {
    if (this.ref) {
      this.ref.destroy();
      this.ref = null;
    }

    if (this.content && this.elementRef) {
      if (this.question && (this.question.question || this.question.explainQuestion || this.question.content)) {
        if (this.question.numberQuestion) {
          if (this.question.status === undefined) {
            this.question.status = 1;
          }
        }
      }

      // for audio template
      const playAudioEl = this.elementRef.nativeElement.querySelectorAll(this.questionId ? '.play-audio-' + this.questionId : '.play-audio');
      if (playAudioEl?.length) {
        playAudioEl.forEach((element: any) => {
          this.renderer.listen(element, 'click', () => {
            this.mathplayAudioService.setAudio(element?.getAttribute('audio'));
            this.mathplayAudioService.setPlaybackRate(1);
            this.audioSubscription = this.mathplayAudioService.$audioEnded.subscribe((ended) => {
              if (ended) {
                element?.classList.remove('spinAudio', 'opacityAudio');
                this.mathplayAudioService.setStateAudio('off');
              }
            });
            if (this.mathplayAudioService.audioState !== 'normal') {
              this.mathplayAudioService.setStateAudio('normal');
              element?.classList.add('spinAudio', 'opacityAudio');
            } else {
              this.mathplayAudioService.setStateAudio('off');
              element?.classList.remove('spinAudio', 'opacityAudio');
            }
          });
        });
      }

      // this.ref = this.renderer.renderInnerHTML(this.elementRef, contentHtml);
      // MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.elementRef.nativeElement], function () { });
      this.jsPlumbInstance = jsPlumb.getInstance();
      if (!this.typeAnswer) {
        const boxs1 = this.elementRef.nativeElement.querySelectorAll('.group1 .cardx');
        boxs1.forEach(element => {
          element.addEventListener('click', this.selectSrc.bind(this));
        });

        const boxs2 = this.elementRef.nativeElement.querySelectorAll('.group2 .cardx');
        boxs2.forEach(element => {
          element.addEventListener('click', this.selectTarget.bind(this));
        });

        const resetBtn = this.elementRef.nativeElement.querySelector('.btn-reset');
        if (resetBtn) {
          if (!this.hiddenReset) {
            resetBtn.addEventListener('click', () => {
              this.flagConnect = true;
              this.clearCanvasGrid();
              this.arrayData = [];
              this.idLeft = null;
              this.idRight = null;
              this.arrayReconnect = [];
              this.userResponse.emit([]);
            });
          } else {
            this.renderer.setStyle(resetBtn, 'visibility', 'hidden');
          }
        }
      } else {
        const boxs3 = this.elementRef.nativeElement.querySelectorAll('.group3 .cardx');
        boxs3.forEach(element => {
          element.addEventListener('click', this.selectSrc.bind(this));
        });
        const boxs4 = this.elementRef.nativeElement.querySelectorAll('.group4 .cardx');
        boxs4.forEach(element => {
          element.addEventListener('click', this.selectTarget.bind(this));
        });

        const resetBtn = this.elementRef.nativeElement.querySelector('#reset') || this.elementRef.nativeElement.querySelector('[id$="reset"]');
        if (resetBtn) {
          resetBtn.style.visibility = 'hidden';
        }
      }
    }

    const topBottom = this.elementRef.nativeElement.getElementsByClassName('top-bottom');
    if (topBottom && topBottom.length > 0) {
      this.position = true;
    } else {
      this.position = false;
    }

    if (this.question && this.question?.userOptionText) {
      const optionText = this.isViewAnswer ? this.question?.answerFreeText : this.question?.userOptionText;
      const group1 = this.elementRef.nativeElement.querySelectorAll(
        this.question.isTestHistory ? '.group1-' + this.questionId : '.group1'
      );
      if (group1 && group1.length > 0) {
        const group2 = this.elementRef.nativeElement.querySelectorAll(
          this.question.isTestHistory ? '.group2-' + this.questionId : '.group2'
        );
        if (this.hiddenReset) {
          this.renderer.setStyle(group1[0], 'pointer-events', 'none');
          this.renderer.setStyle(group2[0], 'pointer-events', 'none');
        }
        for (let i = 0; i < group1[0].children.length; i++) {
          const idLeft = group1[0].children[i].getAttribute('value');
          if (group2 && group2.length > 0) {
            for (let j = 0; j < group2[0].children.length; j++) {
              const idRight = group2[0].children[j].getAttribute('value');
              if (optionText?.length > 0) {
                for (let k = 0; k < optionText.length; k++) {
                  if (optionText[k]) {
                    if ((idLeft + idRight) === optionText[k]) {
                      const gr1 = group1[0].children[i].id;
                      const gr2 = group2[0].children[j].id;
                      if ((isNaN(+gr1.split('-')[0]) && isNaN(+gr2.split('-')[0]) ||
                        (gr1 && gr2 && !this.hiddenReset))) {
                        setTimeout(() => {
                          // this.flagConnect = false;
                          this.connect(gr1, gr2, false);
                        }, 100);
                      }
                      break;
                    }
                  }
                }
              }
            }
          }
        }
        if (this.question?.userOptionText?.length) {
          this.userResponse.emit(this.question?.userOptionText);
        }
      }
    }

    if (this.question && this.question.explainQuestion || this.question?.answerFreeText) {
      const group3 = this.elementRef.nativeElement.querySelectorAll(
        this.question.isTestHistory ? '.group3-' + this.question.stepId : '.group3'
      );
      if (group3 && group3.length > 0) {
        const group4 = this.elementRef.nativeElement.querySelectorAll(
          this.question.isTestHistory ? '.group4-' + this.question.stepId : '.group4'
        );
        if (this.hiddenReset) {
          this.renderer.setStyle(group3[0], 'pointer-events', 'none');
          this.renderer.setStyle(group4[0], 'pointer-events', 'none');
        }
        for (let i = 0; i < group3[0].children.length; i++) {
          const idLeft = group3[0].children[i].getAttribute('value');
          if (group4 && group4.length > 0) {
            for (let j = 0; j < group4[0].children.length; j++) {
              const idRight = group4[0].children[j].getAttribute('value');
              if (this.question.answerFreeText && this.question.answerFreeText.length > 0) {
                for (let k = 0; k < this.question.answerFreeText.length; k++) {
                  if (this.question.answerFreeText[k]) {
                    if ((idLeft + idRight) === this.question.answerFreeText[k]) {
                      const gr1 = group3[0].children[i].id;
                      const gr2 = group4[0].children[j].id;
                      if ((isNaN(+gr1.split('-')[0]) && isNaN(+gr2.split('-')[0]) ||
                        (gr1 && gr2 && !this.hiddenReset))) {
                        setTimeout(() => {
                          // this.flagConnect = false;
                          this.connect(gr1, gr2, false);
                        }, 100);
                      }
                      break;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  replaceAll(string, search, replace) {
    return string.split(search).join(replace);
  }

  selectSrc(event: { currentTarget: { id: string } }) {

    const allCons = this.jsPlumbInstance.getConnections();
    const noConnection = [];
    if (!this.typeAnswer) {
      const actives1 = this.elementRef.nativeElement.querySelectorAll('.group1 .selected');
      actives1.forEach(f => {
        if (allCons.filter(a => a.sourceId === f.id).length < 1) {
          noConnection.push(f);
        }
      });
    } else {
      const actives3 = this.elementRef.nativeElement.querySelectorAll('.group3 .selected');
      actives3.forEach(f => {
        if (allCons.filter(a => a.sourceId === f.id).length < 1) {
          noConnection.push(f);
        }
      });
    }

    noConnection.forEach(f => {
      f.classList.remove('selected');
    });

    this.idLeft = event.currentTarget.id;
    const el = this.elementRef.nativeElement.querySelector('#' + event.currentTarget.id);
    if (el) el.classList.add('selected');

    if (this.idLeft) {
      this.connect(this.idLeft, this.idRight, false);
    }
  }

  selectTarget(event: { currentTarget: { id: string; }; }) {
    const allCons = this.jsPlumbInstance.getConnections();
    const noConnection = [];
    if (!this.typeAnswer) {
      const actives2 = this.elementRef.nativeElement.querySelectorAll('.group2 .selected');
      actives2?.forEach(f => {
        if (allCons.filter(a => a.targetId === f.id).length < 1) {
          noConnection.push(f);
        }
      });
    } else {
      const actives4 = this.elementRef.nativeElement.querySelectorAll('.group4 .selected');
      actives4?.forEach(f => {
        if (allCons.filter(a => a.targetId === f.id).length < 1) {
          noConnection.push(f);
        }
      });
    }

    noConnection.forEach(f => {
      f.classList.remove('selected');
    });

    this.idRight = event.currentTarget.id;
    const el = this.elementRef.nativeElement.querySelector('#' + event.currentTarget.id);
    if (el) el.classList.add('selected');

    if (this.idRight) {
      this.connect(this.idLeft, this.idRight, false);
    }
  }

  connect(src: any, des: any, reconnect: boolean) {
    if (!src || !des) {
      return;
    }
    const allCons = this.jsPlumbInstance.getConnections();
    const currentConLeft = allCons.find(x => x.sourceId === src);
    if (currentConLeft) {
      return;
    }

    const currentRight = allCons.find(y => y.targetId === des);
    if (currentRight) {
      return;
    }

    this.jsPlumbInstance.connect({
      connector: ['Bezier', { curviness: 25 }],
      setDragAllowedWhenFull: true,
      source: src,
      target: des,
      anchor: this.position === true ? ['Top', 'Bottom'] : ['Right', 'Left'],
      paintStyle: { stroke: '#674FFA', strokeWidth: 2 },
      endpoint: ['Dot', { radius: 3, hoverClass: 'myEndpointHover' }, { cssClass: 'myCssClass' }]
    });

    if (!reconnect) {
      this.renderer.addClass(document.getElementById(src), 'selected');
      this.renderer.addClass(document.getElementById(des), 'selected');
      const value = this.elementRef.nativeElement.querySelector('#' + src)?.attributes['value']?.value + this.elementRef.nativeElement.querySelector('#' + des)?.attributes['value']?.value;
      this.arrayData.push(value);
      this.arrayReconnect.push({ src: src, des: des });
      if (this.flagConnect && this.arrayData && this.arrayData.length > 0) {
        this.userResponse.emit(this.arrayData.sort((a, b) => (a > b ? 1 : -1)));
      }
    }
  }

  clearCanvasGrid() {
    this.jsPlumbInstance.reset();
    const listAnswer = this.elementRef.nativeElement.querySelectorAll('.answered');
    const selected = this.elementRef.nativeElement.querySelectorAll('.selected');

    for (let k = 0; k < selected.length; k++) {
      selected[k].classList.remove('selected');
    }

    for (let i = 0; i < listAnswer.length; i++) {
      listAnswer[i].classList.remove('answered');
    }
    this.arrayData = [];
  }

  reConnect() {
    this.clearCanvasGrid();
    setTimeout(() => {
      if (this.arrayReconnect && this.arrayReconnect.length > 0) {
        this.arrayReconnect.forEach(x => {
          this.connect(x.src, x.des, true);
        });
      }
    }, 100);
  }

  ngDoCheck() {
    if (this.ref) {
      this.ref.check();
    }
  }

  ngOnDestroy() {
    this.audioSubscription?.unsubscribe();
    if (this.ref) {
      this.clearCanvasGrid();
      this.answer = [];
      this.question = null;
      this.ref.destroy();
      this.ref = null;
    }
  }
}
