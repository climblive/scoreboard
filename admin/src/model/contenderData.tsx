import { ContenderScoringData } from "./contenderScoringData";

export interface ContenderData {
  id?: number;
  compClassId?: number;
  contestId: number;
  registrationCode: string;
  name?: string;
  entered?: string;
  disqualified: boolean;
  finalPlacing?: number;
  scorings?: ContenderScoringData[];
}
