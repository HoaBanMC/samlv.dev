import { ListTreeFrame } from "./constants";

let context: any;
export const makeBootScene = (ctx) => {
    context = ctx;
    return MainScene;
}

export const ListEffect = [
    'Water', 'Sun', 'Fertilizer'
]

export class MainScene extends Phaser.Scene {
    tree;
    currentAnim = 'idle';
    onChangeScore = false;

    currentEffect = 0;

    localData = {
        id: 0,
        score: 0
    }

    constructor() {
        super({ key: 'main' });
        this.getLocalData(true);
    }

    preload() {
        this.load.spritesheet(`growing10`, `/assets/plant-tree/Trees/${ListTreeFrame[this.localData?.id]?.name}/10growing.png`, { frameWidth: 500, frameHeight: 500 });
        this.load.spritesheet(`moving10`, `/assets/plant-tree/Trees/${ListTreeFrame[this.localData?.id]?.name}/10moving.png`, { frameWidth: 500, frameHeight: 500 });
        this.load.spritesheet(`growing30`, `/assets/plant-tree/Trees/${ListTreeFrame[this.localData?.id]?.name}/30growing.png`, { frameWidth: 500, frameHeight: 500 });
        this.load.spritesheet(`moving30`, `/assets/plant-tree/Trees/${ListTreeFrame[this.localData?.id]?.name}/30moving.png`, { frameWidth: 500, frameHeight: 500 });
        this.load.spritesheet(`growing60`, `/assets/plant-tree/Trees/${ListTreeFrame[this.localData?.id]?.name}/60growing.png`, { frameWidth: 500, frameHeight: 500 });
        this.load.spritesheet(`moving60`, `/assets/plant-tree/Trees/${ListTreeFrame[this.localData?.id]?.name}/60moving.png`, { frameWidth: 500, frameHeight: 500 });
        this.load.spritesheet(`growing100`, `/assets/plant-tree/Trees/${ListTreeFrame[this.localData?.id]?.name}/100growing.png`, { frameWidth: 500, frameHeight: 500 });
        this.load.spritesheet(`done`, `/assets/plant-tree/Trees/${ListTreeFrame[this.localData?.id]?.name}/done.png`, { frameWidth: 500, frameHeight: 500 });
        // sprite effect
        this.load.spritesheet(`Fertilizer`, `/assets/plant-tree/EffectTree/Fertilizer.png`, { frameWidth: 500, frameHeight: 500 });
        this.load.spritesheet(`Rain`, `/assets/plant-tree/EffectTree/Rain.png`, { frameWidth: 500, frameHeight: 500 });
        this.load.spritesheet(`Sun`, `/assets/plant-tree/EffectTree/Sun.png`, { frameWidth: 500, frameHeight: 500 });
        this.load.spritesheet(`Water`, `/assets/plant-tree/EffectTree/water.png`, { frameWidth: 500, frameHeight: 500 });

        // sound effect
        this.load.audio('rainSound', '/assets/plant-tree/Sounds/rain.mp3');
        this.load.audio('growingSound', '/assets/plant-tree/Sounds/growing.mp3');
        this.load.audio('waterSound', '/assets/plant-tree/Sounds/water.mp3');
        this.load.audio('sunSound', '/assets/plant-tree/Sounds/sun.mp3');
        this.load.audio('fertilizerSound', '/assets/plant-tree/Sounds/fertilizer.mp3');
        this.load.audio('doneSound', '/assets/plant-tree/Sounds/done.mp3');
    }

    create() {
        this.createTree();
        this.tree.anims.play(this.currentAnim, true);
        if (context) context.initialized();
    }

    override update() {
        this.getLocalData(false);
    }

