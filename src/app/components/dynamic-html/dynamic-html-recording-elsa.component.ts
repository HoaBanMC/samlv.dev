import {
  Component, ElementRef, Input, Output, OnDestroy, EventEmitter, Renderer2, ViewChild
} from '@angular/core';
import { Subscription, map, timer } from 'rxjs';
import { MathplayAudioService } from './mathlay-audio';
declare const navigator: any;
@Component({
  selector: 'app-dynamic-html-recording-elsa',
  template: `
  <div class="question-content">
    <div class="question-text" #contentEl [mathJax]="content" (loadComplete)="loadComplete()"></div>

    <div class="answer-text" *ngFor="let t of arrTexts" #answerContentEL>
        <div class="text" appMarkSpeakingIelts [content]="t?.result?.words">
        </div>
    </div>

    <div class="question-buttons">
      <div class="btn-play" [class.btn-playing]="onPlayQuestion && ratePlayback === 1" 
      *ngIf="hasAudioDiv" (click)="playAudioQuestion(1)"></div>
      <div class="btn-play-slow" [class.btn-play-slowing]="onPlayQuestion && ratePlayback === 0.75" 
      *ngIf="hasAudioDiv" (click)="playAudioQuestion(0.75)"></div>
      <div class="btn-replay"></div>
    </div>
  </div>
  <div class="recording-container" [class.onplay-question]="onPlayQuestion"
   *ngIf="(!isExplain || !isContentAudio) && !answer?.length">
      <div class="question-answer" *ngIf="stateRun === State.INITIAL || stateRun === State.RECORDING">
          <div class="btn-record" [class.running]="stateRun === State.RECORDING" (click)="record()">
              <div class="btn-wrapper">
                  <img src="/assets/math-play/template-68/{{stateRun === State.RECORDING ? 'record-active' : 'record'}}.svg"
                      alt="">
              </div>
          </div>
          <div class="timer" *ngIf="stateRun === State.RECORDING">
              {{timer | async}}
          </div>
          <div class="timer" *ngIf="stateRun === State.INITIAL">
              Nhấn để thu âm câu trả lời
          </div>
      </div>
      <div class="question-answer" *ngIf="stateRun === State.COMPLETE  || stateRun === State.PENDING">
        <div class="box-answer">
            <div class="box-answer-container"
                *ngIf="stateRun === State.COMPLETE || stateRun === State.PENDING">
                <div class='recording-audio' (click)="replay()">
                    <img src="/assets/math-play/template-68/{{onPlayAudio ? 'icon-replaying' : 'icon-replay'}}.svg"
                        alt="">
                </div>
                <div class="text-replay" *ngIf="stateRun === State.COMPLETE">
                    Nhấn để nghe lại câu trả lời
                <div class="text-replay" *ngIf="stateRun === State.PENDING">
                    Hệ thống đang chấm điểm!</div>
                <div class="part-footer">
                    <a class="btn btn-retry"
                        (click)="recordingAgain()">
                        <i class="fa fa-repeat" aria-hidden="true"></i> Làm lại
                    </a>
                </div>
            </div>
        </div>
      </div>
      <div class="note" *ngIf="showtext">
            Thời lượng bài thu âm tối đa là 3 phút
      </div>
  </div>
`,
})
export class DynamicHTMLRecordingElsaComponent implements OnDestroy {
  @ViewChild('contentEl') contentEl!: ElementRef;
  @ViewChild('answerContentEL') answerContentEL!: ElementRef;

  @Input() content: string;
  @Input() answer: any;
  @Input() isStoreRecord = false;
  @Input() isExplain = false;
  @Input() userRecord;

  @Output() userResponse = new EventEmitter<object>();

  // for question
  audioUrl;
  audioQuestion;
  onPlayQuestion = false;
  hasAudioDiv = false;
  ratePlayback = 1;
  scriptText = '';
  isContentAudio = false;
  audioSubscription: Subscription;

  // for record
  timer;
  State = {
    INITIAL: 1,
    RECORDING: 2,
    COMPLETE: 3,
    DONE: 4,
    PENDING: 5
  };
  stateRun = this.State.INITIAL;
  mediaRecorder;
  media;
  urlMedia;
  texts = [];
  showtext;
  audio;
  onPlayAudio;

  arrTexts = [];

  constructor(
    private elementRef: ElementRef,
    private mathplayAudioService: MathplayAudioService,
    private renderer: Renderer2,
  ) { }

