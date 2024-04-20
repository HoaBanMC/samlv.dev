import {
  Component, ElementRef, Input, Output,
  OnDestroy, DoCheck, OnInit, EventEmitter
} from '@angular/core';

import { DynamicHTMLRef } from './renderer';
import { InputService } from './inputService';

@Component({
  selector: 'app-dynamic-colorpicker-html',
  template: '<div [mathJax]="content" (loadComplete)="loadComplete()"></div>',

})
export class DynamicColorPickerHTMLComponent implements OnInit, DoCheck, OnDestroy {
  @Input() question: any;
  @Input() content: string;
  @Input() answer;
  @Output() userResponse = new EventEmitter<object>();
  arrayData = [];
  private ref: DynamicHTMLRef = null;

  constructor(
    // private renderer: DynamicHTMLRenderer,
    private elementRef: ElementRef,
    private inputService: InputService
  ) { }

  ngOnInit() {
    // listen change form html
    if (this.answer && this.answer.length) {
      this.arrayData = JSON.parse(JSON.stringify(this.answer));

    }
    this.inputService.detectExInputInChange().subscribe((obj: any) => {
      if (obj && obj.id) {
        this.arrayData[obj.id - 1] = obj.value;
        this.userResponse.emit(this.arrayData);
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
      // MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.elementRef.nativeElement], function() {});
      const selects = this.elementRef.nativeElement.getElementsByClassName('mathplay-select');
      const listColor = [];

      for (let index = 0; index < selects.length; index++) {
        selects[index].addEventListener('click', this.onClickSelect);
        listColor.push({
          name: selects[index].getAttribute('value'),
          element: selects[index]
        })
      }
      const answer = this.elementRef.nativeElement.getElementsByClassName('mathplay-answer');
      this.arrayData = [];
      for (let index = 0; index < answer.length; index++) {
        answer[index].addEventListener('click', this.onClickAnswer);
        if (!this.answer || !this.answer.length) {
          this.arrayData.push(null);
        }
      }
      if (this.answer && this.answer.length) {
        this.answer.forEach((a, i) => {
          if (listColor && listColor.length) {
            const ele = listColor.find(color => color.name === a)
            if (ele) {
              ele.element.click();

            } else {
              return;
            }
          }
          if (answer[i]) {
            answer[i].click();

          }
        });
      }
    }

    if (this.question && this.question.userOptionText && this.question.userOptionText.length > 0) {
      this.question.userOptionText.forEach((element, index) => {
        const ans = this.elementRef.nativeElement.querySelectorAll('[id=mathplay-answer-' + (index + 1) + ']');
        if (element && ans && ans.length > 0) {
          switch (element.toLowerCase()) {
            case 'xanh':
              ans[0].style.backgroundColor = '#77e34d';
              break;
            case 'cam':
              ans[0].style.backgroundColor = '#ff731f';
              break;
            case 'xanh1':
              ans[0].style.backgroundColor = '#1e69f6';
              break;
            case 'do':
              ans[0].style.backgroundColor = '#ff0000';
              break;
            case 'nau':
              ans[0].style.backgroundColor = '#a52a2a';
              break;
            case 'vang':
              ans[0].style.backgroundColor = '#ffff00';
              break;
            default:
              break;
          }
        }
      });
    }
  }

  // check document in https://blog.thoughtram.io/angular/2017/02/21/using-zones-in-angular-for-better-performance.html
  onClickSelect(event) {
    if (event && event.target.attributes.color && event.target.attributes.value) {
      window['selection'] = {
        color: event.target.attributes.color.nodeValue,
        value: event.target.attributes.value.nodeValue,
      };
    }
  }

  onClickAnswer(event) {
    if (event) {
      if (window['selection']) {
        event.target.style.background = '#' + window['selection'].color;
        const id = event.target.id.split('-')[2];
        window['inputService'].zone.run(() => {
          window['inputService'].service.markExInputInChange({ 'id': id, 'value': window['selection'].value });
        });
      }
    }
  }

  ngDoCheck() {
    if (this.ref) {
      this.ref.check();
    }
  }

  ngOnDestroy() {
    if (this.ref) {
      this.answer = [];
      this.arrayData = [];
      this.ref.destroy();
      this.ref = null;
    }
  }
}
