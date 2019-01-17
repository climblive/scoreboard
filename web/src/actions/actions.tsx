
import * as constants from '../constants/constants';
import { Problem } from '../model/problem';
import { UserData } from '../model/userData';

export interface ToggleProblem {
   type: constants.TOGGLE_PROBLEM;
   problem: Problem;
}

export interface ReceiveUserData {
   type: constants.RECEIVE_USER_DATA;
   userData: UserData;
}

export type Action = ToggleProblem | ReceiveUserData

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