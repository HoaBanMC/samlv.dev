import { Component, ElementRef, OnInit, viewChild } from '@angular/core';
import { DynamicHTMLModule } from '../../components/dynamic-html/module';

@Component({
  selector: 'app-mathplay',
  templateUrl: './mathplay.component.html',
  styleUrl: './mathplay.component.scss',
  standalone: true,
  imports: [DynamicHTMLModule],
})
export class MathplayComponent implements OnInit {
  iframeDiv = viewChild<ElementRef<HTMLIFrameElement>>('iframeDiv');

  question = `       <div class="title">Look and choose:</div>
  
        <div class="content">
          <div class="text-big">Con mèo</div>
        </div>
  
        <div class="list-selection vertical-sort">
          <div class="select-item">
            <input
              class="form-check-input"
              config-typeaction="number"
              id="mathplay-answer-1"
              name="answer"
              type="radio"
              value="1"
            />
            <label for="mathplay-answer-1"> Cat </label>
          </div>
  
          <div class="select-item">
            <input
              class="form-check-input"
              id="mathplay-answer-2"
              name="answer"
              type="radio"
              value="2"
            />
            <label for="mathplay-answer-2"> Dog </label>
          </div>
  
          <div class="select-item">
            <input
              class="form-check-input"
              id="mathplay-answer-3"
              name="answer"
              type="radio"
              value="3"
            />
            <label for="mathplay-answer-3"> Bird </label>
          </div>
  
          <div class="select-item">
            <input
              class="form-check-input"
              id="mathplay-answer-4"
              name="answer"
              type="radio"
              value="4"
            />
            <label for="mathplay-answer-4"> Monkey </label>
          </div>
        </div>`;

  token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0dvZE1vZGUiOmZhbHNlLCJhdmF0YXIiOiJodHRwczovL2F2YXRhci5vbmx1eWVuLnZuL2F2YXRhci82NWJjOGRmMTZlNTJkYWE4NTczY2U4MWEvNjY4ZDBlYjEzODdmOWE2MjU3YWM4YTQ3LnBuZyIsInVzZXJJZCI6IjY1YmM4ZGYxNmU1MmRhYTg1NzNjZTgxYSIsInVzZXJOYW1lIjoiODQ1NTg5OTk5OTkiLCJpc1ZlcmlmaWVkIjpmYWxzZSwiR3JhZGVJZCI6IkMxMiIsIkRpc3BsYXlOYW1lIjoiWW91ZSIsIkJpcnRoZGF5IjoiMjAwMi0wNS0xMCIsIlByb3ZpbmNlSWQiOjEsIkRpc3RyaWN0SWQiOjE2LCJQaG9uZU51bWJlciI6Ijg0NTU4OTk5OTk5IiwiUGhvbmVDb3VudHJ5IjoiODQiLCJTY2hvb2xZZWFyIjoyMDI0LCJjb2RlQXBwIjoiTU9CSVNUVURZIiwiUm9sZSI6IlNUVURFTlQiLCJHZW5kZXIiOiJOQU0iLCJDcmVhdGVCeVNjaG9vbCI6MjgwLCJwcmVtaXVtIjpmYWxzZSwiY2FuQ2hhbmdlUGFzc3dvcmQiOnRydWUsIm5lZWRDaGFuZ2VQYXNzd29yZCI6dHJ1ZSwia2V5VG9rZW4iOiJiNGYwZDM4YTMxYWU1MzkxYTYxNDk1ZjgwNTc1OGVjZSIsInBhY2thZ2VzIjoiRURUIiwianRpIjoiMzlmMTZjYWQtODFhYS00M2YwLTg3OWYtODEwMzlkYTk0NDA5IiwiaWF0IjoxNzI5ODI0MTA5LCJuYmYiOjE3Mjk4MjQxMDksImV4cCI6MTczMjQxNjEwOSwiaXNzIjoiRURNSUNSTyIsImF1ZCI6Ik1PQklTVFVEWS5WTiJ9.JSZcj-5trzkbmuriXTuT2f0JHsdXFuM5fNNZEPlvxNA';

  constructor() {
    localStorage.setItem('token', this.token);
  }

  ngOnInit() {
    window.addEventListener('message', (event) => {
      if (event.data.action === 'openModal') {
        // Chạy hàm khi nhận được thông điệp từ Godot
        console.log(event.data);
        this.showPopup();
      }
    });
  }

  onSubmit() {
    const inputData = 'message from angular!';
    // Gửi dữ liệu tới Godot
    this.iframeDiv().nativeElement.contentWindow.postMessage(
      {
        value: inputData,
      },
      '*'
    );
    this.hidePopup();
  }

  showPopup() {
    console.log('show modal');
    document.getElementById('popup').classList.add('show');
  }

  hidePopup() {
    document.getElementById('popup').classList.remove('show');
  }
}
