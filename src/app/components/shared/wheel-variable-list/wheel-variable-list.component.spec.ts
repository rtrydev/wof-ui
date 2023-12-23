import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelVariableListComponent } from './wheel-variable-list.component';

describe('WheelVariableListComponent', () => {
  let component: WheelVariableListComponent;
  let fixture: ComponentFixture<WheelVariableListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WheelVariableListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WheelVariableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
