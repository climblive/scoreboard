import * as React from 'react';
import './ProblemComp.css';
import {Problem} from '../model/problem';
import {ProblemState} from "../model/problemState";
import {Color} from "../model/color";
import {Tick} from "../model/tick";
import StatusComp from "./StatusComp";

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
   let isSent = ""
   let problemState = undefined;
   if(isUpdating) {
      isSent = "Updating...";
   } else if(tick) {
      problemState = tick.flash ? ProblemState.FLASHED : ProblemState.SENT;
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
            {problemState && <StatusComp state={problemState!} color={'#00FF00'}/>}
         </div>
         <div className={secondRowClassName} style={colorStyle}>
            <button onClick={() => setProblemState!(problem, ProblemState.FLASHED, tick)}>
               <StatusComp state={ProblemState.FLASHED} color={'#333'}/>
               <div className="buttonText">Flashed</div>
            </button>
            <button onClick={() => setProblemState!(problem, ProblemState.SENT, tick)}>
               <StatusComp state={ProblemState.SENT} color={'#333'}/>
               <div className="buttonText">Sent</div>
            </button>
            <button onClick={() => setProblemState!(problem, ProblemState.NOT_SENT, tick)}>
               <StatusComp state={ProblemState.NOT_SENT} color={'#333'}/>
               <div className="buttonText">Not sent</div>
            </button>
         </div>
      </div>
   );
}

export default ProblemComp;
