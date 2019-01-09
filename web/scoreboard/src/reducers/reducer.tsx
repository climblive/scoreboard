
import { Action } from '../actions/actions';
import { StoreState } from '../model/storeState';
import { TOGGLE_PROBLEM } from '../constants/constants';

export function reducer(state: StoreState, action: Action): StoreState {
   switch (action.type) {
      case TOGGLE_PROBLEM:
         console.log("reducer ", action);

      /*case INCREMENT_ENTHUSIASM:
         return { ...state, enthusiasmLevel: state.enthusiasmLevel + 1 };
      case DECREMENT_ENTHUSIASM:
         return { ...state, enthusiasmLevel: Math.max(1, state.enthusiasmLevel - 1) };*/
      default:
         return state;
   }
}