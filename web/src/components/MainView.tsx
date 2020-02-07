import * as React from 'react';
import './MainView.css';
import { Problem } from '../model/problem';
import { ContenderData } from '../model/contenderData';
import * as ReactModal from 'react-modal';
import { Contest } from '../model/contest';
import ContenderInfoComp from "./ContenderInfoComp";
import {Redirect, RouteComponentProps, withRouter} from "react-router";
import {SortBy} from "../constants/constants";
import {ProblemState} from "../model/problemState";
import {Tick} from "../model/tick";
import {CompClass} from "../model/compClass";
import ProblemList from "./ProblemList";
import {Color} from "../model/color";
import Spinner from "./Spinner";
import {StoreState} from "../model/storeState";
import {connect, Dispatch} from "react-redux";
import * as asyncActions from "../actions/asyncActions";
import * as actions from "../actions/actions";

export interface Props {
   contenderData?: ContenderData,
   contenderNotFound: boolean,
   contest: Contest,
   problems: Problem[],
   compClasses: CompClass[],
   ticks: Tick[],
   colors: Map<number, Color>,
   problemsSortedBy: string,
   problemIdBeingUpdated?: number,
   errorMessage?: string,
   loadUserData?: (code: string) => void,
   saveUserData?: (contenderData: ContenderData) => Promise<ContenderData>,
   setProblemStateAndSave?: (problem: Problem, problemState: ProblemState, tick?: Tick) => void,
   sortProblems?: (sortBy: SortBy) => void,
   clearErrorMessage?: () => void
}

type State = {
   userInfoModalIsOpen: boolean,
   rulesModalIsOpen: boolean,
   goBack: boolean,
}

class MainView extends React.Component<Props & RouteComponentProps, State> {
   public readonly state: State = {
      userInfoModalIsOpen: false,
      rulesModalIsOpen: false,
      goBack: false
   };

   componentDidMount() {
      ReactModal.setAppElement("body");

      let code : string = this.props.match.params["code"];
      this.props.loadUserData!(code);
   }

