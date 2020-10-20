import { Tick } from "./tick";

export interface ContenderScoringInfo {
  ticks?: Tick[];
  totalScore?: number;
  totalPosition?: number;
  qualifyingScore?: number;
  qualifyingPosition?: number;
  isFinalist?: boolean;
}
