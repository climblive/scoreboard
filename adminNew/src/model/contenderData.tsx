import {Tick} from "./tick";

export class ContenderData {
   registrationCode: string;
   contestId: number;
   name?: string;
   id: number;
   entered?: string;
   compClassId?: number;

   // Internal data:
   ticks?: Tick[];
   totalScore?: number;
   totalPosition?: number;
   qualifyingScore?: number;
   qualifyingPosition?: number;
   isFinalist?: boolean;
}