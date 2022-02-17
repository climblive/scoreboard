import { SortBy } from "../constants/constants";
import { CompClass } from "./compClass";
import { ContenderData } from "./contenderData";
import { Contest } from "./contest";
import { Problem } from "./problem";
import { RaffleWinner } from "./raffleWinner";
import { ScoreboardContenderList } from "./scoreboardContenderList";
import { ScoreboardPushItem } from "./scoreboardPushItem";
import { Tick } from "./tick";

export interface StoreState {
  contenderData?: ContenderData;
  contenderNotFound: boolean;
  problemsSortedBy: SortBy;
  contest: Contest;
  problems: Problem[];
  compClasses: CompClass[];
  ticks: Tick[];
  pagingCounter: number;
  problemIdBeingUpdated?: number;
  errorMessage?: string;

  // Scoreboard state:
  scoreboardData: ScoreboardContenderList[];
  currentCompClassId: number;
  raffleWinners?: RaffleWinner[];
  raffleId?: number;
  pushItemsQueue: ScoreboardPushItem[];
}
