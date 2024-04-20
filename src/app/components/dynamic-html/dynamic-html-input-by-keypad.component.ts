import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, Renderer2 } from '@angular/core';
import { MathplayAudioService } from './mathlay-audio';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-dynamic-html-input-by-keypad",
  template: `
  <div [mathJax]="content" (loadComplete)="loadComplete()"></div>
  <div class="caculator" *ngIf="displayPad">
    <div class="message" [class.hidden]="!showError">Hãy chọn một ô cần nhập!</div>
    <div class="keynumbers">
        <div class="rowkeys">
            <div class="numberkey" value="1">1</div>
            <div class="numberkey" value="2">2</div>
            <div class="numberkey" value="3">3</div>
        </div>
        <div class="rowkeys">
            <div class="numberkey" value="4">4</div>
            <div class="numberkey" value="5">5</div>
            <div class="numberkey" value="6">6</div>
        </div>
        <div class="rowkeys">
            <div class="numberkey" value="7">7</div>
            <div class="numberkey" value="8">8</div>
            <div class="numberkey" value="9">9</div>
        </div>
        <div class="rowkeys">
            <div class="numberkey symbol"></div>
            <div class="numberkey" value="0">0</div>
            <div class="numberkey backspace" value="backspace" title="Xoá"></div>
        </div>
    </div>
  </div>`
})
export class DynamicHtmlInputByKeypadComponent implements OnDestroy {
  @Output() userResponse = new EventEmitter<object>();
  @Input() content: string;
  @Input() isExplain? = false;
  @Input() answer?: any;
  @Input() questionId;
  listInput: any;
  @Input() displayPad = true;
  inputFocused: any;
  listKeys: any;
  showError = false;

  userAnswer: string[] = [];
  audioSubscription: Subscription;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private mathplayAudioService: MathplayAudioService
  ) { }


  loadComplete() {
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

    this.listInput = this.elementRef.nativeElement.querySelectorAll('input');
    const symbolValue = this.elementRef.nativeElement.querySelector('.answer-input')?.getAttribute('symbol');
    if (symbolValue) {
      if (this.listInput?.length) {
        this.listInput.forEach((input: any, index: number) => {
          this.renderer.setAttribute(input, 'autocomplete', 'off');
          this.renderer.setAttribute(input, 'inputmode', 'none');

          this.userAnswer.push('');
          this.renderer.listen(input, 'keydown', ($event) => {
            if ($event.key !== 'Backspace') $event.preventDefault();
          });
          this.renderer.listen(input, 'click', () => {
            if (this.inputFocused) this.renderer.removeStyle(this.inputFocused, 'border-color');
            this.inputFocused = input;
            this.renderer.setStyle(input, 'border-color', '#FFA500');
            this.showError = false;
          });
          this.renderer.listen(input, 'blur', () => {
            if (this.inputFocused) {
              this.renderer.setStyle(this.inputFocused, 'border-color', '#FFA500');
            }
          });
          if (index === 0) {
            input.click();
          }
        });
      }

      // this.displayPad = true;
      this.changeDetectorRef.detectChanges();

      this.listKeys = this.elementRef.nativeElement.querySelectorAll('.numberkey');
      if (this.listKeys?.length) {
        const symbolKey = this.elementRef.nativeElement.querySelector('.symbol');
        if (!symbolValue || symbolValue === ' ') {
          this.renderer.setStyle(symbolKey, 'visibility', 'hidden');
        } else {
          symbolKey.textContent = symbolValue;
          this.renderer.setAttribute(symbolKey, 'value', symbolValue);
        }

        const numKeys = Array.from(this.listKeys).filter((input: any) => !(input.getAttribute('value') === 'backspace'));
        numKeys.forEach((key: any) => {
          this.renderer.listen(key, 'click', () => {
            const value = key.getAttribute('value');
            let limitNumber = this.inputFocused.getAttribute('limit');
            if (limitNumber <= 0) limitNumber = undefined;
            if (limitNumber && this.inputFocused.value?.length >= +limitNumber) return;
            this.inputFocused.value += value;
            this.userAnswer[this.inputFocused.id.split('-')[2] - 1] = this.inputFocused.value;
            this.userResponse.emit(this.userAnswer);
            // console.log(this.userAnswer);
          });
        });

        const backspaceKey = this.elementRef.nativeElement.querySelector('.backspace');
        if (backspaceKey) {
          this.renderer.listen(backspaceKey, 'click', () => {
            if (this.inputFocused) {
              if (this.inputFocused?.value.length === 0) return;
              this.inputFocused.value = this.inputFocused?.value.toString().slice(0, -1);
              this.userAnswer[this.inputFocused.id.split('-')[2] - 1] = this.inputFocused.value;
              const checkEmpty = this.userAnswer.every(i => i !== '');
              this.userResponse.emit(checkEmpty ? this.userAnswer : []);
              // console.log(this.userAnswer);
            }
          });
        }
      }

      if (this.answer?.length) {
        this.userAnswer = this.answer;
        this.listInput.forEach((input: any) => {
          if (this.isExplain) this.renderer.setProperty(input, 'disabled', true);
          this.answer?.forEach((ans: string, index: number) => {
            if (index === (input.id.split('-')[2] - 1)) {
              input.textContent = ans;
              this.renderer.setAttribute(input, 'value', ans);
            }
          });
        });
        this.userResponse.emit(this.userAnswer);
      }
    } else {
      // this.displayPad = false;
      if (this.answer?.length || this.isExplain) {
        if (this.listInput?.length) {
          this.listInput.forEach((input: any) => {
            if (this.isExplain) this.renderer.setProperty(input, 'disabled', true);
            this.answer?.forEach((ans: string, index: number) => {
              if (index === (input.id.split('-')[2] - 1)) {
                input.textContent = ans;
                this.renderer.setAttribute(input, 'value', ans);
              }
            });
          });
        }
      } else {
        if (this.listInput?.length) {
          this.listInput.forEach((input: any) => {
            this.userAnswer.push('');
            this.renderer.setStyle(input, 'caret-color', '#ff84a2');

            this.renderer.listen(input, 'keyup', () => {
              this.userAnswer[input.id.split('-')[2] - 1] = input.value;
              this.userResponse.emit(this.userAnswer);
              // console.log(this.userAnswer);
            });
          });
        }
      }
    }
  }

  ngOnDestroy() {
    this.audioSubscription?.unsubscribe();
    if (this.mathplayAudioService?.audio) this.mathplayAudioService.setStateAudio('off');
  }
}