  // creat listen from element
  loadComplete() {
    this.reset();
    if (this.content && this.elementRef) {

      // get script text
      const contentDiv = this.elementRef.nativeElement.querySelectorAll('.content');
      const contentAudioDiv = this.elementRef.nativeElement.querySelectorAll('.content-audio');

      if (contentDiv?.length) {
        this.isContentAudio = false;
        this.scriptText = contentDiv[0]?.getAttribute('scriptText');
        // console.log(1, this.scriptText);
        // this.userResponse.emit({
        //   text: this.scriptText,
        //   record: this.media
        // });

        // for audio template
        const audioDiv = this.elementRef.nativeElement.querySelectorAll('.play-audio');
        if (audioDiv?.length) {
          this.audioUrl = audioDiv[0]?.getAttribute('audio');
          this.hasAudioDiv = true;
          console.log(this.audioUrl);
        }

      } else if (contentAudioDiv?.length) {
        this.isContentAudio = true;
        this.scriptText = contentAudioDiv[0]?.getAttribute('scriptText');
        // console.log(2, this.scriptText);
        // this.userResponse.emit({
        //   text: this.scriptText,
        //   record: this.media
        // });

        // for audio template
        const playAudioEl = this.elementRef.nativeElement.querySelectorAll('.play-audio');
        const playAudioSlowEl = this.elementRef.nativeElement.querySelectorAll('.play-audio-slow');
        if (playAudioEl?.length) {
          this.mathplayAudioService.setAudio(playAudioEl[0]?.getAttribute('audio'));

          this.audioSubscription = this.mathplayAudioService.$audioEnded.subscribe((ended) => {
            if (ended) {
              playAudioSlowEl[0]?.classList.remove('playing-audio-slow');
              playAudioEl[0]?.classList.remove('playing-audio');
              this.mathplayAudioService.setStateAudio('off');
              this.onPlayQuestion = false;
            }
          })

          this.renderer.listen(playAudioEl[0], 'click', () => {
            if (this.stateRun === this.State.RECORDING) return;

            this.mathplayAudioService.setPlaybackRate(1);
            playAudioSlowEl[0]?.classList.remove('playing-audio', 'playing-audio-slow');

            if (this.mathplayAudioService.audioState !== 'normal') {
              this.mathplayAudioService.setStateAudio('normal');
              playAudioEl[0]?.classList.add('playing-audio');
              this.onPlayQuestion = true;
            } else {
              this.mathplayAudioService.setStateAudio('off');
              playAudioEl[0]?.classList.remove('playing-audio');
              this.onPlayQuestion = false;
            }
          });

          if (playAudioSlowEl?.length) {
            this.renderer.listen(playAudioSlowEl[0], 'click', () => {
              if (this.stateRun === this.State.RECORDING) return;

              this.mathplayAudioService.setPlaybackRate(0.75);
              playAudioEl[0].classList.remove('playing-audio', 'playing-audio-slow');

              if (this.mathplayAudioService.audioState !== 'slow') {
                this.mathplayAudioService.setStateAudio('slow');
                playAudioSlowEl[0].classList.add('playing-audio-slow');
                this.onPlayQuestion = true;
              } else {
                this.mathplayAudioService.setStateAudio('off');
                playAudioSlowEl[0].classList.remove('playing-audio-slow');
                this.onPlayQuestion = false;
              }
            });
          }
        }
      }

      if (this.answer) {
        const questionContent = this.contentEl.nativeElement.querySelector('.content');
        if (questionContent) {
          const _quesText = questionContent?.querySelector('.content-text');
          if (_quesText) {
            this.renderer.setStyle(_quesText, 'display', 'none');
          }
          this.arrTexts = [];
          if (this.answer.speaking) {
            if (this.scriptText) {
              this.arrTexts = this.answer?.speaking?.utterances;
            } else {
              this.arrTexts = this.answer?.speaking?.utterances;
            }
            setTimeout(() => {
              this.renderer.appendChild(questionContent, this.answerContentEL.nativeElement);
            }, 300);
          }
        }
      }
    }
  }

  playAudioQuestion(rate: number) {
    if (!this.audioUrl || this.stateRun === this.State.RECORDING) {
      return;
    }
    if (!this.onPlayQuestion || (this.onPlayQuestion && this.ratePlayback !== rate)) {
      if (this.audioQuestion) {
        this.audioQuestion.pause();
        this.audioQuestion = null;
      }

      this.onPlayQuestion = true;
      this.ratePlayback = rate;

      this.audioQuestion = new Audio();
      this.audioQuestion.src = this.audioUrl;
      this.audioQuestion.load();
      this.audioQuestion.playbackRate = this.ratePlayback;
      this.audioQuestion.play();
      this.audioQuestion.onended = () => {
        this.onPlayQuestion = false;
      }
    } else {
      this.onPlayQuestion = false;
      this.audioQuestion.pause();
      this.audioQuestion.currentTime = 0;
    }
  }

