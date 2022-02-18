import * as React from "react";
import { Problem } from "../model/problem";
import { ProblemState } from "../model/problemState";
import { Tick } from "../model/tick";
import ProblemComp from "./ProblemComp";
import "./ProblemList.css";

export interface ProblemListProps {
  problems: Problem[];
  ticks: Tick[];
  problemIdBeingUpdated?: number;
  setProblemStateAndSave?: (
    problem: Problem,
    problemState: ProblemState,
    tick?: Tick
  ) => void;
}

type State = {
  expandedProblem?: number;
};

export default class ProblemList extends React.Component<
  ProblemListProps,
  State
> {
  public readonly state: State = {
    expandedProblem: undefined,
  };

  toggle(p: Problem) {
    this.setState({
      expandedProblem: p.id === this.state.expandedProblem ? undefined : p.id,
    });
  }

  getTick(p: Problem) {
    return this.props.ticks.find((tick) => tick.problemId === p.id);
  }

  render() {
    let problemsList = this.props.problems.map((p) => (
      <ProblemComp
        key={p.id}
        isUpdating={p.id === this.props.problemIdBeingUpdated}
        isExpanded={p.id === this.state.expandedProblem}
        setProblemState={this.props.setProblemStateAndSave}
        onToggle={() => this.toggle(p)}
        problem={p}
        tick={this.getTick(p)}
      />
    ));
    return <div className="problemList">{problemsList}</div>;
  }
}
