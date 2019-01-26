import { UserData } from './userData';
import { ScoreboardList } from './scoreboardList';

export interface StoreState {
   userData: UserData;
   scoreboardData: ScoreboardList[];
}