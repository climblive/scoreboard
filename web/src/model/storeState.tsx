import { UserData } from './userData';
import { ScoreboardList } from './scoreboardList';
import { Contest } from './contest';

export interface StoreState {
   userData: UserData;
   scoreboardData: ScoreboardList[];
   contest: Contest;
}