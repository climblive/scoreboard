export interface Contest {
   id: number;
   name: string;
   rules: string;
   qualifyingProblems: number
   finalists: number;
   gracePeriod: number;
}