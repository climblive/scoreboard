import * as React from 'react';
import './ProblemComp.css';
import {Problem} from '../model/problem';
import {ProblemState} from "../model/problemState";
import {Color} from "../model/color";

export interface ProblemCompProps {
   problem: Problem;
   colors: Map<number, Color>;
   isExpanded: boolean;
   isUpdating: boolean;
   setProblemState?: (problemState: ProblemState) => void;
   onToggle?: () => void;
}

function ProblemComp({ problem, colors, isExpanded, isUpdating, setProblemState, onToggle }: ProblemCompProps) {
   let isSent = "";

   //FIXME problem.state === ProblemState.NOT_SENT ? "" : (problem.state as string);
   if(isUpdating) {
      isSent = "Updating...";
   }
   let className = "problem "; //FIXME + (problem.state !== ProblemState.NOT_SENT ? 'done' : '');
   const color = colors.get(problem.colorId)!;
   let colorStyle = { background: '#' + color.rgb, color: "#000" };
   let secondRowClassName = isExpanded ? "secondRow expanded" : "secondRow";
   return (
      <div className={className} onClick={onToggle}>
         <div style={colorStyle} className="firstRow">
            <div className="id">{problem.id}</div>
            <div className="color">{color.name}</div>
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