    getLocalData(init) {
        if (localStorage.getItem('plantTree')) {
            const data = JSON.parse(localStorage.getItem('plantTree'));
            this.localData.id = data.id;
            if (data.score !== this.localData.score) {
                if (init) {
                    if (data.score < 10) {
                        this.currentAnim = 'idle';
                    } else if (data.score >= 10 && data.score < 30) {
                        this.currentAnim = 'moving10';
                    } else if (data.score >= 30 && data.score < 60) {
                        this.currentAnim = 'moving30';
                    } else if (data.score >= 60 && data.score < 100) {
                        this.currentAnim = 'moving60';
                    } else if (data.score == 100) {
                        this.currentAnim = 'done';
                    }
                    if (context) context.hasInit();
                } else {
                    if ((data.score >= 100 && this.localData.score < 100) || (data.score >= 60 && this.localData.score < 60) ||
                        (data.score >= 30 && this.localData.score < 30) || (data.score >= 10 && this.localData.score < 10)) {
                        this.rateScore2Anim(data.score);
                    } else {
                        switch (this.currentEffect) {
                            case 0:
                                this.makeWaterEffect();
                                break;
                            case 1:
                                this.makeSunEffect();
                                break;
                            case 2:
                                this.makeFertilizerEffect();
                                break;
                            default:
                                break;
                        }
                        this.currentEffect += 1;
                        if (this.currentEffect === ListEffect.length) {
                            this.currentEffect = 0;
                        }
                    }
                }
                this.localData = data;
                this.onChangeScore = true;
            }
        }
    }

