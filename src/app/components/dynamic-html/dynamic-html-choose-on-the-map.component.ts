import {
  Component, ElementRef, Input, Output,
  OnDestroy, DoCheck, OnInit, EventEmitter
} from '@angular/core';

import { DynamicHTMLRef } from './renderer';
import { InputService } from './inputService';

@Component({ 
  selector: 'app-choose-on-the-map',
  template: '<div [mathJax]="content" (loadComplete)="loadComplete()"></div>',
})
export class DynamicHtmlChooseOnTheMapComponent implements OnInit, DoCheck, OnDestroy {
  @Input() question?: any;
  @Input() content?: string;
  @Input() isRunning: boolean = true;

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
          this.userResponse.emit(res);
        } else {
          this.userResponse.emit(null);
        }
      });
  }
      // create listen from element
    loadComplete() {
      if (this.ref) {
          this.ref.destroy();
          this.ref = null;
      }
      if (this.content && this.elementRef) {
        const selects = this.elementRef.nativeElement.getElementsByClassName('garden-slot option');
        for (let i = 0; i < selects.length; i++) {
          selects[i].addEventListener('click', () => {
            this.selectOption(selects[i]);
          });
        }
      }
    }
    selectOption(option) {
      let visibility = option.querySelector('img').style.visibility
      if(visibility == 'visible') {
          option.querySelector('img').style.visibility = 'hidden';
      }  else {
          option.querySelector('img').style.visibility = 'visible'
      }
      window['inputService'].zone.run(() => { 
        const selects = [...this.elementRef.nativeElement.getElementsByClassName('garden-slot option')].filter((e: any) => {
          return e.querySelector('img').style.visibility == 'visible'
        }).map((e: any) => {
          return e.id;
        });
        window['inputService'].service.markDataChange(selects);
      });
    }

    ngDoCheck() {
      if (this.ref) {
        this.ref.check();
      }
    }
    
    ngOnDestroy() {
      if (this.ref) {
        this.ref.destroy();
        this.ref = null;
      }
    }
}
