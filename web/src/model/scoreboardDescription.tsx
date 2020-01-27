import {ScoreboardContenderList} from "./scoreboardContenderList";
import {RaffleWinner} from "./raffleWinner";

export class ScoreboardDescription {
   contestId: number;
   scores:ScoreboardContenderList[];
   raffle?: {
      winners: RaffleWinner[];
   }
}