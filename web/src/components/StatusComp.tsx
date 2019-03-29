import * as React from 'react';
import {ProblemState} from "../model/problemState";

export interface StatusCompProps {
   state: ProblemState;
   color: string;
}

function StatusComp({ state, color }: StatusCompProps) {
   switch(state) {
      case ProblemState.SENT:
         return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
               <path fill="none" d="M0 0h24v24H0z"/>
               <path fill={color} d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
            </svg>
         );
      case ProblemState.FLASHED:
         return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
               <path d="M0 0h24v24H0z" fill="none"/>
               <path fill={color} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
               <path d="M0 0h24v24H0z" fill="none"/>
            </svg>         );
      case ProblemState.NOT_SENT:
         return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
               <path d="M0 0h24v24H0z" fill="none"/>
               <path fill={color} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"/>
            </svg>
         );
      default: return null;
   }
}

export default StatusComp;
