import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelListComponent } from './wheel-list.component';

describe('WheelListComponent', () => {
  let component: WheelListComponent;
  let fixture: ComponentFixture<WheelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WheelListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WheelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
