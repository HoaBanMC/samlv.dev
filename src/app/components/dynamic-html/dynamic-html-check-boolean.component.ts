import {
  Component, ElementRef, Input, Output,
  OnDestroy, DoCheck, OnInit, EventEmitter
} from '@angular/core';

import { DynamicHTMLRef } from './renderer';
import { InputService } from './inputService';

@Component({
  selector: 'app-dynamic-check-boolean-html',
  template: '<div [mathJax]="content" (loadComplete)="loadComplete()"></div>',
})
export class DynamicCheckBooleanHTMLComponent implements OnInit, DoCheck, OnDestroy {
  @Input() question?: any;
  @Input() content?: string;
  @Input() isRunning = true;

  @Input() isTesting?: any;
  @Input() answer?: any;
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
    this.inputService.detectDataChange().subscribe((res: any) => {
      if (res && res.length && res.length > 0) {
        this.question = this.question || {};
        if (!this.isTesting) {
          this.question.userOptionText = JSON.parse(JSON.stringify(res));
        }
        this.userResponse.emit(res);
      }
    });
  }
  // creat listen from element
  loadComplete() {
    window['inputService'].zone.run(() => {
      window['inputService'].service.destroyInputInChange();
    });
    this.question = {};
    if (this.ref) {
      this.ref.destroy();
      this.ref = null;
    }
    if (this.content && this.elementRef) {
      // this.ref = this.renderer.renderInnerHTML(this.elementRef, this.content);
      // // MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.elementRef.nativeElement], function () { });
      const questions = this.elementRef.nativeElement.getElementsByClassName('mathplay-question');
      const selects = this.elementRef.nativeElement.getElementsByClassName('form-check-input');
      window['Questions'] = [];
      window['inputService'].zone.run(() => {
        window['inputService'].service.markDataChange([]);
      });
      // list child question number
      for (let i = 0; i < questions.length; i++) {
        // creat list answer question empty
        window['Questions'].push(null); // [0: null, 1: null, ....]
        const child = questions[i].querySelectorAll('.form-check-input');
        // add data-index for child radio
        for (let x = 0; x < child.length; x++) {
          child[x].setAttribute('data-index', i);
        }
      }

      // add listen event click for radio button
      for (let i = 0; i < selects.length; i++) {
        // selects[i].addEventListener('click', this.checkBoxSelected.bind({
        //   element: selects[i]
        // }));
        if (selects[i]) {
          if (this.isRunning) {
            selects[i].disabled = false;
            selects[i].addEventListener('click', this.checkBoxSelected.bind({
              element: selects[i]
            }));
          } else {
            selects[i].disabled = true;

            selects[i].removeEventListener('click', this.checkBoxSelected.bind({
              element: selects[i]
            }));
          }
        }


      }
    }
    // set data from answered
    if (this.answer?.length) {
      const listQuestions = this.elementRef.nativeElement.querySelectorAll('.mathplay-question')
      this.answer?.forEach((element, index) => {
        window['Questions'][index] = element;

        if (listQuestions && listQuestions[index]
          && listQuestions[index].querySelector(`input[value="${element}"]`)
          && listQuestions[index].querySelector(`input[value="${element}"]`).parentElement.querySelector('label')) {
          listQuestions[index].querySelector(`input[value="${element}"]`)
            .parentElement.querySelector('label').style.background = '#17bcba';
        }

      });
    }
  }

  checkBoxSelected(event: any) {
    const el = event.srcElement;
    const questionIndex = el.getAttribute('data-index');
    const questionName = el.getAttribute('name');
    const radiosName: any = document.getElementsByName(questionName);
    let val = null;
    for (let i = 0, length = radiosName.length; i < length; i++) {
      if (radiosName[i].checked) {
        val = radiosName[i].value;
        window['Questions'][questionIndex] = val;
        window['inputService'].zone.run(() => {
          window['inputService'].service.markDataChange(window['Questions']);
        });
        break;
      }
    }
  }

  ngDoCheck() {
    if (this.ref) {
      this.ref.check();
    }
  }

  ngOnDestroy() {
    window['inputService'].zone.run(() => {
      window['inputService'].service.destroyInputInChange();
    });
    this.question = null;
    if (this.ref) {
      this.ref.destroy();
      this.ref = null;
    }
  }
}
