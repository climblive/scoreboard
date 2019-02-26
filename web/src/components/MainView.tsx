import * as React from 'react';
import './MainView.css';
import { Problem } from '../model/problem';
import ProblemList from './ProblemList';
import { UserData } from '../model/userData';
import * as ReactModal from 'react-modal';
import { Contest } from '../model/contest';
import { BY_NUMBER, BY_POINTS } from '../constants/constants';
import ContenderInfoComp from "./ContenderInfoComp";

export interface Props {
   userData: UserData,
   match: {
      params: {
         code: string;
      }
   }
   contest: Contest,
   problemsSortedBy: string
   loadUserData?: (code: string) => void;
   saveUserData?: (userData: UserData) => Promise<UserData>,
   toggleProblemAndSave?: (problem: Problem) => void;
   sortProblems?: (sortBy: string) => void;
   loadContest?: () => void;
}

type State = {
   userInfoModalIsOpen: boolean,
   rulesModalIsOpen: boolean,
}

export default class MainView extends React.Component<Props, State> {
   public readonly state: State = {
      userInfoModalIsOpen: false,
      rulesModalIsOpen: false
   }

   constructor(props: Props) {
      super(props);
   }

   componentDidMount() {
      ReactModal.setAppElement("body");

      let code : string = this.props.match.params.code;
      this.props.loadUserData!(code);
      this.props.loadContest!();
   }

   render() {
      if (!this.props.userData) { 
         return ( 
            <div>Getting data...</div>
         )
      } else if(!this.props.userData.name) {
         let openRulesModal = () => {
            console.log("openModal")
            this.state.rulesModalIsOpen = true;
            this.setState(this.state);
         };
         return (
            <div className="maxWidth">
               <div className="view mainView">
                   <ContenderInfoComp
                       activationCode={this.props.match.params.code}
                       contest={this.props.contest}
                       saveUserData={this.props.saveUserData}
                       loadContest={this.props.loadContest}
                       onFinished={openRulesModal} >
                   </ContenderInfoComp>
               </div>
            </div>
         )
      } else {
         document.title = this.props.userData.name;
         let totalPoints = this.props.userData.problems.filter(p => p.sent).reduce((s, p) => s + p.points, 0);
         let tenBest = this.props.userData.problems.filter(p => p.sent).sort((a, b) => b.points - a.points).slice(0, 10).reduce((s, p) => s + p.points, 0);

         let openUserInfoModal = () => {
            console.log("openUserInfoModal")
            this.state.userInfoModalIsOpen = true;
            this.setState(this.state);
         };

         let closeUserInfoModal = () => {
            console.log("closeUserInfoModal")
            this.state.userInfoModalIsOpen = false;
            this.setState(this.state);
         };

         let closeRulesModal = () => {
            console.log("closeRulesModal")
            this.state.rulesModalIsOpen = false;
            this.setState(this.state);
         };

         let rules = this.props.contest ? this.props.contest.rules : "";

         return (
            <div className="maxWidth">
               <div className="view mainView">
                  <div className="titleRow">
                     <div className="name">{this.props.userData.name}</div>
                     <div>{this.props.userData.compClass}</div>
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
                     <div className={this.props.problemsSortedBy == BY_NUMBER ? "selector selected" : "selector"} onClick={() => this.props.sortProblems!(BY_NUMBER)}>Nummer</div>
                     <div className={this.props.problemsSortedBy == BY_POINTS ? "selector selected" : "selector"} onClick={() => this.props.sortProblems!(BY_POINTS)}>Poäng</div>
                  </div>
                  <ProblemList problems={this.props.userData.problems} onToggle={this.props.toggleProblemAndSave} />

                  <ReactModal
                      isOpen={this.state.userInfoModalIsOpen}
                      contentLabel="Example Modal"
                      className="modal"
                     >

                     <ContenderInfoComp
                         existingUserData={this.props.userData}
                         activationCode={this.props.match.params.code}
                         contest={this.props.contest}
                         saveUserData={this.props.saveUserData}
                         loadContest={this.props.loadContest}
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
               </div>
            </div>
         );
      }
   }
}