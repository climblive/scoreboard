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
   let color = colors.get(problem.colorId)!;
   if(!color) {
      color = {
         id: -1,
         name: "UNKNOWN " + problem.colorId,
         rgbPrimary: "#CCC"
      };
   }
   let rgbColor = color.rgbPrimary;
   if(rgbColor.charAt(0) != '#') {
      rgbColor = "#" + rgbColor
   }
   let background = rgbColor;
   if(color.rgbSecondary) {
      let rgbSecondary = color.rgbSecondary;
      if(rgbSecondary.charAt(0) !== '#') {
         rgbSecondary = '#' + rgbSecondary;
      }
      background = "repeating-linear-gradient(-30deg," + rgbColor + "," + rgbSecondary + " 15px," + rgbColor + " 30px)";
   }

   let displayPoints = problem.points;
   if(problemState == ProblemState.FLASHED && problem.flashBonus) {
      displayPoints += problem.flashBonus;
   }

   let secondRowClassName = "secondRow";
   if(isExpanded) {
      secondRowClassName += problem.flashBonus ? " expandedLarge" : " expanded";
   }
   const chromaInst = Chroma(rgbColor);
   const luminance = chromaInst.luminance();
   let borderColor = chromaInst.darken(1).hex();
   let textColor = luminance < 0.5 ? "#FFF" : "#333";
   if(tick) {
      background = "#CDCDCD";
      borderColor = "#CDCDCD";
      textColor = "#ADADAD";
   }
   const selectorStyle:any = {};
   if(luminance < 0.5 || tick) {
      selectorStyle.borderWidth = 0;
   }
   const colorStyle = { color: textColor };
   return (
      <div style={{borderColor: borderColor, background: background}} className={className} onClick={onToggle}>
         <div style={colorStyle} className="firstRow">
            <div className="id">{problem.number}</div>
            <div className="color">{color.name}</div>
            {isUpdating && <div style={{height:0}}>
               <Spinner color={textColor}/>
            </div>}
            {(problemState != ProblemState.NOT_SENT && !isUpdating) && <StatusComp state={problemState!} color={textColor} size={25}/>}
            <div className="points">{displayPoints}</div>
         </div>
         <div className={secondRowClassName} style={colorStyle}>
            {problem.flashBonus &&
               <div
                  style={selectorStyle}
                  className={problemState == ProblemState.FLASHED ? "selector selected" : "selector"}
                  onClick={() => setProblemState!(problem, ProblemState.FLASHED, tick)}>
                  <StatusComp state={ProblemState.FLASHED} color={problemState == ProblemState.FLASHED ? '#FFF' : 'F333'} size={20}/>
                  <div className="buttonText">Flashed</div>
               </div>}
            <div
               style={selectorStyle}
               className={problemState == ProblemState.SENT ? "selector selected" : "selector"}
               onClick={() => setProblemState!(problem, ProblemState.SENT, tick)}>
               <StatusComp state={ProblemState.SENT} color={problemState == ProblemState.SENT ? '#FFF' : 'F333'} size={20}/>
               <div className="buttonText">Sent</div>
            </div>
            <div
               style={selectorStyle}
               className={problemState == ProblemState.NOT_SENT ? "selector selected" : "selector"}
               onClick={() => setProblemState!(problem, ProblemState.NOT_SENT, tick)}>
               <StatusComp state={ProblemState.NOT_SENT} color={problemState == ProblemState.NOT_SENT ? '#FFF' : 'F333'} size={20}/>
               <div className="buttonText">Not sent</div>
            </div>
         </div>
      </div>
   );
}

export default ProblemComp;
