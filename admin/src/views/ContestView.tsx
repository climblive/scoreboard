import * as React from "react";
import { Contest } from "../model/contest";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { StoreState } from "../model/storeState";
import { connect, Dispatch } from "react-redux";
import * as asyncActions from "../actions/asyncActions";
import * as actions from "../actions/actions";
import ProblemsComp from "../components/ProblemsComp";
import { CompClass } from "../model/compClass";
import { Problem } from "../model/problem";
import CompClassesComp from "../components/CompClassesComp";
import ContestGeneralComp from "../components/ContestGeneralComp";
import { Color } from "../model/color";
import ContendersComp from "../components/ContendersComp";
import { ContenderData } from "../model/contenderData";
import {
  getColorMap,
  getCompClassMap,
  getContenderMap,
  getContendersWithTicks,
  getContestIssues,
  getProblemMap,
  getProblemsWithTicks,
} from "../selectors/selector";
import { Series } from "../model/series";
import { Organizer } from "../model/organizer";
import { Redirect } from "react-router";
import { CompLocation } from "../model/compLocation";
import { SortBy } from "../constants/sortBy";
import RafflesComp from "../components/RafflesComp";
import { Raffle } from "../model/raffle";
import { Switch, Route } from "react-router";
import { Link } from "react-router-dom";

interface Props {
  match: {
    params: {
      contestId: string;
    };
  };
  contest?: Contest;
  organizer?: Organizer;
  creatingPdf: boolean;
  series?: Series[];
  locations?: CompLocation[];
  problems?: Problem[];
  problemMap: Map<number, Problem>;
  colors?: Color[];
  colorMap: Map<number, Color>;
  compClasses?: CompClass[];
  compClassMap: Map<number, CompClass>;
  contenders?: ContenderData[];
  contenderMap: Map<number, ContenderData>;
  contenderSortBy: SortBy;
  contenderFilterCompClassId?: number;
  editProblem?: Problem;
  editCompClass?: CompClass;
  contestIssues: string[];
  raffles?: Raffle[];

  loadContest?: (contestId: number) => void;
  setNewContest?: () => void;
  updateContest?: (propName: string, value: any) => void;
  saveContest?: (onSuccess: (contest: Contest) => void) => any;
  deleteContest?: (contest: Contest) => void;
  loadColors?: () => void;
  setTitle?: (title: string) => void;
  createPdf?: () => void;
  createPdfFromTemplate?: (file: Blob) => void;

  startEditProblem?: (problem: Problem) => void;
  cancelEditProblem?: () => void;
  saveEditProblem?: () => void;
  startAddProblem?: (problem: Problem) => void;
  deleteProblem?: (problem: Problem) => void;
  updateEditProblem?: (propName: string, value: any) => void;

  startEditCompClass?: (compClass: CompClass) => void;
  cancelEditCompClass?: () => void;
  saveEditCompClass?: () => void;
  startAddCompClass?: () => void;
  deleteCompClass?: (compClass: CompClass) => void;
  updateEditCompClass?: (propName: string, value: any) => void;

  createContenders?: (nNewContenders: number) => void;
  loadContenders?: () => void;
  setContenderFilterCompClass?: (contenderFilterCompClass: CompClass) => void;
  setContenderSortBy?: (contenderSortBy: SortBy) => void;
  exportResults?: () => void;
  resetContenders?: () => void;
  updateContender?: (contender: ContenderData) => void;

  createRaffle?: () => void;
  drawWinner?: (raffle: Raffle) => void;
  activateRaffle?: (raffle: Raffle) => void;
  deactivateRaffle?: (raffle: Raffle) => void;
  deleteRaffle?: (raffle: Raffle) => void;
}

type State = {
  selectedPath: string;
};

