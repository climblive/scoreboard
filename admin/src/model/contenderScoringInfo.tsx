import { Tick } from "./tick";

export class ContenderScoringInfo {
  ticks?: Tick[];
  totalScore?: number;
  totalPosition?: number;
  qualifyingScore?: number;
  qualifyingPosition?: number;
  isFinalist?: boolean;
}
