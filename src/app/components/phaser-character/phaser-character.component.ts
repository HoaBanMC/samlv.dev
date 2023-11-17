import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Phaser from 'phaser';
import { LandingPageService } from '../landing-page/landing-page.service';
import { Subscription } from 'rxjs';

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

class MainScene extends Phaser.Scene {
  player: any;
  target;
  appleGroup: any = [];
  cursorKeys: any;
  screenSize: any;
  score = 1;

  scoreText;
  scoreCount = 0;

  appleTree;

  bombs;
  bombGeneratorEvent;
  explodeBomb;

  gameOverGroup;
  gameState: GameState = GameState.Start;

  buttonStart;
  buttonBg;

  constructor() {
    super({ key: 'main' });
  }

  preload() {
    // load image using as sprite, frameWidth - frameHeight is size container of each frame in image
    this.load.spritesheet('player', '/assets/phaser/kids.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('apple', '/assets/phaser/Apple.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('appeTree', 'assets/phaser/apple-tree.png', { frameWidth: 64, frameHeight: 128 });
    this.load.image('bomb', 'assets/phaser/bomb.png');
    this.load.spritesheet('bomb2', '/assets/phaser/bomb2.png', { frameWidth: 159.7, frameHeight: 223 });
  }

  create() {
    this.cursorKeys = this.input.keyboard?.createCursorKeys();

    // get screen size {width, height}
    this.screenSize = this.sys.game.canvas;

    const localConfig = JSON.parse(localStorage.getItem('gameConfig'));
    if (+localConfig?.score !== this.score) {
      this.score = +localConfig?.score
      console.log(localConfig);
    } else {
      localConfig['score'] = this.score;
      localStorage.setItem('gameConfig', JSON.stringify(localConfig));
    }

    this.scoreText = this.add.text(0, 0, `Score: ${this.scoreCount}`, { fontFamily: 'Arial', fontSize: 16, color: '#000000' });

    // game over group
    this.gameOverGroup = this.add.group();
    const gameOverBg = this.add.graphics();
    gameOverBg.fillStyle(0x000000, 0.8);
    gameOverBg.fillRect(0, ((this.screenSize.height - 65) / 2), 800, 100);
    this.gameOverGroup.add(gameOverBg);
    const gameOverText = this.add.text(
      (this.screenSize.width / 2),
      (this.screenSize.height / 2), `Start Game!`,
      { fontFamily: 'Arial', fontSize: 24, color: '#ffffff', align: 'center' }
    );
    gameOverText.setOrigin(0.5);
    this.gameOverGroup.add(gameOverText);

    const gameOverNote = this.add.text(
      (this.screenSize.width / 2),
      ((this.screenSize.height + 50) / 2), `Click Start to play`,
      { fontFamily: 'Arial', fontSize: 14, color: '#ffffff', align: 'center' }
    );
    gameOverNote.setOrigin(0.5);
    this.gameOverGroup.add(gameOverNote);

    this.gameOverGroup.setDepth(1e9);
    this.gameOverGroup.setVisible(false);

    // button start
    this.buttonStart = this.add.container(
      (this.screenSize.width / 2),
      ((this.screenSize.height + 240) / 2));

    this.buttonBg = this.add.rectangle(0, 0, 200, 60, 0x000000);
    this.buttonBg.setOrigin(0.5, 0.5);

    const buttonText = this.add.text(0, 0, 'Start', { fontSize: '24px', color: '#fff', });
    buttonText.setOrigin(0.5, 0.5);
    this.buttonStart.add(this.buttonBg);
    this.buttonStart.add(buttonText);
    this.buttonStart.setDepth(1e9);

    this.initPlayer();
    this.setGameState(GameState.Start);

    // Handle button click event
    this.buttonBg.setInteractive();
    this.buttonBg.on('pointerup', this.startTap, this);
  }

  play() {
    // set sprite and create animate
    this.initAppleGroup();
    // this.initAppleTree();

    // make bomb
    this.physics.world.setBounds(0, 0, this.screenSize.width, this.screenSize.height);
    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.player, this.bombs, this.gameOver, null, this);

    this.bombs.getChildren()?.forEach((bomb: any) => {
      bomb.setDisplaySize(20, 20);
      bomb.setBounceY(Phaser.Math.FloatBetween(this.screenSize.width - 20, this.screenSize.height - 20));
    });
    this.bombGeneratorEvent = this.time.addEvent({ delay: 1000, callback: this.generateBomb, callbackScope: this, loop: true });
    this.physics.add.collider(this.player, this.bombs, this.gameOver, null, this);

    this.physics.resume();
    this.player.body.setVelocity(0);
  }

