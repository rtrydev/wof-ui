import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WheelOptionsComponent } from "../wheel-options/wheel-options.component";
import { WheelElementWrite } from '../../interfaces/wheel-element-write';
import { SchemaService } from '../../services/schema.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-new-wheel',
    standalone: true,
    templateUrl: './new-wheel.component.html',
    styleUrl: './new-wheel.component.scss',
    imports: [CommonModule, WheelOptionsComponent, ReactiveFormsModule, FormsModule]
})
export class NewWheelComponent {
  public wheelName: string = '';
  public optionInputs: WheelElementWrite[] = [
    {text: 'Option 1'},
    {text: 'Option 2'},
    {text: 'Option 3'},
  ];

  public wheelProcessing = false;

  constructor(private schemaService: SchemaService, private router: Router) {}

  public addOption(): void {
    this.optionInputs.push({
      text: ''
    });
  }

  public async createWheel(): Promise<void> {
    if (this.optionInputs.length === 0) {
      return;
    }

    this.wheelProcessing = true;

    const wheelData = {
      name: this.wheelName || 'My Wheel',
      elements: this.optionInputs
        .filter(input => input.text)
        .map(input => ({
          text: input.text
        }))
    };

    const result = await this.schemaService.createSchema(
      wheelData
    );

    setTimeout(() => {
      this.wheelProcessing = false;
    }, 100);

    if (result) {
      this.router.navigateByUrl(`wheel/${result.id}`);
    }
  }

  public removeOption(index: number): void {
    this.optionInputs.splice(index, 1);
  }
}
