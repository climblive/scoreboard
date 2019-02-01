
import * as constants from '../constants/constants';
import { Problem } from '../model/problem';
import { UserData } from '../model/userData';
import { Api } from '../utils/Api';
import { Dispatch } from 'react-redux';
import { StoreState } from '../model/storeState';
import { ScoreboardContenderList } from '../model/scoreboardContenderList';
import { ScoreboardPushItem } from '../model/scoreboardPushItem';
import { Contest } from '../model/contest';

export interface ToggleProblem {
   type: constants.TOGGLE_PROBLEM;
   problem: Problem;
}

export interface ReceiveUserData {
   type: constants.RECEIVE_USER_DATA;
   userData: UserData;
}

export interface ReceiveScoreboardData {
   type: constants.RECEIVE_SCOREBOARD_DATA;
   scoreboardData: ScoreboardContenderList[];
}

export interface ReceiveScoreboardItem {
   type: constants.RECEIVE_SCOREBOARD_ITEM;
   scoreboardPushItem: ScoreboardPushItem;
}

export interface ReceiveContest {
   type: constants.RECEIVE_CONTEST;
   contest: Contest;
}

export type Action = ToggleProblem | ReceiveUserData | ReceiveScoreboardData | ReceiveScoreboardItem | ReceiveContest

export function toggleProblem(problem: Problem): ToggleProblem {
   console.log("TOGGLE_PROBLEM");
   return {
      type: constants.TOGGLE_PROBLEM,
      problem: problem
   };
}

export function receiveUserData(userData: UserData): ReceiveUserData {
   console.log("receiveUserData ", userData);
   return {
      type: constants.RECEIVE_USER_DATA,
      userData: userData
   };
}

export function receiveScoreboardData(scoreboardData: ScoreboardContenderList[]): ReceiveScoreboardData {
   console.log("receiveScoreboardData ", scoreboardData);
   return {
      type: constants.RECEIVE_SCOREBOARD_DATA,
      scoreboardData: scoreboardData
   };
}

export function receiveScoreboardItem(scoreboardPushItem: ScoreboardPushItem): ReceiveScoreboardItem {
   console.log("receiveScoreboardItem ", scoreboardPushItem);
   return {
      type: constants.RECEIVE_SCOREBOARD_ITEM,
      scoreboardPushItem: scoreboardPushItem
   };
}

export function receiveContest(contest: Contest): ReceiveContest {
   console.log("receiveContest ", contest);
   return {
      type: constants.RECEIVE_CONTEST,
      contest: contest
   };
}


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