  setGameState(state: GameState): void {
    this.gameState = state;
    switch (state) {
      case GameState.Start:
        this.gameOverGroup.getChildren()[0].setVisible(false);
        this.gameOverGroup.setVisible(true);
        this.buttonStart.setVisible(true);
        break;
      case GameState.Playing:
        this.gameOverGroup.setVisible(false);
        this.buttonStart.setVisible(false);
        break;
      case GameState.GameOver:
        this.gameOverGroup.setVisible(true);
        this.buttonStart.setVisible(true);
        break;
    }
  }

  gameOver() {
    this.setGameState(GameState.GameOver);
    this.gameOverGroup.setVisible(true);
    this.gameOverGroup.getChildren()[1].setText('Game Over!');

    // Game over logic
    console.log('Game Over');
    // Pause the game
    this.physics.pause();
    this.bombGeneratorEvent.remove(false);

    this.bombs.clear(true, true);
    this.appleGroup.clear(true, true);

    this.player.anims.play('idle', true);
    this.input.removeAllListeners('pointerdown');
  }

  generateBomb() {
    // Define an array of possible spawn points along the screen edges
    let spawnPoints = [
      { x: Phaser.Math.Between(0, this.screenSize.width), y: 0 },
      { x: Phaser.Math.Between(0, this.screenSize.width), y: this.screenSize.height },
      { x: 0, y: Phaser.Math.Between(0, this.screenSize.height) },
      { x: this.screenSize.width, y: Phaser.Math.Between(0, this.screenSize.height) }
    ];

    // Choose a random spawn point
    let spawnPoint = Phaser.Math.RND.pick(spawnPoints);
    let bomb = this.bombs.create(spawnPoint.x, spawnPoint.y, 'bomb');
    bomb.setDisplaySize(20, 20);
    this.physics.moveToObject(bomb, this.player, 100);


  }

  override update(delta: any) {
    const localConfig = JSON.parse(localStorage.getItem('gameConfig'));
    if (+localConfig?.score !== this.score) {
      this.score = +localConfig?.score
      // console.log(localConfig);
      if (this.score >= 1) {
        this.player.setScale(this.score);
      }
      if (this.score === 3) {
        this.appleTree.anims.play('big', true)
      } else if (this.score >= 2) {
        this.appleTree.anims.play('midle', true)
      } else if (this.score >= 1) {
        this.appleTree.anims.play('small', true)
      }
    }

    if (this.gameState === GameState.Playing) {
      this.movePlayerManager();
      if (this.appleGroup.getChildren()?.length === 0) {
        this.initAppleGroup();
      }
      // bomb
      this.bombs.getChildren()?.forEach((bomb: any) => {
        if (Phaser.Math.RND.frac() < 0.02) {
          this.physics.moveToObject(bomb, this.player, 150);
        }
        // if (bomb.y > this.game.config.height) {
        //   bomb.destroy(true);
        // }

        setTimeout(() => {
          bomb.destroy(true);
        }, 5000);

      });
    } else {
      if (this.cursorKeys.space.isDown && this.gameState === GameState.Start) {
        this.play();
        this.setGameState(GameState.Playing);
      } else if (this.cursorKeys.space.isDown && this.gameState === GameState.GameOver) {
        this.scoreCount = 0;
        this.scoreText.setText(`Score: ${this.scoreCount}`);
        this.play();
        this.setGameState(GameState.Playing);
      }
    }
  }

  startTap() {
    if (this.gameState === GameState.Start) {
      this.play();
      this.setGameState(GameState.Playing);
    } else if (this.gameState === GameState.GameOver) {
      this.scoreCount = 0;
      this.scoreText.setText(`Score: ${this.scoreCount}`);
      this.play();
      this.setGameState(GameState.Playing);
    }
  }

