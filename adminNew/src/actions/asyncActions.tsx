import {Problem} from '../model/problem';
import {ContenderData} from '../model/contenderData';
import {Dispatch} from 'react-redux';
import {Api} from '../utils/Api';
import * as actions from './actions';
import {StoreState} from '../model/storeState';
import {ProblemState} from "../model/problemState";
import {Tick} from "../model/tick";

export function login(code:string): any {
   return (dispatch: Dispatch<any>) => {
      dispatch(actions.setLoggingIn(true));
      Api.getUser(code)
         .then(userData => {
            console.log(userData);
            dispatch(actions.setLoggingIn(false));
            dispatch(actions.setLoggedInUser("USER"));
         })
         .catch(error => {
            dispatch(actions.setLoggingIn(false));
            dispatch(actions.setErrorMessage(error));
      })
   }
}

export function loadContests(): any {
   return (dispatch: Dispatch<any>) => {
      Api.getContests()
         .then(contests => {
            dispatch(actions.receiveContests(contests));
         })
         .catch(error => {
            dispatch(actions.receiveContests([]));
            dispatch(actions.setErrorMessage(error));
         });
   }
}

export function loadContest(contestId: number): any {
   return (dispatch: Dispatch<any>) => {
      Api.getContest(contestId).then(contest => {
         dispatch(actions.receiveContest(contest));
      }).catch(error => {
         dispatch(actions.setErrorMessage(error));
      });

      Api.getProblems(contestId).then(problems => {
         dispatch(actions.receiveProblems(problems));
      }).catch(error => {
         dispatch(actions.setErrorMessage(error));
      });

      Api.getCompClasses(contestId).then(compClasses => {
         dispatch(actions.receiveCompClasses(compClasses));
      }).catch(error => {
         dispatch(actions.setErrorMessage(error));
      });

   }
}

export function loadColors(): any {
   return (dispatch: Dispatch<any>) => {
      Api.getColors()
         .then(colors => {
            dispatch(actions.receiveColors(colors));
         })
         .catch(error => {
            dispatch(actions.receiveColors([]));
            dispatch(actions.setErrorMessage(error));
         });
   }
}

export function loadLocations(): any {
   return (dispatch: Dispatch<any>) => {
      Api.getLocations()
         .then(locations => {
            dispatch(actions.receiveLocations(locations));
         })
         .catch(error => {
            dispatch(actions.receiveLocations([]));
            dispatch(actions.setErrorMessage(error));
         });
   }
}

export function loadOrganizers(): any {
   return (dispatch: Dispatch<any>) => {
      Api.getOrganizers()
         .then(organizers => {
            dispatch(actions.receiveOrganizers(organizers));
         })
         .catch(error => {
            dispatch(actions.receiveOrganizers([]));
            dispatch(actions.setErrorMessage(error));
         });
   }
}




export function saveUserData(contenderData: ContenderData): any {
   return (dispatch: Dispatch<any>) => {
      let promise: Promise<ContenderData> = Api.setContender(contenderData);
      promise.then(contenderData => dispatch(actions.receiveContenderData(contenderData)));
      return promise;
   };
}

export function setProblemStateAndSave(problem: Problem, problemState: ProblemState, tick?:Tick): any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      const oldState = !tick ? ProblemState.NOT_SENT : tick.flash ? ProblemState.FLASHED : ProblemState.SENT;
      if(oldState != problemState) {
         dispatch(actions.startProblemUpdate(problem));
         const activationCode: string = getState().contenderData!.registrationCode;
         if(!tick) {
            // Create a new tick:
            Api.createTick(problem.id, getState().contenderData!.id, problemState == ProblemState.FLASHED, activationCode)
               .then((tick) => {
                  dispatch(actions.createTick(tick))
               })
               .catch((error) => {
                  console.log(error);
                  dispatch(actions.setProblemStateFailed(error))
               });

         } else if (problemState == ProblemState.NOT_SENT) {
            // Delete the tick:
            Api.deleteTick(tick)
               .then(() => {
                  dispatch(actions.deleteTick(tick))
               })
               .catch((error) => {
                  dispatch(actions.setProblemStateFailed(error))
               });
         } else {
            // Update the tick:
            const newTick:Tick = JSON.parse(JSON.stringify(tick));
            newTick.flash = problemState == ProblemState.FLASHED;
            Api.updateTick(newTick)
               .then(() => {
                  dispatch(actions.updateTick(newTick))
               })
               .catch((error) => {
                  dispatch(actions.setProblemStateFailed(error))
               });
         }
      }
   };
}