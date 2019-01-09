
import * as constants from '../constants/constants';
import { Problem } from '../model/problem';

export interface ToggleProblem {
   type: constants.TOGGLE_PROBLEM;
   problem: Problem;
}

export type Action = ToggleProblem //| DecrementEnthusiasm;

export function toggleProblem(problem: Problem): ToggleProblem {
   console.log("TOGGLE_PROBLEM");
    return {
       type: constants.TOGGLE_PROBLEM,
       problem: problem
    };
}