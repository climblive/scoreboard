import * as React from 'react';
import './MainView.css';
import { Problem } from '../model/problem';
import ProblemList from './ProblemList';
import { UserData } from '../model/userData';

export interface Props {
   userData: UserData;
   onToggle?: (problem:Problem) => void;
}

function DashboardView({ userData, onToggle }: Props) {

   var totalPoints = userData.problems.filter(p => p.isSent).reduce((s, p) => s + p.points, 0);
   var tenBest = userData.problems.filter(p => p.isSent).sort((a, b) => b.points - a.points).slice(0, 3).reduce((s, p) => s + p.points, 0);

   var onChange = () => {
      console.log("onChange")
   };

   return (
      <div>
         <div className="titleRow">DASHBOARD
            <div className="name">{name}</div>
            <div>{userData.compClass}</div>
            <button onClick={onChange}>Change</button>
         </div>
         <div className="pointsRow">
            <div className="points">{totalPoints}</div>
            <div className="pointsDesc total">Totalt</div>
            <div className="pointsDesc">10 bästa</div>
            <div className="points">{tenBest}</div>
         </div>
         <ProblemList problems={userData.problems} onToggle={onToggle} />
      </div>
   );
}

export default DashboardView;