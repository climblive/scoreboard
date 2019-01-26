
import { StoreState } from '../model/storeState';
import { TOGGLE_PROBLEM, RECEIVE_USER_DATA, RECEIVE_SCOREBOARD_DATA } from '../constants/constants';
import { Problem } from '../model/problem';
import { Action } from '../actions/actions';

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

      default:
         return state;
   }
}