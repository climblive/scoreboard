import { Dispatch } from "redux";
import { ContenderData } from "../model/contenderData";
import { Problem } from "../model/problem";
import { ProblemState } from "../model/problemState";
import { ScoreboardPushItem } from "../model/scoreboardPushItem";
import { StoreState } from "../model/storeState";
import { Tick } from "../model/tick";
import { ScoreboardActions } from "../reducers/reducer";
import { Api } from "../utils/Api";
import {
  clearPushItemsQueue,
  createTick,
  deleteTick,
  receiveCompClasses,
  receiveContenderData,
  receiveContenderNotFound,
  receiveContest,
  receiveProblems,
  receiveScoreboardData,
  receiveScoreboardItem,
  receiveTicks,
  resetScoreboardItemAnimation,
  setProblemStateFailed,
  startProblemUpdate,
  updateScoreboardTimer,
  updateTick,
} from "./actions";

export function loadUserData(code: string) {
  return (dispatch: Dispatch<ScoreboardActions>) => {
    Api.getContender(code)
      .then((contenderData) => {
        dispatch(receiveContenderData(contenderData));
        Api.getProblems(
          contenderData.contestId,
          contenderData.registrationCode
        ).then((problems) => {
          dispatch(receiveProblems(problems));
        });
        Api.getContest(
          contenderData.contestId,
          contenderData.registrationCode
        ).then((contest) => {
          dispatch(receiveContest(contest));
        });
        Api.getCompClasses(
          contenderData.contestId,
          contenderData.registrationCode
        ).then((compClasses) => {
          dispatch(receiveCompClasses(compClasses));
        });
        Api.getTicks(contenderData.id, contenderData.registrationCode).then(
          (ticks) => {
            dispatch(receiveTicks(ticks));
          }
        );
      })
      .catch(() => dispatch(receiveContenderNotFound()));
  };
}

export function loadContest(contestId: number) {
  return (dispatch: Dispatch<ScoreboardActions>) => {
    Api.getContest(contestId).then((contest) => {
      dispatch(receiveContest(contest));
    });
  };
}

export function loadScoreboardData(id: number) {
  return (
    dispatch: Dispatch<ScoreboardActions>,
    getState: () => StoreState
  ) => {
    Api.getScoreboard(id).then((scoreboardDescription) => {
      dispatch(receiveScoreboardData(scoreboardDescription));
      dispatch(updateScoreboardTimer());

      for (const queuedItem of getState().pushItemsQueue) {
        handleScoreboardItem(queuedItem);
      }

      dispatch(clearPushItemsQueue());
    });
  };
}

export function handleScoreboardItem(scoreboardPushItem: ScoreboardPushItem) {
  return (dispatch: Dispatch<ScoreboardActions>) => {
    dispatch(receiveScoreboardItem(scoreboardPushItem));
    setTimeout(() => {
      dispatch(resetScoreboardItemAnimation(scoreboardPushItem));
    }, 3000);
  };
}

export function saveUserData(contenderData: ContenderData) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<ContenderData> => {
    return Api.updateContender(
      contenderData,
      contenderData.registrationCode
    ).then((contenderData) => {
      dispatch(receiveContenderData(contenderData));
      return contenderData;
    });
  };
}

export function setProblemStateAndSave(
  problem: Problem,
  problemState: ProblemState,
  tick?: Tick
) {
  return (
    dispatch: Dispatch<ScoreboardActions>,
    getState: () => StoreState
  ) => {
    const oldState = !tick
      ? ProblemState.NOT_SENT
      : tick.flash
      ? ProblemState.FLASHED
      : ProblemState.SENT;
    if (oldState !== problemState) {
      dispatch(startProblemUpdate(problem));
      const activationCode: string = getState().contenderData!.registrationCode;
      if (!tick) {
        // Create a new tick:
        Api.createTick(
          problem.id,
          getState().contenderData!.id,
          problemState === ProblemState.FLASHED,
          activationCode
        )
          .then((tick) => {
            dispatch(createTick(tick));
          })
          .catch((error) => {
            console.log(error);
            dispatch(setProblemStateFailed(error));
          });
      } else if (problemState === ProblemState.NOT_SENT) {
        // Delete the tick:
        Api.deleteTick(tick, activationCode)
          .then(() => {
            dispatch(deleteTick(tick));
          })
          .catch((error) => {
            dispatch(setProblemStateFailed(error));
          });
      } else {
        // Update the tick:
        const newTick: Tick = JSON.parse(JSON.stringify(tick));
        newTick.flash = problemState === ProblemState.FLASHED;
        Api.updateTick(newTick, activationCode)
          .then(() => {
            dispatch(updateTick(newTick));
          })
          .catch((error) => {
            dispatch(setProblemStateFailed(error));
          });
      }
    }
  };
}