  replay() {
    if (!this.urlMedia) {
      return;
    }
    this.onPlayAudio = !this.onPlayAudio;
    if (this.onPlayAudio) {
      this.audio = new Audio();
      this.audio.src = this.urlMedia;
      this.audio.load();
      this.audio.play();
      this.audio.onended = () => {
        this.onPlayAudio = false;
      }
    } else {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.stateRun = this.State.COMPLETE;
    this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
  }

  record() {
    if (this.stateRun === this.State.INITIAL) {
      this.startRecording();
      return;
    }
    if (this.stateRun === this.State.RECORDING) {
      this.stopRecording();
      return;
    }
    return;
  }
  startRecording() {
    const userAgent = navigator.userAgent;
    if (userAgent.match(/firefox|fxios/i)) {
      this.connectAudio();
    } else {
      try {
        const permissionName = 'microphone' as PermissionName;
        navigator.permissions.query({ name: permissionName }).then((m) => {
          if (m.state === 'denied') {
            alert('The browser does not allow the use microphones !');
          } else {
            this.connectAudio();
          }
        });
      } catch (error) {
        try {
          this.connectAudio();
        } catch (error) {
          alert('The browser does not allow the use microphones !');
        }
      }
    }
  }
  confirmAlert(event) {
    return event.returnValue = 'Các thay đổi bạn đã thực hiện có thể không được lưu.';
  }

  connectAudio() {
    if (!navigator.mediaDevices && !navigator.mediaDevices.getUserMedia) {
      navigator.userMedia = navigator.mozGetUserMedia || navigator.getUserMedia
      if (!navigator.userMedia) {
        alert("Please Update or Use Different Browser");
        return
      }
      navigator.userMedia({
        video: false,
        audio: true
      }, (stream) => showAudio(stream), (err) => showErr(err))
      return
    } else {
      navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
      })
        .then((stream) => showAudio(stream))
        .catch((err) => showErr(err))
    }

    const showAudio = (stream) => {
      this.stateRun = this.State.RECORDING;
      this.timer = timer(0, 1000).pipe(map((v) => {
        const seconds = v % 60;
        const minutes = Math.floor(v / 60);
        if (v >= 180) {
          this.showtext = true;
          this.record();
        }
        if (seconds < 10) {
          if (minutes < 10) {
            return `0${minutes}:0${seconds}`

          }
          return `${minutes}:0${seconds}`
        }
        if (minutes < 10) {
          return `0${minutes}:${seconds}`

        }
        return `${minutes}:${seconds}`
      }))
      // addEventListener('beforeunload', this.confirmAlert);
      const recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        } else {
          console.log('error');
        }
      };
      this.mediaRecorder.onstop = () => {
        this.media = new Blob(recordedChunks, { type: 'audio/ogg; codecs=opus' });
        this.urlMedia = URL.createObjectURL(this.media);
        this.userResponse.emit({
          text: this.scriptText,
          record: this.media
        });
      };
      this.mediaRecorder.start();
    }

    const showErr = (err) => {
      const message = err.name === "NotFoundError" ? "Please Attach Camera" :
        err.name === "NotAllowedError" ? "Please Grant Permission to Access Camera" : err
      alert(message)
    }
  }
  onLoadedMetadataAudio() {

    const audio = (document.getElementById('audio-ielts-audio') as HTMLAudioElement);
    if (audio.duration === Infinity) {
      audio.currentTime = 1e101;
      setTimeout(() => {
        audio.currentTime = 0;
      }, 100);
    }
  }
  getFileExtension(filename) {
    const ext = /^.+\.([^.]+)$/.exec(filename);
    return ext == null ? '' : ext[1];
  }

  recordingAgain() {
    this.stateRun = this.State.INITIAL;
    this.audio?.pause();
    this.onPlayAudio = false;
  }

  reset() {
    if (this.audioQuestion) {
      this.audioUrl = null;
      this.audioQuestion.pause();
      this.audioQuestion = null;
    }

    if (this.audio) {
      this.urlMedia = null;
      this.audio.pause();
      this.audio = null;
    }
  }

  ngOnDestroy() {
    this.reset();
    this.audioSubscription?.unsubscribe();
    if (this.mathplayAudioService?.audio) this.mathplayAudioService.setStateAudio('off');
  }
}
