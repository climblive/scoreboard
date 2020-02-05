
export class ScoreboardContender { 
   contenderId: number;
   contenderName: string;
   totalScore: number;
   qualifyingScore: number;

   isAnimatingTotal:boolean;
   isAnimatingFinalist:boolean;
   lastUpdate: number;
}