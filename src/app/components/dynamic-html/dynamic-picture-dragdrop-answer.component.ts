import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { gsap, Power3 } from 'gsap';
import { Draggable } from 'gsap/Draggable';

@Component({
  selector: 'app-dynamic-picture-dragdrop-answer',
  template: `<div class="question-container">
    @if (isEntry) {
      <div class="question-config">
        <div class="btn-config btn-red" (click)="changeMode()">
          {{isEdit ? 'Tắt' : 'Bật'}} chỉnh sửa
        </div>
        <div class="btn-config" (click)="saveEdit()">Lưu</div>
      </div>
    }
    <div class="question-content" #questionEl [mathJax]="content" (loadComplete)="loadComplete()"></div>
  </div>`
})
export class DynamicPictureDragdropAnswerComponent {
  @ViewChild('questionEl') questionEl!: ElementRef;
  @Input() content: string;

  @Output() contentHTML = new EventEmitter();
  @Output() userResponse = new EventEmitter();

  @Input() answer;
  @Input() isEntry = false;
  @Input() isEdit? = false;

  listZones: any[] = [];
  bgRect: any;
  private _listeners: any[] = [];
  private _mouseElListener!: any;
  listItems: any[] = [];
  bgEl: any;
  zoneEls: any;
  userAnswer: any[] = [];
  dragableArr: any;
  hasNumber = false;

  constructor(
    private renderer2: Renderer2,
    private elementRef: ElementRef
  ) {
    gsap.registerPlugin(Draggable);
  }

  loadComplete() {
    this.loadQuestion();
  }

  loadQuestion() {
    this.bgEl = this.elementRef.nativeElement.querySelector('#question-background') || this.elementRef.nativeElement.querySelector('[id$="question-background"]');
    this.zoneEls = this.elementRef.nativeElement.querySelector('#list-drop-zone') || this.elementRef.nativeElement.querySelector('[id$="list-drop-zone"]');
    if (this.bgEl) {
      this.bgRect = this.bgEl.getBoundingClientRect();
      if (this.isEdit) {
        this.renderer2.listen(this.bgEl, 'click', () => {
          this.resetElement();
          this.clearListener();
        });
      }
    }

    this.listZones = this.elementRef.nativeElement.querySelectorAll('.drop-zone');

    if (!this.hasNumber) {
      this.listZones?.forEach((element: any) => {
        const zoneNumber = element.getAttribute('value');
        if (zoneNumber) {
          const div = this.renderer2.createElement('div');
          this.renderer2.addClass(div, 'number');
          div.innerHTML = zoneNumber;
          this.renderer2.appendChild(element, div);
        }
      });
      this.hasNumber = true;
    }
    this.listZones?.forEach((element: any) => {
      if (this.isEdit) {
        this.renderer2.removeClass(element, 'doing');
      } else {
        this.renderer2.addClass(element, 'doing');
      }
    });

    if (this.isEdit) {
      this.renderer2.setStyle(this.elementRef.nativeElement.querySelector('.question-wrapper'), 'overflow', 'hidden');
      if (this.listZones?.length) {
        this.listZones.forEach((element: any) => {
          this.calculateFontSize(element.querySelector('.text'));
          this.renderer2.listen(element, 'click', (event) => {
            this.clearListener();
            this.resetElement();
            this.onClickEdit(event, element);
          });
        });
      }
    } else {
      this.renderer2.setStyle(this.elementRef.nativeElement.querySelector('.question-wrapper'), 'overflow', 'inherit');
      this.listItems = [];
      const answerZoneDiv = this.elementRef.nativeElement.querySelector('[id$="answerZone"]');
      this.elementRef.nativeElement.querySelectorAll('.item').forEach((e: any) => {
        this.listItems.push({ element: e, zone: this.listZones[0] });
      });
      this.listItems?.forEach(item => {
        const clone = item.element.cloneNode(true);
        clone.style = {};
        clone.opacity = 0.4;
        this.calculateFontSize(item.element.querySelector('.text'));
        Draggable.create(item.element, {
          cursor: 'grab',
          throwProps: true,
          onDrag: () => {
            // this.listZones?.forEach(zone => {
            //   if (zone === item.zone) {
            //     return;
            //   }
            //   if (Draggable.hitTest(item.element, zone, '20')) {
            //     zone.appendChild(clone);
            //   } else {
            //     if (this.isDescendant(zone, clone)) {
            //       zone.removeChild(clone);
            //     }
            //   }
            // });
          },
          onDragEnd: () => {

            this.listZones?.forEach(zone => {
              if (zone === item.zone) {
                return;
              }
              if (Draggable.hitTest(item.element, zone, '20')) {
                console.log(zone);

                if (zone !== answerZoneDiv && zone.querySelectorAll('.item')?.length > 0) {
                  if (this.isDescendant(zone, clone)) {
                    zone.removeChild(clone);
                  }
                } else {
                  if (this.isDescendant(zone, clone)) {
                    zone.removeChild(clone);
                  }
                  if (this.isDescendant(item.zone, item.element)) {
                    item.zone.removeChild(item.element);
                  }
                  item.zone = zone;
                  zone.appendChild(item.element);
                  if (item.element.querySelector('.text')) {
                    this.calculateFontSize(item.element.querySelector('.text'));
                  }
                }
              }
            });
            item.element.style = {};
            gsap.to(item.element, { duration: 0, x: 0, y: 0, });
            const answerDiv = this.zoneEls?.querySelectorAll('.drop-zone');
            this.userAnswer = [];
            answerDiv?.forEach((zone: any) => {
              if (zone.querySelectorAll('.item')?.length !== 0) {
                this.userAnswer.push(`${zone.getAttribute('value')}${zone.querySelectorAll('.item')[0].getAttribute('value')}`);
              }
            });
            this.userResponse.emit(this.userAnswer);
          }
        });
      });

      if (this.answer?.length && this.elementRef && this.elementRef.nativeElement) {
        const answerZoneDiv = this.elementRef.nativeElement.querySelector('[id$="answerZone"]');
        const listZones = this.elementRef.nativeElement.querySelectorAll('.drop-zone');
        listZones.forEach((zone: any) => {
          if (zone === answerZoneDiv || zone.querySelectorAll('.item')?.length) {
            return;
          }
          const valueZone = zone.getAttribute('value');
          const currentUserAnswerIndex = this.answer?.findIndex(userAnswer => +userAnswer.split('')[0] === +valueZone);
          if (currentUserAnswerIndex !== -1) {
            const valueUser = this.answer[currentUserAnswerIndex].split('')[1];
            for (let i = 0; i < this.listItems.length; i++) {
              const valueChild = this.listItems[i]?.element.getAttribute('value');

              if (valueChild === valueUser) {
                zone.appendChild(this.listItems[i]?.element);
                this.listItems[i].zone = zone;
                // this.listItems.find((item)=> item.element === answerZoneDiv.children[i]).zone = zone;
              }
            }
          }
        });

        this.userResponse.emit(this.answer);
      }
    }
  }

