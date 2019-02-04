import * as React from 'react';
import './ScoreboardListComp.css';
import { ScoreboardListItem } from '../model/scoreboardListItem';
import { CompClass } from '../model/compClass';

export interface ScoreboardListCompProps {
   compClass: CompClass
   totalList?: ScoreboardListItem[];
}

export function ScoreboardListComp({ totalList }: ScoreboardListCompProps) {
   var list = totalList!.map(contender =>
      <div key={contender.contenderId} className="contenderRow"> 
         <div className="position">{contender.position}</div>
         <div className="name">{contender.contenderName}</div>
         <div className="score">{contender.score}</div>
      </div>
   )
   return (
      <div className="scoreboardList">
         {list}
      </div>
   );
}
