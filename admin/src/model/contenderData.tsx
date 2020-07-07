import { Tick } from "./tick";

export class ContenderData {
  id?: number;
  compClassId?: number;
  contestId: number;
  registrationCode: string;
  name?: string;
  entered?: string;
  disqualified: boolean;
  finalPlacing?: number;

  static makeRequestBody = (contender: ContenderData) => {
    return {
      id: contender.id,
      compClassId: contender.compClassId,
      contestId: contender.contestId,
      registrationCode: contender.registrationCode,
      name: contender.name,
      entered: contender.entered,
      disqualified: contender.disqualified,
      finalPlacing: contender.finalPlacing,
    };
  };

  // ---------------------------------------------------------------------------
  // Internal properties
  // ---------------------------------------------------------------------------

  ticks?: Tick[];
  totalScore?: number;
  totalPosition?: number;
  qualifyingScore?: number;
  qualifyingPosition?: number;
  isFinalist?: boolean;
}
