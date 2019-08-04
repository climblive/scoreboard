import {Problem} from '../model/problem';
import {Dispatch} from 'react-redux';
import {Api} from '../utils/Api';
import * as actions from './actions';
import {Contest} from "../model/contest";
import {StoreState} from "../model/storeState";
import {CompClass} from "../model/compClass";
import { saveAs } from 'file-saver';
import {Color} from "../model/color";
import {Serie} from "../model/serie";

export function login(code:string): any {
   return (dispatch: Dispatch<any>) => {
      dispatch(actions.setLoggingIn(true));
      Api.setCredentials(code);
      Api.getUser()
         .then(userData => {
            console.log(userData);
            dispatch(actions.setLoggingIn(false));
            dispatch(actions.setLoggedInUser(userData));
            Api.getOrganizers().then(organizers => {
               dispatch(actions.receiveOrganizers(organizers));
            }).catch(error => {
               dispatch(actions.setErrorMessage(error));

            })
         })
         .catch(error => {
            Api.setCredentials(undefined);
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
      dispatch(actions.clearContest());
      Api.getContest(contestId).then(contest => {
         dispatch(actions.receiveContest(contest));
         reloadProblems(dispatch, contestId);
         reloadCompClasses(dispatch, contestId);
         reloadContenders(dispatch, contestId);
      }).catch(error => {
         dispatch(actions.setErrorMessage(error));
      });
   }
}

export function saveContest(onSuccess:(contest:Contest) => void): any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      let contest = getState().contest;
      Api.saveContest(contest!).then(contest => {
         dispatch(actions.receiveContest(contest));
         onSuccess(contest);
      }).catch(error => {
         dispatch(actions.setErrorMessage(error));
      });
   }
}

// ************

let reloadColors = (dispatch: Dispatch<any>) => {
   Api.getColors().then(colors => {
      dispatch(actions.receiveColors(colors));
   })
   .catch(error => {
      dispatch(actions.receiveColors([]));
      dispatch(actions.setErrorMessage(error));
   });
};

export function loadColors(): any {
   return (dispatch: Dispatch<any>) => {
      reloadColors(dispatch);
   }
}

export function saveEditColor(): any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      let color = getState().editColor!;
      Api.saveColor(color).then(color => {
         // Reload the list of comp classes:
         dispatch(actions.cancelEditColor());
         reloadColors(dispatch);
      }).catch(error => {
         dispatch(actions.setErrorMessage(error));
      });
   }
}

export function deleteColor(color:Color): any {
   return (dispatch: Dispatch<any>) => {
      Api.deleteColor(color)
         .then(() => {
            dispatch(actions.cancelEditColor());
            reloadColors(dispatch);
         })
         .catch(error => {dispatch(actions.setErrorMessage(error))});
   }
}

// ************

let reloadSeries = (dispatch: Dispatch<any>) => {
   Api.getSeries().then(series => {
      dispatch(actions.receiveSeries(series));
   })
      .catch(error => {
         dispatch(actions.receiveSeries([]));
         dispatch(actions.setErrorMessage(error));
      });
};

export function loadSeries(): any {
   return (dispatch: Dispatch<any>) => {
      reloadSeries(dispatch);
   }
}

export function saveEditSerie(): any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      let serie = getState().editSerie!;
      Api.saveSerie(serie).then(serie => {
         // Reload the list of comp classes:
         dispatch(actions.cancelEditSerie());
         reloadSeries(dispatch);
      }).catch(error => {
         dispatch(actions.setErrorMessage(error));
      });
   }
}

export function deleteSerie(serie:Serie): any {
   return (dispatch: Dispatch<any>) => {
      Api.deleteSerie(serie)
         .then(() => {
            dispatch(actions.cancelEditSerie());
            reloadColors(dispatch);
         })
         .catch(error => {dispatch(actions.setErrorMessage(error))});
   }
}

// ************

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

let reloadProblems = (dispatch: Dispatch<any>, contestId: number) => {
   Api.getProblems(contestId).then(problems => {
      dispatch(actions.receiveProblems(problems));
   }).catch(error => {
      dispatch(actions.setErrorMessage(error));
   });
};

export function saveEditProblem(): any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      // TODO: Implement
      let problem = getState().editProblem!;
      Api.saveProblem(problem).then(problem => {
         // Reload the list of problems:
         dispatch(actions.cancelEditProblem());
         reloadProblems(dispatch, problem.contestId);
      }).catch(error => {
         dispatch(actions.setErrorMessage(error));
      });
   }
}

export function deleteProblem(problem:Problem): any {
   return (dispatch: Dispatch<any>) => {
      Api.deleteProblem(problem)
         .then(() => {
            dispatch(actions.cancelEditProblem());
            reloadProblems(dispatch, problem.contestId);
         })
         .catch(error => {dispatch(actions.setErrorMessage(error))});
   }
}


let reloadCompClasses = (dispatch: Dispatch<any>, contestId: number) => {
   Api.getCompClasses(contestId).then(compClasses => {
      dispatch(actions.receiveCompClasses(compClasses));
   }).catch(error => {
      dispatch(actions.setErrorMessage(error));
   });
};

export function saveEditCompClass(): any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      let compClass = getState().editCompClass!;
      Api.saveCompClass(compClass).then(compClass => {
         // Reload the list of comp classes:
         dispatch(actions.cancelEditCompClass());
         reloadCompClasses(dispatch, compClass.contestId);
      }).catch(error => {
         dispatch(actions.setErrorMessage(error));
      });
   }
}

export function deleteCompClass(compClass:CompClass): any {
   return (dispatch: Dispatch<any>) => {
      Api.deleteCompClass(compClass).then(() => {
         dispatch(actions.cancelEditCompClass());
         reloadCompClasses(dispatch, compClass.contestId);
      }).catch(error => {dispatch(actions.setErrorMessage(error))});
   }
}

let reloadContenders = (dispatch: Dispatch<any>, contestId: number) => {
   Api.getContenders(contestId).then(contenders => {
      dispatch(actions.receiveContenders(contenders));
   }).catch(error => {
      dispatch(actions.setErrorMessage(error));
   });
};

export function createContenders(nNewContenders:number):any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      let contestId = getState().contest!.id;
      Api.createContenders(contestId, nNewContenders).then(() => {
         reloadContenders(dispatch, contestId);
      }).catch(error => {dispatch(actions.setErrorMessage(error))});
   }
}

export function resetContenders():any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      let contestId = getState().contest!.id;
      Api.resetContenders(contestId).then(() => {
         reloadContenders(dispatch, contestId);
      }).catch(error => {dispatch(actions.setErrorMessage(error))});
   }
}

export function exportResults():any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      let contestId = getState().contest!.id;
      Api.exportContest(contestId).then(response => {
         console.log(response);
         saveAs(response, "contest.xls");
      }).catch(error => {
         dispatch(actions.setErrorMessage(error))
      });
   }
}

export function generatePdf(file:Blob):any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      let contestId = getState().contest!.id;
      let reader = new FileReader();
      reader.onload = (evt:any) => {
         let arrayBuffer = evt.currentTarget.result;
         console.log("ArrayBuffer", arrayBuffer);
         Api.generatePdf(contestId, arrayBuffer).then(response => {
            console.log(response);
            saveAs(response, "contest.pdf");
         }).catch(error => {
            dispatch(actions.setErrorMessage(error))
         });
      };
      reader.onerror = function (evt) {
         dispatch(actions.setErrorMessage("Failed to load file:" + evt))
      };
      reader.readAsArrayBuffer(file);
   }
}


