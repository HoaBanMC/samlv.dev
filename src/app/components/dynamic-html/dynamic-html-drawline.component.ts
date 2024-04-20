import { Component, ElementRef, Input, Output, OnDestroy, DoCheck, EventEmitter } from '@angular/core';
import { DynamicHTMLRef } from './renderer';
import { InputService } from './inputService';

declare const jsPlumb: any;

@Component({
  selector: 'app-drawline-dynamic-html',
  template: '<div [mathJax]="content" (loadComplete)="loadComplete()"></div>',
})
export class DynamicHTMLDrawlineComponent implements DoCheck, OnDestroy {
  @Input() content: string;
  @Input() answer: any;
  @Output() userResponse = new EventEmitter<object>();
  arrayData = [];
  private ref: DynamicHTMLRef = null;
  jsPlumbInstance;

  constructor(
    // private renderer: DynamicHTMLRenderer,
    private elementRef: ElementRef,
    private inputService: InputService
  ) { }

  // creat listen from element
  loadComplete() {
    if (this.ref) {
      this.ref.destroy();
      this.ref = null;
    }
    if (this.content && this.elementRef) {
      // this.ref = this.renderer.renderInnerHTML(this.elementRef, this.content);
      // MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.elementRef.nativeElement], function () { });
      this.arrayData = [];
      this.inputService.detectItemDataChange().subscribe(res => {
        this.arrayData[res['index']] = res['value'];
        this.userResponse.emit(this.arrayData);
      })
      window['lastSelection'] = '';
      window['jsPlumbInstance'] = jsPlumb.getInstance();
      const box = this.elementRef.nativeElement.querySelectorAll('.custom-box');
      // make customBox run function selectAnswer when click
      for (let i = 0; i < box.length; i++) {
        box[i].addEventListener('click', this.selectAnswer.bind({
          element: box[i]
        }));
      }
      const rowsLeft = this.elementRef.nativeElement.querySelectorAll('.custom-box.left-pointer');
      // set attribute index for custombox left and set arrayData
      for (let rowl = 0; rowl < rowsLeft.length; rowl++) {
        rowsLeft[rowl].setAttribute('index', rowl);
        this.arrayData.push(null);
      }
      // detech zonejs
      window['inputService'].zone.run(() => {
        window['inputService'].service.markDataChange(this.arrayData);
      });
      const resetBtn = this.elementRef.nativeElement.querySelector('#reset') || this.elementRef.nativeElement.querySelector('[id$="reset"]');
      if (resetBtn && !this.answer) {
        resetBtn.addEventListener('click', () => {
          this.clearCanvasGrid();
          this.arrayData = [];
          for (let rowl = 0; rowl < rowsLeft.length; rowl++) {
            rowsLeft[rowl].setAttribute('index', rowl);
            this.arrayData.push(null);
          }
          this.userResponse.emit([]);
        });
      }

      if (this.answer) {
        const rowsRight = this.elementRef.nativeElement.querySelectorAll('.custom-box.right-pointer');

        if (rowsLeft && rowsRight) {
          setTimeout(() => {
            // set data for question answered
            if (Array.isArray(this.answer)) {
              this.answer.forEach(e => {
                const leftanswer = Number(e.substr(0, 1)) - 1;
                rowsLeft[leftanswer].click();
                const rightanswer = Number(e.substr(1, 1)) - 1;
                rowsRight[rightanswer].click();
              });
            }
          }, 100);
        }
      }
    }
  }

  onChange(event) {
    if (event) {
      const inputid = event.target.id.split('_')[1];
      window['inputService'].zone.run(() => {
        window['inputService'].service.markExInputInChange({ 'type': event.target.type, 'inputid': inputid, 'value': event.target.value });
      });
    }
  }

  selectAnswer(event) {
    event = {
      ...event,
      target: event.target.id ? event.target : event.target.parentElement,
      srcElement: event.srcElement.id ? event.srcElement : event.srcElement.parentElement,
    }
    // check item is answer ?
    if (event.target.classList.contains('answered')) { // drawline has been done
      return false;
    }
    // reset selected when double click
    if (window['lastSelection']) {
      event.srcElement.classList.remove('selected');
    }
    // // check
    if (!window['lastSelection'] || window['lastSelection'].srcElement === event.srcElement) {
      window['lastSelection'] = event;
      event.srcElement.classList.add('selected');
    } else {
      if (event.srcElement.classList.contains('right-pointer')) {
        if (window['lastSelection'].srcElement.classList.contains('right-pointer')) {
          return false;
        }
      } else if (event.srcElement.classList.contains('left-pointer')) {
        if (window['lastSelection'].srcElement.classList.contains('left-pointer')) {
          return false;
        }
      }

      if (window['lastSelection'].srcElement.classList.contains('right-pointer')) {
        const idleft = event.srcElement.id;
        const idright = window['lastSelection'].srcElement.id;
        window['jsPlumbInstance'].connect({
          connector: ['Straight', { stub: 5 }],
          source: idleft,
          target: idright,
          anchor: ['Right', 'Left'],
          paintStyle: { stroke: '#456', strokeWidth: 1 },
          endpoint: ['Dot', { radius: 3, hoverClass: 'myEndpointHover' }, { cssClass: 'myCssClass' }]
        });
        const index = event.srcElement.getAttribute('index');
        const value = event.srcElement.getAttribute('value') + window['lastSelection'].srcElement.getAttribute('value');
        window['inputService'].zone.run(() => {
          window['inputService'].service.markItemDataChange({ 'index': index, 'value': value });
        });
      } else if (window['lastSelection'].srcElement.classList.contains('left-pointer')) {
        const idleft = window['lastSelection'].srcElement.id;
        const idright = event.srcElement.id;
        window['jsPlumbInstance'].connect({
          connector: ['Straight', { stub: 5 }],
          source: idleft,
          target: idright,
          anchor: ['Right', 'Left'],
          paintStyle: { stroke: '#456', strokeWidth: 1 },
          endpoint: ['Dot', { radius: 3, hoverClass: 'myEndpointHover' }]
        });
        const index = window['lastSelection'].srcElement.getAttribute('index');
        const value = window['lastSelection'].srcElement.getAttribute('value') + event.srcElement.getAttribute('value');
        window['inputService'].zone.run(() => {
          window['inputService'].service.markItemDataChange({ 'index': index, 'value': value });
        });
      }
      event.srcElement.classList.add('answered');
      window['lastSelection'].srcElement.classList.add('answered');
      window['lastSelection'].srcElement.classList.remove('selected');
      window['lastSelection'] = null;
    }
    return null;
  }

  resizeCanvas() {
  }

  getPoint() {
  }

  clearCanvasGrid() {
    // reset answer question
    window['lastSelection'] = '';
    window['jsPlumbInstance'].reset();
    const listanswer = document.querySelectorAll('.answered');
    const selected = document.querySelectorAll('.selected');
    for (let k = 0; k < selected.length; k++) {
      selected[k].classList.remove('selected')
    }
    for (let i = 0; i < listanswer.length; i++) {
      listanswer[i].classList.remove('answered')
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
      this.ref.destroy();
      this.ref = null;
    }
  }
}
