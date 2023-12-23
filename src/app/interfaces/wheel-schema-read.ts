import { WheelElement } from './wheel-element';
import { WheelVariableRead } from './wheel-variable-read';

export interface WheelSchemaRead {
  id: string;
  name: string;
  elements: WheelElement[];
  variables: WheelVariableRead[];
}