import {ProblemState} from "./problemState";

export interface Problem {
   id: number;
   color: string;
   textColor: string;
   colorName: string;
   points: number;
   text: string;
   state: ProblemState;
}