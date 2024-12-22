import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WheelElementWrite } from '../../../interfaces/wheel-element-write';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLock, faLockOpen, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-wheel-options',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FontAwesomeModule],
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

  @Input()
  public canEdit: boolean = false;

  @Output()
  public optionRemoved: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  public optionAdded: EventEmitter<void> = new EventEmitter();

  @Output()
  public wheelSubmitted: EventEmitter<void> = new EventEmitter();

  @Output()
  public optionChanged: EventEmitter<void> = new EventEmitter();

  @Output()
  public optionLocked: EventEmitter<number> = new EventEmitter<number>();

  public faTrash = faTrash;
  public faLock = faLock;
  public faLockOpen = faLockOpen;

  public changeCallback() {
    this.optionChanged.emit();
  }
}
