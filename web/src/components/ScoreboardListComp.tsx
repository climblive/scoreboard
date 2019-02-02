import * as React from 'react';
import './ScoreboardListComp.css';
import { ScoreboardListItem } from '../model/scoreboardListItem';

export interface ScoreboardListCompProps {
   //scoreboardList: ScoreboardContenderList
   totalList?: ScoreboardListItem[];
}

export function ScoreboardListComp({ totalList }: ScoreboardListCompProps) {
   var list = totalList!.map(contender =>
      //TODO: Real id
      <div key={contender.contenderName} className="contenderRow"> 
         <div className="name">{contender.contenderName}</div>
         <div className="score">{contender.score}</div>
         <div className="score">{contender.position}</div>
      </div>
   )
   
   return (
      <div className="scoreboardList">
         <div className="compClass">Test</div>
         {list}
      </div>
   );
}
