import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlantTreeService {

  hasUp = signal(false);

  constructor() { }
}