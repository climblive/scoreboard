import { Color } from "./color";

export interface Problem {
  id: number;
  number: number;
  colorId: number;
  color?: Color;
  points: number;
  flashBonus?: number;
  name: string;
  description?: string;
}
