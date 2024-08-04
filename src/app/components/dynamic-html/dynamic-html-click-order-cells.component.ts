import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, Renderer2 } from '@angular/core';
import { gsap, Power3 } from 'gsap';
import { MathplayAudioService } from './mathlay-audio';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-dynamic-html-click-order-cells",
  template: `
  <div class="question-area">
    <div [mathJax]="content" (loadComplete)="loadComplete()"></div>
    @if (listAnswerOpt?.length) {
      <div class="answer-ordered" [class.mathtype]="mathtype">
        <div class="contains-dozone">
          @for (c of cells; track c) {
            <div class="doZone"></div>
          }
        </div>
        <div class="buttons" id="buttonsZone">
          @for (opt of listAnswerOpt; track opt; let index = $index) {
            <div class="item" [class.answered]="isExplain" [attr.value]="mathtype ? opt.mathtype : opt.text"
              id="button-{{index}}">
              <span [mathJax]="opt.text"></span>
            </div>
          }
        </div>
      </div>
    }
  </div>
  `
})
export class DynamicHtmlClickOrderCellsComponent implements OnDestroy {
  @Output() userResponse = new EventEmitter<object>();
  @Input() content: string;
  @Input() isExplain? = false;
  @Input() answer?: any;
  @Input() questionId;
  configDiv: any;
  listItems: any[] = [];
  listAnswerOpt: any[] = [];
  userAnswer: any[] = [];
  cells = [];
  audioSubscription: Subscription;
  mathtype = false;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private mathplayAudioService: MathplayAudioService
  ) { }

  loadComplete(): void {
    this.configDiv = this.elementRef.nativeElement.querySelector("#config") || this.elementRef.nativeElement.querySelector('[id$="config"]');
    const config = this.configDiv?.getAttribute("config") ? JSON.parse(this.configDiv?.getAttribute("config")) : null;
    this.mathtype = config?.value?.mathtype;
    this.listAnswerOpt = config?.value?.questions;
    this.listAnswerOpt = this.listAnswerOpt?.map(x => {
      return {
        text: x,
        mathtype: x.replaceAll("\\", "\\\\")
      }
    });
    for (let index = 0; index < config?.value?.cells; index++) {
      this.cells.push(index);
    }
    this.createListItems();
  }

  createListItems() {
    setTimeout(() => {
      if (this.elementRef && this.elementRef.nativeElement) {
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

        this.listItems = [];
        this.elementRef.nativeElement.querySelectorAll('.item').forEach((e: any) => {
          this.listItems.push({ element: e, zone: e.parentNode });
        });
        if (this.listItems && this.listItems?.length > 0) {
          this.listItems.forEach(item => {
            item.element.addEventListener('click', this.selectButton.bind(this, item, true));
          });
        }

        if (this.isExplain || this.answer?.length && this.listItems?.length) {
          const hasClicked = [];
          this.answer?.forEach((ans: any) => {
            const index = this.listItems.findIndex(item => item.element.getAttribute('value') === ans &&
              !hasClicked.includes(item.element.getAttribute('id')));
            if (this.listItems[index]) {
              hasClicked.push(this.listItems[index].element.getAttribute('id'));
              this.selectButton(this.listItems[index], false);
            }
          });
        }
      }
    }, 500);
  }

  selectButton(item: any, isDoing: boolean) {
    if (item?.element) {
      const doZones = this.elementRef.nativeElement.querySelectorAll('.doZone');
      const buttonsZone = this.elementRef.nativeElement.querySelector('#buttonsZone') || this.elementRef.nativeElement.querySelector('[id$="buttonsZone"]');
      const elementRect = item?.element?.getBoundingClientRect();
      const clone = { element: item.element.cloneNode(true), zone: item.element.parentNode };
      if (item.zone === buttonsZone) {
        for (const zone of doZones) {
          if (zone.querySelectorAll('.item')?.length === 0) {
            zone.appendChild(clone.element);
            clone.zone = zone;
            clone.element.addEventListener('click', this.selectButton.bind(this, clone));
            this.listItems.push(clone);
            item.element.classList.add('select-item');
            this.gsapTranslate(elementRect, clone.element);
            this.userAnswer.push(item.element.getAttribute('value'));
            break;
          }
        }
      } else {
        const itemId = item.element.id;
        for (const zone of doZones) {
          if (zone.querySelectorAll('.item')[0]?.id === itemId) {
            zone.removeChild(item.element);
            break;
          }
        }
        this.userAnswer = [];
        doZones.forEach((zone: any) => {
          if (zone.querySelectorAll('.item')?.length !== 0) {
            this.userAnswer.push(zone.querySelectorAll('.item')[0].getAttribute('value'));
          }
        });
        this.listItems = this.listItems.filter((item: any) => item.element.id !== itemId);
        buttonsZone.querySelectorAll('.item')?.forEach((button: any) => {
          if (button.id === itemId) {
            button.classList.remove('select-item');
            this.gsapTranslate(elementRect, button);
          }
        });
      }
      if (isDoing) this.userResponse.emit(this.userAnswer);
    }
  }

  gsapTranslate(fromRect: any, element: any) {
    gsap.set(element, { x: 0, y: 0 });
    const newRect = element.getBoundingClientRect();
    gsap.from(element, { duration: 0.3, x: fromRect.left - newRect.left, y: fromRect.top - newRect.top, ease: Power3.easeOut });
  }

  ngOnDestroy() {
    this.audioSubscription?.unsubscribe();
    if (this.mathplayAudioService?.audio) this.mathplayAudioService.setStateAudio('off');
  }
}
