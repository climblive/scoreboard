import * as React from 'react';
import './MainView.css';
import { Problem } from '../model/problem';
import ProblemList from './ProblemList';
import { UserData } from '../model/userData';

export interface Props {
   userData: UserData,
   match: {
      params: {
         code: string;
      }
   }
   receiveUserData?: (userData: UserData) => void;
   onToggle?: (problem: Problem) => void;
}

export default class MainView extends React.Component<Props> {

   constructor(props: Props) {
      super(props);

      // Make 
      console.log("This is the constructor!");
   }

   componentDidMount() { 
      console.log("componentDidMount " + this.props.match.params.code);
      fetch("/test.json").then((data) => data.json()).then(this.props.receiveUserData!);
   }

   render() {
      console.log(this.props.match);

      if (!this.props.userData) { 
         return ( 
            <div>Getting data...</div>
         )
      } else {
         var totalPoints = this.props.userData.problems.filter(p => p.isSent).reduce((s, p) => s + p.points, 0);
         var tenBest = this.props.userData.problems.filter(p => p.isSent).sort((a, b) => b.points - a.points).slice(0, 3).reduce((s, p) => s + p.points, 0);

         var onChange = () => {
            console.log("onChange")
         };         
         return (
            <div>
               <div className="titleRow">
                  <div className="name">{this.props.userData.name}</div>
                  <div>{this.props.userData.compClass}</div>
                  <button onClick={onChange}>Change</button>
               </div>
               <div className="pointsRow">
                  <div className="points">{totalPoints}</div>
                  <div className="pointsDesc total">Totalt</div>
                  <div className="pointsDesc">10 bästa</div>
                  <div className="points">{tenBest}</div>
               </div>
               <ProblemList problems={this.props.userData.problems} onToggle={this.props.onToggle} />
            </div>
         );
      }
   }
}