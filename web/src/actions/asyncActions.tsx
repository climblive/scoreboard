
import { Problem } from '../model/problem';
import { UserData } from '../model/userData';
import { Dispatch } from 'react-redux';
import { Api } from '../utils/Api';
import { receiveUserData, receiveScoreboardData, toggleProblem, receiveContest } from './actions';
import { StoreState } from '../model/storeState';

export function loadUserData(code: string): any {
   return (dispatch: Dispatch<any>) => {
      Api.getContender(code).then(contenderData => dispatch(receiveUserData(contenderData)))
   };
}

export function loadScoreboardData(): any {
   return (dispatch: Dispatch<any>) => {
      Api.getScoreboard().then(scoreboardData => dispatch(receiveScoreboardData(scoreboardData)))
   };
}

export function loadContest(): any {
   return (dispatch: Dispatch<any>) => {
      Api.getContest().then(contest => dispatch(receiveContest(contest)))
   };
}

export function saveUserData(contenderData: UserData): any {
   return (dispatch: Dispatch<any>) => {
      return Api.setContender(contenderData);
   };
}

export function toggleProblemAndSave(problem: Problem): any { 
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      dispatch(toggleProblem(problem));
      dispatch(saveUserData(getState().userData));
   };
}