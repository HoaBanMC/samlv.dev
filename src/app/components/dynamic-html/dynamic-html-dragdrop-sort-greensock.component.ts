import { DynamicHTMLRef } from './renderer';
import {
  Component, ElementRef, Input, Output,
  OnInit, EventEmitter, OnDestroy, Renderer2
} from '@angular/core';
import { gsap, ScrollTrigger, Draggable, MotionPathPlugin, TweenLite } from 'gsap/all';
// declare const MathJax: {
//     Hub: {
//         Queue: (param: Object[], callback: () => void) => void;
//   }
// }
@Component({
  selector: 'app-dragdrop-sort-greensock-dynamic-html',
  template: '<div [mathJax]="content" (loadComplete)="loadComplete()"></div>',
})
export class DynamicDragDropSortGreensockHTMLComponent implements OnInit, OnDestroy {
  @Input() content: string;
  @Input() answer: any;
  @Input() question: any;
  @Output() userResponse = new EventEmitter<object>();
  arrayData = [];
  private ref: DynamicHTMLRef = null;

  constructor(
    // private renderer: DynamicHTMLRenderer,
    private elementRef: ElementRef,
    private renderer2: Renderer2
  ) {
    gsap.registerPlugin(ScrollTrigger, Draggable, MotionPathPlugin);
  }

  ngOnInit() {
    if (this.arrayData?.length) {
      this.userResponse.emit(this.arrayData);
    }
  }

  loadComplete() {
    if (this.ref) {
      this.ref.destroy();
      this.ref = null;
    }

    if (this.content && this.elementRef && this.elementRef.nativeElement) {
      // this.ref = this.renderer.renderInnerHTML(this.elementRef, this.content);
      let listItems = this.elementRef.nativeElement.querySelectorAll('.item');
      listItems.forEach((el: any, index: number) => {
        this.renderer2.setAttribute(el, 'id', index.toString());
      });

      const dropZone = this.elementRef.nativeElement.querySelector('.drop-zone');

      if (listItems && listItems.length > 0) {
        listItems.forEach((item) => {
          const clone = document.createElement('div');
          clone.style['border-left'] = '1px solid';
          Draggable.create((item), {
            bounds: [dropZone],
            cursor: 'grab',
            throwProps: true,
            onDragStart: () => {
              // console.log(event);
              // TweenLite.set('.move', { cursor: 'grabbing', opacity: 0.6 });
            },
            onDrag: function () {
              // if (Draggable.hitTest(item, dropZone, '0')) {
              //     dropZone.insertBefore(clone, listItems[listItems.length - 1].nextSibling);

              //     return;
              // }
              let havePosition = true;
              for (let index1 = 0; index1 < listItems.length - 1; index1++) {
                const item1 = listItems[index1];
                if (!item1) {
                  return;
                }
                if (Draggable.hitTest(item, item1, '30%')) {
                  // const insert = index >= index1 ? 'insertBefore' : 'insertAfter';
                  if (this.getDirection(item1).indexOf('right') > -1) {
                    dropZone.insertBefore(clone, item1.nextSibling);
                  }
                  if (this.getDirection(item1).indexOf('left') > -1) {
                    dropZone.insertBefore(clone, item1);
                  }
                  havePosition = false;
                  break;
                }

              }

              if (havePosition) {
                if (this.getDirection(listItems[listItems.length - 1]).indexOf('top') > -1) {
                  dropZone.insertBefore(clone, item);


                }
                if (this.getDirection(listItems[listItems.length - 1]).indexOf('right') > -1) {
                  dropZone.insertBefore(clone, listItems[listItems.length - 1].nextSibling);
                }
                if (this.getDirection(listItems[listItems.length - 1]).indexOf('left') > -1) {
                  dropZone.insertBefore(clone, listItems[listItems.length - 1]);
                }
              }

            },
            onDragEnd: () => {
              // console.log(event);
              // Row to update is used for a partial layout update
              // Shift left/right checks if the tile is being dragged
              if (this.isDescendant(dropZone, clone)) {
                // dropZone.removeChild(clone);
                clone.replaceWith(item);
                listItems = this.elementRef.nativeElement.querySelectorAll('.item');

              }

              TweenLite.set(item, { x: 0, y: 0, });
              const _dataArr = Array.from(listItems).map((val: any) => {
                return val.getAttribute('value');
              });
              console.log(_dataArr);
              this.userResponse.emit(_dataArr);
            }
          });

        });
      }
    }
    if (this.answer?.length) {
      if (this.answer?.every(x => x === '')) return;
      setTimeout(() => {
        const listZone = [];
        const listIdZone = [];
        const zone = this.elementRef.nativeElement.querySelectorAll('.drop-zone');
        for (let i = 0; i < this.answer.length; i++) {
          for (let j = 0; j < zone[0].children?.length; j++) {
            if (this.answer[i] === zone[0].children[j].getAttribute('value')
              && !listIdZone.includes(zone[0].children[j].getAttribute('id'))) {
              listIdZone.push(zone[0].children[j].getAttribute('id'));
              break;
            }
          }
        }
        if (zone && zone.length > 0) {
          const countZone = zone[0].children.length;
          if (countZone > 0) {
            // eslint-disable-next-line for-direction
            for (let i = (countZone - 1); i < countZone; i--) {
              if (i >= 0) {
                listZone.push(zone[0].children[i]);
                zone[0].removeChild(zone[0].children[i]);
              } else {
                if (listZone && listZone.length > 0) {
                  for (let j = 0; j < listIdZone.length; j++) {
                    const check = listZone.findIndex((item: any) => item.getAttribute('id') === listIdZone[j]);
                    if (check !== -1) {
                      zone[0].appendChild(listZone[check]);
                      continue;
                    }
                  }
                }
                return;
              }
            }
          }
        }
      }, 1000);
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
