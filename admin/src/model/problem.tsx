import { Tick } from "./tick";

export class Problem {
  id?: number;
  colorId?: number;
  contestId: number;
  number?: number;
  name?: string;
  points?: number;
  flashBonus?: number;

  static makeRequestBody = (problem: Problem) => {
    return {
      id: problem.id,
      colorId: problem.colorId,
      contestId: problem.contestId,
      number: problem.number,
      name: problem.name,
      points: problem.points,
      flashBonus: problem.flashBonus,
    };
  };

  // ---------------------------------------------------------------------------
  // Internal properties
  // ---------------------------------------------------------------------------

  ticks?: Tick[];
}
