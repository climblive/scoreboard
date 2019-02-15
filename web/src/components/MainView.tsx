import * as React from 'react';
import './MainView.css';
import { Problem } from '../model/problem';
import ProblemList from './ProblemList';
import { UserData } from '../model/userData';
import * as ReactModal from 'react-modal';
import { Contest } from '../model/contest';
import { BY_NUMBER, BY_POINTS } from '../constants/constants';

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
   toggleProblemAndSave?: (problem: Problem) => void;
   sortProblems?: (sortBy: string) => void;
   loadContest?: () => void;
}

type State = {
   modalIsOpen: boolean,
   name?: string,
   compClass?: string
}

export default class MainView extends React.Component<Props, State> {
   public readonly state: State = {
      modalIsOpen: false
   }

   constructor(props: Props) {
      super(props);
   }

   componentDidMount() { 
      var code : string = this.props.match.params.code;
      this.props.loadUserData!(code);
   }

   handleNameCodeChange = (event: React.FormEvent<HTMLInputElement>) => {
      this.state.name = event.currentTarget.value;
      this.setState(this.state);
   }

   setCompClass = (compClass: string) => {
      this.state.compClass = compClass;
      this.setState(this.state);
   }

   render() {
      if (!this.props.userData) { 
         return ( 
            <div>Getting data...</div>
         )
      } else {
         document.title = this.props.userData.name;
         var totalPoints = this.props.userData.problems.filter(p => p.sent).reduce((s, p) => s + p.points, 0);
         var tenBest = this.props.userData.problems.filter(p => p.sent).sort((a, b) => b.points - a.points).slice(0, 10).reduce((s, p) => s + p.points, 0);

         var openModal = () => {
            console.log("openModal")
            this.state.modalIsOpen = true;
            this.state.name = this.props.userData.name;
            this.state.compClass = this.props.userData.compClass;
            this.setState(this.state);
            this.props.loadContest!();
         };         

         var closeModal = () => {
            console.log("openModal")
            this.state.modalIsOpen = false;
            this.setState(this.state);
         };         

         var compClasses: any[] = [];
         if (this.props.contest) {
            compClasses = this.props.contest.compClasses.map(compClass => (
               <div key={compClass.name} className={compClass.name == this.state.compClass ? "compClass selected" : "compClass"} onClick={() => this.setCompClass(compClass.name)}>{compClass.name}</div>
            ));
         }

         return (
            <div className="view mainView">
               <div className="titleRow">
                  <div className="name">{this.props.userData.name}</div>
                  <div>{this.props.userData.compClass}</div>
                  <button onClick={openModal}>Ändra</button>
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
                  
                  isOpen={this.state.modalIsOpen}
                  contentLabel="Example Modal"
               >

                  <div>Name:</div>
                  <input value={this.state.name} onChange={this.handleNameCodeChange} />
                  <div className="compClassContainer">{compClasses}</div>
                  <div className="buttonRow">
                     <button onClick={closeModal}>Ok</button>
                     <button onClick={closeModal}>Cancel</button>
                  </div>
               </ReactModal>
            </div>            
         );
      }
   }
}