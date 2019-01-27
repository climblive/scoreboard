import * as React from 'react';
import './ScoreboardView.css';
import { ScoreboardList } from '../model/scoreboardList';
import { ScoreboardListComp } from './ScoreboardListComp';

export interface Props {
   scoreboardData: ScoreboardList[];
   loadScoreboardData? : () => void;
}

export default class ScoreboardView extends React.Component<Props> {

   componentDidMount() {
      this.props.loadScoreboardData!();
   }

   render() {
      var scoreboardData = this.props.scoreboardData;
      
      if (scoreboardData) {
         var list = scoreboardData.map(scoreboardList => <ScoreboardListComp scoreboardList={scoreboardList}/>);
         return (
            <div className="scoreboardListContainer">{list}</div>
         );
      } else { 
         return <div>Getting data...</div>
      }

   }
}