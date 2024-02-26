export interface Contest {
  id?: number;
  location?: string;
  organizerId: number;
  seriesId?: number;
  protected: boolean;
  name: string;
  description: string;
  finalEnabled: boolean;
  qualifyingProblems: number;
  finalists: number;
  rules: string;
  gracePeriod: number;
  scoreboardUrl?: number;
  timeBegin?: string;
  timeEnd?: string;
}
