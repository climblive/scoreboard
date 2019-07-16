import {Problem} from '../model/problem';
import {Dispatch} from 'react-redux';
import {Api} from '../utils/Api';
import * as actions from './actions';
import {Contest} from "../model/contest";
import {StoreState} from "../model/storeState";

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

export function saveContest(): any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      let contest = getState().contest;
      Api.saveContest(contest).then(contest => {
         dispatch(actions.receiveContest(contest));
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

export function saveEditProblem(): any {
   return (dispatch: Dispatch<any>) => {
      // TODO: Implement
      dispatch(actions.cancelEditProblem());
   }
}

export function deleteProblem(problem:Problem): any {
   return (dispatch: Dispatch<any>) => {
      // TODO: Implement
      dispatch(actions.cancelEditProblem());
   }
}