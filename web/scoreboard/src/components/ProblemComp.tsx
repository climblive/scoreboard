import * as React from 'react';
import './ProblemList.css';
import { Problem } from '../model/problem';

export interface ProblemCompProps {
   problem: Problem;
   onToggle?: () => void;
}

function ProblemComp({ problem, onToggle }: ProblemCompProps) {
   return (
      <div className="hello" onClick={onToggle}>
         <div>{problem.id}</div>
         <div>{problem.color}</div>
         <div>{problem.points}</div>
      </div>
   );
}

export default ProblemComp;
