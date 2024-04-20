import { HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class InputService {

  myHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });

  private isInputInChange: Subject<object> = new Subject<any>();
  private arrayData = new BehaviorSubject<Array<object>>([]);
  private itemData = new Subject<object>();
  private keypadShow = new BehaviorSubject<boolean>(false);

  keypadShow$ = this.keypadShow.asObservable();

  constructor(
    private _ngZone: NgZone
  ) {
    window['inputService'] = { service: this, zone: this._ngZone };
  }
  markExKeypadShow(display) {
    return this.keypadShow.next(display);
  }

  markExInputInChange(changed: object) {
    this.isInputInChange.next(changed);
  }
  destroyInputInChange() {
    this.isInputInChange.next(null);
  }

  markDataChange(data: Array<object>) {
    this.arrayData.next(data);
  }
  markItemDataChange(data: {}) {
    this.itemData.next(data);
  }
  detectExInputInChange(): Observable<object> {
    return this.isInputInChange.asObservable();
  }
  detectDataChange(): Observable<Array<object>> {
    return this.arrayData.asObservable();
  }
  detectItemDataChange(): Observable<object> {
    return this.itemData.asObservable();
  }
}
