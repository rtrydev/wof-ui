import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelOptionsComponent } from './wheel-options.component';

describe('WheelOptionsComponent', () => {
  let component: WheelOptionsComponent;
  let fixture: ComponentFixture<WheelOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WheelOptionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WheelOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
