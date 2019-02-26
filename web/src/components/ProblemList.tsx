import * as React from 'react';
import './ProblemList.css';
import { Problem } from '../model/problem';
import ProblemComp from './ProblemComp';

export interface ProblemListProps {
  problems: Problem[];
  onToggle?: (problem:Problem) => void;
}

type State = {
   expandedProblem?: number,
}

export default class ProblemList extends React.Component<ProblemListProps, State> {
   public readonly state: State = {
      expandedProblem: undefined
   }

   constructor(props: ProblemListProps) {
      super(props);

   }

   toggle(p: Problem) {
      this.state.expandedProblem = p.id === this.state.expandedProblem ? undefined: p.id;
      this.setState(this.state);
      //this.props.onToggle!(p);
   }

   toggleSent(p: Problem) {
      this.props.onToggle!(p);
   }

   render() {
      var problemsList = this.props.problems.map(p => (<ProblemComp key={p.id} isExpanded={p.id === this.state.expandedProblem} toggleSent={() => this.toggleSent(p)} onToggle={() => this.toggle(p)} problem={p}/>));
      return (
         <div className="problemList">
            {problemsList}
       </div>
     );
   }
}