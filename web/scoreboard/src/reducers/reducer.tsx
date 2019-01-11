
import { Action } from '../actions/actions';
import { StoreState } from '../model/storeState';
import { TOGGLE_PROBLEM } from '../constants/constants';
import { Problem } from '../model/problem';

export function reducer(state: StoreState, action: Action): StoreState {
   switch (action.type) {
      case TOGGLE_PROBLEM:
         var newProblems: Problem[] = Object.assign([], state.problems);
         var p: Problem = newProblems.find(p => p.id == action.problem.id)!;
         p.isSent = !p.isSent;
         return { ...state,  problems: newProblems };

      /*case INCREMENT_ENTHUSIASM:
         return { ...state, enthusiasmLevel: state.enthusiasmLevel + 1 };
      case DECREMENT_ENTHUSIASM:
         return { ...state, enthusiasmLevel: Math.max(1, state.enthusiasmLevel - 1) };*/
      default:
         return state;
   }
}