import {
  Component, ElementRef, Input, Output,
  OnDestroy, DoCheck, OnInit, EventEmitter
} from '@angular/core';

import { DynamicHTMLRef } from './renderer';
import { InputService } from './inputService';

@Component({
  selector: 'app-dynamic-check-multiplechoices-html',
  template: '<div [mathJax]="content" (loadComplete)="loadComplete()"></div>',
})
export class DynamicCheckMultipleChoicesHTMLComponent implements OnInit, DoCheck, OnDestroy {
  @Input() hiddenReset = false;
  @Input() userAnswer: any;
  @Input() content: string;
  @Output() userResponse = new EventEmitter<object>();
  arrayData = [];
  private ref: DynamicHTMLRef = null;
  jsPlumbInstance;

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
  // creat listen from element
  loadComplete() {
    if (this.ref) {
      this.ref.destroy();
      this.ref = null;
    }
    if (this.content && this.elementRef) {
      // this.ref = this.renderer.renderInnerHTML(this.elementRef, this.content);
      // MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.elementRef.nativeElement], function () { });
      const inputs = this.elementRef.nativeElement.getElementsByClassName('mathplay-answer');
      const tRow = this.elementRef.nativeElement.getElementsByClassName('tRow');
      const tCell = this.elementRef.nativeElement.getElementsByClassName('tCell');
      const resetBtn = this.elementRef.nativeElement.querySelector('#reset') || this.elementRef.nativeElement.querySelector('[id$="reset"]');
      window['numberCellInRow'] = tRow[0].children.length;
      window['listArrayInputs'] = [];
      window['tCell'] = tCell[0];
      window['numberAlphabet'] = 0;
      window['arrayValue'] = [];
      // add listen event click for check input
      window['arrayId'] = [];
      for (let i = 0; i < inputs.length; i++) {
        window['listArrayInputs'].push(inputs[i].id);
        if (inputs[i].classList.contains('begin')) {
          window['beginInput'] = inputs[i];
          // window['arrayValue'].push(inputs[i].value);
          window['arrayValue'][0] = inputs[i].value;
          window['arrayId'][0] = inputs[i].getAttribute('id');
          inputs[i].classList.add('lock');
          inputs[i].checked = true;
        }
        if (inputs[i].classList.contains('begin1')) {
          window['beginInput1'] = inputs[i];
          window['arrayValue'][1] = inputs[i].value;
          inputs[i].classList.add('lock');
          inputs[i].checked = true;
        }
        inputs[i].addEventListener('click', this.checkBoxSelected.bind({
          element: inputs[i]
        }));
      }
      resetBtn.addEventListener('click', this.resetSelected.bind(resetBtn));
    }

    if (this.ref) {
      const cavasTableContent: any = this.elementRef.nativeElement.querySelectorAll('.canvas');
      if (cavasTableContent && cavasTableContent.length > 0) {
        const canvas = document.createElement('canvas');
        window['canvas'] = canvas;
        canvas.id = 'CanvasLayer';
        canvas.width = cavasTableContent[0].offsetWidth;
        canvas.height = cavasTableContent[0].offsetHeight;
        canvas.style.zIndex = '1';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';

        cavasTableContent[0].appendChild(canvas);
        window['numberAlphabet'] = 1;
        window['beginInput'].parentElement.setAttribute('data-contentafter', 'A');
        if (window['beginInput1']) {
          this.drawline(window['beginInput1']);
          window['numberAlphabet'] = 2;
          window['beginInput1'].parentElement.setAttribute('data-contentafter', 'B');
        }
        window['elementRefDynamic'] = this.elementRef.nativeElement;
      }
    }

    if (this.userAnswer && this.userAnswer.userOptionText && this.userAnswer.userOptionText.length > 0) {
      if (this.hiddenReset) {
        const resetBtn = this.elementRef.nativeElement.querySelector('#reset') || this.elementRef.nativeElement.querySelector('[id$="reset"]');
        if (resetBtn) {
          resetBtn.style.display = 'none';
        }
      }
      const answer: any = this.elementRef.nativeElement.querySelectorAll('.mathplay-answer');
      if (answer && answer.length > 0) {
        const listConnect: any[] = [];
        for (let i = 2; i < this.userAnswer.userOptionText.length; i++) {
          for (let j = 0; j < answer.length; j++) {
            if (this.userAnswer.userOptionText[i] === answer[j].getAttribute('value')) {
              listConnect.push(answer[j].id);
              break;
            }
          }
        }

        if (listConnect && listConnect.length > 0) {
          for (let k = 0; k < listConnect.length; k++) {
            if (listConnect[k] && listConnect[k].length > 0) {
              setTimeout(() => {
                const point = this.elementRef.nativeElement.querySelectorAll('[id=' + listConnect[k] + ']');
                if (point && point.length > 0) {
                  point[0].click();
                  if (listConnect.length > k) {
                    this.timeCall(listConnect, k + 1);
                  }
                }
              }, 100);
              break;
            }
          }
        }
      }
    }
  }

