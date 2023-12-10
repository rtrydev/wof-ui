import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WheelComponent } from "../wheel/wheel.component";
import { SchemaService } from '../../services/schema.service';
import { ActivatedRoute } from '@angular/router';
import { take, tap } from 'rxjs';
import { WheelSchema } from '../../interfaces/wheel-schema';
import { WheelOption } from '../../interfaces/wheel-option';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WheelElement } from '../../interfaces/wheel-element';
import { WheelElementWrite } from '../../interfaces/wheel-element-write';

@Component({
    selector: 'app-wheel-creator',
    standalone: true,
    templateUrl: './wheel-creator.component.html',
    styleUrl: './wheel-creator.component.scss',
    imports: [CommonModule, WheelComponent, ReactiveFormsModule, FormsModule]
})
export class WheelCreatorComponent {
  public currentWheelId?: string;
  public options: WheelOption[] = [];

  public textSize = 20;
  public textOffset = 70;

  public textMarginTop = 0;
  public textMarginLeft = 0;

  public spinTime = 10000;
  public optionInputs: WheelElementWrite[] = [];

  private maxOptions = 30;

  private colors = [
    'AliceBlue',
    'Coral',
    'DeepSkyBlue',
    'Gold',
    'HotPink',
    'Lavender',
    'MediumSeaGreen',
    'NavajoWhite',
    'Olive',
    'PaleTurquoise',
    'RoyalBlue',
    'SlateGray',
    'Teal',
    'Violet',
    'Wheat',
    'YellowGreen',
    'Azure',
    'BurlyWood',
    'Chocolate',
    'DarkSalmon'
  ];

  constructor(
    private schemaService: SchemaService,
    private activatedRoute: ActivatedRoute
  ) {
    this.loadFormOptions();
  }

  ngOnInit() {
    this.activatedRoute.params.pipe(
      take(1),
        tap((params: any) => {
          this.currentWheelId = params.id;
        }),
        tap(() => {
          this.loadWheel();
      })
    ).subscribe();
  }

  public loadOptions(wheelSchema: WheelSchema): void {
    const optionCount = wheelSchema.elements.length;

    this.options = wheelSchema.elements.map(
      (element, idx) => ({
        id: element.id!,
        text: element.text,
        color: this.colors[
          Math.floor(Math.random() * this.colors.length)
        ],
        rotation: idx * (2 * Math.PI / optionCount),
        textRotation: `${-90 + (180 / optionCount)}deg`
      })
    );

    this.textMarginTop = -(this.textOffset - this.textSize) * Math.cos(Math.PI / optionCount);
    this.textMarginLeft = (this.textOffset) * Math.sin(Math.PI / optionCount);

    this.loadFormOptions();
  }

  public addOption(): void {
    this.optionInputs.push({
      text: ''
    });
  }

  public async updateWheel(): Promise<void> {
    if (!this.currentWheelId || this.optionInputs.length === 0) {
      return;
    }

    const wheelData = {
      elements: this.optionInputs
        .filter(input => input.text)
        .map(input => ({
          text: input.text
        }))
    };

    await this.schemaService.updateSchema(
      this.currentWheelId,
      wheelData
    );

    this.loadWheel();
  }

  public removeOption(index: number): void {
    this.optionInputs.splice(index, 1);
  }

  private loadWheel() {
    if (!this.currentWheelId) {
      return;
    }

    this.schemaService.getSchema(this.currentWheelId).then(
      schema => {
        if (!schema) {
          return;
        }

        this.loadOptions(schema);
    }
  );
  }

  private loadFormOptions() {
    this.optionInputs = [];

    this.optionInputs = this.options.map(option => ({
        text: option.text
      }));
  }
}
