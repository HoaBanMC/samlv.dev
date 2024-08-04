
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { DynamicHTMLModule } from '../../../components/dynamic-html/module';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    DynamicHTMLModule
]
})
export class QuestionsComponent implements OnInit {
  @Input() question;
  @Output() userAnswer = new EventEmitter();
  answerOption;

  ngOnInit(): void {
    if (this.question) {
      this.answerOption = this.question?.showAnswer ? this.question?.userOptionText : null;
    }
  }

  userAction(event) {
    if (event && event?.length) {
      this.userAnswer.emit({ answer: event, typeAnswer: this.question.typeAnswer });
    }
  }
}
