import { WheelElementWrite } from "./wheel-element-write";
import { WheelVariableWrite } from "./wheel-variable-write";

export interface WheelSchemaWrite {
  elements: WheelElementWrite[],
  variables?: WheelVariableWrite[]
}
