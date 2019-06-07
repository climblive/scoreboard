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
   receiveContest, receiveContests, receiveLocations, receiveOrganizers,
   receiveProblems,
   receiveScoreboardData,
   receiveTicks, setErrorMessage,
   setProblemStateFailed,
   startProblemUpdate,
   updateScoreboardTimer, updateTick
} from './actions';
import {StoreState} from '../model/storeState';
import {ProblemState} from "../model/problemState";
import {Tick} from "../model/tick";

export function loadContests(): any {
   return (dispatch: Dispatch<any>) => {
      Api.getContests()
         .then(contests => {
            dispatch(receiveContests(contests));
         })
         .catch(error => {
            dispatch(receiveContests([]));
            dispatch(setErrorMessage(error));
         });
   }
}

export function loadContest(contestId: number): any {
   return (dispatch: Dispatch<any>) => {
      Api.getContest(contestId).then(contest => {
         dispatch(receiveContest(contest));
      }).catch(error => {
         dispatch(setErrorMessage(error));
      });

      Api.getProblems(contestId).then(problems => {
         dispatch(receiveProblems(problems));
      }).catch(error => {
         dispatch(setErrorMessage(error));
      });

      Api.getCompClasses(contestId).then(compClasses => {
         dispatch(receiveCompClasses(compClasses));
      }).catch(error => {
         dispatch(setErrorMessage(error));
      });

   }
}

export function loadColors(): any {
   return (dispatch: Dispatch<any>) => {
      Api.getColors()
         .then(colors => {
            dispatch(receiveColors(colors));
         })
         .catch(error => {
            dispatch(receiveColors([]));
            dispatch(setErrorMessage(error));
         });
   }
}

export function loadLocations(): any {
   return (dispatch: Dispatch<any>) => {
      Api.getLocations()
         .then(locations => {
            dispatch(receiveLocations(locations));
         })
         .catch(error => {
            dispatch(receiveLocations([]));
            dispatch(setErrorMessage(error));
         });
   }
}

export function loadOrganizers(): any {
   return (dispatch: Dispatch<any>) => {
      Api.getOrganizers()
         .then(organizers => {
            dispatch(receiveOrganizers(organizers));
         })
         .catch(error => {
            dispatch(receiveOrganizers([]));
            dispatch(setErrorMessage(error));
         });
   }
}




export function saveUserData(contenderData: ContenderData): any {
   return (dispatch: Dispatch<any>) => {
      let promise: Promise<ContenderData> = Api.setContender(contenderData);
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
            Api.deleteTick(tick)
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
            Api.updateTick(newTick)
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