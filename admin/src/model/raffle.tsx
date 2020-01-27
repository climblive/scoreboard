import {RaffleWinner} from "./raffleWinner";

export interface Raffle {
   id: number;
   contestId: number;
   active: boolean;
   winners?: RaffleWinner[];
}