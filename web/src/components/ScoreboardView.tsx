import * as React from 'react';
import './ScoreboardView.css';
import { ScoreboardList } from '../model/scoreboardList';

export interface Props {
   scoreboardData: ScoreboardList[];
   loadScoreboardData? : () => void;
}

export default class ScoreboardView extends React.Component<Props> {

   componentDidMount() {
      this.props.loadScoreboardData!();
   }
   render() {
      return (
         <div>{JSON.stringify(this.props.scoreboardData)}</div>
      );
   }
}