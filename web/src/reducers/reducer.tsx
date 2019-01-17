
import { StoreState } from '../model/storeState';
import { TOGGLE_PROBLEM, RECEIVE_USER_DATA } from '../constants/constants';
import { Problem } from '../model/problem';
import { Action } from '../actions/actions';

export function reducer(state: StoreState, action: Action): StoreState {
   switch (action.type) {
      case TOGGLE_PROBLEM:
         var newProblems: Problem[] = Object.assign([], state.userData.problems);
         var p: Problem = newProblems.find(p => p.id == action.problem.id)!;
         p.isSent = !p.isSent;
         return { ...state, userData: { ...state.userData, problems: newProblems } };

      case RECEIVE_USER_DATA:
         return { ...state, userData: action.userData };

         /*case INCREMENT_ENTHUSIASM:
         return { ...state, enthusiasmLevel: state.enthusiasmLevel + 1 };
      case DECREMENT_ENTHUSIASM:
         return { ...state, enthusiasmLevel: Math.max(1, state.enthusiasmLevel - 1) };*/
      default:
         return state;
   }
}