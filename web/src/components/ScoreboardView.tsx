import * as React from 'react';
import './ScoreboardView.css';
import { ScoreboardListComp } from './ScoreboardListComp';
import { ScoreboardList } from '../model/scoreboardList';
import { Client } from '@stomp/stompjs';
import { ScoreboardPushItem } from '../model/scoreboardPushItem';
import { Api } from '../utils/Api';

export interface Props {
   scoreboardData: ScoreboardList[];
   loadScoreboardData?: () => void;
   receiveScoreboardItem?: (scoreboardPushItem : ScoreboardPushItem) => void;
}

export default class ScoreboardView extends React.Component<Props> {

   client : Client;

   componentDidMount() {

      this.client = new Client({
         brokerURL: Api.getLiveUrl(),
         debug: function (str) {
            console.log("DEBUG: " + str);
         }
      });

      this.client.activate();
      this.client.onConnect = () => {
         this.props.loadScoreboardData!();
         console.log("onConnect");
         this.client.subscribe("/topic/scoreboard", (message) => {
            console.log(message, JSON.parse(message.body));
            this.props.receiveScoreboardItem!(JSON.parse(message.body))
         });
      } 
   }

   render() {
      var scoreboardData = this.props.scoreboardData;
      
      if (scoreboardData) {
         var list = scoreboardData.map(scoreboardList => <ScoreboardListComp key={scoreboardList.compClass} scoreboardList={scoreboardList}/>);
         return (
            <div className="scoreboardListContainer">{list}</div>
         );
      } else { 
         return <div>Getting data...</div>
      }

   }
}