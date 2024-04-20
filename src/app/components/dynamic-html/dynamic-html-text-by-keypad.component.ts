import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, Renderer2 } from '@angular/core';
import { MathplayAudioService } from './mathlay-audio';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-dynamic-html-text-by-keypad",
  template: `
  <div [mathJax]="content" (loadComplete)="loadComplete()"></div>
  <div class="caculator" *ngIf="displayPad">
    <div class="message" [class.hidden]="!showError">Hãy chọn một ô cần nhập!</div>
    <div class="keynumbers">
        <div *ngFor="let k of listChars" class="numberkey" attr.value="{{k}}">{{k}}</div>
        <div class="numberkey backspace" value="backspace" title="Xoá"></div>
    </div>
  </div>`
})
export class DynamicHtmlTextByKeypadComponent implements OnDestroy {
  @Output() userResponse = new EventEmitter<object>();
  @Input() content: string;
  @Input() isExplain? = false;
  @Input() answer?: any;
  listInput: any;
  @Input() displayPad = true;
  @Input() questionId;
  inputFocused: any;
  listKeys: any;
  showError = false;
  listChars: any;
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

    const configDiv = this.elementRef.nativeElement.querySelector("#config") || this.elementRef.nativeElement.querySelector('[id$="config"]');
    const config = configDiv?.getAttribute("config") ? JSON.parse(configDiv?.getAttribute("config")) : null;

    const splitArr = config.map(x => x.split('')).reduce((x, y) => x.concat(y));
    this.listChars = this.shuffle([...new Set(splitArr)]);

    this.listInput = this.elementRef.nativeElement.querySelectorAll('input');
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
  }

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  ngOnDestroy() {
    this.audioSubscription?.unsubscribe();
    if (this.mathplayAudioService?.audio) this.mathplayAudioService.setStateAudio('off');
  }
}