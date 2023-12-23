import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WheelElementWrite } from '../../../interfaces/wheel-element-write';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-wheel-options',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './wheel-options.component.html',
  styleUrl: './wheel-options.component.scss'
})
export class WheelOptionsComponent {
  @Input()
  public optionInputs!: WheelElementWrite[];

  @Input()
  public submitActive: boolean = true;

  @Input()
  public submitProcessing: boolean = false;

  @Output()
  public optionRemoved: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  public optionAdded: EventEmitter<void> = new EventEmitter();

  @Output()
  public wheelSubmitted: EventEmitter<void> = new EventEmitter();

  @Output()
  public optionChanged: EventEmitter<void> = new EventEmitter();

  public changeCallback() {
    this.optionChanged.emit();
  }
}
