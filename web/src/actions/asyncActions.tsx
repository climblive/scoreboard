import {Problem} from '../model/problem';
import {ContenderData} from '../model/contenderData';
import {Dispatch} from 'react-redux';
import {Api} from '../utils/Api';
import {
   createTick,
   deleteTick,
   receiveColors,
   receiveCompClasses,
   receiveContenderData,
   receiveContenderNotFound,
   receiveContest,
   receiveProblems,
   receiveScoreboardData,
   receiveTicks,
   setProblemStateFailed,
   startProblemUpdate,
   updateScoreboardTimer, updateTick
} from './actions';
import {StoreState} from '../model/storeState';
import {ProblemState} from "../model/problemState";
import {Tick} from "../model/tick";

export function loadUserData(code: string): any {
   return (dispatch: Dispatch<any>) => {
      Api.getContender(code)
         .then(contenderData => {
            dispatch(receiveContenderData(contenderData));
            Api.getProblems(contenderData.contestId, contenderData.registrationCode).then(problems => {
               dispatch(receiveProblems(problems));
            });
            Api.getContest(contenderData.contestId, contenderData.registrationCode).then(contest => {
               dispatch(receiveContest(contest));
            });
            Api.getCompClasses(contenderData.contestId, contenderData.registrationCode).then(compClasses => {
               dispatch(receiveCompClasses(compClasses));
            });
            Api.getTicks(contenderData.id, contenderData.registrationCode).then(ticks => {
               dispatch(receiveTicks(ticks));
            });
            Api.getColors(contenderData.registrationCode).then(colors => {
               dispatch(receiveColors(colors));
            });
         })
         .catch(() => dispatch(receiveContenderNotFound())
      )
   };
}

export function loadContest(contestId:number): any {
   return (dispatch: Dispatch<any>) => {
      Api.getContest(contestId).then(contest => {
         dispatch(receiveContest(contest));
      })
   };
}

export function loadScoreboardData(id: number): any {
   return (dispatch: Dispatch<any>) => {
      Api.getScoreboard(id).then(scoreboardDescription => {
         dispatch(receiveScoreboardData(scoreboardDescription));
         dispatch(updateScoreboardTimer());
      })
   };
}

/*export function loadContest(): any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      Api.getContest(0).then(contest => {
         dispatch(receiveContest(contest));
      })
   };
}*/

export function saveUserData(contenderData: ContenderData): any {
   return (dispatch: Dispatch<any>) => {
      let promise: Promise<ContenderData> = Api.setContender(contenderData, contenderData.registrationCode);
      promise.then(contenderData => dispatch(receiveContenderData(contenderData)));
      return promise;
   };
}

export function setProblemStateAndSave(problem: Problem, problemState: ProblemState, tick?:Tick): any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      const oldState = !tick ? ProblemState.NOT_SENT : tick.flash ? ProblemState.FLASHED : ProblemState.SENT;
      if(oldState != problemState) {
         dispatch(startProblemUpdate(problem));
         const activationCode: string = getState().contenderData!.registrationCode;
         if(!tick) {
            // Create a new tick:
            Api.createTick(problem.id, getState().contenderData!.id, problemState == ProblemState.FLASHED, activationCode)
               .then((tick) => {
                  dispatch(createTick(tick))
               })
               .catch((error) => {
                  console.log(error);
                  dispatch(setProblemStateFailed(error))
               });

         } else if (problemState == ProblemState.NOT_SENT) {
            // Delete the tick:
            Api.deleteTick(tick, activationCode)
               .then(() => {
                  dispatch(deleteTick(tick))
               })
               .catch((error) => {
                  dispatch(setProblemStateFailed(error))
               });
         } else {
            // Update the tick:
            const newTick:Tick = JSON.parse(JSON.stringify(tick));
            newTick.flash = problemState == ProblemState.FLASHED;
            Api.updateTick(newTick, activationCode)
               .then(() => {
                  dispatch(updateTick(newTick))
               })
               .catch((error) => {
                  dispatch(setProblemStateFailed(error))
               });
         }
      }
   };
}