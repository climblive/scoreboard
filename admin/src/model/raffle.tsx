import {RaffleWinner} from "./raffleWinner";

export interface Raffle {
   id: number;
   contestId: number;
   isActive: boolean;
   winners?: RaffleWinner[];
}