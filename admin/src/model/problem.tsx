import { Tick } from "./tick";

export interface Problem {
  id?: number;
  contestId: number;
  number?: number;
  colorId?: number;
  points?: number;
  flashBonus?: number;
  text?: string;

  // Internal data:
  ticks?: Tick[];
}
