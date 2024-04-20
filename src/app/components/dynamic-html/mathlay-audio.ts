import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MathplayAudioService {
    audio;
    audioState: any;

    audioEnded = new BehaviorSubject<boolean>(false);
    $audioEnded = this.audioEnded.asObservable();

    setStateAudio(state: any) {
        if (state !== 'off') {
            if (this.audio) {
                this.audio.pause();
                this.audio.currentTime = 0;
            }
            this.audio.play();
        } else {
            this.audio.pause();
        }
        this.audioState = state;
    }

    setPlaybackRate(rate: number) {
        this.audio.playbackRate = rate;
    }

    setAudio(src: any): void {
        if (src === this.audio?.src) {
            return;
        }

        this.audio = new Audio();
        this.audio.src = src;
        this.audio.loop = false;
        this.audio.load();
        this.audioState = 'on';

        this.audio.onended = () => {
            // console.log('ended');
            this.audioEnded.next(true);
        }
    }

    destroyAudio() {
        this.audio?.pause();
        this.audio = null;
    }
}