
import { StoreState } from '../model/storeState';
import { TOGGLE_PROBLEM, RECEIVE_USER_DATA, RECEIVE_SCOREBOARD_DATA, RECEIVE_SCOREBOARD_ITEM } from '../constants/constants';
import { Problem } from '../model/problem';
import { Action } from '../actions/actions';
import { ScoreboardList } from '../model/scoreboardList';

export function reducer(state: StoreState, action: Action): StoreState {
   switch (action.type) {
      case TOGGLE_PROBLEM:
         var newProblems: Problem[] = Object.assign([], state.userData.problems);
         var p: Problem = newProblems.find(p => p.id == action.problem.id)!;
         p.sent = !p.sent;
         return { ...state, userData: { ...state.userData, problems: newProblems } };

      case RECEIVE_USER_DATA:
         return { ...state, userData: action.userData };

      case RECEIVE_SCOREBOARD_DATA:
         return { ...state, scoreboardData: action.scoreboardData };

      case RECEIVE_SCOREBOARD_ITEM:
         var newScoreboardData: ScoreboardList[] = [...state.scoreboardData];
         var compClassIndex = newScoreboardData.findIndex(list => list.compClass === action.scoreboardPushItem.compClass)
         var oldScoreboardList = state.scoreboardData[compClassIndex];
         var oldContenders = oldScoreboardList.contenders;
         var contendersIndex = oldContenders.findIndex(contender => action.scoreboardPushItem.item.contenderId === contender.contenderId);

         // Create the new contenders list and put everything together again:
         var newContenders = [...oldContenders];
         newContenders[contendersIndex === -1 ? newContenders.length : contendersIndex] = action.scoreboardPushItem.item;
         newScoreboardData[compClassIndex] = { ...oldScoreboardList, contenders: newContenders}
         return { ...state, scoreboardData: newScoreboardData };

      default:
         return state;
   }
}