  checkBoxSelected(event: any) {
    const el = event.srcElement;
    const indexLastId = window['arrayId'].length - 1;
    const lastId = window['arrayId'][indexLastId];
    if (el.classList.contains('lock') && lastId === el.id) {
      event.preventDefault();
      return false;
    }
    el.classList.add('lock2');
    if (el.classList.contains('lock2')) {
      el.checked = true;
    }
    if (!el.parentElement.getAttribute('data-contentafter')) {
      window['numberAlphabet'] += 1;
      el.parentElement.setAttribute('data-contentafter', String.fromCharCode(window['numberAlphabet'] + 64));
    }
    const lastIdIndex = window['listArrayInputs'].indexOf(lastId);
    const numberOrderLast = lastIdIndex + 1;
    const yAxisPre = Math.ceil(numberOrderLast / window['numberCellInRow']);
    const xAxisPre = lastIdIndex - (window['numberCellInRow'] * (yAxisPre - 1));

    const index = window['listArrayInputs'].indexOf(el.id);
    const numberOrder = index + 1;
    const yAxis = Math.ceil(numberOrder / window['numberCellInRow']);
    const xAxis = index - (window['numberCellInRow'] * (yAxis - 1));

    const canvas = window['canvas'];
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(window['tCell'].offsetWidth * xAxisPre + (xAxisPre > 6 ? 2 : 0), window['tCell'].offsetHeight * yAxisPre);
    ctx.lineTo(window['tCell'].offsetWidth * xAxis + (xAxisPre > 6 ? 2 : 0), window['tCell'].offsetHeight * yAxis);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffa500';
    ctx.stroke();
    setTimeout(() => {
      window['arrayId'].push(el.id);
      const indexValue = window['arrayValue'].indexOf(el.value);
      if (indexValue === -1 || el.value === window['arrayValue'][0]) {
        window['arrayValue'].push(el.value);
        window['inputService'].zone.run(() => {
          window['inputService'].service.markDataChange(window['arrayValue']);
        });
      }
    }, 0);
    return null;
  }

  drawline(el) {
    const indexLastId = window['arrayId'].length - 1;
    const lastId = window['arrayId'][indexLastId];
    const lastIdIndex = window['listArrayInputs'].indexOf(lastId);
    const numberOrderLast = lastIdIndex + 1;
    const yAxisPre = Math.ceil(numberOrderLast / window['numberCellInRow']);
    const xAxisPre = lastIdIndex - (window['numberCellInRow'] * (yAxisPre - 1));

    const index = window['listArrayInputs'].indexOf(el.id);
    const numberOrder = index + 1;
    const yAxis = Math.ceil(numberOrder / window['numberCellInRow']);
    const xAxis = index - (window['numberCellInRow'] * (yAxis - 1));

    const canvas = window['canvas'];
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(window['tCell'].offsetWidth * xAxisPre + (xAxisPre > 6 ? 2 : 0), window['tCell'].offsetHeight * yAxisPre);
    ctx.lineTo(window['tCell'].offsetWidth * xAxis + (xAxis > 6 ? 2 : 0), window['tCell'].offsetHeight * yAxis);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffa500';
    ctx.stroke();
    setTimeout(() => {
      window['arrayId'].push(el.id);
    }, 0);
  }

