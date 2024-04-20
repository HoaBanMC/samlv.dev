import {
  Component, ElementRef, Input, Output,
  OnDestroy, DoCheck, OnInit, EventEmitter
} from '@angular/core';

import { DynamicHTMLRef } from './renderer';
import { InputService } from './inputService';

@Component({
  selector: 'app-dynamic-html-circle-character',
  template: '<div [mathJax]="content" (loadComplete)="loadComplete()"></div>',
})
export class DynamicHtmlCircleCharacterComponent implements OnInit, DoCheck, OnDestroy {
  @Input() content: string;
  @Input() question: any;
  @Output() userResponse = new EventEmitter<object>();
  arrayData = [];
  private ref: DynamicHTMLRef = null;
  jsPlumbInstance;

  constructor(
    // private renderer: DynamicHTMLRenderer,
    private elementRef: ElementRef,
    private inputService: InputService
  ) { }

  ngOnInit() {
    // listen change form html
    this.inputService.detectDataChange().subscribe((res: any) => {
      if (res && res.length && res.length > 0) {
        this.userResponse.emit(res);
      } else {
        this.userResponse.emit(null);
      }
    });
  }

  // creat listen from element
  loadComplete() {
    if (this.ref) {
      this.ref.destroy();
      this.ref = null;
    }
    if (this.content && this.elementRef) {
      // this.ref = this.renderer.renderInnerHTML(this.elementRef, this.content);
      // MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.elementRef.nativeElement], function () { });
      const selects = this.elementRef.nativeElement.getElementsByClassName('form-check-input');
      for (let i = 0; i < selects.length; i++) {
        selects[i].addEventListener('click', () => {
          this.selectAnswer(selects[i]);
        });
      }

      if (this.question && this.question.userOptionText) {
        for (let i = 0; i < this.question.userOptionText.length; i++) {
          const ques = this.question.userOptionText[i];
          const ans = this.elementRef.nativeElement.querySelectorAll('[id=mathplay-answer-' + ques + ']');
          if (ans && ans.length > 0) {
            ans[0].parentElement.classList.add('isChoosen');
          }
        }
      }
    }
  }

  ngDoCheck() {
    if (this.ref) {
      this.ref.check();
    }
  }

  selectAnswer(answer) {
    if (answer.parentElement.classList.contains('isChoosen')) {
      answer.parentElement.classList.remove('isChoosen');
    } else {
      answer.parentElement.classList.add('isChoosen');
    }
    window['inputService'].zone.run(() => {
      const selects = [...this.elementRef.nativeElement.getElementsByClassName('form-check-input')].filter((e: any) => {
        return e.checked;
      }).map((e: any) => {
        return e.value;
      });
      window['inputService'].service.markDataChange(selects);
    });
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.destroy();
      this.ref = null;
    }
  }
}
