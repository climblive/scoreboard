import * as React from 'react';
import './ScoreboardView.css';
import { ScoreboardListComp } from './ScoreboardListComp';
import { ScoreboardList } from '../model/scoreboardList';
import { Client } from '@stomp/stompjs';

export interface Props {
   scoreboardData: ScoreboardList[];
   loadScoreboardData? : () => void;
}

export default class ScoreboardView extends React.Component<Props> {

   client : Client;

   componentDidMount() {
      this.props.loadScoreboardData!();

      this.client = new Client({
         brokerURL: "ws://localhost:8080/gs-guide-websocket/websocket",
         /*connectHeaders: {
            login: "user",
            passcode: "password"
         },*/
         debug: function (str) {
            console.log("DEBUG: " + str);
         },
         //reconnectDelay: 5000,
         //heartbeatIncoming: 4000,
         //heartbeatOutgoing: 4000
      });

      //console.log("Client: ", this.client);

      this.client.activate();
      this.client.onConnect = () => {
         console.log("onConnect");
         this.client.subscribe("/topic/greetings", (message) => {
            console.log(message);
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