export interface Contest {
   id: number;
   seriesId?: number,
   name: string;
   description: string;
   organizerId: number;
   locationId?: number;
   qualifyingProblems: number;
   finalists: number;
   gracePeriod: number;
   rules: string;


   // Internal parameters:
   isNew?: boolean;
}