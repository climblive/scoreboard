import { Client } from "@stomp/stompjs";
import * as React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import {
  deactivateRaffle,
  receiveRaffleWinner,
  setCurrentCompClassId,
  updateScoreboardTimer,
} from "../actions/actions";
import {
  handleScoreboardItem,
  loadContest,
  loadScoreboardData,
} from "../actions/asyncActions";
import { RafflePushItem } from "../model/rafflePushItem";
import { RaffleWinner } from "../model/raffleWinner";
import { StoreState } from "../model/storeState";
import { Api } from "../utils/Api";
import { ScoreboardClassHeaderComp } from "./ScoreboardClassHeaderComp";
import {
  ScoreboardFinalistListContainer,
  ScoreboardTotalListContainer,
} from "./ScoreboardListComp";
import "./ScoreboardView.css";
import Spinner from "./Spinner";

export interface Props {}

class ScoreboardView extends React.Component<
  Props & PropsFromRedux & RouteComponentProps
> {
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
      this.client.subscribe(
        "/topic/contest/" + contestId + "/scoreboard",
        (message) => {
          this.props.handleScoreboardItem(JSON.parse(message.body));
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

  componentWillUnmount() {
    this.client.deactivate();
    window.clearInterval(this.intervalId);
  }

  addSeparators = (list: any[]) => {
    let result: any[] = [];
    for (let i = 0; i < list.length; i++) {
      if (i !== 0) {
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
        (sd) => sd.compClass.id === currentCompClassId
      )?.compClass;

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
                  scoreboardList.compClass.id === currentCompClassId
                    ? "selector selected"
                    : "selector"
                }
                onClick={() =>
                  this.props.setCurrentCompClassId(scoreboardList.compClass.id)
                }
              >
                {scoreboardList.compClass.name}
              </div>
            ))}
          </div>
          <div className="showLarge scoreboardListContainer">{headers}</div>
          {currentCompClass && (
            <div className="showSmall scoreboardListContainer">
              <ScoreboardClassHeaderComp compClass={currentCompClass} />
            </div>
          )}
          {contest.finalEnabled && <div className="header">Finalister</div>}
          {contest.finalEnabled && (
            <div className="showLarge scoreboardListContainer">
              {finalistList}
            </div>
          )}
          {currentCompClass && contest.finalEnabled && (
            <div className="showSmall scoreboardListContainer">
              <ScoreboardFinalistListContainer compClass={currentCompClass} />
            </div>
          )}
          <div className="header">Placering</div>
          <div className="showLarge scoreboardListContainer total">
            {totalList}
          </div>
          {currentCompClass && (
            <div className="showSmall scoreboardListContainer total">
              <ScoreboardTotalListContainer compClass={currentCompClass} />
            </div>
          )}
          <div className="logoContainer">
            <img height="100" src="/clmb_MainLogo_Shadow.png" alt="" />
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

const mapStateToProps = (state: StoreState) => ({
  scoreboardData: state.scoreboardData,
  raffleWinners: state.raffleWinners,
  contest: state.contest,
  currentCompClassId: state.currentCompClassId,
});

const mapDispatchToProps = {
  loadScoreboardData,
  loadContest,
  updateScoreboardTimer,
  setCurrentCompClassId,
  deactivateRaffle,
  receiveRaffleWinner,
  handleScoreboardItem,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withRouter(ScoreboardView));