class ContestView extends React.Component<Props, State> {
  public readonly state: State = {
    selectedPath: location.pathname,
  };

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    let contestId: string = this.props.match.params.contestId;
    if (contestId == "new") {
      this.props.setNewContest!();
    } else {
      this.props.loadContest!(parseInt(contestId));
    }
    this.props.loadColors!();
    this.setState(this.state);
  }

  componentDidUpdate(nextProps: Readonly<Props>, nextContext: any): void {
    let title = "";
    if (this.props.contest) {
      title =
        this.props.contest?.id == undefined
          ? "Add contest"
          : this.props.contest.name;
    }
    this.props.setTitle!(title);
  }

  selectTab = (event: any, newValue: string) => {
    this.setState({ ...this.state, selectedPath: newValue });
  };

  createLink = (tab?: string): string => {
    let path = "/contests/" + this.props.contest?.id;
    if (tab != undefined) {
      path += "/" + tab;
    }

    return path;
  };

  render() {
    if (
      this.props.contest &&
      this.props.organizer &&
      this.props.contest!.organizerId !== this.props.organizer!.id
    ) {
      return <Redirect to="/contests" />;
    }

    let isNew = this.props.contest?.id == undefined;

    let tabs = [
      <Tab
        key={0}
        label="General information"
        value={this.createLink()}
        component={Link}
        to={this.createLink()}
      />,
    ];

    if (!isNew) {
      tabs = [
        ...tabs,
        <Tab
          key={1}
          label="Classes"
          value={this.createLink("classes")}
          component={Link}
          to={this.createLink("classes")}
        />,
        <Tab
          key={2}
          label="Problems"
          value={this.createLink("problems")}
          component={Link}
          to={this.createLink("problems")}
        />,
        <Tab
          key={3}
          label="Contenders"
          value={this.createLink("contenders")}
          component={Link}
          to={this.createLink("contenders")}
        />,
        <Tab
          key={4}
          label="Raffles"
          value={this.createLink("raffles")}
          component={Link}
          to={this.createLink("raffles")}
        />,
      ];
    }

    return (
      <div
        style={{
          margin: 10,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <Tabs
          key="tabs"
          value={this.state.selectedPath}
          onChange={this.selectTab}
        >
          {tabs}
        </Tabs>

        <Switch>
          <Route path="/contests/:contestId" exact>
            <ContestGeneralComp
              key="general"
              contest={this.props.contest!}
              creatingPdf={this.props.creatingPdf}
              series={this.props.series}
              locations={this.props.locations}
              contestIssues={this.props.contestIssues}
              updateContest={this.props.updateContest}
              saveContest={this.props.saveContest}
              deleteContest={this.props.deleteContest}
              createPdf={this.props.createPdf}
              createPdfFromTemplate={this.props.createPdfFromTemplate}
            />
          </Route>
          <Route path="/contests/:contestId/classes">
            <CompClassesComp
              key="compClasses"
              compClasses={this.props.compClasses!}
              editCompClass={this.props.editCompClass}
              startEditCompClass={this.props.startEditCompClass}
              cancelEditCompClass={this.props.cancelEditCompClass}
              saveEditCompClass={this.props.saveEditCompClass}
              startAddCompClass={this.props.startAddCompClass}
              deleteCompClass={this.props.deleteCompClass}
              updateEditCompClass={this.props.updateEditCompClass}
            />
          </Route>
          <Route path="/contests/:contestId/problems">
            <ProblemsComp
              key="problems"
              problems={this.props.problems}
              colors={this.props.colors}
              colorMap={this.props.colorMap}
              contenderMap={this.props.contenderMap}
              compClassMap={this.props.compClassMap}
              editProblem={this.props.editProblem}
              startEditProblem={this.props.startEditProblem}
              cancelEditProblem={this.props.cancelEditProblem}
              saveEditProblem={this.props.saveEditProblem}
              startAddProblem={this.props.startAddProblem}
              deleteProblem={this.props.deleteProblem}
              updateEditProblem={this.props.updateEditProblem}
            />
          </Route>
          <Route path="/contests/:contestId/contenders">
            <ContendersComp
              key="contenders"
              contest={this.props.contest!}
              contenders={this.props.contenders!}
              contenderFilterCompClassId={this.props.contenderFilterCompClassId}
              contenderSortBy={this.props.contenderSortBy}
              compClasses={this.props.compClasses}
              compClassMap={this.props.compClassMap}
              problemMap={this.props.problemMap}
              colorMap={this.props.colorMap}
              createContenders={this.props.createContenders}
              loadContenders={this.props.loadContenders}
              setContenderFilterCompClass={
                this.props.setContenderFilterCompClass
              }
              setContenderSortBy={this.props.setContenderSortBy}
              exportResults={this.props.exportResults}
              resetContenders={this.props.resetContenders}
              updateContender={this.props.updateContender}
            />
          </Route>
          <Route path="/contests/:contestId/raffles">
            <RafflesComp
              key="raffles"
              raffles={this.props.raffles!}
              contenderMap={this.props.contenderMap}
              createRaffle={this.props.createRaffle}
              drawWinner={this.props.drawWinner}
              activateRaffle={this.props.activateRaffle}
              deactivateRaffle={this.props.deactivateRaffle}
              deleteRaffle={this.props.deleteRaffle}
            />
          </Route>
        </Switch>
      </div>
    );
  }
}

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    contest: state.contest,
    organizer: state.organizer,
    creatingPdf: state.creatingPdf,
    locations: state.locations,
    problems: getProblemsWithTicks(state),
    series: state.series,
    compClasses: state.compClasses,
    compClassMap: getCompClassMap(state),
    contestIssues: getContestIssues(state),
    contenders: getContendersWithTicks(state),
    contenderMap: getContenderMap(state),
    contenderSortBy: state.contenderSortBy,
    contenderFilterCompClassId: state.contenderFilterCompClassId,
    problemMap: getProblemMap(state),
    colors: state.colors,
    colorMap: getColorMap(state),
    editProblem: state.editProblem,
    editCompClass: state.editCompClass,
    raffles: state.raffles,
    match: props.match,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    loadContest: (contestId: number) =>
      dispatch(asyncActions.loadContest(contestId)),
    setNewContest: () => dispatch(actions.setNewContest()),
    updateContest: (propName: string, value: any) =>
      dispatch(actions.updateContest({ propName: propName, value: value })),
    saveContest: (onSuccess: (contest: Contest) => void) =>
      dispatch(asyncActions.saveContest(onSuccess)),
    deleteContest: (contest: Contest) =>
      dispatch(asyncActions.deleteContest(contest)),
    loadColors: () => dispatch(asyncActions.loadColors()),
    setTitle: (title: string) => dispatch(actions.setTitle(title)),

    startEditProblem: (problem: Problem) =>
      dispatch(actions.startEditProblem(problem)),
    cancelEditProblem: () => dispatch(actions.cancelEditProblem()),
    saveEditProblem: () => dispatch(asyncActions.saveEditProblem()),
    startAddProblem: (problem: Problem) =>
      dispatch(actions.startAddProblem(problem)),
    deleteProblem: (problem: Problem) =>
      dispatch(asyncActions.deleteProblem(problem)),
    updateEditProblem: (propName: string, value: any) =>
      dispatch(actions.updateEditProblem({ propName: propName, value: value })),

    startEditCompClass: (compClass: CompClass) =>
      dispatch(actions.startEditCompClass(compClass)),
    cancelEditCompClass: () => dispatch(actions.cancelEditCompClass()),
    saveEditCompClass: () => dispatch(asyncActions.saveEditCompClass()),
    startAddCompClass: () => dispatch(actions.startAddCompClass()),
    deleteCompClass: (compClass: CompClass) =>
      dispatch(asyncActions.deleteCompClass(compClass)),
    updateEditCompClass: (propName: string, value: any) =>
      dispatch(
        actions.updateEditCompClass({ propName: propName, value: value })
      ),

    createContenders: (nNewContenders: number) =>
      dispatch(asyncActions.createContenders(nNewContenders)),
    loadContenders: () => dispatch(asyncActions.loadContenders()),
    setContenderFilterCompClass: (contenderFilterCompClass: CompClass) =>
      dispatch(actions.setContenderFilterCompClass(contenderFilterCompClass)),
    setContenderSortBy: (sortBy: SortBy) =>
      dispatch(actions.setContenderSortBy(sortBy)),
    exportResults: () => dispatch(asyncActions.exportResults()),
    createPdf: () => dispatch(asyncActions.createPdf()),
    createPdfFromTemplate: (file: Blob) =>
      dispatch(asyncActions.createPdfFromTemplate(file)),
    resetContenders: () => dispatch(asyncActions.resetContenders()),
    updateContender: (contender: ContenderData) =>
      dispatch(asyncActions.updateContender(contender)),

    createRaffle: () => dispatch(asyncActions.createRaffle()),
    drawWinner: (raffle: Raffle) => dispatch(asyncActions.drawWinner(raffle)),
    activateRaffle: (raffle: Raffle) =>
      dispatch(asyncActions.activateRaffle(raffle)),
    deactivateRaffle: (raffle: Raffle) =>
      dispatch(asyncActions.deactivateRaffle(raffle)),
    deleteRaffle: (raffle: Raffle) =>
      dispatch(asyncActions.deleteRaffle(raffle)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContestView);
