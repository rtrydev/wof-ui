import { AfterContentInit, AfterViewInit, Component, HostListener } from '@angular/core';
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
import { WheelOptionsComponent } from "../wheel-options/wheel-options.component";

@Component({
    selector: 'app-wheel-creator',
    standalone: true,
    templateUrl: './wheel-creator.component.html',
    styleUrl: './wheel-creator.component.scss',
    imports: [CommonModule, WheelComponent, ReactiveFormsModule, FormsModule, WheelOptionsComponent]
})
export class WheelCreatorComponent implements AfterContentInit {
  public currentWheelId?: string;
  public wheelName?: string;
  public options: WheelOption[] = [];

  public wheelSize = 500;
  public calculatedWheelSize: number = this.wheelSize;

  public textSize = 20;
  public textOffset = 70;

  public textMarginTop = 0;
  public textMarginLeft = 0;

  public spinTime = 10000;
  public optionInputs: WheelElementWrite[] = [];

  public wheelProcessing = false;

  public window = window;

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

  ngAfterContentInit(): void {
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.calculatedWheelSize = Math.min(window.innerWidth, this.wheelSize);
  }

  public loadOptions(wheelSchema: WheelSchema): void {
    const optionCount = wheelSchema.elements.length;
    this.wheelName = wheelSchema.name;

    this.options = wheelSchema.elements.map(
      (element, idx) => ({
        id: element.id!,
        text: element.text,
        color: this.getColorForText(element.text),
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

    this.wheelProcessing = true;

    const wheelData = {
      name: this.wheelName,
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

    this.wheelProcessing = false;

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

  private getColorForText(text: string) : string {
    const bytes = Array.from(text).map(char => char.charCodeAt(0));

    const normalizer = Math.max(...bytes) / 192 + 64;

    const avgByte = Math.floor((
      bytes.reduce(
        (a, b) => normalizer * (a % 255 + b % 255), 0
      ) / bytes.length
    ));

    let firstSegment = 0;
    let lastSegment = 0;

    if (avgByte < 64) {
      firstSegment = avgByte + 64;
      lastSegment = avgByte + 128;
    } else if (avgByte > 192) {
      firstSegment = avgByte - 128;
      lastSegment = avgByte - 64;
    } else {
      firstSegment = avgByte + 64;
      lastSegment = avgByte - 64;
    }

    return `#${firstSegment.toString(16)}${avgByte.toString(16)}${lastSegment.toString(16)}`
      .slice(0, 7).padEnd(7, '0');
  }
}
