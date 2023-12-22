import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WheelOptionsComponent } from "../shared/wheel-options/wheel-options.component";
import { WheelElementWrite } from '../../interfaces/wheel-element-write';
import { SchemaService } from '../../services/schema.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WheelListComponent } from "../shared/wheel-list/wheel-list.component";
import { WheelSchema } from '../../interfaces/wheel-schema';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [CommonModule, WheelOptionsComponent, ReactiveFormsModule, FormsModule, WheelListComponent]
})
export class HomeComponent implements OnInit {
  public wheelName: string = '';
  public optionInputs: WheelElementWrite[] = [
    {text: 'Option 1'},
    {text: 'Option 2'},
    {text: 'Option 3'},
  ];

  public wheelProcessing = false;

  public userSchemas: WheelSchema[] = [];

  constructor(private schemaService: SchemaService, private router: Router) {}

  ngOnInit(): void {
    this.schemaService.getSchemas().then(schemas => {
      this.userSchemas = schemas;
    });
  }

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
