export interface ContenderData {
  id?: number;
  compClassId?: number;
  contestId: number;
  registrationCode: string;
  name?: string;
  club?: string;
  entered?: string;
  disqualified: boolean;
  finalPlacing?: number;
}
