import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWheelComponent } from './new-wheel.component';

describe('NewWheelComponent', () => {
  let component: NewWheelComponent;
  let fixture: ComponentFixture<NewWheelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewWheelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewWheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
