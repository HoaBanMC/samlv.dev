import {
  Component, ElementRef, Input, Output, OnDestroy, EventEmitter, Renderer2, ViewChild
} from '@angular/core';
import { MathplayAudioService } from './mathlay-audio';
import { Subscription } from 'rxjs';
import { SpeechRecognitionService } from './speech-recognition.service';


@Component({
  selector: 'app-dynamic-html-recording',
  template: `<div [mathJax]="content" (loadComplete)="loadComplete()"></div>
  <div class="message">{{message}}</div>
  <div class="recording">
    <div #micro class="micro"></div>
    <div #ear class="ear">
      <audio #earAudio controls hidden>
        <source type="audio/ogg" [src]="urlMedia | safeHtml: 'resourceUrl'">
      </audio>
    </div>
  </div>
  <!-- <div (click)="onSubmit()" [class.disabled]="!urlMedia || currentState !== state.INITIAL" 
    class="submit-record">{{currentState === state.SUBMIT ? 'Đang gửi...' : 'Gửi'}}</div> -->`,
})
export class DynamicHTMLRecordingComponent implements OnDestroy {
  @ViewChild('micro') micro: ElementRef;
  @ViewChild('ear') ear: ElementRef;
  @ViewChild('earAudio') earAudio: ElementRef;
  @Input() content: string;
  @Input() answer: any;
  @Input() isStoreRecord = false;
  @Input() isExplain = false;
  @Input() userRecord;

  mediaRecorder;
  urlMedia;
  media;
  state = {
    INITIAL: 1,
    RECORDING: 2,
    LISTENING_EAR: 3,
    LISTENING_QUESTION: 4,
    SUBMIT: 5
  };
  currentState = this.state.INITIAL;

  messageConfig = {
    START: "Nhấn để ghi âm",
    RECORDING: "Nhấn để kết thúc",
    TEXT_EMPTY: 'Dường như không nghe rõ, hãy thử lại nhé',
    RELISTEN: 'Nhấn tai nghe để nghe lại câu trả lời'
  }
  canClick = true;
  message = this.messageConfig.START;

  language = 'vi';
  transcriptSpeech;

  audioSubscription: Subscription;
  speechRecognitionSubscription: Subscription;

