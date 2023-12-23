import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WheelVariable } from '../../../interfaces/wheel-variable';
import { WheelSchema } from '../../../interfaces/wheel-schema';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-wheel-variable-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './wheel-variable-list.component.html',
  styleUrl: './wheel-variable-list.component.scss'
})
export class WheelVariableListComponent {
  @Input()
  public variables?: WheelVariable[];

  @Input()
  public availableSchemas?: WheelSchema[];
}
