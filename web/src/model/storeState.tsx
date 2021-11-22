import { ContenderData } from "./contenderData";
import { ScoreboardContenderList } from "./scoreboardContenderList";
import { Contest } from "./contest";
import { SortBy } from "../constants/constants";
import { Problem } from "./problem";
import { CompClass } from "./compClass";
import { Tick } from "./tick";
import { Color } from "./color";
import { RaffleWinner } from "./raffleWinner";
import { ScoreboardPushItem } from "./scoreboardPushItem";

export interface StoreState {
  contenderData?: ContenderData;
  contenderNotFound: boolean;
  problemsSortedBy: SortBy;
  contest: Contest;
  problems: Problem[];
  compClasses: CompClass[];
  ticks: Tick[];
  colors: Map<number, Color>;
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
