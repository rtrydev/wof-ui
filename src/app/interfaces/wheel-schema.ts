import { WheelElement } from './wheel-element';
import { WheelVariable } from './wheel-variable';

export interface WheelSchema {
  id: string;
  name: string;
  elements: WheelElement[];
  variables: WheelVariable[];
}
