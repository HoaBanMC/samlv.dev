import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
declare let webkitSpeechRecognition: any;
declare let SpeechRecognition: any;

@Injectable({ providedIn: 'root' })
export class SpeechRecognitionService {
    listCodeLanguages = ['vi-VN', 'en-GB', 'ja-JP', 'cmn-Hans-CN'];
    speechApi: any;
    transcriptResult = new Subject();
    $transcriptResult = this.transcriptResult.asObservable();
    constructor() {
        this.speechApi = new webkitSpeechRecognition() || new SpeechRecognition();
        this.speechApi.continuous = true;
        this.speechApi.interimResults = false;
    }

    start(languageCode: string) {
        if (languageCode) {
            this.speechApi.lang = this.listCodeLanguages?.find(lang => lang.split('-')[0] === languageCode);
        } else {
            this.speechApi.lang = 'vi-VN';
        }
        this.speechApi.onresult = (event) => {
            const resultIndex = event.resultIndex;
            const transcript = event.results[resultIndex][0].transcript;
            this.transcriptResult.next(transcript);
        };
        this.speechApi.start();
    }
    stop() {
        this.speechApi.stop();
    }
}