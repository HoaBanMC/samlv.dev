import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixijsDemoComponent } from './pixijs-demo.component';

describe('PixijsDemoComponent', () => {
  let component: PixijsDemoComponent;
  let fixture: ComponentFixture<PixijsDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PixijsDemoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PixijsDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
