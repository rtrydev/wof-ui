import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelCollaborationOptionsComponent } from './wheel-collaboration-options.component';

describe('WheelCollaborationOptionsComponent', () => {
  let component: WheelCollaborationOptionsComponent;
  let fixture: ComponentFixture<WheelCollaborationOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WheelCollaborationOptionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WheelCollaborationOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
