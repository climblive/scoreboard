import { UserData } from './userData';
import { ScoreboardContenderList } from './scoreboardContenderList';
import { Contest } from './contest';

export interface StoreState {
   userData: UserData;
   problemsSortedBy: string;
   scoreboardData: ScoreboardContenderList[];
   contest: Contest;
   pagingCounter: number;
}