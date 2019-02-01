import * as React from 'react';
import './ScoreboardListComp.css';
import { ScoreboardContenderList } from '../model/scoreboardContenderList';

export interface ScoreboardListCompProps {
   scoreboardList: ScoreboardContenderList
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
