export class Contest {
  id?: number;
  locationId?: number;
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
}
