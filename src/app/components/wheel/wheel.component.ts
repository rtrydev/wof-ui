import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WheelOption } from '../../interfaces/wheel-option';

@Component({
  selector: 'app-wheel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wheel.component.html',
  styleUrl: './wheel.component.scss'
})
export class WheelComponent implements OnDestroy {
  public currentRotation = 0;
  public time = 0;

  public options: WheelOption[] = [];
  public currentResult: WheelOption | null = null;

  public textSize = 22;
  public textOffset = 90;

  public textMarginTop = 0;
  public textMarginLeft = 0;

  private timeStep = 17;
  private maxDivider = 2048;

  private speedDivider = 0;
  private rotationInterval: any;

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
  ]

  constructor() {
    const optionCount = 5;

    this.textMarginTop = -(this.textOffset - this.textSize) * Math.cos(Math.PI / optionCount);
    this.textMarginLeft = (this.textOffset) * Math.sin(Math.PI / optionCount);

    this.options = this.generateOptions(optionCount);
  }

  ngOnDestroy() {
    this.clearRotationInterval();
  }

  public generateOptions(optionCount: number): WheelOption[] {
    const result = [];

    for (let i = 0; i < optionCount; i++) {
      result.push({
        text: `option${i + 1}`,
        color: this.colors[
            Math.floor(Math.random() * this.colors.length)
          ],
        rotation: i * (2 * Math.PI / optionCount),
        textRotation: `${-90 + (180 / optionCount)}deg`
      })
    }

    return result;
  }

  public startRotation(spinFor: number) {
    this.clearRotationInterval();

    this.time = 0;
    this.speedDivider = this.getStartSpinSpeed();

    const steps = spinFor / this.timeStep;
    const speedDividerIncreaseRate = Math.pow(this.maxDivider, 1 / steps);

    this.rotationInterval = setInterval(() => {
      this.speedDivider *= speedDividerIncreaseRate;
      this.currentRotation += Math.PI / this.speedDivider;

      if (this.currentRotation > 2 * Math.PI) {
        this.currentRotation -= 2 * Math.PI;
      }

      if (this.speedDivider > this.maxDivider) {
        this.currentResult = this.getCurrentResult();
        this.clearRotationInterval();
      }

      this.time += this.timeStep;
    }, this.timeStep);
  }

  public getSliceClipPath(sliceCount: number): string {
    if (sliceCount === 1) {
      return `
        circle(100%)
      `;
    }

    if (sliceCount === 2) {
      return `
        polygon(
          50% 50%,
          50% 0%,
          100% 0%,
          0% 999999%,
          50% 50%
        )
      `;
    }

    if (sliceCount <= 8) {
      return `
        polygon(
          50% 50%,
          50% 0%,
          100% 0%,
          100% ${50 * (1 - Math.tan(Math.PI / 2 - 2 * Math.PI / sliceCount))}%,
          50% 50%
        )
      `;
    }

    return `
      polygon(
        50% 50%,
        50% 0%,
        100% 0%,
        ${50 * (1 + Math.tan(2 * Math.PI / sliceCount))}% 0%,
        50% 50%
      )
    `;
  }

  private getCurrentResult(): WheelOption | null {
    const offsetRotation = (5 / 2) * Math.PI - this.currentRotation;
    const normalizedRotation = this.normalizeRotation(offsetRotation);

    let currentIndex = -1;

    for (const [idx, option] of this.options.entries()) {
      if (idx === this.options.length - 1) {
        currentIndex = idx;
        break;
      }

      if (option.rotation < normalizedRotation && this.options[idx + 1].rotation > normalizedRotation) {
        currentIndex = idx;
        break;
      }
    }

    if (currentIndex === -1) {
      return null;
    }

    return this.options[currentIndex];
  }

  private clearRotationInterval() {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
    }
  }

  private getStartSpinSpeed() {
    const minSpeed = 0.5;
    const maxSpeed = 1.5;

    return Math.random() * (maxSpeed - minSpeed + 1) + minSpeed;
  }

  private normalizeRotation(rotation: number): number {
    if (rotation < 0) {
      const n = Math.ceil(rotation / -(2 * Math.PI));

      return rotation + 2 * n * Math.PI;
    }

    if (rotation > 2 * Math.PI) {
      const n = Math.floor(rotation / (2 * Math.PI));

      return rotation - 2 * n * Math.PI;
    }

    return rotation;
  }
}