   render() {
      const code = this.props.match.params["code"];
      if(this.state.goBack) {
         return <Redirect to="/" />
      } else if(this.props.contenderNotFound) {
         let goBack = () => {
            this.state.goBack = true;
            this.setState(this.state);
         };

         return (
            <div className="maxWidth">
               <div className="startView view">
                  <div className="activationWrapper">
                     <img style={{width:200, position:'absolute', top:70, right: 0, marginRight: 'auto',left: 0, marginLeft: 'auto'}} src="clmb_MainLogo_NoShadow.png"/>
                     <div style={{marginTop:50, textAlign:"center"}}>
                        <div style={{marginBottom:10}}>Registreringskoden är inte giltig.<br/>Vänligen kontrollera att den är rätt.</div>
                        <button className="large" onClick={goBack}>Försök igen</button>
                     </div>
                  </div>
               </div>
            </div>
         )
      } else if (!(this.props.contenderData && this.props.problems && this.props.contest && this.props.compClasses && this.props.ticks && this.props.colors)) {
         return (
            <div className="maxWidth">
               <div className="view mainView">
                  <div style={{marginTop:50, textAlign:"center"}}>
                     <div style={{marginBottom:5}}>Vänta...</div>
                     <Spinner color={"#333"} />
                  </div>
               </div>
            </div>
         )
      } else if(!this.props.contenderData.name) {
         let openRulesModal = () => {
            /*console.log("openModal");
            this.state.rulesModalIsOpen = true;
            this.setState(this.state);*/
         };
         return (
            <div className="maxWidth">
               <div className="view mainView">
                  <ContenderInfoComp
                     existingUserData={this.props.contenderData}
                     activationCode={code}
                     contest={this.props.contest}
                     compClasses={this.props.compClasses}
                     saveUserData={this.props.saveUserData}
                     onFinished={openRulesModal}>
                  </ContenderInfoComp>
               </div>
            </div>
         )
      } else if (this.state.userInfoModalIsOpen) {
         let closeUserInfoModal = () => {
            console.log("closeUserInfoModal");
            this.state.userInfoModalIsOpen = false;
            this.setState(this.state);
         };

         return (
            <div className="maxWidth">
               <div className="view mainView">
                  <ContenderInfoComp
                     existingUserData={this.props.contenderData}
                     activationCode={code}
                     contest={this.props.contest}
                     compClasses={this.props.compClasses}
                     saveUserData={this.props.saveUserData}
                     isProfile={true}
                     onFinished={closeUserInfoModal}>
                  </ContenderInfoComp>
               </div>
            </div>
         )
      } else {
         document.title = this.props.contenderData.name;
         const points = this.props.ticks.map(tick => {
            const problem = this.props.problems.find(problem => problem.id == tick.problemId)!;
            return tick.isFlash ? (problem.points + problem.flashBonus) : problem.points;
         }).sort((a, b) => b - a);
         console.log("POINTS:", points);
         let qualifyingProblems = this.props.contest.qualifyingProblems;
         let totalPoints = points.reduce((s, p) => s + p, 0);
         let tenBest = points.slice(0, qualifyingProblems).reduce((s, p) => s + p, 0);

         let openUserInfoModal = () => {
            console.log("openUserInfoModal");
            this.state.userInfoModalIsOpen = true;
            this.setState(this.state);
         };

         let closeRulesModal = () => {
            console.log("closeRulesModal");
            this.state.rulesModalIsOpen = false;
            this.setState(this.state);
         };

         let rules = this.props.contest ? this.props.contest.rules : "";
         const compClass = this.props.compClasses.find(compClass => compClass.id === this.props.contenderData!.compClassId)!;

         return (
            <div className="maxWidth">
               <div className="view mainView">
                  <div className="titleRow">
                     <div className="name">{this.props.contenderData.name}</div>
                     <div>{compClass.name}</div>
                     <button onClick={openUserInfoModal}>Ändra</button>
                  </div>
                  <div className="pointsRow">
                     <div className="points">{totalPoints}</div>
                     <div className="pointsDesc total">Totalt</div>
                     <div className="pointsDesc">{qualifyingProblems} bästa</div>
                     <div className="points">{tenBest}</div>
                  </div>
                  <div className="headerRow">
                     <div className={this.props.problemsSortedBy == SortBy.BY_NUMBER ? "selector selected" : "selector"} onClick={() => this.props.sortProblems!(SortBy.BY_NUMBER)}>Sortera efter nummer</div>
                     <div className={this.props.problemsSortedBy == SortBy.BY_POINTS ? "selector selected" : "selector"} onClick={() => this.props.sortProblems!(SortBy.BY_POINTS)}>Sortera efter poäng</div>
                  </div>
                  <ProblemList
                     problems={this.props.problems}
                     ticks={this.props.ticks}
                     colors={this.props.colors}
                     problemIdBeingUpdated={this.props.problemIdBeingUpdated}
                     setProblemStateAndSave={this.props.setProblemStateAndSave} />
                  <ReactModal
                      isOpen={this.state.rulesModalIsOpen}
                      contentLabel="Example Modal"
                      className="modal">
                     <div dangerouslySetInnerHTML={{__html: rules}}></div>
                     <div className="buttonRow">
                        <button onClick={closeRulesModal}>Fortsätt</button>
                     </div>
                  </ReactModal>

                  <ReactModal
                     isOpen={this.props.errorMessage !== undefined}
                     contentLabel="Example Modal"
                     className="modal">
                     <div>{this.props.errorMessage}</div>
                     <div className="buttonRow">
                        <button onClick={this.props.clearErrorMessage!}>Ok</button>
                     </div>
                  </ReactModal>
               </div>
            </div>
         );
      }
   }
}

function mapStateToProps(state: StoreState, props: any): Props {
   return {
      contenderData: state.contenderData,
      contenderNotFound: state.contenderNotFound,
      contest: state.contest,
      problems: state.problems,
      compClasses: state.compClasses,
      ticks: state.ticks,
      colors: state.colors,
      problemsSortedBy: state.problemsSortedBy,
      problemIdBeingUpdated: state.problemIdBeingUpdated,
      errorMessage: state.errorMessage,
   };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      setProblemStateAndSave: (problem: Problem, problemState: ProblemState, tick?:Tick) => dispatch(asyncActions.setProblemStateAndSave(problem, problemState, tick)),
      loadUserData: (code: string) => dispatch(asyncActions.loadUserData(code)),
      saveUserData: (contenderData: ContenderData) => dispatch(asyncActions.saveUserData(contenderData)),
      sortProblems: (sortBy: SortBy) => dispatch(actions.sortProblems(sortBy)),
      clearErrorMessage: () => dispatch(actions.clearErrorMessage())
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MainView));
