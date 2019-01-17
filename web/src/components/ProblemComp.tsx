import * as React from 'react';
import './ProblemComp.css';
import { Problem } from '../model/problem';

export interface ProblemCompProps {
   problem: Problem;
   onToggle?: () => void;
}

function ProblemComp({ problem, onToggle }: ProblemCompProps) {
   var isSent = problem.isSent ? 'SENT!' : '';
   var className = "problem " + (problem.isSent ? 'done' : '');
   var colorStyle = { background: problem.color, color: problem.textColor };
   return (
      <div className={className} style={colorStyle} onClick={onToggle}>
         <div className="id">{problem.id}</div>
         <div className="color">{problem.colorName}</div>
         <div className="points">{problem.points}</div>
         <div className="sent"> {isSent}</div>
      </div>
   );
}

export default ProblemComp;