  movePlayerManager() {
    // move by mouse
    this.physics.add.existing(this.player);
    this.input.on('pointerdown', (pointer) => {
      this.target.x = pointer.x;
      this.target.y = pointer.y;
      // Move at 200 px/s:
      let angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.target.x, this.target.y);
      let degrees = Phaser.Math.RadToDeg(angle);
      if (degrees > -45 && degrees <= 45) {
        this.player.anims.play('walk_right', true);
      } else if (degrees > 45 && degrees <= 135) {
        this.player.anims.play('walk_down', true);
      } else if ((degrees > 135 && degrees <= 180) || (degrees >= -180 && degrees <= -135)) {
        this.player.anims.play('walk_left', true);
      } else {
        this.player.anims.play('walk_up', true);
      }

      this.physics.moveToObject(this.player, this.target, 200);
    });

    const tolerance = 4;
    // const tolerance = 200 * 1.5 / this.game.loop.targetFps;
    const distance = Phaser.Math.Distance.BetweenPoints(this.player, this.target);
    if (this.player.body.speed > 0) {
      if (distance < tolerance) {
        this.player.body.reset(this.target.x, this.target.y);

        setTimeout(() => {
          this.player.body.setVelocity(0);
          this.player.anims.play('idle', true);
        }, 200);
      }
    }
  }

  initAppleGroup() {
    this.appleGroup = this.physics.add.group();
    for (let i = 0; i < 3; i++) {
      this.appleGroup.add(this.createApple());
    }
    this.appleGroup.getChildren()?.forEach((apple: any) => {
      apple.anims.play('idle', true);
      this.physics.add.existing(apple);
    });
    this.physics.add.collider(this.player, this.appleGroup, this.collectPlayAndApple, null, this);
  }

  collectPlayAndApple(player, apple) {
    apple.destroy();
    player.body.setVelocity(0);
    player.anims.play('idle', true);
    this.scoreCount += 1;
    this.scoreText.setText(`Score: ${this.scoreCount}`);
  }

  createApple() {
    const apple = this.physics.add.sprite(
      Math.floor(Math.random() * (this.screenSize.width - 32) + 16),
      Math.floor(Math.random() * (this.screenSize.height - 32) + 16), 'apple');
    apple.setBounce(0.2);

    apple.body.setSize(20, 20);
    apple.body.setOffset(5, 5);

    apple.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('apple',
        { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }),
      frameRate: 12,
      repeat: -1
    });
    apple.setPushable(false);
    // apple.setScale(2);

    return apple;
  }

  initAppleTree() {
    this.appleTree = this.physics.add.sprite(50, 200, 'appeTree');
    this.appleTree.anims.create({
      key: 'small',
      frames: this.anims.generateFrameNumbers('appeTree', { frames: [0, 1, 2] }),
      frameRate: 1,
      repeat: -1
    })

    this.appleTree.anims.create({
      key: 'midle',
      frames: this.anims.generateFrameNumbers('appeTree', { frames: [3, 4, 5] }),
      frameRate: 1,
      repeat: -1
    })

    this.appleTree.anims.create({
      key: 'big',
      frames: this.anims.generateFrameNumbers('appeTree', { frames: [6, 7, 8] }),
      frameRate: 1,
      repeat: -1
    });
  }

  initPlayer() {
    this.player = this.physics.add.sprite(
      (this.screenSize.width / 2),
      (this.screenSize.height / 2),
      'player');

    // this.player.body.setCollideWorldBounds(true);

    this.player.body.setSize(40, 50);
    this.player.body.setOffset(10, 10);

    this.player.setScale(this.score);
    this.target = new Phaser.Math.Vector2();

    this.player.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', { frames: [0] }),
      frameRate: 8,
      repeat: -1
    });

    this.player.anims.create({
      key: 'walk_down',
      frames: this.anims.generateFrameNumbers('player', { frames: [0, 1, 2, 3] }),
      frameRate: 8,
      repeat: -1
    });

    this.player.anims.create({
      key: 'walk_left',
      frames: this.anims.generateFrameNumbers('player', { frames: [4, 5, 6, 7] }),
      frameRate: 8,
      repeat: -1
    });

    this.player.anims.create({
      key: 'walk_right',
      frames: this.anims.generateFrameNumbers('player', { frames: [8, 9, 10, 11] }),
      frameRate: 8,
      repeat: -1
    });

    this.player.anims.create({
      key: 'walk_up',
      frames: this.anims.generateFrameNumbers('player', { frames: [12, 13, 14, 15] }),
      frameRate: 8,
      repeat: -1
    });
  }
}

export enum GameState {
  Start = 0,
  Playing = 1,
  GameOver = 2
}