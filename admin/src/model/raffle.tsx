export class Raffle {
  id?: number;
  contestId: number;
  active: boolean;

  static makeRequestBody = (raffle: Raffle) => {
    return {
      id: raffle.id,
      contestId: raffle.contestId,
      active: raffle.active,
    };
  };
}
