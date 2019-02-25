
import { StoreState } from '../model/storeState';
import { Problem } from '../model/problem';
import { ScoreboardContenderList } from '../model/scoreboardContenderList';
import { BY_POINTS, BY_NUMBER } from '../constants/constants';
import * as scoreboardActions from '../actions/actions';
import { ActionType, getType } from 'typesafe-actions';

export type ScoreboardActions = ActionType<typeof scoreboardActions>;

function getDurationString(sec: number): string { 
   sec = Math.round(sec);
   var min = Math.floor(sec / 60);
   sec -= min * 60;
   if (min >= 10) {
      return "" + min + " min";
   }
   return "" + min + ":" + (sec > 9 ? "" : "0") + sec;
}

export const reducer = (state: StoreState, action: ScoreboardActions) => {
   switch (action.type) {
      case getType(scoreboardActions.toggleProblem):
         var newProblems: Problem[] = Object.assign([], state.userData!.problems);
         var p: Problem = newProblems.find(p => p.id == action.payload.id)!;
         p.sent = !p.sent;
         return { ...state, userData: { ...state.userData, problems: newProblems } };

      case getType(scoreboardActions.sortProblems):
         var newProblems: Problem[] = [...state.userData.problems];
         if (action.payload === BY_POINTS) {
            newProblems = newProblems.sort((a, b) => a.points - b.points);
         } else {
            newProblems = newProblems.sort((a, b) => a.id - b.id);
         }
         return { ...state, userData: { ...state.userData, problems: newProblems }, problemsSortedBy: action.payload };

      case getType(scoreboardActions.receiveUserData):
         return { ...state, userData: action.payload, problemsSortedBy: BY_NUMBER};

      case getType(scoreboardActions.receiveScoreboardData):
         return { ...state, scoreboardData: action.payload };

      case getType(scoreboardActions.receiveContest):
         return { ...state, contest: action.payload };

      case getType(scoreboardActions.receiveScoreboardItem):
         var newScoreboardData: ScoreboardContenderList[] = [...state.scoreboardData];
         var compClassIndex = newScoreboardData.findIndex(list => list.compClass.name === action.payload.compClass)
         var oldScoreboardList = state.scoreboardData[compClassIndex];
         var oldContenders = oldScoreboardList.contenders;
         var contendersIndex = oldContenders.findIndex(contender => action.payload.item.contenderId === contender.contenderId);

         // Create the new contenders list and put everything together again:
         var newContenders = [...oldContenders];
         newContenders[contendersIndex === -1 ? newContenders.length : contendersIndex] = action.payload.item;
         newScoreboardData[compClassIndex] = { ...oldScoreboardList, contenders: newContenders}
         return { ...state, scoreboardData: newScoreboardData };

      case getType(scoreboardActions.updateScoreboardTimer):
         var now: number = new Date().getTime() / 1000;
         //console.log("UPDATE_SCOREBOARD_TIMER " + now);
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
         
         return { ...state, scoreboardData: newScoreboardData, pagingCounter: state.pagingCounter ? (state.pagingCounter + 1)  : 1};

      default:
         return state;
   }
}