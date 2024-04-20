import { DynamicHTMLRef } from './renderer';
import {
  Component, ElementRef, Input, Output,
  OnInit, EventEmitter, OnDestroy
} from '@angular/core';
import { gsap, ScrollTrigger, Draggable, MotionPathPlugin, TweenLite } from 'gsap/all';
// declare const MathJax: {
//     Hub: {
//         Queue: (param: Object[], callback: () => void) => void;
//   }
// }
@Component({
  selector: 'app-dragdrop-greensock-dynamic-html',
  template: '<div [mathJax]="content" (loadComplete)="loadComplete()"></div>',
})
export class DynamicDragDropGreensockHTMLComponent implements OnInit, OnDestroy {
  @Input() question: any;
  @Input() content: string;
  @Input() answer: any;
  @Input() isViewAnswer = false;
  @Output() userResponse = new EventEmitter<object>();
  arrayData = [];
  private ref: DynamicHTMLRef = null;
  listItems: any[] = [];

  constructor(
    // private renderer: DynamicHTMLRenderer,
    private elementRef: ElementRef,
  ) {
    gsap.registerPlugin(ScrollTrigger, Draggable, MotionPathPlugin);
  }

  ngOnInit() {
    this.userResponse.emit(this.arrayData);
  }

  loadComplete() {
    if (this.ref) {
      this.ref.destroy();
      this.ref = null;
    }

    if (this.content && this.elementRef && this.elementRef.nativeElement) {
      // this.ref = this.renderer.renderInnerHTML(this.elementRef, this.content);
      const listZones = this.elementRef.nativeElement.querySelectorAll('.drop-zone');
      this.listItems = [];
      this.elementRef.nativeElement.querySelectorAll('.item').forEach(e => {
        this.listItems.push({ element: e, zone: listZones[0] });
      });

      if (this.listItems && this.listItems.length > 0) {
        this.listItems.forEach(item => {
          const clone = item.element.cloneNode(true)
          clone.style = {};
          clone.style.opacity = 0.4;
          Draggable.create(item.element, {
            cursor: 'grab',
            throwProps: true,
            onDragStart: () => {

              // TweenLite.set('.move', { cursor: 'grabbing', opacity: 0.6 });   
            },
            onDrag: () => {
              listZones.forEach(zone => {
                if (zone === item.zone) {
                  return;
                }
                if (Draggable.hitTest(item.element, zone, '51%')) {
                  zone.appendChild(clone)
                } else {
                  if (this.isDescendant(zone, clone)) {
                    zone.removeChild(clone);

                  }
                }
              });

            },
            onDragEnd: () => {
              listZones.forEach(zone => {
                if (zone === item.zone) {
                  return;
                }
                if (Draggable.hitTest(item.element, zone, '51%')) {
                  if (this.isDescendant(zone, clone)) {
                    zone.removeChild(clone);

                  }
                  if (this.isDescendant(item.zone, item.element)) {
                    item.zone.removeChild(item.element);

                  }
                  // clone.remove();
                  item.zone = zone;
                  zone.appendChild(item.element);
                }
              });
              item.element.style = {};
              TweenLite.set(item.element, { x: 0, y: 0, });
              this.userResponse.emit(this.listItems.map((answer: any) => {
                return answer.zone.getAttribute('value');
              }))
              // TweenLite.set('.move', { opacity: 1 });
            }
          });
        });
        if (this.question?.userOptionText?.length || this.answer?.length) {
          const options = this.isViewAnswer ? this.answer : this.question?.userOptionText;

          options?.forEach((opt: any, index: number) => {
            if (opt !== '' && listZones[+opt]) {
              this.listItems[index].zone = listZones[+opt];
              listZones[+opt].appendChild(this.listItems[index].element);
            }
          });
          this.userResponse.emit(this.listItems.map((answer: any) => {
            return answer.zone.getAttribute('value');
          }));
        }
      }
    }
  }

  isDescendant(parent, child) {
    let node = child.parentNode;
    while (node != null) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.destroy();
      this.ref = null;
    }
  }
}
