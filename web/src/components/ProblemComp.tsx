import * as React from 'react';
import './ProblemComp.css';
import {Problem} from '../model/problem';
import {ProblemState} from "../model/problemState";
import {Color} from "../model/color";
import {Tick} from "../model/tick";

export interface ProblemCompProps {
   problem: Problem;
   tick?: Tick;
   colors: Map<number, Color>;
   isExpanded: boolean;
   isUpdating: boolean;
   setProblemState?: (problem:Problem, problemState: ProblemState, tick?:Tick) => void;
   onToggle?: () => void;
}

function ProblemComp({ problem, tick, colors, isExpanded, isUpdating, setProblemState, onToggle }: ProblemCompProps) {
   let isSent = !tick ? "" : tick.flash ? "Flashed" : "Sent";
   if(isUpdating) {
      isSent = "Updating...";
   }
   let className = "problem " + (tick ? 'done' : '');
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
            <button onClick={() => setProblemState!(problem, ProblemState.FLASHED, tick)}>Flashed</button>
            <button onClick={() => setProblemState!(problem, ProblemState.SENT, tick)}>Sent</button>
            <button onClick={() => setProblemState!(problem, ProblemState.NOT_SENT, tick)}>Not sent</button>
         </div>
      </div>
   );
}

export default ProblemComp;
