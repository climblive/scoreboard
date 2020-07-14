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
}
