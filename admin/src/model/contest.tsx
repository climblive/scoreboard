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

  static makeRequestBody = (contest: Contest) => {
    return {
      id: contest.id,
      locationId: contest.locationId,
      organizerId: contest.organizerId,
      seriesId: contest.seriesId,
      protected: contest.protected,
      name: contest.name,
      description: contest.description,
      finalEnabled: contest.finalEnabled,
      qualifyingProblems: contest.qualifyingProblems,
      finalists: contest.finalists,
      rules: contest.rules,
      gracePeriod: contest.gracePeriod,
      scoreboardUrl: contest.scoreboardUrl,
    };
  };

  // ---------------------------------------------------------------------------
  // Internal properties
  // ---------------------------------------------------------------------------

  isNew?: boolean;
}
