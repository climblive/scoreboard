export interface Contest {
   id: number;
   name: string;
   description: string;
   organizerId: number;
   locationId: number;
   qualifyingProblems: number;
   rules: string;
}