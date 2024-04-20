import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

export interface DirectionChangePosition {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

@Component({
  selector: 'app-dynamic-html-dragdrop-bebras-gsap',
  template: `
      <div *ngIf="isEntry">
          <div class="info-form">
              <strong>Hiển thị lưới: </strong>
              <button type="button" (click)="turnOnOffAlign()">{{isOnAlign ? 'Bật' : 'Tắt'}}</button>
            </div>
            <div class="info-form">
              <br/>
              <strong>Căn lề: </strong>
              <label for="top">
                  <span>top</span>
                  <input type="number" value="0" id="top" (change)="inputEvent($event, 'top')">
              </label>
              <label for="bottom">
                  <span>bottom</span>
                  <input type="number" value="0" id="bottom" (change)="inputEvent($event, 'bottom')">
              </label>
              <label for="left">
                  <span>left</span>
                  <input type="number" value="0" id="left" (change)="inputEvent($event, 'left')">
              </label>
              <label for="right">
                  <span>right</span>
                  <input type="number" value="0" id="right" (change)="inputEvent($event, 'right')">
              </label>
          </div>
          <div class="percent-position">
            <strong>Giá trị cần lấy: </strong>
            <span>top: {{directionChangePosition.top}}</span>
            /
            <span>bottom: {{directionChangePosition.bottom}}</span>
            /
            <span>left: {{directionChangePosition.left}}</span>
            /
            <span>right: {{directionChangePosition.right}}</span>
          </div>
          <div class="info-form">
            <br/>  
            <h3>Nội dung hiển thị: </h3>
            <hr/><br/>
          </div>
      </div>
    <div [mathJax]="content" (loadComplete)="loadComplete()"></div>
  `,
})
export class DynamicHtmlDragdropBebrasGsapComponent implements OnInit {
  @Output() userResponse = new EventEmitter<object>();
  @Input() content: string;
  @Input() answer: any;
  @Input() isEntry: boolean;
  @Input() isMobileEvent: EventEmitter<boolean>;
  // @Output() directionChangeEvent = new EventEmitter<DirectionChangePosition>();

  widthZone: number = 0;
  heightZone: number = 0;
  rowZone: number = 0;
  columnZone: number = 0;
  zoneContainer: any;
  answerZone: any;
  zoneChild: any;
  directionChangePosition: DirectionChangePosition = { top: 0, bottom: 0, left: 0, right: 0 };
  listItems: any[] = [];

  // userAnswered: any[] = ['1-6', '2-1']; // left - right;
  userAnswered: any[] = []; // left - right;

  isOnAlign: boolean = false;
  constructor(private renderer2: Renderer2, private elementRef: ElementRef) {
    gsap.registerPlugin(ScrollTrigger, Draggable, MotionPathPlugin);
  }
  ngOnInit(): void {
    this.userResponse.emit(this.userAnswered);
    if (this.isMobileEvent) {
      this.isMobileEvent.subscribe(data => {
        if (data) {
          this.loadComplete();
        }
      });
    }

  }
  initPosition(direction: any) {
    this.renderer2.setStyle(this.zoneChild, 'top', `${direction.top}%`);
    this.renderer2.setStyle(this.zoneChild, 'left', `${direction.left}%`);
    this.renderer2.setStyle(this.zoneChild, 'height', `calc(100% - ${direction.bottom + direction.top}%)`);
    this.renderer2.setStyle(this.zoneChild, 'width', `calc(100% - ${direction.left + direction.right}%)`);
    this.setItemDimension(direction);
  }

