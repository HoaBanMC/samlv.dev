import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PixijsDemoComponent } from '../pixijs-demo/pixijs-demo.component';
import { PhaserDemoComponent } from '../phaser-demo/phaser-demo.component';
import { PhaserCharacterComponent } from '../phaser-character/phaser-character.component';
import { FormsModule } from '@angular/forms';
import { LandingPageService } from './landing-page.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PixijsDemoComponent,
    PhaserDemoComponent,
    PhaserCharacterComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  score = 1;

  constructor(private landingPageService: LandingPageService) {
    if (localStorage.getItem('gameConfig')) {
      const localConfig = JSON.parse(localStorage.getItem('gameConfig'));
      this.score = localConfig.score;
    }
  }

  onChangeScore(value) {
    if (+value === 1) {
      this.score += 0.1;
    } else if (+value === -1) {
      this.score -= 0.1;
    }

    if (this.score < 1) {
      this.score = 1;
      return;
    } else if (this.score > 3) {
      this.score = 3;
      return;
    }
    this.score = +this.score.toFixed(2);

    this.landingPageService.setScore(this.score);
  }

}
