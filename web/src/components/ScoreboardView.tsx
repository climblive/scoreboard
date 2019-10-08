import * as React from 'react';
import './ScoreboardView.css';
import { ScoreboardContenderList } from '../model/scoreboardContenderList';
import { Client } from '@stomp/stompjs';
import { ScoreboardPushItem } from '../model/scoreboardPushItem';
import { Api } from '../utils/Api';
import ScoreboardTotalListContainer from '../containers/ScoreboardTotalListContainer';
import ScoreboardFinalistListContainer from '../containers/ScoreboardFinalistListContainer';
import { ScoreboardClassHeaderComp } from './ScoreboardClassHeaderComp';
import Spinner from "./Spinner";
import {StoreState} from "../model/storeState";
import {connect, Dispatch} from "react-redux";
import * as asyncActions from "../actions/asyncActions";
import * as actions from "../actions/actions";
import {Contest} from "../model/contest";
import {RouteComponentProps, withRouter} from "react-router";

export interface Props {
   scoreboardData: ScoreboardContenderList[];
   currentCompClassId: number;
   contest: Contest;
   loadScoreboardData?: (id:number) => void;
   loadContest?: (id:number) => void;
   receiveScoreboardItem?: (scoreboardPushItem: ScoreboardPushItem) => void;
   updateScoreboardTimer?: () => void;
   setCurrentCompClassId?: (compClassId:number) => void;
}

class ScoreboardView extends React.Component<Props & RouteComponentProps> {

   client: Client;
   intervalId: number;

   componentDidMount() {
      document.title = "Scoreboard";
      const contestId = this.props.match.params["id"];
      this.props.loadContest!(contestId);

      this.client = new Client({
         brokerURL: Api.getLiveUrl(),
         /*debug: function (str) {
            console.log("DEBUG: " + str);
         },*/
         heartbeatIncoming: 4000,
         heartbeatOutgoing: 4000
      });

      this.client.activate();
      this.client.onConnect = () => {
         this.props.loadScoreboardData!(contestId);
         this.client.subscribe("/topic/scoreboard/" + contestId, (message) => {
            console.log(message, JSON.parse(message.body));
            this.props.receiveScoreboardItem!(JSON.parse(message.body))
         });
      }
      
      // Start the timer:
      this.intervalId = window.setInterval(() => { 
         this.props.updateScoreboardTimer!();
      }, 1000)
   }

   componentWillUnmount() { 
      this.client.deactivate();
      window.clearInterval(this.intervalId);
   }

   render() {
      const scoreboardData = this.props.scoreboardData;
      const contest = this.props.contest;

      if (scoreboardData && contest) {
         const currentCompClassId = this.props.currentCompClassId;
         const currentCompClass = scoreboardData.find(sd => sd.compClass.id == currentCompClassId)!.compClass;

         let headers = scoreboardData.map(scoreboardList => <ScoreboardClassHeaderComp key={scoreboardList.compClass.name} compClass={scoreboardList.compClass} />);
         let finalistList = scoreboardData.map(scoreboardList => <ScoreboardFinalistListContainer key={scoreboardList.compClass.name} compClass={scoreboardList.compClass} />);
         let totalList = scoreboardData.map(scoreboardList => <ScoreboardTotalListContainer key={scoreboardList.compClass.name} isPaging={true} compClass={scoreboardList.compClass} />);
         return (
            <div className="scoreboardView">
               <div style={{margin:20}} className="showSmall headerRow">
                  { scoreboardData.map(scoreboardList =>
                     <div key={scoreboardList.compClass.id}
                          style={{padding:5, fontSize:18}}
                          className={scoreboardList.compClass.id == currentCompClassId ? "selector selected" : "selector"}
                          onClick={() => this.props.setCurrentCompClassId!(scoreboardList.compClass.id)}>{scoreboardList.compClass.name}</div>)}
               </div>
               <div className="showLarge scoreboardListContainer">{headers}</div>
               <div className="showSmall scoreboardListContainer"><ScoreboardClassHeaderComp compClass={currentCompClass} /></div>
               <div className="header">Finalister</div>
               <div className="showLarge scoreboardListContainer">{finalistList}</div>
               <div className="showSmall scoreboardListContainer"><ScoreboardFinalistListContainer compClass={currentCompClass} /></div>
               <div className="header">Totalpoäng</div>
               <div className="showLarge scoreboardListContainer total">{totalList}</div>
               <div className="showSmall scoreboardListContainer total"><ScoreboardTotalListContainer compClass={currentCompClass} /></div>
               <div className="logoContainer">
                  <img height="100" src="/clmb_MainLogo_Shadow.png" />
               </div>
            </div>
         );
      } else { 
         return (
            <div className="scoreboardView">
               <div style={{marginTop:50, textAlign:"center"}}>
                  <div style={{marginBottom:5}}>Laddar scoreboard...</div>
                  <Spinner color={"#333"} />
               </div>
            </div>
         )
      }
   }
}

function mapStateToProps(state: StoreState, props: any): Props {
   return {
      scoreboardData: state.scoreboardData,
      contest: state.contest,
      currentCompClassId: state.currentCompClassId
   };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      loadScoreboardData: (contestId:number) => dispatch(asyncActions.loadScoreboardData(contestId)),
      loadContest: (contestId:number) => dispatch(asyncActions.loadContest(contestId)),
      receiveScoreboardItem: (scoreboardPushItem: ScoreboardPushItem) => dispatch(actions.receiveScoreboardItem(scoreboardPushItem)),
      updateScoreboardTimer: () => dispatch(actions.updateScoreboardTimer()),
      setCurrentCompClassId: (compClassId:number) => dispatch(actions.setCurrentCompClassId(compClassId))
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ScoreboardView));
