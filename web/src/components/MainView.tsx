import * as React from 'react';
import './MainView.css';
import { Problem } from '../model/problem';
import ProblemList from './ProblemList';
import { UserData } from '../model/userData';
import * as ReactModal from 'react-modal';

export interface Props {
   userData: UserData,
   match: {
      params: {
         code: string;
      }
   }
   loadUserData?: (code: string) => void;
   toggleProblemAndSave?: (problem: Problem) => void;
}

type State = {
   modalIsOpen: boolean
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

   render() {
      if (!this.props.userData) { 
         return ( 
            <div>Getting data...</div>
         )
      } else {
         var totalPoints = this.props.userData.problems.filter(p => p.sent).reduce((s, p) => s + p.points, 0);
         var tenBest = this.props.userData.problems.filter(p => p.sent).sort((a, b) => b.points - a.points).slice(0, 3).reduce((s, p) => s + p.points, 0);

         var openModal = () => {
            console.log("openModal")
            this.state.modalIsOpen = true;
            this.setState(this.state);
         };         

         var closeModal = () => {
            console.log("openModal")
            this.state.modalIsOpen = false;
            this.setState(this.state);
         };         

         return (
            <div className="view">
               <div className="titleRow">
                  <div className="name">{this.props.userData.name}</div>
                  <div>{this.props.userData.compClass}</div>
                  <button onClick={openModal}>Change</button>
               </div>
               <div className="pointsRow">
                  <div className="points">{totalPoints}</div>
                  <div className="pointsDesc total">Totalt</div>
                  <div className="pointsDesc">10 bästa</div>
                  <div className="points">{tenBest}</div>
               </div>
               <ProblemList problems={this.props.userData.problems} onToggle={this.props.toggleProblemAndSave} />
            
               <ReactModal
                  isOpen={this.state.modalIsOpen}
                  contentLabel="Example Modal"
               >

                  <h2>Hello</h2>
                  <button onClick={closeModal}>close</button>
                  <div>I am a modal</div>
                  <form>
                     <input />
                     <button>tab navigation</button>
                     <button>stays</button>
                     <button>inside</button>
                     <button>the modal</button>
                  </form>
               </ReactModal>
            </div>            
         );
      }
   }
}