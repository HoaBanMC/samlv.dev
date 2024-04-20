import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, Renderer2 } from '@angular/core';

@Component({
  selector: "app-dynamic-html-select-dropdown-abc",
  template: `<div [mathJax]="content" (loadComplete)="loadComplete()"></div>`
})
export class DynamicHtmlSelectDropdownABCComponent implements OnDestroy, OnChanges {
  @Output() userResponse = new EventEmitter<object>();
  @Input() content: string;
  @Input() answer?: any;
  userAnswer: any[] = [];
  @Input() isExplain = false;
  @Input() questionId?: any;

  listener = [];
  listSelectItems;
  listSelections;

  constructor(private elementRef: ElementRef,
    private renderer: Renderer2,
  ) { }


  ngOnChanges() {
    if (this.listSelections?.length) {
      this.listSelections.forEach((select: any) => {
        select.selectedIndex = 0;
      });
      setTimeout(() => {
        this.loadComplete();
      });
    }
  }

  loadComplete(): void {
    this.listSelectItems = this.elementRef.nativeElement.querySelectorAll('.select-item');
    this.listSelections = this.elementRef.nativeElement.querySelectorAll('select');
    if (this.listSelectItems?.length) {
      const listValue: any[] = [''];
      this.listSelectItems.forEach((s: any) => {
        listValue.push(s.getAttribute('value'));
      });
      this.listSelections.forEach((select: any) => {
        listValue.forEach((valueAnswer) => {
          const opt = this.renderer.createElement('option');
          opt.text = valueAnswer;
          opt.value = valueAnswer;
          if (valueAnswer === '') {
            this.renderer.setAttribute(opt, 'hidden', 'true');
            this.renderer.setAttribute(opt, 'selected', 'true');
          }
          this.renderer.appendChild(select, opt);
        });
        this.listener.push(this.renderer.listen(select, 'change', this.onSelected.bind(this)));
      });
    } else {
      this.listSelections.forEach((select: any) => {
        this.listener.push(this.renderer.listen(select, 'change', this.onSelected.bind(this)));
      });
    }

    if (this.answer?.length || this.isExplain) {
      this.userAnswer = this.answer;
      this.listSelections.forEach((select: any) => {
        const answer = this.answer?.find(ans => select.id.split('-')[1] === ans.split('_')[0]) || select.getAttribute('answer');
        if (answer?.length) {
          const options = select.querySelectorAll('option');
          const targetOtp = Array.from(options).findIndex((opt: any) => opt.getAttribute('value') === (this.isExplain ? answer : answer.split('_')[1]));
          if (targetOtp !== -1) {
            select.selectedIndex = targetOtp;
          }
        }
      });
      this.userResponse.emit(this.userAnswer);
    }
  }

  onSelected(event: any) {
    const id = event.target.id
    const value = event.target.value;
    if (!this.userAnswer?.length) {
      this.userAnswer.push(id.split('-')[1] + '_' + value)
    } else {
      const index = this.userAnswer.findIndex(ans => ans.split('_')[0] === id.split('-')[1]);
      if (index !== -1) {
        this.userAnswer[index] = id.split('-')[1] + '_' + value;
      } else {
        this.userAnswer.push(id.split('-')[1] + '_' + value);
      }
    }
    this.userAnswer.sort((a, b) => a.split('_')[0] - b.split('_')[0]);
    // console.log(this.userAnswer);
    this.userResponse.emit(this.userAnswer);
  }

  ngOnDestroy(): void {
    this.renderer?.destroy();
    this.listener.forEach((fn: any) => fn());
    this.listener = [];
  }
}
