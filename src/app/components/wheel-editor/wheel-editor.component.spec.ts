import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelEditorComponent } from './wheel-editor.component';

describe('WheelCreatorComponent', () => {
  let component: WheelEditorComponent;
  let fixture: ComponentFixture<WheelEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WheelEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WheelEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
