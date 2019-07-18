export interface Problem {
   id: number;
   contestId: number;
   number: number;
   colorId?: number;
   points?: number;
   flashBonus?: number;
   text?: string;
}