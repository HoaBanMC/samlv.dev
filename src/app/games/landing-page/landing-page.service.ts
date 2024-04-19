import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {

  score = new Subject();

  constructor() { }

  setScore(value: number) {
    this.score.next(value);
  }

  getScore(){
    return this.score.asObservable();
  }
}
