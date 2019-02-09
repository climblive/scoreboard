import * as React from 'react';
import './ProblemList.css';
import { Problem } from '../model/problem';
import ProblemComp from './ProblemComp';

export interface ProblemListProps {
  problems: Problem[];
  onToggle?: (problem:Problem) => void;
}

function ProblemList({ problems, onToggle }: ProblemListProps) {
   var problemsList = problems.map(p => (<ProblemComp key={p.id} onToggle={() => onToggle!(p)} problem={p}/>));
   return (
      <div className="problemList">
         {problemsList}
    </div>
  );
}

export default ProblemList;