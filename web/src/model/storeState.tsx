import { ContenderData } from './contenderData';
import { ScoreboardContenderList } from './scoreboardContenderList';
import { Contest } from './contest';
import {SortBy} from "../constants/constants";

export interface StoreState {
   contenderData?: ContenderData;
   contenderNotFound: boolean;
   problemsSortedBy: SortBy;
   scoreboardData: ScoreboardContenderList[];
   contest: Contest;
   pagingCounter: number;
   problemIdBeingUpdated?: number;
   errorMessage?: string;
}