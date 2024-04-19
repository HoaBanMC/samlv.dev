import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Phaser from 'phaser';
import { LandingPageService } from '../landing-page/landing-page.service';
import { Subscription } from 'rxjs';
import { MainScene } from './main.scene';

@Component({
  selector: 'app-phaser-character',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './phaser-character.component.html',
  styleUrl: './phaser-character.component.scss'
})
export class PhaserCharacterComponent implements OnInit, OnDestroy {

  @Input() width = 800;
  @Input() height = 600;

  phaserGame: Phaser.Game | undefined;
  config: Phaser.Types.Core.GameConfig;

  subscription: Subscription;

  score = 1;

  localConfig;

  constructor(private landingPageService: LandingPageService) {
    this.config = {
      type: Phaser.AUTO,
      height: 800,
      width: 600,
      scene: [MainScene],
      parent: 'gameContainer',
      transparent: true,
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
      }
    }
  }

  ngOnInit(): void {
    if (localStorage.getItem('gameConfig')) {
      this.localConfig = JSON.parse(localStorage.getItem('gameConfig'));
      this.score = this.localConfig.score;
    }

    if (this.width && this.height) {

      this.config.width = this.width;
      this.config.height = this.height;

      if (window.innerWidth < this.config.width) {
        this.config.width = window.innerWidth - 10;
      }

      if (window.innerHeight < this.config.height + 200) {
        this.config.height = window.innerHeight - 240;
      }

      this.localConfig = {
        ...this.localConfig,
        width: this.width,
        height: this.height,
        score: this.score
      };

    }
    this.phaserGame = new Phaser.Game(this.config);
    localStorage.setItem('gameConfig', JSON.stringify(this.localConfig));

    this.landingPageService.getScore().subscribe((res: any) => {
      if (res) {
        this.score = res;
        this.localConfig['score'] = this.score;
        localStorage.setItem('gameConfig', JSON.stringify(this.localConfig));
      }
    });


  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}