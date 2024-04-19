import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameWordleComponent } from './game-wordle.component';

describe('GameWordleComponent', () => {
  let component: GameWordleComponent;
  let fixture: ComponentFixture<GameWordleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameWordleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameWordleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
