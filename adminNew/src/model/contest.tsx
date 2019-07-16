export interface Contest {
   id: number;
   name: string;
   description: string;
   organizerId: number;
   locationId: number;
   qualifyingProblems: number;
   gracePeriod: number;
   rules: string;

   // Internal parameters:
   isNew?: boolean;
}