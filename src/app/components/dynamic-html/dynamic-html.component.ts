import { Component, ElementRef, Input, Output, OnDestroy, DoCheck, OnInit, EventEmitter, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { DynamicHTMLRef } from './renderer';
import { InputService } from './inputService';
import { MathplayAudioService } from './mathlay-audio';

@Component({
  selector: 'app-dynamic-html',
  template: '<div [mathJax]="content" (loadComplete)="loadComplete()"></div>',
})
export class DynamicHTMLComponent implements OnInit, DoCheck, OnDestroy {
  @Input() content: string;
  @Input() answer: any;
  @Input() initTest?: any;
  @Input() questionId?: string;
  @Input() isRunning = true;
  @Output() userResponse = new EventEmitter<object>();
  arrayData = [];
  private ref: DynamicHTMLRef = null;
  keypadsubscription: Subscription;
  inputServicesubscription: Subscription;
  audioSubscription: Subscription;
  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private inputService: InputService,
    private mathplayAudioService: MathplayAudioService
  ) { }

  ngOnInit() {
    // listen change form html
    this.arrayData = [];
    this.inputServicesubscription = this.inputService.detectExInputInChange().subscribe((obj: any) => {
      if (this.content?.includes(obj?.id)) {
        if (obj && obj.inputid) {
          if (obj.type === 'radio') {
            this.arrayData = [];
            this.arrayData.push(obj.value);
          } else if (obj.type === 'text' || obj.type === 'number' || obj.type === 'textarea') {
            this.arrayData[obj.inputid - 1] = obj.value;
          } else if (obj.type === 'checkbox') {
            // check is checked . if checked then remove it from array
            const check = this.arrayData?.indexOf(obj.value);
            if (check > -1) { // isset item in array then remove it
              this.arrayData.splice(check, 1);
            } else {
              this.arrayData.push(obj.value);
              if (this.arrayData && this.arrayData.length > 1) {
                const sortData = this.arrayData.sort((a, b) => (a > b ? 1 : -1));
                this.arrayData = sortData;
              }
            }
          }
          this.userResponse.emit(this.arrayData);
        }
      }

    });
    // this.keypadsubscription = this.keypadService.keypadChange$.subscribe(keypadChange => {
    //   if (keypadChange && window['currentInput']) {
    //     if (keypadChange === 'del') {
    //       window['currentInput'].srcElement.value = window['currentInput'].srcElement.value.slice(0, -1);
    //     } else {
    //       window['currentInput'].srcElement.value = window['currentInput'].srcElement.value + keypadChange;
    //     }
    //     this.onChange(window['currentInput']);
    //   }
    // });
  }

  resize(hide, txt, flag) {
    hide.textContent = txt.value;
    if (flag) {
      txt.style.width = '30px';
    } else {
      txt.style.width = hide.offsetWidth + 'px';
    }
  }

  resizeSecond(hide, txt, flag) {
    hide.textContent = txt.value;
    const lengthContent = txt.value ? txt.value.length : 0;
    if (flag) {
      txt.style.width = '30px';
    } else {
      txt.style.width = hide.offsetWidth + lengthContent + 'px';
    }
  }

  // creat listen from element

  loadComplete() {
    this.arrayData = [];
    let showkeypad = false;
    if (this.ref) {
      this.ref.destroy();
      this.ref = null;
    }
    if (this.content && this.elementRef) {
      this.mathplayAudioService.destroyAudio();
      // for audio template
      const playAudioEl = this.elementRef.nativeElement.querySelectorAll(this.questionId ? '.play-audio-' + this.questionId : '.play-audio');
      const playAudioSlowEl = this.elementRef.nativeElement.querySelectorAll(this.questionId ? '.play-audio-slow-' + this.questionId : '.play-audio-slow');
      if (playAudioEl?.length) {
        this.audioSubscription = this.mathplayAudioService.$audioEnded.subscribe((ended) => {
          if (ended) {
            playAudioSlowEl[0]?.classList.remove('clickAudioSlow');
            playAudioEl[0]?.classList.remove('clickAudio', 'clickAudioSmall');
            this.mathplayAudioService.setStateAudio('off');
          }
        })

        this.renderer.listen(playAudioEl[0], 'click', () => {
          this.mathplayAudioService.setAudio(playAudioEl[0]?.getAttribute('audio'));
          this.mathplayAudioService.setPlaybackRate(1);
          playAudioSlowEl[0]?.classList.remove('clickAudioSlow');

          if (this.mathplayAudioService.audioState !== 'normal') {
            this.mathplayAudioService.setStateAudio('normal');
            playAudioEl[0]?.classList.add('clickAudio', 'clickAudioSmall');
          } else {
            this.mathplayAudioService.setStateAudio('off');
            playAudioEl[0]?.classList.remove('clickAudio', 'clickAudioSmall');
          }
        });

        if (playAudioSlowEl?.length) {
          this.renderer.listen(playAudioSlowEl[0], 'click', () => {
            this.mathplayAudioService.setAudio(playAudioEl[0]?.getAttribute('audio'));
            this.mathplayAudioService.setPlaybackRate(0.75);
            playAudioEl[0].classList.remove('clickAudio', 'clickAudioSmall');

            if (this.mathplayAudioService.audioState !== 'slow') {
              this.mathplayAudioService.setStateAudio('slow');
              playAudioSlowEl[0].classList.add('clickAudioSlow');
            } else {
              this.mathplayAudioService.setStateAudio('off');
              playAudioSlowEl[0].classList.remove('clickAudioSlow');
            }
          });
        }
      }

      const playAudioOptionEl = this.elementRef.nativeElement.querySelectorAll('.play-audio-option');
      if (playAudioOptionEl?.length) {
        playAudioOptionEl.forEach((element: any) => {
          this.renderer.listen(element, 'click', () => {
            this.mathplayAudioService.setAudio(element?.getAttribute('audio'));
            this.mathplayAudioService.setPlaybackRate(1);
            this.audioSubscription = this.mathplayAudioService.$audioEnded.subscribe((ended) => {
              if (ended) {
                element?.classList.remove('opacityAudio');
                this.mathplayAudioService.setStateAudio('off');
              }
            });

            if (this.mathplayAudioService.audioState !== 'normal') {
              this.mathplayAudioService.setStateAudio('normal');
              element?.classList.add('opacityAudio');
            } else {
              this.mathplayAudioService.setStateAudio('off');
              element?.classList.remove('opacityAudio');
            }
          });
        });
      }

      // this.ref = this.renderer.renderInnerHTML(this.elementRef, this.content);
      // MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.elementRef.nativeElement], function () { });
      let inputs = this.elementRef.nativeElement.querySelectorAll('input');
      const textarea = this.elementRef.nativeElement.querySelectorAll('textarea');
      inputs = [...inputs, ...textarea];

      setTimeout(() => {
        if (!this.isRunning) {
          inputs.forEach(input => {
            input.disabled = true;
          })
        } else {
          inputs.forEach(input => {
            input.disabled = false;
          });
        }
      }, 500)
      for (let index = 0; index < inputs.length; index++) {
        const checkInput = inputs[index].id.split('-')[1];
        const position = inputs[index].id.split('-')[2];
        // for question input text
        if ((inputs[index].type === 'text' || inputs[index].type === 'number' || inputs[index].type === 'textarea') && checkInput === 'answer') {
          showkeypad = true;
          inputs[index].setAttribute('autocomplete', 'off');
          // if (this.detectmob()) {
          //   inputs[index].setAttribute('readonly', 'readonly');
          // }

          inputs[index].addEventListener('keyup', this.onChange);
          inputs[index].addEventListener('click', this.isCurrentInput);

          // set data for question answered input
          if (Array.isArray(this.answer)) {
            inputs[index].value = this.answer[position - 1] || '';
          }
          this.arrayData.push(inputs[index].value);

        } else if (checkInput === 'answer') { // reclick button when reload answered question
          if (inputs[index].type === 'checkbox') { inputs[index].checked = false; }
          inputs[index].addEventListener('change', this.onChange);
          if (this.answer && Array.isArray(this.answer) && this.answer.length === 1) {
            const labels = this.elementRef.nativeElement.querySelectorAll('label');
            if (this.answer[0] === inputs[index].value) {
              inputs[index].click();
              for (let i = 0; i < labels.length; i++) {
                if (labels[i].htmlFor.includes(inputs[index].id)) {
                  // labels[i].style.border = "3px solid #ffb953";
                  break;
                }
                // console.log(1);
              }
            }
          } else if (this.answer && Array.isArray(this.answer) && this.answer.length > 1) {
            for (let j = 0; j < this.answer.length; j++) {
              if (this.answer[j] === inputs[index].value) {
                inputs[index].click();
                break;
              }
            }
          }
        }
        if (this.answer?.length) {
          this.userResponse.emit(this.answer);
        }
      }
      // detect show keypad
      window['inputService'].zone.run(() => {
        window['inputService'].service.markExKeypadShow(showkeypad);
      });

      const listInputResize = this.elementRef.nativeElement.querySelectorAll('.can-resize');
      if (listInputResize && listInputResize.length > 0) {
        for (let i = 0; i < listInputResize.length; i++) {
          const hideText = this.elementRef.nativeElement.querySelectorAll('.ans-span');
          if (hideText) {
            const txt = listInputResize[i];
            if (this.answer && Array.isArray(this.answer) && this.answer.length > 0) {
              this.resize(hideText[i], txt, false);
            } else {
              this.resize(hideText[i], txt, true);
              txt.addEventListener('keyup', () => this.resize(hideText[i], txt, false));
            }
          }
        }
      }

      const listInputResize23 = this.elementRef.nativeElement.querySelectorAll('.can-resize-second');
      if (listInputResize23 && listInputResize23.length > 0) {
        for (let i = 0; i < listInputResize23.length; i++) {
          const hideText = this.elementRef.nativeElement.querySelectorAll('.ans-span-second');
          if (hideText) {
            const txt = listInputResize23[i];
            if (this.answer && Array.isArray(this.answer) && this.answer.length > 0) {
              this.resizeSecond(hideText[i], txt, false);
            } else {
              this.resizeSecond(hideText[i], txt, true);
              txt.addEventListener('keyup', () => this.resizeSecond(hideText[i], txt, false));
            }
          }
        }
      }
    }
  }

  // check document in https://blog.thoughtram.io/angular/2017/02/21/using-zones-in-angular-for-better-performance.html
  onChange(event) {
    if (event) {
      const inputid = event.target.id.split('-')[2];


      window['inputService'].zone.run(() => {
        window['inputService'].service.markExInputInChange({ id: event.target.id, 'type': event.target.type, 'inputid': +inputid, 'value': event.target.value });
        const obj = { 'type': event.target.type, 'inputid': +inputid, 'value': event.target.value };
        if (obj && obj.inputid) {
          if (obj.type === 'radio') {
            this.arrayData = [];
            this.arrayData.push(obj.value);
          } else if (obj.type === 'text' || obj.type === 'number' || obj.type === 'textarea') {
            this.arrayData = [];
            this.arrayData[obj.inputid - 1] = obj.value;
          } else if (obj.type === 'checkbox') {
            // check is checked . if checked then remove it from array
            const check = this.arrayData?.indexOf(obj.value);
            if (check > -1) { // isset item in array then remove it
              this.arrayData.splice(check, 1);
            } else {
              this.arrayData = [];
              this.arrayData?.push(obj.value);
              if (this.arrayData && this.arrayData?.length > 1) {
                const sortData = this.arrayData?.sort((a, b) => (a > b ? 1 : -1));
                this.arrayData = sortData;
              }
            }
          }
          if (this.userResponse) {
            this.userResponse.emit(this.arrayData);
          }
        }
      });
    }
  }

  isCurrentInput(event) {
    if (event) {
      window['currentInput'] = event;
      event.preventDefault();
      window['inputService'].zone.run(() => {
        window['inputService'].service.markExKeypadShow(true);
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  replaceSelectedText(_replacementText) {
    // let sel, range;
    // if (window.getSelection) {
    //     sel = window.getSelection();
    //     if (sel.rangeCount) {
    //         range = sel.getRangeAt(0);
    //         range.deleteContents();
    //         range.insertNode(document.createTextNode(replacementText));
    //     }
    // } else if (document.selection && document.selection.createRange) {
    //     range = document.selection.createRange();
    //     range.text = replacementText;
    // }
  }
  setInputTextValue() { }

  ngDoCheck() {
    if (this.ref) {
      this.ref.check();
    }
  }

  ngOnDestroy() {
    this.audioSubscription?.unsubscribe();
    if (this.mathplayAudioService?.audio) {
      this.mathplayAudioService.setStateAudio('off');
      this.mathplayAudioService.audio = null;
    }

    if (this.keypadsubscription) {
      this.keypadsubscription.unsubscribe();
    }
    if (this.inputServicesubscription) {
      this.inputServicesubscription.unsubscribe();
    }
    window['inputService'].zone.run(() => {
      window['inputService'].service.destroyInputInChange();
    });
    if (this.ref) {
      this.answer = [];
      this.arrayData = [];
      this.ref.destroy();
      this.ref = null;
    }
  }
}
