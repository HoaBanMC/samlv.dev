import {
  Component, ElementRef, Input, Output,
  OnDestroy, DoCheck, OnInit, EventEmitter
} from '@angular/core';

import { DynamicHTMLRef } from './renderer';
import { InputService } from './inputService';

import dragula from "../../../assets/js/dragula/dragula";

@Component({
  selector: 'app-dragdrop-multiple-dynamic-html',
  template: '<div [mathJax]="content" (loadComplete)="loadComplete()"></div>',
})
export class DynamicDragDropMultipleHTMLComponent implements OnInit, DoCheck, OnDestroy {
  @Input() content: string;
  @Input() answer: any;
  @Output() userResponse = new EventEmitter<object>();
  arrayData = [];
  private ref: DynamicHTMLRef = null;

  constructor(
    // private renderer: DynamicHTMLRenderer,
    private elementRef: ElementRef,
    private inputService: InputService,
  ) {

  }
  ngOnInit() {
    this.inputService.detectExInputInChange().subscribe((dragula_: any) => {
      if (dragula_ && dragula_.dragula) {
        // this.arrayData = dragula_.dragula;
        let checkExist = false;
        for (let i = 0; i < dragula_.dragula.length; i++) {
          if (dragula_.dragula.length && dragula_.dragula.length > 0 && dragula_.dragula[i] !== null) {
            checkExist = true;
          }
        }
        if (checkExist && dragula_) {
          this.arrayData = dragula_.dragula;
        } else {
          this.arrayData = [];
        }
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
      const dragulas = this.elementRef.nativeElement.getElementsByClassName('dragula');
      const boxDragula = this.elementRef.nativeElement.getElementsByClassName('box-dragula');
      const listDrag = this.elementRef.nativeElement.getElementsByClassName('list-drag');
      const elListDrag = listDrag[0].children;
      window['arrayDataDrop'] = [];
      const containers = [];
      for (let i = 0; i < dragulas.length; i++) {
        containers.push(dragulas[i]);
      }
      for (let i = 0; i < elListDrag.length; i++) {
        elListDrag[i].setAttribute('data-index', i);
        window['arrayDataDrop'].push(null);
      }
      for (let i = 0; i < boxDragula.length; i++) {
        boxDragula[i].setAttribute('data-index', i);
      }
      const drake = dragula({
        containers: containers,
        revertOnSpill: true,
        direction: 'horizontal'
      });
      let scrollable = true;
      const listener = function (e) {
        if (!scrollable) {
          e.preventDefault();
        }
      }
      document.addEventListener('touchmove', listener, { passive: false });
      drake.on('drag', function (_el, _source) {
        scrollable = false;
      }).on('dragend', function (_el, _source) {
        scrollable = true;
        // your logic on dragend
      });
      drake.on('drop', function (el, target, _source, _sibling) {
        scrollable = false;
        // const elVal = el.getAttribute('value');
        // const tarVal = target.getAttribute('value');
        const elIndex = el.getAttribute('data-index');
        const tarIndex = target.getAttribute('data-index');
        // const obj = window['arrayDataDrop'].find(o => o.value === tarVal);
        if (target.classList.contains('list-drag')) {
          window['arrayDataDrop'][elIndex] = null;
        } else {
          window['arrayDataDrop'][elIndex] = Number(tarIndex) + 1;
        }
        window['inputService'].zone.run(() => {
          window['inputService'].service.markExInputInChange({ 'dragula': window['arrayDataDrop'] });
        });
      });
      // set data for question answered
      if (Array.isArray(this.answer)) {
        let j = 0;
        this.answer.forEach(function (e) {
          if (e !== null) {
            const indexOfBox = Number(e) - 1;
            dragula(elListDrag[j], boxDragula[indexOfBox]);
            boxDragula[indexOfBox].appendChild(elListDrag[j]);
          } else {
            j++;
          }
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
      this.ref.destroy();
      this.ref = null;
    }
  }
}
