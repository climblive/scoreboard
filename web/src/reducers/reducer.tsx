
import { StoreState } from '../model/storeState';
import { Problem } from '../model/problem';
import { ScoreboardContenderList } from '../model/scoreboardContenderList';
import { BY_POINTS } from '../constants/constants';
import * as scoreboardActions from '../actions/actions';
import { ActionType, getType} from 'typesafe-actions';

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

function getSortedProblems(problems: Problem[], sortBy:string): Problem[] {
   let newProblems: Problem[] = [...problems];
   if (sortBy === BY_POINTS) {
      newProblems = newProblems.sort((a, b) => a.points - b.points);
   } else {
      newProblems = newProblems.sort((a, b) => a.id - b.id);
   }
   return newProblems;
}

export const reducer = (state: StoreState, action: ScoreboardActions) => {
   switch (action.type) {
      case getType(scoreboardActions.toggleProblem):
         let newProblems: Problem[] = Object.assign([], state.contenderData!.problems);
         let p: Problem = newProblems.find(p => p.id == action.payload.id)!;
         p.sent = !p.sent;
         return { ...state, contenderData: { ...state.contenderData!, problems: newProblems } };

      case getType(scoreboardActions.sortProblems):
         let newProblems2: Problem[] = getSortedProblems(state.contenderData!.problems, action.payload);
         return { ...state, contenderData: { ...state.contenderData!, problems: newProblems2 }, problemsSortedBy: action.payload };

      case getType(scoreboardActions.receiveContenderData):
         let contenderData = action.payload;
         contenderData.problems = getSortedProblems(contenderData.problems, state.problemsSortedBy);
         return { ...state, contenderData: contenderData, contenderNotFound: false};

      case getType(scoreboardActions.receiveContenderNotFound):
         return { ...state, contenderData: undefined, contenderNotFound: true};

      case getType(scoreboardActions.receiveScoreboardData):
         return { ...state, scoreboardData: action.payload };

      case getType(scoreboardActions.receiveContest):
         return { ...state, contest: action.payload };

      case getType(scoreboardActions.receiveScoreboardItem):
         let newScoreboardData: ScoreboardContenderList[] = [...state.scoreboardData];
         let compClassIndex = newScoreboardData.findIndex(list => list.compClass.name === action.payload.compClass);
         let oldScoreboardList = state.scoreboardData[compClassIndex];
         let oldContenders = oldScoreboardList.contenders;
         let contendersIndex = oldContenders.findIndex(contender => action.payload.item.contenderId === contender.contenderId);

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