  resetSelected() {
    const cavasTableContent: any = window['elementRefDynamic'].getElementsByClassName('canvas')[0];
    const tCell = window['elementRefDynamic'].getElementsByClassName('tCell');
    window['tCell'] = tCell[0];
    window['numberAlphabet'] = 1;
    const canvas = window['canvas'];
    canvas.width = cavasTableContent.offsetWidth;
    canvas.height = cavasTableContent.offsetHeight;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const inputs: any = window['elementRefDynamic'].querySelectorAll('.mathplay-answer');
    window['arrayValue'] = [];
    window['arrayId'] = [];
    window['beginInput'] = null;
    window['beginInput1'] = null;
    for (let i = 0; i < inputs.length; i++) {
      if (!inputs[i].classList.contains('lock')) {
        inputs[i].checked = false;
        inputs[i].parentElement.removeAttribute('data-contentafter');
      }
      if (inputs[i].classList.contains('begin')) {
        window['beginInput'] = inputs[i];
        window['arrayId'][0] = inputs[i].getAttribute('id');
        window['arrayValue'][0] = inputs[i].value;
      }
      if (inputs[i].classList.contains('begin1')) {
        window['numberAlphabet'] = 2;
        window['beginInput1'] = inputs[i];
        window['arrayValue'][1] = inputs[i].value;
        window['arrayId'][1] = inputs[i].id;
      }
      if (inputs[i].classList.contains('lock2')) {
        inputs[i].classList.remove('lock2');
      }
    }
    setTimeout(() => {
      if (window['beginInput1']) {
        const el = window['beginInput1'];
        // const indexBeginId = window['arrayId'].length - 1;
        const beginId = window['arrayId'][0];
        const beginIdIndex = window['listArrayInputs'].indexOf(beginId);
        const numberOrderLast = beginIdIndex + 1;
        const yAxisPre = Math.ceil(numberOrderLast / window['numberCellInRow']);
        const xAxisPre = beginIdIndex - (window['numberCellInRow'] * (yAxisPre - 1));

        const index = window['listArrayInputs'].indexOf(el.id);
        const numberOrder = index + 1;
        const yAxis = Math.ceil(numberOrder / window['numberCellInRow']);
        const xAxis = index - (window['numberCellInRow'] * (yAxis - 1));

        ctx.beginPath();
        ctx.moveTo(window['tCell'].offsetWidth * xAxisPre + (xAxisPre > 6 ? 2 : 0), window['tCell'].offsetHeight * yAxisPre);
        ctx.lineTo(window['tCell'].offsetWidth * xAxis + (xAxis > 6 ? 2 : 0), window['tCell'].offsetHeight * yAxis);
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#ffa500';
        ctx.stroke();
      }
      window['inputService'].zone.run(() => {
        window['inputService'].service.markDataChange(null);
      });
    }, 0);
  }

  ngDoCheck() {
    if (this.ref) {
      this.ref.check();
    }
  }

  timeCall(listConnect, value) {
    if (listConnect && value < listConnect.length) {
      setTimeout(() => {
        const point = this.elementRef.nativeElement.querySelectorAll('[id=' + listConnect[value] + ']');
        if (point && point.length > 0) {
          point[0].click();
          if (listConnect.length > value) {
            this.timeCall(listConnect, value + 1);
          }
        }
      }, 100);
    }
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.destroy();
      this.ref = null;
    }
  }
}
