
import { StoreState } from '../model/storeState';
//import { Problem } from '../model/problem';
import { ScoreboardContenderList } from '../model/scoreboardContenderList';
import * as scoreboardActions from '../actions/actions';
import { ActionType, getType} from 'typesafe-actions';
import {Color} from "../model/color";
import {Problem} from "../model/problem";
import {SortBy} from "../constants/constants";
//import {SortBy} from "../constants/constants";

export type ScoreboardActions = ActionType<typeof scoreboardActions>;

function getDurationString(sec: number): string {
   sec = Math.round(sec);
   let min = Math.floor(sec / 60);
   sec -= min * 60;
   if (min >= 10) {
      return "" + min + " min";
   }
   return "" + min + ":" + (sec > 9 ? "" : "0") + sec;
}

function getSortedProblems(problems: Problem[], sortBy:SortBy): Problem[] {
   let newProblems: Problem[] = [...problems];
   if (sortBy === SortBy.BY_POINTS) {
      newProblems = newProblems.sort((a, b) => a.points - b.points);
   } else {
      newProblems = newProblems.sort((a, b) => a.id - b.id);
   }
   return newProblems;
}

export const reducer = (state: StoreState, action: ScoreboardActions) => {
   switch (action.type) {
      case getType(scoreboardActions.startProblemUpdate):
         return { ...state, problemIdBeingUpdated: action.payload.id };

      /*case getType(scoreboardActions.setProblemState):
         let newProblems: Problem[] = Object.assign([], state.contenderData!.problems);
         let p: Problem = newProblems.find(p => p.id == action.payload.id)!;
         p.state = action.meta;
         return { ...state, contenderData: { ...state.contenderData!, problems: newProblems }, problemIdBeingUpdated: undefined};
*/
      case getType(scoreboardActions.setProblemStateFailed):
         return { ...state, problemIdBeingUpdated: undefined, errorMessage: "Failed to set state"};

      case getType(scoreboardActions.clearErrorMessage):
         return { ...state, errorMessage: undefined};

      case getType(scoreboardActions.sortProblems):
         let newProblems2: Problem[] = getSortedProblems(state.problems, action.payload);
         return { ...state, problems: newProblems2, problemsSortedBy: action.payload };

      case getType(scoreboardActions.receiveContenderData):
         let contenderData = action.payload;
         return { ...state, contenderData: contenderData, contenderNotFound: false};

      case getType(scoreboardActions.receiveContenderNotFound):
         return { ...state, contenderData: undefined, contenderNotFound: true};

      case getType(scoreboardActions.receiveScoreboardData):
         return { ...state, scoreboardData: action.payload };

      case getType(scoreboardActions.receiveContest):
         return { ...state, contest: action.payload };

      case getType(scoreboardActions.receiveCompClasses):
         return { ...state, compClasses: action.payload };

      case getType(scoreboardActions.receiveProblems):
         const problems = getSortedProblems(action.payload, state.problemsSortedBy);
         return { ...state, problems: problems };

      case getType(scoreboardActions.receiveTicks):
         return { ...state, ticks: action.payload };

      case getType(scoreboardActions.receiveColors):
         const colors = new Map<number, Color>();
         action.payload.forEach(color => colors.set(color.id, color));
         return { ...state, colors: colors };

      case getType(scoreboardActions.receiveScoreboardItem):
         let newScoreboardData: ScoreboardContenderList[] = [...state.scoreboardData];
         let compClassIndex = newScoreboardData.findIndex(list => list.compClass.name === action.payload.compClass);
         let oldScoreboardList = state.scoreboardData[compClassIndex];
         let oldContenders = oldScoreboardList.contenders;
         let contendersIndex = oldContenders.findIndex(contender => action.payload.item.contenderId === contender.contenderId);

         if(contendersIndex === -1) {
            // The contender wasn't found in this class.
            // To be sure, remove it from the other classes:
            newScoreboardData = newScoreboardData.map(contenderList => {
               let index = contenderList.contenders.findIndex(contender => action.payload.item.contenderId === contender.contenderId);
               if(index !== -1) {
                  let filteredList = contenderList.contenders.filter(contender => action.payload.item.contenderId !== contender.contenderId);
                  return {...contenderList, contenders: filteredList}
               } else {
                  return contenderList;
               }
            })
         }

         // Create the new contenders list and put everything together again:
         let newContenders = [...oldContenders];
         newContenders[contendersIndex === -1 ? newContenders.length : contendersIndex] = action.payload.item;
         newScoreboardData[compClassIndex] = { ...oldScoreboardList, contenders: newContenders};
         return { ...state, scoreboardData: newScoreboardData };

      case getType(scoreboardActions.updateScoreboardTimer):
         let now: number = new Date().getTime() / 1000;
         //console.log("UPDATE_SCOREBOARD_TIMER " + now);
         let newScoreboardData2: ScoreboardContenderList[] = state.scoreboardData.map(scl => {
            let newCompClass = { ...scl.compClass };
            newCompClass.inProgress = false;
            if (newCompClass.start > now) {
               newCompClass.statusString = "Startar om " + getDurationString(newCompClass.start - now);
               newCompClass.time = undefined;
            } else if (now > newCompClass.end) {
               newCompClass.statusString = "Tävlingen är avslutad";
               newCompClass.time = undefined;
            } else { 
               newCompClass.statusString = "Slutar om";
               newCompClass.time = getDurationString(newCompClass.end - now);
               newCompClass.inProgress = true;
            }
            return { ...scl, compClass: newCompClass }
         });
         
         return { ...state, scoreboardData: newScoreboardData2, pagingCounter: state.pagingCounter ? (state.pagingCounter + 1)  : 1};

      default:
         return state;
   }
};