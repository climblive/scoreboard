
import { Problem } from '../model/problem';
import { ContenderData } from '../model/contenderData';
import { Dispatch } from 'react-redux';
import { Api } from '../utils/Api';
import {
   receiveContenderData,
   receiveScoreboardData,
   startProblemUpdate,
   setProblemState,
   receiveContest,
   updateScoreboardTimer,
   receiveContenderNotFound, setProblemStateFailed
} from './actions';
import { StoreState } from '../model/storeState';
import {ProblemState} from "../model/problemState";

export function loadUserData(code: string): any {
   return (dispatch: Dispatch<any>) => {
      Api.getContender(code)
         .then(contenderData => dispatch(receiveContenderData(contenderData)))
         .catch(() => dispatch(receiveContenderNotFound())
      )
   };
}

export function loadScoreboardData(): any {
   return (dispatch: Dispatch<any>) => {
      Api.getScoreboard().then(scoreboardData => {
         dispatch(receiveScoreboardData(scoreboardData));
         dispatch(updateScoreboardTimer());
      })
   };
}

export function loadContest(): any {
   return (dispatch: Dispatch<any>) => {
      Api.getContest().then(contest => {
         dispatch(receiveContest(contest));
      })
   };
}

export function saveUserData(contenderData: ContenderData): any {
   return (dispatch: Dispatch<any>) => {
      let promise: Promise<ContenderData> = Api.setContender(contenderData);
      promise.then(contenderData => dispatch(receiveContenderData(contenderData)));
      return promise;
   };
}

export function setProblemStateAndSave(problem: Problem, problemState: ProblemState): any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      dispatch(startProblemUpdate(problem));
      let state = getState();
      Api.setProblemState(state.contenderData!, problem, problemState)
         .then(() => {
            console.log("HEJ!");
            dispatch(setProblemState(problem, problemState))
         })
         .catch((error) => {
            console.log("NEEEJ", error);
            dispatch(setProblemStateFailed())
         });
   };
}