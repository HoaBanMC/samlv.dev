import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzleSlideComponent } from './puzzle-slide.component';

describe('PuzzleSlideComponent', () => {
  let component: PuzzleSlideComponent;
  let fixture: ComponentFixture<PuzzleSlideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuzzleSlideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PuzzleSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