  setItemDimension(direction: any) {
    const anwserItems = this.elementRef.nativeElement.querySelectorAll('.answer-item');
    const itemWidth = this.widthZone - (this.widthZone * ((direction.left + direction.right) / 100));
    const itemHeight = this.heightZone - (this.heightZone * ((direction.top + direction.bottom) / 100));
    anwserItems.forEach((item: any) => {
      this.renderer2.setStyle(item, 'width', (itemWidth - 4) / this.columnZone + 'px');
      this.renderer2.setStyle(item, 'height', (itemHeight - 4) / this.rowZone + 'px');
    });
    const rows = this.zoneChild.querySelectorAll('.grid-row');
    for (let i = 0; i < rows.length; i++) {
      this.renderer2.setStyle(rows[i], 'height', itemHeight / this.rowZone + 'px');
      const columns = rows[i].querySelectorAll('.grid-column');
      for (let j = 0; j < columns.length; j++) {
        this.renderer2.setStyle(columns[j], 'width', itemWidth / this.columnZone + 'px');
      }
    }
  }

  // emitPosition(event: any) {
  //   if (event) {
  //     this.directionChangeEvent.emit(this.directionChangePosition);
  //   }
  // }

  inputEvent(event: any, direction: string) {
    if (event.target.value < 0) return;
    switch (direction) {
      case 'top':
        const percentTop = +((event.target.value / this.heightZone) * 100).toFixed(2);
        if (percentTop > 90) { break };
        this.directionChangePosition.top = percentTop;
        break
      case 'bottom':
        const percentBottom = +((event.target.value / this.heightZone) * 100).toFixed(2);
        if ((percentBottom + this.directionChangePosition.top) > 90) { break };
        this.directionChangePosition.bottom = percentBottom;
        break
      case 'left':
        const percentLeft = +((event.target.value / this.widthZone) * 100).toFixed(2);
        if ((percentLeft + this.directionChangePosition.top) > 90) { break };
        this.directionChangePosition.left = percentLeft;
        break
      case 'right':
        const percentRight = +((event.target.value / this.widthZone) * 100).toFixed(2);
        if ((percentRight + this.directionChangePosition.top) > 90) { break };
        this.directionChangePosition.right = percentRight;
        break
      default:
        break
    }
    this.initPosition(this.directionChangePosition);
  }

  turnOnOffAlign() {
    this.isOnAlign = !this.isOnAlign;
    const rows = this.zoneChild.querySelectorAll('.grid-row');
    for (let i = 0; i < rows.length; i++) {
      const columns = rows[i].querySelectorAll('.grid-column');
      for (let j = 0; j < columns.length; j++) {
        this.renderer2.setStyle(columns[j], 'border', `${this.isOnAlign ? '1px solid red' : '1px solid transparent'}`);
        this.renderer2.setStyle(columns[j], 'border', `${this.isOnAlign ? '1px solid red' : '1px solid transparent'}`);
      }
    }
  }

