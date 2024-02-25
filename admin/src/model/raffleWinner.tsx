export interface RaffleWinner {
  id?: number;
  raffleId: number;
  contenderId: number;
  contenderName: string;
  timestamp: string;
}