    makeFertilizerEffect() {
        const fertilizerEffect = this.physics.add.sprite(320, 280, 'Fertilizer');
        fertilizerEffect.setScale(0.5);
        fertilizerEffect.anims.create({
            key: 'fertilizerEffect',
            frames: this.anims.generateFrameNumbers('Fertilizer', {
                start: 0,
                end: 11
            }),
            frameRate: 8,
            repeat: -1
        });

        const fertilizerSound = this.sound.add('fertilizerSound', { loop: true });

        this.tweens.add({
            targets: fertilizerEffect,
            x: 150,
            duration: 500,
            yoyo: false,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                fertilizerEffect.anims.play('fertilizerEffect', true);
                fertilizerSound.play();

                setTimeout(() => {
                    fertilizerEffect.setFrame(0);
                    fertilizerEffect.anims.stop();
                    this.tweens.add({
                        targets: fertilizerEffect,
                        x: 320,
                        duration: 500,
                        yoyo: false,
                        ease: 'Sine.easeInOut',
                        onComplete: () => {
                            fertilizerSound.stop();
                            fertilizerSound.destroy();
                            fertilizerEffect.destroy();
                            if (context) context.canNext(true);
                        }
                    });
                }, 3000);
            }
        });
    }

    makeSunEffect() {
        const sunEffect = this.physics.add.sprite(-10, 80, 'Sun');
        sunEffect.setScale(0.5);
        sunEffect.anims.create({
            key: 'sunEffect',
            frames: this.anims.generateFrameNumbers('Sun', {
                start: 0,
                end: 3
            }),
            frameRate: 8,
            repeat: -1
        });
        sunEffect.anims.play('sunEffect', true);

        const sunSound = this.sound.add('sunSound', { loop: false });
        sunSound.play();

        this.tweens.add({
            targets: sunEffect,
            x: 150,
            duration: 500,
            yoyo: false,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.tweens.add({
                    targets: sunEffect,
                    x: 320,
                    duration: 500,
                    delay: 2000,
                    yoyo: false,
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                        sunSound.stop();
                        sunSound.destroy();
                        sunEffect.destroy();
                        if (context) context.canNext(true);
                    }
                });
            }
        });
    }

    makeWaterEffect() {
        // water effect
        const waterEffect = this.physics.add.sprite(300, 100, 'Water');
        waterEffect.setScale(0.35);
        waterEffect.anims.create({
            key: 'waterEffect',
            frames: this.anims.generateFrameNumbers('Water', {
                start: 0,
                end: 11
            }),
            frameRate: 8,
            repeat: -1
        });

        const waterSound = this.sound.add('waterSound', { loop: true });

        this.tweens.add({
            targets: waterEffect,
            x: 200,
            duration: 500,
            yoyo: false,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                waterEffect.anims.play('waterEffect', true);
                waterSound.play();

                setTimeout(() => {
                    waterEffect.setFrame(0);
                    waterEffect.anims.stop();
                    this.tweens.add({
                        targets: waterEffect,
                        x: 300,
                        duration: 500,
                        yoyo: false,
                        ease: 'Sine.easeInOut',
                        onComplete: () => {
                            waterSound.stop();
                            waterSound.destroy();
                            waterEffect.destroy();
                            if (context) context.canNext(true);
                        }
                    });
                }, 3000);
            }
        });
    }

    rateScore2Anim(score) {
        const rainEffect = this.physics.add.sprite(-120, 100, 'Rain');
        rainEffect.setScale(0.5);
        rainEffect.anims.create({
            key: 'rainEffect', frames: this.anims.generateFrameNumbers('Rain', {
                start: 0,
                end: 7
            }),
            frameRate: 8,
            repeat: -1
        });
        rainEffect.anims.play('rainEffect', true);

        const rainSound = this.sound.add('rainSound', { loop: true });
        rainSound.play();

        this.tweens.add({
            targets: rainEffect,
            x: 150,
            duration: 1000,
            yoyo: false,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.tweens.add({
                    targets: rainEffect,
                    x: -120,
                    delay: 2000,
                    duration: 1000,
                    yoyo: false,
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                        rainSound.stop();
                        rainSound.destroy();
                        rainEffect.destroy();
                        const growingSound = this.sound.add('growingSound', { loop: false });
                        growingSound.play();
                        if (score >= 100) {
                            this.tree.anims.play('growing100', true);
                            this.tree.on('animationcomplete', (animation) => {
                                if (animation.key === 'growing100') {
                                    this.tree.anims.play('done', true);
                                    growingSound.stop();
                                    growingSound.destroy();
                                    const doneSound = this.sound.add('doneSound', { loop: false });
                                    doneSound.play();
                                    setTimeout(() => {
                                        doneSound.stop();
                                        doneSound.destroy();
                                        if (context) context.canNext(true);
                                    }, 3500);
                                }
                            }, this);
                            this.onChangeScore = false;
                        } else if (score < 100 && score >= 60) {
                            this.tree.anims.play('growing60', true);
                            this.tree.on('animationcomplete', (animation) => {
                                if (animation.key === 'growing60') {
                                    this.tree.anims.play('moving60', true);
                                    setTimeout(() => {
                                        growingSound.stop();
                                        growingSound.destroy();
                                        if (context) context.canNext(true);
                                    }, 1500);
                                }
                            }, this);
                            this.onChangeScore = false;
                        } else if (score < 60 && score >= 30) {
                            this.tree.anims.play('growing30', true);
                            this.tree.on('animationcomplete', (animation) => {
                                if (animation.key === 'growing30') {
                                    this.tree.anims.play('moving30', true);
                                    setTimeout(() => {
                                        growingSound.stop();
                                        growingSound.destroy();
                                        if (context) context.canNext(true);
                                    }, 1500);
                                }
                            }, this);
                            this.onChangeScore = false;
                        } else if (score < 30 && score >= 10) {
                            this.tree.anims.play('growing10', true);
                            this.tree.on('animationcomplete', (animation) => {
                                if (animation.key === 'growing10') {
                                    this.tree.anims.play('moving10', true);
                                    setTimeout(() => {
                                        growingSound.stop();
                                        growingSound.destroy();
                                        if (context) context.canNext(true);
                                    }, 1500);
                                }
                            }, this);
                            this.onChangeScore = false;
                        }
                    }
                });
            }
        });
    }

    createTree() {
        const treeInstance = ListTreeFrame[this.localData.id];
        this.tree = this.physics.add.sprite(150, 280, 'growing10');
        this.tree.setScale(0.6);
        treeInstance?.frames.forEach(x => {
            this.tree.anims.create({
                key: x.key,
                frames: this.anims.generateFrameNumbers(x.sprite, {
                    start: x.start,
                    end: x.end
                }),
                frameRate: 8,
                repeat: x.repeat
            });
        });
    }
}