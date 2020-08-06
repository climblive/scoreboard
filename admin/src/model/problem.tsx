import { SharedPoints } from "./sharedPoints";

export class Problem {
  id?: number;
  colorId?: number;
  contestId: number;
  number: number;
  name?: string;
  points?: number;
  flashBonus?: number;
  sharedPoints?: SharedPoints[];
}
