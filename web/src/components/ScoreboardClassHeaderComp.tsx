import * as React from 'react';
import './ScoreboardListComp.css';
import { CompClass } from '../model/compClass';

export interface ScoreboardClassHeaderCompProps {
   compClass: CompClass
}

export function ScoreboardClassHeaderComp({ compClass }: ScoreboardClassHeaderCompProps) {
   return (
      <div className="compClassHeader">
         <div className={'compClass-' + compClass.name + " showLarge compClass"}>{compClass.name}</div>
         <div className="status">{compClass.statusString}</div>
         <div className="time">{compClass.time}</div>
      </div>
   );
}
