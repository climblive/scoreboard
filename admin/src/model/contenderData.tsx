import { ContenderScoring } from "./contenderScoring";

export class ContenderData {
  id?: number;
  compClassId?: number;
  contestId: number;
  registrationCode: string;
  name?: string;
  entered?: string;
  disqualified: boolean;
  finalPlacing?: number;
  scorings?: ContenderScoring[];
}
