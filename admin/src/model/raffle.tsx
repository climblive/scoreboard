import {RaffleWinner} from "./raffleWinner";

export interface Raffle {
   id: number;
   contestId: number;
   winners?: RaffleWinner[];
}