  loadComplete() {
    setTimeout(() => {
      this.zoneContainer = this.elementRef.nativeElement.querySelector('#zoneContainer') || this.elementRef.nativeElement.querySelector('[id$="zoneContainer"]');
      this.widthZone = this.zoneContainer?.offsetWidth;
      this.heightZone = this.zoneContainer?.offsetHeight;
      this.zoneChild = this.elementRef.nativeElement.querySelector('#dropZone') || this.elementRef.nativeElement.querySelector('[id$="dropZone"]');
      this.rowZone = this.zoneChild.getAttribute('row');
      this.columnZone = this.zoneChild.getAttribute('column');

      this.directionChangePosition.top = +this.zoneChild.getAttribute('top');
      this.directionChangePosition.bottom = +this.zoneChild.getAttribute('bottom');
      this.directionChangePosition.left = +this.zoneChild.getAttribute('left');
      this.directionChangePosition.right = +this.zoneChild.getAttribute('right');
      this.initPosition(this.directionChangePosition);
    }, 500);

    setTimeout(() => {
      // for test
      if (!this.answer?.length && this.elementRef && this.elementRef.nativeElement) {
        const listZones = this.elementRef.nativeElement.querySelectorAll('.drop-zone');
        this.listItems = [];
        const answerZoneDiv = this.elementRef.nativeElement.querySelector('#answerZone') || this.elementRef.nativeElement.querySelector('[id$="answerZone"]');
        this.renderer2.setStyle(answerZoneDiv, 'min-height', this.heightZone + 'px');

        this.elementRef.nativeElement.querySelectorAll('.item').forEach((e: any) => {
          this.listItems.push({ element: e, zone: answerZoneDiv });
        });
        if (this.listItems && this.listItems.length > 0) {
          this.listItems.forEach(item => {
            const clone = item.element.cloneNode(true);
            clone.style.opacity = 0.4;
            Draggable.create(item.element, {
              cursor: 'grab',
              throwProps: true,
              onDragStart: () => {
                // gsap.to('.move', { cursor: 'grabbing', opacity: 0.6 });   
              },
              onDrag: () => {
                listZones.forEach((zone: any) => {
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
                });
              },
              onDragEnd: () => {
                listZones.forEach((zone: any) => {
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
                    if (zone.querySelectorAll('.item').length === 0 && zone !== answerZoneDiv) {
                      item.zone = zone;
                      zone.appendChild(item.element);
                      if (this.userAnswered?.findIndex(value => value.split('-')[1] === item.element.getAttribute('value')) !== -1) {
                        this.userAnswered = this.userAnswered.filter(value => value.split('-')[1] !== item.element.getAttribute('value'));
                      }
                      this.checkAnswered({ left: item.zone.getAttribute('value'), right: item.element.getAttribute('value') })
                    } else {
                      item.zone = answerZoneDiv;
                      answerZoneDiv.appendChild(item.element);
                      if (this.userAnswered?.findIndex(value => value.split('-')[1] === item.element.getAttribute('value')) !== -1) {
                        this.userAnswered = this.userAnswered.filter(value => value.split('-')[1] !== item.element.getAttribute('value'));
                      }
                    }
                  }
                });
                gsap.to(item.element, { duration: 0, x: 0, y: 0, });
                this.setItemDimension(this.directionChangePosition);
              }
            });
          });
        }
      }

      // for explain
      if (this.answer?.length && this.elementRef && this.elementRef.nativeElement) {
        const answerZoneDiv = this.elementRef.nativeElement.querySelector('#answerZone') || this.elementRef.nativeElement.querySelector('[id$="answerZone"]');
        this.renderer2.setStyle(answerZoneDiv, 'min-height', this.heightZone + 'px');
        const listZones = this.elementRef.nativeElement.querySelectorAll('.drop-zone');
        listZones.forEach((zone: any) => {
          if (zone === answerZoneDiv || zone.querySelectorAll('.item')?.length) {
            return;
          }
          let valueZone = zone.getAttribute('value');
          let currentUserAnswerIndex = this.answer.findIndex(userAnswer => userAnswer.split('-')[0] === valueZone);
          if (currentUserAnswerIndex !== -1) {
            let valueUser = this.answer[currentUserAnswerIndex].split('-')[1];
            let countChild = answerZoneDiv.children.length;
            for (let i = 0; i < countChild; i++) {
              let valueChild = answerZoneDiv.children[i]?.getAttribute('value');
              if (valueChild === valueUser) {
                zone.appendChild(answerZoneDiv.children[i]);
              }
            }
          }
        });
      }
    }, 800);
  }

  ngAfterViewInit() {

  }

  sendAnswered() {
    console.log(this.userAnswered);

  }

  checkAnswered(answer: any) {
    if (!this.userAnswered.length || this.userAnswered?.findIndex(item => item.split('-')[0] === answer.left) === -1) {
      this.userAnswered.push(`${answer.left}-${answer.right}`);
      return;
    };
    this.userAnswered?.forEach((item, index) => {
      if (item.split('-')[0] === answer.left) {
        this.userAnswered[index] = `${answer.left}-${answer.right}`;
      }
    });
    this.userResponse.emit(this.userAnswered);
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
