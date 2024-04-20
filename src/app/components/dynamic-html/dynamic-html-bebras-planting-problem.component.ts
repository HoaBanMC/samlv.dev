import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';


@Component({
  selector: 'dynamic-html-bebras-planting-problem',
  template: `<div [mathJax]="content" (loadComplete)="loadComplete()"></div>`,
})
export class DynamicHtmlBebrasPlantingProblem implements OnInit {
  @Output() userResponse = new EventEmitter<object>();
  @Input() content: string;
  @Input() explain: any;

  listItems: any[] = [];
  numbetPlants: number = 0;
  userAnswered: any[] = [
    "0-yellow",
    "1-red",
    "2-red",
    "6-yellow",
    "7-yellow"
  ];
  // userAnswered: any[] = [];
  constructor(private elementRef: ElementRef) {

  }
  ngOnInit(): void {
    gsap.registerPlugin(ScrollTrigger, Draggable, MotionPathPlugin);
  }

  loadComplete() {
    if (!this.explain) {
      this.createDraggable();
    }

    // if (!this.userAnswered?.length) {
    //   this.createDraggable();
    // } else {
    //   setTimeout(() => {
    //     console.log('answer!');

    //     if (this.elementRef && this.elementRef.nativeElement) {
    //       const answerZoneDiv = this.elementRef.nativeElement.querySelector('#answerZone');
    //       let listZones: any[] = [];
    //       this.elementRef.nativeElement.querySelectorAll('.drop-zone').forEach((zone: any) => {
    //         if (zone.getAttribute('value')) {
    //           listZones.push(zone);
    //         }
    //       });
    //       listZones.forEach((zone: any) => {
    //         if (zone.querySelectorAll('.item')?.length) {
    //           return;
    //         }
    //         let valueZone = zone.getAttribute('value');
    //         let currentUserAnswerIndex = this.userAnswered.findIndex(userAnswer => userAnswer.split('-')[0] === valueZone);
    //         if (currentUserAnswerIndex !== -1) {
    //           let valueUser = this.userAnswered[currentUserAnswerIndex].split('-')[1];
    //           let countChild = answerZoneDiv.children.length;
    //           for (let i = 0; i < countChild; i++) {
    //             let valueChild = answerZoneDiv.children[i]?.getAttribute('value');
    //             if (valueChild === valueUser) {
    //               let clone = answerZoneDiv.children[i].cloneNode(true);
    //               zone.appendChild(clone);
    //             }
    //           }
    //         }
    //       });
    //     }
    //   }, 500);
    // }
  }

  @HostListener('change', ['$event']) onChangeInput(event: any) {
    if (event.target === this.elementRef.nativeElement.querySelector('input')) {
      this.userResponse.emit(event.target.value);
    }
  }

  sendAnswer() {
    // let listElement: any[] = [];
    // this.elementRef.nativeElement.querySelectorAll('.drop-zone').forEach((e: any) => {
    //   if (e.getAttribute('value') && e.childNodes[0]) {
    //     listElement.push(`${e.getAttribute('value')}-${e.childNodes[0]?.getAttribute('value')}`);
    //   }
    // });
    // console.log(listElement);
    // let countSame: any[] = [];
    // listElement.forEach((item) => {
    //   let key = item.split('-')[1];
    //   countSame[key] = (countSame[key] || 0) + 1;
    // });
    // console.log(countSame);
    console.log(this.numbetPlants);
  }

  createDraggable() {
    setTimeout(() => {
      console.log('drag active!');
      // for test
      if (this.elementRef && this.elementRef.nativeElement) {
        const listZones = this.elementRef.nativeElement.querySelectorAll('.drop-zone');
        this.listItems = [];
        const answerZoneDiv = this.elementRef.nativeElement.querySelector('#answerZone') || this.elementRef.nativeElement.querySelector('[id$="answerZone"]');
        this.elementRef.nativeElement.querySelectorAll('.item').forEach((e: any) => {
          this.listItems.push({ element: e, zone: e.parentNode.getAttribute('value') ? e.parentNode : answerZoneDiv });
        });
        if (this.listItems && this.listItems.length > 0) {
          this.listItems.forEach(item => {
            let clone: any;
            Draggable.create(item.element, {
              cursor: 'grab',
              throwProps: true,
              onDragStart: () => {
                clone = item.element.cloneNode(true);
                clone.style.opacity = 0.4;
              },
              onDrag: () => {
                listZones.forEach((zone: any) => {
                  if (item.zone !== answerZoneDiv) {
                    if (zone === item.zone) {
                      return;
                    }
                    if (Draggable.hitTest(item.element, zone, '51%')) {
                      if ((zone.querySelectorAll('.item').length === 0 && zone !== answerZoneDiv)) {
                        zone.appendChild(clone)
                      }
                    } else {
                      if (this.isDescendant(zone, clone)) {
                        zone.removeChild(clone);
                      }
                    }
                  } else {
                    if (zone === item.zone) {
                      return;
                    }
                    if (Draggable.hitTest(item.element, zone, '51%')) {
                      if ((zone.querySelectorAll('.item').length === 0 && zone !== answerZoneDiv) || zone === answerZoneDiv) {
                        zone.appendChild(clone)
                      }
                    } else {
                      if (this.isDescendant(zone, clone)) {
                        zone.removeChild(clone);
                      }
                    }
                  }
                });
              },
              onDragEnd: () => {
                listZones.forEach((zone: any) => {
                  clone.style.opacity = 1;
                  if (item.zone === answerZoneDiv) {
                    if (zone === item.zone) {
                      return;
                    }
                    if (Draggable.hitTest(item.element, zone, '51%')) {
                      if (zone.querySelectorAll('.item').length === 0) {
                        if (this.isDescendant(zone, clone)) {
                          zone.removeChild(clone);
                        }
                        zone.appendChild(clone);
                      }
                    }
                  } else {
                    if (zone === item.zone) {
                      return;
                    }
                    if (Draggable.hitTest(item.element, zone, '51%')) {
                      if (this.isDescendant(zone, clone)) {
                        zone.removeChild(clone);
                      }
                      if (zone.querySelectorAll('.item').length === 0) {
                        if (this.isDescendant(item.zone, item.element)) {
                          item.zone.removeChild(item.element);
                        }
                        zone.appendChild(clone);
                      } else {
                        if (zone === answerZoneDiv) {
                          if (this.isDescendant(item.zone, item.element)) {
                            item.zone.removeChild(item.element);
                          }
                        }
                      }
                    }
                  }
                });
                clone = null;
                gsap.to(item.element, { duration: 0, x: 0, y: 0, });
                this.createDraggable();
              }
            });
          });
        }
      }
    }, 500);
  }

  isDescendant(parent: any, child: any) {
    let node = child.parentNode;
    while (node != null) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }
}