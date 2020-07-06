import * as React from "react";
import "./ScoreboardView.css";
import { ScoreboardContenderList } from "../model/scoreboardContenderList";
import { Client } from "@stomp/stompjs";
import { ScoreboardPushItem } from "../model/scoreboardPushItem";
import { Api } from "../utils/Api";
import ScoreboardTotalListContainer from "../containers/ScoreboardTotalListContainer";
import ScoreboardFinalistListContainer from "../containers/ScoreboardFinalistListContainer";
import { ScoreboardClassHeaderComp } from "./ScoreboardClassHeaderComp";
import Spinner from "./Spinner";
import { StoreState } from "../model/storeState";
import { connect, Dispatch } from "react-redux";
import * as asyncActions from "../actions/asyncActions";
import * as actions from "../actions/actions";
import { Contest } from "../model/contest";
import { RouteComponentProps, withRouter } from "react-router";
import { RaffleWinner } from "../model/raffleWinner";
import { RafflePushItem } from "../model/rafflePushItem";

export interface Props {
  scoreboardData: ScoreboardContenderList[];
  raffleWinners?: RaffleWinner[];
  currentCompClassId: number;
  contest: Contest;
  loadScoreboardData?: (id: number) => void;
  loadContest?: (id: number) => void;
  receiveScoreboardItem?: (scoreboardPushItem: ScoreboardPushItem) => void;
  deactivateRaffle?: (rafflePushItem: RafflePushItem) => void;
  receiveRaffleWinner?: (raffleWinner: RaffleWinner) => void;
  updateScoreboardTimer?: () => void;
  setCurrentCompClassId?: (compClassId: number) => void;
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
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.activate();
    this.client.onConnect = () => {
      this.props.loadScoreboardData!(contestId);
      console.log("subscribe " + contestId);
      this.client.subscribe(
        "/topic/contest/" + contestId + "/scoreboard",
        (message) => {
          console.log(message, JSON.parse(message.body));
          this.props.receiveScoreboardItem!(JSON.parse(message.body));
        }
      );
      this.client.subscribe(
        "/topic/contest/" + contestId + "/raffle",
        (message) => {
          let rafflePushItem = JSON.parse(message.body) as RafflePushItem;
          if (rafflePushItem.active) {
            this.props.loadScoreboardData!(contestId);
          } else {
            this.props.deactivateRaffle!(rafflePushItem);
          }
        }
      );
      this.client.subscribe(
        "/topic/contest/" + contestId + "/raffle/winner",
        (message) => {
          console.log(message, JSON.parse(message.body));
          this.props.receiveRaffleWinner!(
            JSON.parse(message.body) as RaffleWinner
          );
        }
      );
    };

