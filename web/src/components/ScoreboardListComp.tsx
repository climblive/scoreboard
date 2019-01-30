import * as React from 'react';
import './ScoreboardListComp.css';
import { ScoreboardList } from '../model/scoreboardList';

export interface ScoreboardListCompProps {
   scoreboardList: ScoreboardList
}

export function ScoreboardListComp({ scoreboardList }: ScoreboardListCompProps) {
   var list = scoreboardList.contenders.map(contender =>
      <div key={contender.contenderId} className="contenderRow">
         <div className="name">{contender.contenderName}</div>
         <div className="score">{contender.tenBestScore}</div>
         <div className="score">{contender.totalScore}</div>
      </div>
   )
   
   return (
      <div className="scoreboardList">
         <div className="compClass">{scoreboardList.compClass}</div>
         {list}
      </div>
   );
}
