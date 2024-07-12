import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelCollaborationComponent } from './wheel-collaboration.component';

describe('WheelCollaborationComponent', () => {
  let component: WheelCollaborationComponent;
  let fixture: ComponentFixture<WheelCollaborationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WheelCollaborationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WheelCollaborationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
