import * as React from 'react';
import './MainView.css';
import { Problem } from '../model/problem';
import { ContenderData } from '../model/contenderData';
import * as ReactModal from 'react-modal';
import { Contest } from '../model/contest';
import ContenderInfoComp from "./ContenderInfoComp";
import {Redirect} from "react-router";
import {SortBy} from "../constants/constants";
import {ProblemState} from "../model/problemState";
import {Tick} from "../model/tick";
import {CompClass} from "../model/compClass";
import ProblemList from "./ProblemList";
import {Color} from "../model/color";

export interface Props {
   contenderData?: ContenderData,
   contenderNotFound: boolean,
   match: {
      params: {
         code: string
      }
   }
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
   setProblemStateAndSave?: (problem: Problem, problemState: ProblemState) => void,
   sortProblems?: (sortBy: SortBy) => void,
   clearErrorMessage?: () => void
}

type State = {
   userInfoModalIsOpen: boolean,
   rulesModalIsOpen: boolean,
   goBack: boolean,
}

export default class MainView extends React.Component<Props, State> {
   public readonly state: State = {
      userInfoModalIsOpen: false,
      rulesModalIsOpen: false,
      goBack: false
   };

   constructor(props: Props) {
      super(props);
   }

   componentDidMount() {
      ReactModal.setAppElement("body");

      let code : string = this.props.match.params.code;
      this.props.loadUserData!(code);
   }

   render() {
      if(this.state.goBack) {
         return <Redirect to="/" />
      } else if(this.props.contenderNotFound) {
         let goBack = () => {
            this.state.goBack = true;
            this.setState(this.state);
         };

         return(
            <div>
               <div>Not a valid registration code</div>
               <button onClick={goBack}>Go back</button>
            </div>
         )
      } else if (!(this.props.contenderData && this.props.problems && this.props.contest && this.props.compClasses && this.props.ticks && this.props.colors)) {
         return ( 
            <div>Getting data...</div>
         )
      } else if(!this.props.contenderData.name) {
         let openRulesModal = () => {
            console.log("openModal");
            this.state.rulesModalIsOpen = true;
            this.setState(this.state);
         };
         return (
            <div className="maxWidth">
               <div className="view mainView">
                   <ContenderInfoComp
                       existingUserData={this.props.contenderData}
                       activationCode={this.props.match.params.code}
                       contest={this.props.contest}
                       compClasses={this.props.compClasses}
                       saveUserData={this.props.saveUserData}
                       onFinished={openRulesModal} >
                   </ContenderInfoComp>
               </div>
            </div>
         )
      } else {
         document.title = this.props.contenderData.name;
         let totalPoints = 0;  // FIXME //this.props.problems.filter(p => p.state !== ProblemState.NOT_SENT).reduce((s, p) => s + p.points, 0);
         let tenBest = 0; // FIXME this.props.problems.filter(p => p.state !== ProblemState.NOT_SENT).sort((a, b) => b.points - a.points).slice(0, 10).reduce((s, p) => s + p.points, 0);

         let openUserInfoModal = () => {
            console.log("openUserInfoModal");
            this.state.userInfoModalIsOpen = true;
            this.setState(this.state);
         };

         let closeUserInfoModal = () => {
            console.log("closeUserInfoModal");
            this.state.userInfoModalIsOpen = false;
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
                     <div className="pointsDesc">10 bästa</div>
                     <div className="points">{tenBest}</div>
                  </div>
                  <div className="headerRow">
                     <div className="title">Problem:</div>
                     <div className="sortBy">Sortera efter:</div>
                     <div className={this.props.problemsSortedBy == SortBy.BY_NUMBER ? "selector selected" : "selector"} onClick={() => this.props.sortProblems!(SortBy.BY_NUMBER)}>Nummer</div>
                     <div className={this.props.problemsSortedBy == SortBy.BY_POINTS ? "selector selected" : "selector"} onClick={() => this.props.sortProblems!(SortBy.BY_POINTS)}>Poäng</div>
                  </div>
                  <ProblemList
                     problems={this.props.problems}
                     colors={this.props.colors}
                     problemIdBeingUpdated={this.props.problemIdBeingUpdated}
                     setProblemStateAndSave={this.props.setProblemStateAndSave} />
                  <ReactModal
                      isOpen={this.state.userInfoModalIsOpen}
                      contentLabel="Example Modal"
                      className="modal"
                     >

                     <ContenderInfoComp
                         existingUserData={this.props.contenderData}
                         activationCode={this.props.match.params.code}
                         contest={this.props.contest}
                         compClasses={this.props.compClasses}
                         saveUserData={this.props.saveUserData}
                         showCancelButton={true}
                         onFinished={closeUserInfoModal}>
                     </ContenderInfoComp>
                  </ReactModal>

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