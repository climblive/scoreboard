import { Color } from "./color";

export interface Problem {
  id?: number;
  colorId: number;
  color?: Color;
  contestId: number;
  number: number;
  name?: string;
  points?: number;
  flashBonus?: number;
}
