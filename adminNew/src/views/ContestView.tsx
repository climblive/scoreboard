import * as React from 'react';
import { Contest } from '../model/contest';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {StoreState} from "../model/storeState";
import {connect, Dispatch} from "react-redux";
import * as asyncActions from "../actions/asyncActions";
import * as actions from "../actions/actions";
import ProblemsComp from "../components/ProblemsComp";
import {CompClass} from "../model/compClass";
import {Problem} from "../model/problem";
import CompClassesComp from "../components/CompClassesComp";
import ContestGeneralComp from "../components/ContestGeneralComp";
import {Color} from "../model/color";
import ContendersComp from "../components/ContendersComp";
import {ContenderData} from "../model/contenderData";
import {
   getColorMap,
   getCompClassMap,
   getContestIssues,
   getOrganizerColors,
   getOrganizerLocations
} from "../selectors/selector";
import {Series} from "../model/series";
import {Organizer} from "../model/organizer";
import {Redirect} from "react-router";
import {CompLocation} from "../model/compLocation";

interface Props {
   match: {
      params: {
         contestId: string
      }
   },
   contest?:Contest,
   organizer?:Organizer,
   creatingPdf:boolean,
   series?:Series[],
   locations?:CompLocation[],
   problems?:Problem[],
   colors?:Color[],
   colorMap: Map<number, Color>,
   compClasses?:CompClass[],
   compClassMap:Map<number, CompClass>,
   contenders?:ContenderData[],
   editProblem?: Problem
   editCompClass?: CompClass
   contestIssues: string[]

   loadContest?: (contestId: number) => void,
   setNewContest?: () => void,
   updateContest?: (propName:string, value:any) => void,
   saveContest?: (onSuccess:(contest:Contest) => void) => any,
   loadColors?: () => void,
   setTitle?: (title: string) => void,
   createPdf?: () => void
   createPdfFromTemplate?: (file:Blob) => void

   startEditProblem?:(problem:Problem) => void
   cancelEditProblem?:() => void
   saveEditProblem?:() => void
   startAddProblem?:(problem:Problem) => void
   deleteProblem?:(problem:Problem) => void
   updateEditProblem?: (propName:string, value:any) => void,

   startEditCompClass?:(compClass:CompClass) => void
   cancelEditCompClass?:() => void
   saveEditCompClass?:() => void
   startAddCompClass?:() => void
   deleteCompClass?:(compClass:CompClass) => void
   updateEditCompClass?: (propName:string, value:any) => void,

   createContenders?:(nNewContenders:number) => void,
   exportResults?:() => void,
   resetContenders?:() => void,
}

type State = {
   selectedTab: number,
}

class ContestView extends React.Component<Props, State> {
   public readonly state: State = {
      selectedTab: 0,
   };

   constructor(props: Props) {
      super(props);
   }

   componentDidMount() {
      let contestId : string = this.props.match.params.contestId;
      if(contestId == "new") {
         this.props.setNewContest!();
      } else {
         this.props.loadContest!(parseInt(contestId));
      }
      this.props.loadColors!();
      this.setState(this.state);
   }

   componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
      let title = "";
      if(this.props.contest) {
         title = this.props.contest.isNew ? "Add contest" : this.props.contest.name;
      }
      this.props.setTitle!(title);
   }

   selectTab = (event: any, newValue: number) => {
      this.state.selectedTab = newValue;
      this.setState(this.state)
   };

   render() {
      if(this.props.contest && this.props.organizer && this.props.contest!.organizerId !== this.props.organizer!.id) {
         return <Redirect to="/contests" />
      }

      let selectedTab = this.state.selectedTab;
      let tab;
      let isNew = this.props.contest == undefined || this.props.contest.isNew;
      if(selectedTab == 0) {
         tab = (<ContestGeneralComp key="general"
                                    contest={this.props.contest!}
                                    creatingPdf={this.props.creatingPdf}
                                    series={this.props.series}
                                    locations={this.props.locations}
                                    contestIssues={this.props.contestIssues}
                                    updateContest={this.props.updateContest}
                                    saveContest={this.props.saveContest}
                                    createPdf={this.props.createPdf}
                                    createPdfFromTemplate={this.props.createPdfFromTemplate}
         />);
      } else if(selectedTab == 1) {
         tab = (<CompClassesComp key="compClasses"
                                 compClasses={this.props.compClasses!}
                                 editCompClass={this.props.editCompClass}
                                 startEditCompClass={this.props.startEditCompClass}
                                 cancelEditCompClass={this.props.cancelEditCompClass}
                                 saveEditCompClass={this.props.saveEditCompClass}
                                 startAddCompClass={this.props.startAddCompClass}
                                 deleteCompClass={this.props.deleteCompClass}
                                 updateEditCompClass={this.props.updateEditCompClass}
         />);
      } else if(selectedTab == 2) {
         tab = (<ProblemsComp key="problems"
                              problems={this.props.problems}
                              colors={this.props.colors}
                              colorMap={this.props.colorMap}
                              editProblem={this.props.editProblem}
                              startEditProblem={this.props.startEditProblem}
                              cancelEditProblem={this.props.cancelEditProblem}
                              saveEditProblem={this.props.saveEditProblem}
                              startAddProblem={this.props.startAddProblem}
                              deleteProblem={this.props.deleteProblem}
                              updateEditProblem={this.props.updateEditProblem}
         />);
      } else if(selectedTab == 3) {
         tab = (<ContendersComp key="contenders"
                                contenders={this.props.contenders!}
                                compClassMap={this.props.compClassMap}
                                createContenders={this.props.createContenders}
                                exportResults={this.props.exportResults}
                                resetContenders={this.props.resetContenders}
         />);
      }
      return [
         (<Tabs key="tabs" value={selectedTab} onChange={this.selectTab}>
            <Tab label="General information" />
            {!isNew && <Tab label="Classes" />}
            {!isNew && <Tab label="Problems" />}
            {!isNew && <Tab label="Contenders" />}
         </Tabs>),
         tab
      ]
   }
}

function mapStateToProps(state: StoreState, props: any): Props {
   return {
      contest: state.contest,
      organizer: state.organizer,
      creatingPdf: state.creatingPdf,
      locations: getOrganizerLocations(state),
      problems: state.problems,
      series: state.series,
      compClasses: state.compClasses,
      compClassMap: getCompClassMap(state),
      contestIssues: getContestIssues(state),
      contenders: state.contenders,
      colors: getOrganizerColors(state),
      colorMap: getColorMap(state),
      editProblem: state.editProblem,
      editCompClass: state.editCompClass,
      match: props.match
   };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      loadContest: (contestId: number) => dispatch(asyncActions.loadContest(contestId)),
      setNewContest: () => dispatch(actions.setNewContest()),
      updateContest: (propName:string, value:any) => dispatch(actions.updateContest({propName: propName, value: value})),
      saveContest: (onSuccess:(contest:Contest) => void) => dispatch(asyncActions.saveContest(onSuccess)),
      loadColors: () => dispatch(asyncActions.loadColors()),
      setTitle: (title: string) => dispatch(actions.setTitle(title)),

      startEditProblem: (problem: Problem) => dispatch(actions.startEditProblem(problem)),
      cancelEditProblem: () => dispatch(actions.cancelEditProblem()),
      saveEditProblem: () => dispatch(asyncActions.saveEditProblem()),
      startAddProblem: (problem: Problem) => dispatch(actions.startAddProblem(problem)),
      deleteProblem: (problem: Problem) => dispatch(asyncActions.deleteProblem(problem)),
      updateEditProblem: (propName:string, value:any) => dispatch(actions.updateEditProblem({propName: propName, value: value})),

      startEditCompClass: (compClass: CompClass) => dispatch(actions.startEditCompClass(compClass)),
      cancelEditCompClass: () => dispatch(actions.cancelEditCompClass()),
      saveEditCompClass: () => dispatch(asyncActions.saveEditCompClass()),
      startAddCompClass: () => dispatch(actions.startAddCompClass()),
      deleteCompClass: (compClass: CompClass) => dispatch(asyncActions.deleteCompClass(compClass)),
      updateEditCompClass: (propName:string, value:any) => dispatch(actions.updateEditCompClass({propName: propName, value: value})),

      createContenders: (nNewContenders:number) => dispatch(asyncActions.createContenders(nNewContenders)),
      exportResults: () => dispatch(asyncActions.exportResults()),
      createPdf: () => dispatch(asyncActions.createPdf()),
      createPdfFromTemplate: (file:Blob) => dispatch(asyncActions.createPdfFromTemplate(file)),
      resetContenders: () => dispatch(asyncActions.resetContenders()),
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContestView);
