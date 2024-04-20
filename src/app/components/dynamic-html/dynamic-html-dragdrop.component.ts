import {
  Component, ElementRef, Input, Output,
  OnDestroy, DoCheck, OnInit, EventEmitter
} from '@angular/core';

import { DynamicHTMLRef } from './renderer';
import { InputService } from './inputService';

import dragula from "../../../assets/js/dragula/dragula";

@Component({
  selector: 'app-dragdrop-dynamic-html',
  template: '<div [mathJax]="content" (loadComplete)="loadComplete()"></div>',
})
export class DynamicDragDropHTMLComponent implements OnInit, DoCheck, OnDestroy {
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
    this.inputService.detectExInputInChange().subscribe((dragular_: any) => {
      if (dragular_ && dragular_.dragula) {
        this.arrayData = [];
        for (let i = 0; i < dragular_.dragula.children.length; i++) {
          this.arrayData.push(dragular_.dragula.children[i].innerHTML);
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
      const dragular_ = this.elementRef.nativeElement.getElementsByClassName('dragula')[0];
      for (let i = 0; i < dragular_.children.length; i++) {
        this.arrayData.push(dragular_.children[i].innerHTML);
      }
      // this.userResponse.emit(this.arrayData);
      const drake = dragula([dragular_]);
      drake.on('dragend', function (_el, _target, _src) {
        window['inputService'].zone.run(() => {
          window['inputService'].service.markExInputInChange({ 'dragula': dragular_ });
        });
      });
    }
  }
  ngDoCheck() {
    if (this.ref) {
      this.ref.check();
    }
  }

  ngOnDestroy() {
    if (this.ref) {
      const dragular_ = this.elementRef.nativeElement.getElementsByClassName('dragula')[0];
      // this.userResponse.emit(this.arrayData);
      const drake = dragula([dragular_]);
      drake.destroy();
      this.ref.destroy();
      this.ref = null;
    }
  }
}
