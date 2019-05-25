import { ContenderData } from './contenderData';
import { ScoreboardContenderList } from './scoreboardContenderList';
import { Contest } from './contest';
import {SortBy} from "../constants/constants";
import {Problem} from "./problem";
import {CompClass} from "./compClass";
import {Tick} from "./tick";
import {Color} from "./color";

export interface StoreState {
   contests: Contest[],
   title: string,

   contenderData?: ContenderData;
   contenderNotFound: boolean;
   problemsSortedBy: SortBy;
   scoreboardData: ScoreboardContenderList[];
   contest: Contest;
   problems: Problem[];
   compClasses: CompClass[];
   ticks: Tick[];
   colors: Map<number, Color>,
   pagingCounter: number;
   problemIdBeingUpdated?: number;
   errorMessage?: string;
}