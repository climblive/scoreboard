import * as React from 'react';
import './ProblemList.css';
import { Problem } from '../model/problem';
import ProblemComp from './ProblemComp';
import {ProblemState} from "../model/problemState";
import {Color} from "../model/color";

export interface ProblemListProps {
   problems: Problem[],
   colors: Map<number, Color>,
   problemIdBeingUpdated?: number,
   setProblemStateAndSave?: (problem: Problem, problemState: ProblemState) => void
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

   setProblemState(p: Problem, problemState: ProblemState) {
      this.props.setProblemStateAndSave!(p, problemState);
   }

   render() {
      let problemsList = this.props.problems.map(p => (
         <ProblemComp
            key={p.id}
            isUpdating={p.id === this.props.problemIdBeingUpdated}
            isExpanded={p.id === this.state.expandedProblem}
            setProblemState={(problemState: ProblemState) => this.setProblemState(p, problemState)}
            onToggle={() => this.toggle(p)}
            problem={p}
            colors={this.props.colors}
         />));
      return (
         <div className="problemList">
            {problemsList}
       </div>
     );
   }
}