  @Output() userResponse = new EventEmitter<object>();

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private mathplayAudioService: MathplayAudioService,
    private speechRecognitionService: SpeechRecognitionService
  ) { }

  // creat listen from element
  loadComplete() {
    if (this.content && this.elementRef) {
      if (this.answer?.length) {
        this.userResponse.emit({
          answer: this.answer,
          record: null
        });
      }

      // for audio template
      const playAudioEl = this.elementRef.nativeElement.querySelectorAll('.play-audio');
      if (playAudioEl?.length) {
        const questionAudio = playAudioEl[0]?.getAttribute('audio');
        this.mathplayAudioService?.setAudio(questionAudio);
        this.language = playAudioEl[0]?.getAttribute('language');
        this.audioSubscription = this.mathplayAudioService.$audioEnded.subscribe((ended) => {
          if (ended) {
            playAudioEl[0]?.classList.remove('opacityAudio');
            this.mathplayAudioService.setStateAudio('off');
            this.currentState = this.state.INITIAL;
          }
        });

        this.renderer.listen(playAudioEl[0], 'click', () => {
          this.mathplayAudioService.setPlaybackRate(1);
          if (this.mathplayAudioService.audioState === 'normal') {
            this.mathplayAudioService.setStateAudio('off');
            playAudioEl[0]?.classList.remove('opacityAudio');
            this.currentState = this.state.INITIAL;
          } else {
            if (this.currentState === this.state.INITIAL) {
              this.mathplayAudioService.setStateAudio('normal');
              playAudioEl[0]?.classList.add('opacityAudio');
              this.currentState = this.state.LISTENING_QUESTION;
            }
          }
        });
      }

      let isRecord = false;
      if (this.micro?.nativeElement && !this.isExplain) {
        this.speechRecognitionSubscription = this.speechRecognitionService.$transcriptResult.subscribe((result: any) => {
          if (result) {
            this.transcriptSpeech = [result?.toLowerCase()];

            if (this.isStoreRecord) {
              this.userResponse.emit({
                answer: this.transcriptSpeech,
                record: this.media
              });
            } else {
              this.userResponse.emit(this.transcriptSpeech);
            }
          }
        });

        this.renderer.listen(this.micro?.nativeElement, 'click', () => {
          if (isRecord && this.canClick) {
            isRecord = false;
            this.canClick = false;
            this.renderer.removeClass(this.micro?.nativeElement, 'running');
            this.stopRecording();
            this.currentState = this.state.INITIAL;
            this.speechRecognitionService.stop();
            setTimeout(() => {
              if (this.transcriptSpeech?.length) {
                this.message = this.messageConfig.START;
              } else {
                this.message = this.messageConfig.TEXT_EMPTY;
              }
              this.canClick = true;
            }, 500);
          } else {
            if (this.currentState === this.state.INITIAL && this.canClick) {
              this.canClick = false;
              isListening = false;
              isRecord = true;
              this.transcriptSpeech = null;
              this.renderer.addClass(this.micro?.nativeElement, 'running');
              this.renderer.removeClass(this.ear?.nativeElement, 'ear-listening');
              this.currentState = this.state.RECORDING;
              this.message = this.messageConfig.RECORDING;
              this.startRecording();
              this.speechRecognitionService.start(this.language);
              setTimeout(() => {
                this.canClick = true;
              }, 500);
            }
          }
        });
      }

      let isListening = false;
      if (this.ear?.nativeElement) {
        if (this.userRecord) {
          this.urlMedia = this.userRecord?.url;
          this.earAudio?.nativeElement.setAttribute('src', this.urlMedia);
          this.message = this.messageConfig.RELISTEN;
        }

        this.renderer.listen(this.ear?.nativeElement, 'click', () => {
          if (!this.urlMedia) {
            return;
          }
          if (isListening) {
            isListening = false;
            this.renderer.removeClass(this.ear?.nativeElement, 'ear-listening');
            this.earAudio.nativeElement?.pause();
            this.currentState = this.state.INITIAL;
          } else {
            if (this.currentState === this.state.INITIAL) {
              isRecord = false;
              isListening = true;
              this.renderer.removeClass(this.micro?.nativeElement, 'running');
              this.renderer.addClass(this.ear?.nativeElement, 'ear-listening');
              this.earAudio.nativeElement?.play();
              this.currentState = this.state.LISTENING_EAR;

              this.earAudio.nativeElement.onended = () => {
                this.ear?.nativeElement.click();
              }
            }
          }
        });
      }
    }
  }

  onSubmit() {
    console.log('submit');
    this.currentState = this.state.SUBMIT;

    setTimeout(() => {
      this.currentState = this.state.INITIAL;
    }, 2000)
  }

  startRecording() {
    if (this.currentState === this.state.RECORDING) {
      if (this.mathplayAudioService?.audio) this.mathplayAudioService?.setStateAudio('off');
      const userAgent = navigator.userAgent;
      if (userAgent.match(/firefox|fxios/i)) {
        this.connectAudio();
      } else {
        const permissionName = 'microphone' as PermissionName;
        navigator.permissions.query({ name: permissionName }).then((m) => {
          if (m.state === 'denied') {
            alert('The browser does not allow the use microphones !');
          } else {
            this.connectAudio();
          }
        });
      }
    }
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
  }

  confirmAlert(event) {
    return event.returnValue = 'Các thay đổi bạn đã thực hiện có thể không được lưu.';
  }

  connectAudio() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
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
          if (this.earAudio?.nativeElement) {
            this.earAudio?.nativeElement.setAttribute('src', this.urlMedia);
          }
        };
        this.mediaRecorder.start();
      }).catch(err => {
        console.log(err);
        alert('Audio cannot be found. Please check your microphone settings');
      });
  }

  ngOnDestroy() {
    this.speechRecognitionSubscription?.unsubscribe();
    this.audioSubscription?.unsubscribe();
    if (this.mathplayAudioService?.audio) this.mathplayAudioService.setStateAudio('off');
  }
}
