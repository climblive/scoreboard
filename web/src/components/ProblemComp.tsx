import * as React from 'react';
import './ProblemComp.css';
import {Problem} from '../model/problem';
import {ProblemState} from "../model/problemState";

export interface ProblemCompProps {
   problem: Problem;
   isExpanded: boolean;
   isUpdating: boolean;
   setProblemState?: (problemState: ProblemState) => void;
   onToggle?: () => void;
}

function ProblemComp({ problem, isExpanded, isUpdating, setProblemState, onToggle }: ProblemCompProps) {
   let isSent = problem.state === ProblemState.NOT_SENT ? "" : (problem.state as string);
   if(isUpdating) {
      isSent = "Updating...";
   }
   let className = "problem " + (problem.state !== ProblemState.NOT_SENT ? 'done' : '');
   let colorStyle = { background: problem.color, color: problem.textColor };
   let secondRowClassName = isExpanded ? "secondRow expanded" : "secondRow";
   return (
      <div className={className} onClick={onToggle}>
         <div style={colorStyle} className="firstRow">
            <div className="id">{problem.id}</div>
            <div className="color">{problem.colorName}</div>
            <div className="points">{problem.points}</div>
            <div className="sent"> {isSent}</div>
         </div>
         <div className={secondRowClassName} style={colorStyle}>
            <button onClick={() => setProblemState!(ProblemState.FLASHED)}>Flashed</button>
            <button onClick={() => setProblemState!(ProblemState.SENT)}>Sent</button>
            <button onClick={() => setProblemState!(ProblemState.NOT_SENT)}>Not sent</button>
         </div>
      </div>
   );
}

export default ProblemComp;
