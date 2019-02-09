
import { StoreState } from '../model/storeState';
import { TOGGLE_PROBLEM, RECEIVE_USER_DATA, RECEIVE_SCOREBOARD_DATA, RECEIVE_SCOREBOARD_ITEM, RECEIVE_CONTEST, UPDATE_SCOREBOARD_TIMER, SORT_PROBLEMS, BY_POINTS, BY_NUMBER } from '../constants/constants';
import { Problem } from '../model/problem';
import { Action } from '../actions/actions';
import { ScoreboardContenderList } from '../model/scoreboardContenderList';

function getDurationString(sec: number): string { 
   sec = Math.round(sec);
   var min = Math.floor(sec / 60);
   sec -= min * 60;
   if (min >= 10) {
      return "" + min + " min";
   }
   return "" + min + ":" + (sec > 9 ? "" : "0") + sec;
}

export function reducer(state: StoreState, action: Action): StoreState {
   switch (action.type) {
      case TOGGLE_PROBLEM:
         var newProblems: Problem[] = Object.assign([], state.userData.problems);
         var p: Problem = newProblems.find(p => p.id == action.problem.id)!;
         p.sent = !p.sent;
         return { ...state, userData: { ...state.userData, problems: newProblems } };

      case SORT_PROBLEMS:
         var newProblems: Problem[] = [...state.userData.problems];
         if (action.sortBy === BY_POINTS) {
            newProblems = newProblems.sort((a, b) => a.points - b.points);
         } else {
            newProblems = newProblems.sort((a, b) => a.id - b.id);
         }
         return { ...state, userData: { ...state.userData, problems: newProblems }, problemsSortedBy: action.sortBy };

      case RECEIVE_USER_DATA:
         return { ...state, userData: action.userData, problemsSortedBy: BY_NUMBER};

      case RECEIVE_SCOREBOARD_DATA:
         return { ...state, scoreboardData: action.scoreboardData };

      case RECEIVE_CONTEST:
         return { ...state, contest: action.contest };

      case RECEIVE_SCOREBOARD_ITEM:
         var newScoreboardData: ScoreboardContenderList[] = [...state.scoreboardData];
         var compClassIndex = newScoreboardData.findIndex(list => list.compClass.name === action.scoreboardPushItem.compClass)
         var oldScoreboardList = state.scoreboardData[compClassIndex];
         var oldContenders = oldScoreboardList.contenders;
         var contendersIndex = oldContenders.findIndex(contender => action.scoreboardPushItem.item.contenderId === contender.contenderId);

         // Create the new contenders list and put everything together again:
         var newContenders = [...oldContenders];
         newContenders[contendersIndex === -1 ? newContenders.length : contendersIndex] = action.scoreboardPushItem.item;
         newScoreboardData[compClassIndex] = { ...oldScoreboardList, contenders: newContenders}
         return { ...state, scoreboardData: newScoreboardData };

      case UPDATE_SCOREBOARD_TIMER:
         var now: number = new Date().getTime() / 1000; 
         console.log("UPDATE_SCOREBOARD_TIMER " + now);
         var newScoreboardData: ScoreboardContenderList[] = state.scoreboardData.map(scl => { 
            var newCompClass = { ...scl.compClass };
            newCompClass.inProgress = false;
            if (newCompClass.start > now) {
               newCompClass.statusString = "Startar om " + getDurationString(newCompClass.start - now);
               newCompClass.time = undefined;
            } else if (now > newCompClass.end) {
               newCompClass.statusString = "Tävlingen är avslutad"
               newCompClass.time = undefined;
            } else { 
               newCompClass.statusString = "Slutar om"
               newCompClass.time = getDurationString(newCompClass.end - now);
               newCompClass.inProgress = true;
            }
            return { ...scl, compClass: newCompClass }
         });
         
         return { ...state, scoreboardData: newScoreboardData };
         
      default:
         return state;
   }
}