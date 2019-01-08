
import { Action } from '../actions/actions';
import { DECREMENT_ENTHUSIASM, INCREMENT_ENTHUSIASM } from '../constants/constants';
import { StoreState } from '../model/storeState';

export function reducer(state: StoreState, action: Action): StoreState {
   switch (action.type) {
      case INCREMENT_ENTHUSIASM:
         return { ...state, enthusiasmLevel: state.enthusiasmLevel + 1 };
      case DECREMENT_ENTHUSIASM:
         return { ...state, enthusiasmLevel: Math.max(1, state.enthusiasmLevel - 1) };
      default:
         return state;
   }
}