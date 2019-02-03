import * as React from 'react';
import './ScoreboardListComp.css';
import { ScoreboardListItem } from '../model/scoreboardListItem';
import { CompClass } from '../model/compClass';

export interface ScoreboardListCompProps {
   compClass: CompClass
   totalList?: ScoreboardListItem[];
   showHeader: boolean;
}

export function ScoreboardListComp({ compClass, totalList, showHeader }: ScoreboardListCompProps) {
   var list = totalList!.map(contender =>
      <div key={contender.contenderId} className="contenderRow"> 
         <div className="position">{contender.position}</div>
         <div className="name">{contender.contenderName}</div>
         <div className="score">{contender.score}</div>
      </div>
   )

   var header = null;
   if (showHeader) {
      header = (
         <div>
            <div className="compClass">{compClass.name}</div>
            <div className="compClass">{compClass.start}</div>
            <div className="compClass">{compClass.end}</div>
         </div>
      );
   }
   
   return (
      <div className="scoreboardList">
         {header}
         {list}
      </div>
   );
}
