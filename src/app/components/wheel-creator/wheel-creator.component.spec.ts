import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelCreatorComponent } from './wheel-creator.component';

describe('WheelCreatorComponent', () => {
  let component: WheelCreatorComponent;
  let fixture: ComponentFixture<WheelCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WheelCreatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WheelCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
