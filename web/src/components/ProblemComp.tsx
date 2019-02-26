import * as React from 'react';
import './ProblemComp.css';
import { Problem } from '../model/problem';

export interface ProblemCompProps {
   problem: Problem;
   isExpanded: boolean;
   onToggle?: () => void;
   toggleSent?: () => void;
}

function ProblemComp({ problem, isExpanded, onToggle, toggleSent }: ProblemCompProps) {
   var isSent = problem.sent ? 'SENT!' : '';
   var className = "problem " + (problem.sent ? 'done' : '');
   var colorStyle = { background: problem.color, color: problem.textColor };
   var secondRowClassName = isExpanded ? "secondRow expanded" : "secondRow";
   return (
      <div className={className} onClick={onToggle}>
         <div style={colorStyle} className="firstRow">
            <div className="id">{problem.id}</div>
            <div className="color">{problem.colorName}</div>
            <div className="points">{problem.points}</div>
            <div className="sent"> {isSent}</div>
         </div>
         <div className={secondRowClassName} style={colorStyle}>
            <button onClick={toggleSent}>Flashed</button>
            <button onClick={toggleSent}>Sent</button>
            <button onClick={toggleSent}>Not sent</button>
         </div>
      </div>
   );
}

export default ProblemComp;
