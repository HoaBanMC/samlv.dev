import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dynamic-picture-pick-answer',
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
export class DynamicPicturePickAnswerComponent {
  @ViewChild('questionEl') questionEl!: ElementRef;
  @Input() content: string;

  @Output() contentHTML = new EventEmitter();
  @Output() userResponse = new EventEmitter();

  @Input() answer;
  @Input() isEntry = false;
  @Input() isEdit? = false;
  listButtons: any[] = [];
  bgRect: any;
  private _listeners: any[] = [];
  private _mouseElListener!: any;

  userAnswer: any[] = [];

  buttonEls: any;
  bgEl: any;

  constructor(private renderer2: Renderer2, private elementRef: ElementRef) { }

  loadComplete() {
    this.loadQuestion();
  }

  loadQuestion() {
    this.bgEl = this.elementRef.nativeElement.querySelector('#question-background') || this.elementRef.nativeElement.querySelector('[id$="question-background"]');
    this.buttonEls = this.elementRef.nativeElement.querySelector('#question-buttons') || this.elementRef.nativeElement.querySelector('[id$="question-buttons"]');

    if (this.bgEl) {
      this.bgRect = this.bgEl.getBoundingClientRect();
      if (this.isEdit) {
        this.renderer2.listen(this.bgEl, 'click', () => {
          this.resetElement();
          this.clearListener();
        });
      }
    }
    this.listButtons = this.buttonEls.querySelectorAll('.button');
    if (this.listButtons?.length) {
      this.listButtons.forEach((element: any) => {
        if (!this.isEdit) {
          this.renderer2.addClass(element, 'button-notedit');
        }
        this.renderer2.listen(element, 'click', () => {
          this.clearListener();
          this.resetElement();
          this.onClickEdit(element);
        });
      });

      setTimeout(() => {
        if (this.answer?.length && !this.isEdit) {
          this.listButtons.forEach((element: any) => {
            if (element.getAttribute('value') === this.answer[0]) {
              this.onClickEdit(element);
            }
          });
          this.userResponse.emit(this.answer);
        }
      }, 300);
    }
  }

  onClickEdit(element: any) {
    if (this.isEdit) {
      const moveEl = this.renderer2.createElement('div');
      this.renderer2.addClass(moveEl, 'button-move');
      this.renderer2.appendChild(element, moveEl);

      const resizeEl = this.renderer2.createElement('div');
      this.renderer2.addClass(resizeEl, 'button-resize');
      this.renderer2.appendChild(element, resizeEl);

      this.moveElement(element, moveEl);
      this.resizeElement(element, resizeEl);

    } else {
      const elementValue = element.getAttribute('value');
      this.listButtons.forEach((_e: any) => {
        if (_e.getAttribute('value') === elementValue) {
          this.renderer2.addClass(_e, 'button-active');
        } else {
          this.renderer2.removeClass(_e, 'button-active');
        }
      });
      this.userAnswer = [elementValue];
      this.userResponse.emit(this.userAnswer);
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
    this.listButtons.forEach((element: any) => {
      if (element.querySelector('.button-move')) {
        this.renderer2.removeChild(element, element.querySelector('.button-move'));
      }
      if (element.querySelector('.button-resize')) {
        this.renderer2.removeChild(element, element.querySelector('.button-resize'));
      }
      this.renderer2.removeClass(element, 'button-active');
      this.renderer2.removeClass(element, 'button-notedit');
    });
    if (this._mouseElListener) {
      this._mouseElListener();
    }
  }

  changeMode() {
    this.isEdit = !this.isEdit;
    this.listButtons?.forEach((element: any) => {
      if (this.isEdit) {
        this.renderer2.removeClass(element, 'button-notedit');
        this.renderer2.removeClass(element, 'button-active');
        const zoneNumber = element.getAttribute('value');
        const span = this.renderer2.createElement('span');
        span.innerHTML = zoneNumber;
        this.renderer2.appendChild(element, span);
      } else {
        if (element.querySelector('span')) {
          this.renderer2.removeChild(element, element.querySelector('span'));
        }
        this.renderer2.addClass(element, 'button-notedit');
      }
    });
    this.clearListener();
    this.resetElement();
  }

  saveEdit() {
    this.isEdit = false;
    this.listButtons?.forEach((element: any) => {
      if (element.querySelector('span')) {
        this.renderer2.removeChild(element, element.querySelector('span'));
      }
    });
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