    // Start the timer:
    this.intervalId = window.setInterval(() => {
      this.props.updateScoreboardTimer!();
    }, 1000);
  }

  fakeScore = () => {
    if (this.props.scoreboardData) {
      let scoreboardData = this.props.scoreboardData[0];
      let contender =
        scoreboardData.contenders[
          Math.floor(Math.random() * scoreboardData.contenders.length)
        ];
      this.props.receiveScoreboardItem!({
        compClassId: scoreboardData.compClass.id,
        item: {
          contenderId: contender.contenderId,
          contenderName: contender.contenderName,
          totalScore: contender.totalScore + 50,
          qualifyingScore: contender.qualifyingScore + 50,
          isAnimatingTotal: false,
          isAnimatingFinalist: false,
          lastUpdate: 0,
        },
      });
    }
    setTimeout(this.fakeScore, 2000);
  };

  componentWillUnmount() {
    this.client.deactivate();
    window.clearInterval(this.intervalId);
  }

  addSeparators = (list: any[]) => {
    let result: any[] = [];
    for (let i = 0; i < list.length; i++) {
      if (i != 0) {
        result.push(<div key={-1 * i} className="separator"></div>);
      }
      result.push(list[i]);
    }
    return result;
  };

  render() {
    const scoreboardData = this.props.scoreboardData;
    const contest = this.props.contest;

    if (scoreboardData && contest) {
      const currentCompClassId = this.props.currentCompClassId;
      const currentCompClass = scoreboardData.find(
        (sd) => sd.compClass.id == currentCompClassId
      )!.compClass;

      let headers = scoreboardData.map((scoreboardList) => (
        <ScoreboardClassHeaderComp
          key={scoreboardList.compClass.name}
          compClass={scoreboardList.compClass}
        />
      ));
      let finalistList = this.addSeparators(
        scoreboardData.map((scoreboardList) => (
          <ScoreboardFinalistListContainer
            key={scoreboardList.compClass.id}
            compClass={scoreboardList.compClass}
          />
        ))
      );
      let totalList = this.addSeparators(
        scoreboardData.map((scoreboardList) => (
          <ScoreboardTotalListContainer
            key={scoreboardList.compClass.id}
            isPaging={true}
            compClass={scoreboardList.compClass}
          />
        ))
      );

      return (
        <div className="scoreboardView">
          {this.props.raffleWinners && (
            <div className="winnerOuterContainer">
              <div className="winnerInnerContainer">
                {this.props.raffleWinners!.map((winner) => (
                  <div
                    className="winner"
                    style={{ top: winner.top }}
                    key={winner.contenderId}
                  >
                    {winner.contenderName}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ margin: 20 }} className="showSmall headerRow">
            {scoreboardData.map((scoreboardList) => (
              <div
                key={scoreboardList.compClass.id}
                style={{ padding: 5, fontSize: 18 }}
                className={
                  scoreboardList.compClass.id == currentCompClassId
                    ? "selector selected"
                    : "selector"
                }
                onClick={() =>
                  this.props.setCurrentCompClassId!(scoreboardList.compClass.id)
                }
              >
                {scoreboardList.compClass.name}
              </div>
            ))}
          </div>
          <div className="showLarge scoreboardListContainer">{headers}</div>
          <div className="showSmall scoreboardListContainer">
            <ScoreboardClassHeaderComp compClass={currentCompClass} />
          </div>
          {contest.finalists > 0 && <div className="header">Finalister</div>}
          {contest.finalists > 0 && (
            <div className="showLarge scoreboardListContainer">
              {finalistList}
            </div>
          )}
          {contest.finalists > 0 && (
            <div className="showSmall scoreboardListContainer">
              <ScoreboardFinalistListContainer compClass={currentCompClass} />
            </div>
          )}
          {contest.finalists > 0 && <div className="header">Totalpoäng</div>}
          {contest.finalists == 0 && (
            <div className="header" style={{ marginTop: 20 }}></div>
          )}
          <div className="showLarge scoreboardListContainer total">
            {totalList}
          </div>
          <div className="showSmall scoreboardListContainer total">
            <ScoreboardTotalListContainer compClass={currentCompClass} />
          </div>
          <div className="logoContainer">
            <img height="100" src="/clmb_MainLogo_Shadow.png" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="scoreboardView">
          <div style={{ marginTop: 50, textAlign: "center" }}>
            <div style={{ marginBottom: 5 }}>Laddar scoreboard...</div>
            <Spinner color={"#333"} />
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    scoreboardData: state.scoreboardData,
    raffleWinners: state.raffleWinners,
    contest: state.contest,
    currentCompClassId: state.currentCompClassId,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    loadScoreboardData: (contestId: number) =>
      dispatch(asyncActions.loadScoreboardData(contestId)),
    loadContest: (contestId: number) =>
      dispatch(asyncActions.loadContest(contestId)),
    receiveScoreboardItem: (scoreboardPushItem: ScoreboardPushItem) =>
      dispatch(asyncActions.handleScoreboardItem(scoreboardPushItem)),
    updateScoreboardTimer: () => dispatch(actions.updateScoreboardTimer()),
    setCurrentCompClassId: (compClassId: number) =>
      dispatch(actions.setCurrentCompClassId(compClassId)),
    deactivateRaffle: (rafflePushItem: RafflePushItem) =>
      dispatch(actions.deactivateRaffle(rafflePushItem)),
    receiveRaffleWinner: (raffleWinner: RaffleWinner) =>
      dispatch(actions.receiveRaffleWinner(raffleWinner)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ScoreboardView));
