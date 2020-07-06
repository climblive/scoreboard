export interface Contest {
  id?: number;
  seriesId?: number;
  protected: boolean;
  name: string;
  description: string;
  organizerId: number;
  locationId?: number;
  finalEnabled: boolean;
  qualifyingProblems: number;
  finalists: number;
  gracePeriod: number;
  rules: string;

  // Internal parameters:
  isNew?: boolean;
}
