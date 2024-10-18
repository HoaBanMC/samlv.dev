import { Component, OnInit } from '@angular/core';
import { DynamicHTMLModule } from '../../components/dynamic-html/module';

@Component({
  selector: 'app-mathplay',
  templateUrl: './mathplay.component.html',
  styleUrl: './mathplay.component.scss',
  standalone: true,
  imports: [DynamicHTMLModule],
})
export class MathplayComponent implements OnInit {
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

  constructor() {}

  ngOnInit() {
    document.getElementById('popupForm').addEventListener('submit', (e) => {
      e.preventDefault(); // Ngăn chặn việc submit form thật sự
      const inputData = 'hello';
      // Gửi dữ liệu tới Godot
      window.postMessage(
        {
          value: inputData,
        },
        '*'
      );

      // Ẩn popup sau khi submit
      this.hidePopup();
    });

    window.addEventListener('message', (event) => {
      if (event.data.action === 'openModal') {
        // Chạy hàm khi nhận được thông điệp từ Godot
        console.log(event.data);
        this.showPopup();
      }
    });
  }

  // JavaScript để điều khiển popup
  showPopup() {
    console.log('show modal');
    document.getElementById('popup').classList.add('show');
  }

  hidePopup() {
    document.getElementById('popup').classList.remove('show');
  }
}
