import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { questions } from './questions';

@Component({
  selector: 'app-puzzle-match',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './puzzle-match.component.html',
  styleUrl: './puzzle-match.component.scss'
})
export class PuzzleMatchComponent implements OnInit{

  isCheckShowHide = false;
  listQuestion = questions;

  constructor(){}

  ngOnInit(): void {
      console.log(111);
      
  }

  onShowHide() {
    this.isCheckShowHide = !this.isCheckShowHide;
  }

}
