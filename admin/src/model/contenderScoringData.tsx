import { Tick } from "./tick";

export interface ContenderScoringData {
  contenderId: number;
  ruleId: number;
  score: number;
  placement: number;

  ticks?: Tick[];
  totalScore?: number;
  totalPosition?: number;
  qualifyingScore?: number;
  qualifyingPosition?: number;
  isFinalist?: boolean;
}
