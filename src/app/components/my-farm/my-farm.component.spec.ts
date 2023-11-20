import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFarmComponent } from './my-farm.component';

describe('MyFarmComponent', () => {
  let component: MyFarmComponent;
  let fixture: ComponentFixture<MyFarmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyFarmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyFarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