  calculateFontSize(container) {
    if (!container) {
      return;
    }

    const targetWidth = container.clientWidth;
    const targetHeight = container.clientHeight;
    const text = container.textContent;

    let fontSize = 1;
    const textElement = this.renderer2.createElement('span');
    this.renderer2.setStyle(textElement, 'font-size', fontSize + 'px');
    this.renderer2.setStyle(textElement, 'visibility', 'hidden');

    textElement.innerText = text;
    this.renderer2.appendChild(container, textElement);

    while (textElement.offsetWidth < targetWidth && textElement.offsetHeight < targetHeight) {
      fontSize++;
      this.renderer2.setStyle(textElement, 'font-size', fontSize + 'px');
    }
    fontSize--;
    this.renderer2.removeChild(container, textElement);
    this.renderer2.setStyle(container, 'font-size', fontSize + 'px');
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

  onClickEdit(_event: any, element: any) {
    if (this.isEdit) {
      const moveEl = this.renderer2.createElement('div');
      this.renderer2.addClass(moveEl, 'zone-move');
      this.renderer2.appendChild(element, moveEl);

      const resizeEl = this.renderer2.createElement('div');
      this.renderer2.addClass(resizeEl, 'zone-resize');
      this.renderer2.appendChild(element, resizeEl);

      this.moveElement(element, moveEl);
      this.resizeElement(element, resizeEl);
    }
  }

  resizeElement(element: any, resizeEl: any) {
    this._mouseElListener = this.renderer2.listen(resizeEl, 'mousedown', (_event) => {
      _event.stopPropagation();
      const prevSize = {
        x: _event.clientX,
        y: _event.clientY
      };
      const elementTarget = element.getBoundingClientRect();
      const mouseResizeListener = this.renderer2.listen(document, 'mousemove', (e) => {
        const deltaX = e.clientX - prevSize.x;
        const deltaY = e.clientY - prevSize.y;
        const newWidth = (((elementTarget.width + deltaX) / this.bgRect.width) * 100).toFixed(2);
        const newHeight = (((elementTarget.height + deltaY) / this.bgRect.height) * 100).toFixed(2);
        this.renderer2.setStyle(element, 'width', newWidth + '%');
        this.renderer2.setStyle(element, 'height', newHeight + '%');
      });
      this._listeners.push(mouseResizeListener);
    });
    this.clearListener();
  }

  moveElement(element: any, moveEl: any) {
    this._mouseElListener = this.renderer2.listen(moveEl, 'mousedown', (_event) => {
      _event.preventDefault();
      const prevPos = {
        x: _event.clientX,
        y: _event.clientY
      };
      const elementTarget = element.getBoundingClientRect();
      const mouseMoveListener = this.renderer2.listen(document, 'mousemove', (_e: any) => {
        const deltaX = elementTarget.x + (_e.clientX - prevPos.x);
        const deltaY = elementTarget.y + (_e.clientY - prevPos.y);
        let newLeft = +(((deltaX - this.bgRect.x) / this.bgRect.width) * 100).toFixed(2);
        let newTop = +(((deltaY - this.bgRect.y) / this.bgRect.height) * 100).toFixed(2);
        if (newLeft <= 0) newLeft = 0;
        if (newTop <= 0) newTop = 0;
        this.renderer2.setStyle(element, 'left', newLeft + '%');
        this.renderer2.setStyle(element, 'top', newTop + '%');
      });
      const mouseUpListener = this.renderer2.listen(document, 'mouseup', () => {
        this.clearListener();
      });
      const dragstartListener = this.renderer2.listen(element, 'dragstart', () => {
        return false
      });
      this._listeners.push(mouseMoveListener, mouseUpListener, dragstartListener);
    });
    this.clearListener();
  }

  clearListener() {
    this._listeners.forEach(listener => listener());
    this._listeners = [];
  }

  resetElement() {
    this.listZones?.forEach((element: any) => {
      if (element.querySelector('.zone-move')) {
        this.renderer2.removeChild(element, element.querySelector('.zone-move'));
      }
      if (element.querySelector('.zone-resize')) {
        this.renderer2.removeChild(element, element.querySelector('.zone-resize'));
      }
    });
    if (this._mouseElListener) {
      this._mouseElListener();
    }
  }

  resetItemZones() {
    if (this.listItems?.length && this.listZones?.length) {
      const answerZoneDiv = this.elementRef.nativeElement.querySelector('[id$="answerZone"]');

      this.listItems?.forEach((item: any) => {
        if (item.zone !== answerZoneDiv) {
          const elementRect = item?.element?.getBoundingClientRect();
          const clone = { element: item.element.cloneNode(true), zone: item.element.parentNode };
          answerZoneDiv.appendChild(clone.element);
          item.zone.removeChild(item.element);
          item.zone = answerZoneDiv;
          this.gsapTranslate(elementRect, clone.element);
        }
      });
    }
  }

  gsapTranslate(fromRect: any, element: any) {
    gsap.set(element, { x: 0, y: 0 });
    const newRect = element.getBoundingClientRect();
    gsap.from(element, { duration: 0.3, x: fromRect.left - newRect.left, y: fromRect.top - newRect.top, ease: Power3.easeOut });
  }

  changeMode() {
    this.isEdit = !this.isEdit;
    this.clearListener();
    this.resetElement();
    this.resetItemZones();
    setTimeout(() => {
      this.loadQuestion();
    }, 500);
  }

  saveEdit() {
    this.isEdit = false;
    this.listZones?.forEach((element: any) => {
      if (element.querySelector('span')) {
        this.renderer2.removeChild(element, element.querySelector('span'));
      }
    });
    this.resetItemZones();
    this.clearListener();
    this.resetElement();
    setTimeout(() => {
      // remove attribute _ngcontent-ng-xxx form angular
      const textHTML = this.questionEl.nativeElement.innerHTML.replace(/ (_ngcon|ng-).*?".*?"/g, '');
      console.log(textHTML);
      this.contentHTML.emit(textHTML);
      this.loadQuestion();
    }, 500);
  }
}
