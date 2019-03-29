import * as React from 'react';
import './ProblemComp.css';
import {Problem} from '../model/problem';
import {ProblemState} from "../model/problemState";
import {Color} from "../model/color";
import {Tick} from "../model/tick";
import StatusComp from "./StatusComp";
import Spinner from "./Spinner";
import * as Chroma from 'chroma-js';

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
   const problemState = !tick ? ProblemState.NOT_SENT : tick.flash ? ProblemState.FLASHED : ProblemState.SENT;
   const className = "problem " + (tick ? 'done' : '');
   const color = colors.get(problem.colorId)!;
   const rgbColor = '#' + color.rgb;
   const secondRowClassName = isExpanded ? "secondRow expanded" : "secondRow";
   const chromaInst = Chroma(rgbColor);
   const luminance = chromaInst.luminance();

   console.log(luminance);

   const borderColor = chromaInst.darken(1).hex();
   const textColor = luminance < 0.5 ? "#FFF" : "#333";
   const colorStyle = { background: '#' + color.rgb, color: textColor };
   return (
      <div style={{borderColor: borderColor, backgroundColor: rgbColor}} className={className} onClick={onToggle}>
         <div style={colorStyle} className="firstRow">
            <div className="id">{problem.id}</div>
            <div className="color">{color.name}</div>
            <div className="points">{problem.points}</div>
            {isUpdating && <div style={{height:0}}>
               <Spinner color={textColor}/>
            </div>}
            {(problemState != ProblemState.NOT_SENT && !isUpdating) && <StatusComp state={problemState!} color={textColor} size={25}/>}
         </div>
         <div className={secondRowClassName} style={colorStyle}>
            <button
                  className={problemState == ProblemState.FLASHED ? "current" : ""}
                  onClick={() => setProblemState!(problem, ProblemState.FLASHED, tick)}>
               <StatusComp state={ProblemState.FLASHED} color={'#333'} size={20}/>
               <div className="buttonText">Flashed</div>
            </button>
            <button
                  className={problemState == ProblemState.SENT ? "current" : ""}
                  onClick={() => setProblemState!(problem, ProblemState.SENT, tick)}>
               <StatusComp state={ProblemState.SENT} color={'#333'} size={20}/>
               <div className="buttonText">Sent</div>
            </button>
            <button
                  className={problemState == ProblemState.NOT_SENT ? "current" : ""}
                  onClick={() => setProblemState!(problem, ProblemState.NOT_SENT, tick)}>
               <StatusComp state={ProblemState.NOT_SENT} color={'#333'} size={20}/>
               <div className="buttonText">Not sent</div>
            </button>
         </div>
      </div>
   );
}

export default ProblemComp;
