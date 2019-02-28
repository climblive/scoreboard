import { ContenderData } from './contenderData';
import { ScoreboardContenderList } from './scoreboardContenderList';
import { Contest } from './contest';

export interface StoreState {
   contenderData?: ContenderData;
   contenderNotFound: boolean;
   problemsSortedBy: string;
   scoreboardData: ScoreboardContenderList[];
   contest: Contest;
   pagingCounter: number;
}