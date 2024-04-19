import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { makeBootScene } from './main.scene';

@Component({
  selector: 'app-plant-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plant-tree.component.html',
  styleUrl: './plant-tree.component.scss'
})
export class PlantTreeComponent {
  phaserGame: Phaser.Game | undefined;
  config: Phaser.Types.Core.GameConfig;

  questionId = 'abc123';

  localData = signal({
    id: 5,
    score: 0
  });

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      height: 420,
      width: 300,
      scene: makeBootScene(this),
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
    // this.phaserGame = new Phaser.Game(this.config);
    // if (localStorage.getItem('plantTree')) {
    //   this.localData.set(JSON.parse(localStorage.getItem('plantTree')));
    // } else {
    //   localStorage.setItem('plantTree', JSON.stringify(this.localData()));
    // }
  }

  initialized() {
    console.log('Boot Scene initialized!');
  }

  canNext(state) {
    console.log(state);

  }

  hasInit() {
    console.log('hasInit');

  }

  add(e) {
    this.localData.update(x => {
      x.score = x.score + e * 10
      return x
    });
    localStorage.setItem('plantTree', JSON.stringify(this.localData()));
  }
}
