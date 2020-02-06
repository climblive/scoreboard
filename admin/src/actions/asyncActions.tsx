import {Problem} from '../model/problem';
import {Dispatch} from 'react-redux';
import {Api} from '../utils/Api';
import * as actions from './actions';
import {Contest} from "../model/contest";
import {StoreState} from "../model/storeState";
import {CompClass} from "../model/compClass";
import { saveAs } from 'file-saver';
import {Color} from "../model/color";
import {Series} from "../model/series";
import {Organizer} from "../model/organizer";
import {CompLocation} from "../model/compLocation";
import {Raffle} from "../model/raffle";

export function login(code:string): any {
   return (dispatch: Dispatch<any>) => {
      dispatch(actions.setLoggingIn(true));
      Api.setCredentials(code);
      Api.getUser()
         .then(userData => {
            console.log(userData);
            dispatch(actions.setLoggingIn(false));
            dispatch(actions.setLoggedInUser(userData));
            reloadSeries(dispatch);
            reloadOrganizers(dispatch);
            reloadLocations(dispatch);
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
         reloadContendersForContest(dispatch, contestId);
         reloadTicks(dispatch, contestId);
         reloadRaffles(dispatch, contestId);
      }).catch(error => {
         dispatch(actions.setErrorMessage(error));
      });
   }
}

export function saveContest(onSuccess:(contest:Contest) => void): any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      let contest = getState().contest;
      let isNew = contest!.isNew;
      Api.saveContest(contest!).then(contest => {
         dispatch(actions.receiveContest(contest));
         if(isNew) {
            dispatch(actions.receiveProblems([]));
            dispatch(actions.receiveTicks([]));
            dispatch(actions.receiveCompClasses([]));
            dispatch(actions.receiveContenders([]));
            dispatch(actions.receiveRaffles([]));
         }
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
   }).catch(error => {
      dispatch(actions.receiveSeries([]));
      dispatch(actions.setErrorMessage(error));
   });
};

export function loadSeries(): any {
   return (dispatch: Dispatch<any>) => {
      reloadSeries(dispatch);
   }
}

export function saveEditSeries(): any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      let series = getState().editSeries!;
      Api.saveSeries(series).then(serie => {
         // Reload the list of comp classes:
         dispatch(actions.cancelEditSeries());
         reloadSeries(dispatch);
      }).catch(error => {
         dispatch(actions.setErrorMessage(error));
      });
   }
}

export function deleteSeries(series:Series): any {
   return (dispatch: Dispatch<any>) => {
      Api.deleteSeries(series)
         .then(() => {
            dispatch(actions.cancelEditSeries());
            reloadColors(dispatch);
         })
         .catch(error => {dispatch(actions.setErrorMessage(error))});
   }
}

// ************

let reloadLocations = (dispatch: Dispatch<any>) => {
   Api.getLocations().then(locations => {
      dispatch(actions.receiveLocations(locations));
   })
   .catch(error => {
      dispatch(actions.receiveLocations([]));
      dispatch(actions.setErrorMessage(error));
   });
};

export function loadLocations(): any {
   return (dispatch: Dispatch<any>) => {
      reloadLocations(dispatch);
   }
}

export function saveEditLocation(): any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      let location = getState().editLocation!;
      Api.saveLocation(location).then(location => {
         // Reload the list of comp classes:
         dispatch(actions.cancelEditLocation());
         reloadLocations(dispatch);
      }).catch(error => {
         dispatch(actions.setErrorMessage(error));
      });
   }
}

export function deleteLocation(location:CompLocation): any {
   return (dispatch: Dispatch<any>) => {
      Api.deleteLocation(location)
         .then(() => {
            dispatch(actions.cancelEditLocation());
            reloadColors(dispatch);
         })
         .catch(error => {dispatch(actions.setErrorMessage(error))});
   }
}

// ************

let reloadOrganizers = (dispatch: Dispatch<any>) => {
   Api.getOrganizers().then(organizers => {
      dispatch(actions.receiveOrganizers(organizers));
   }).catch(error => {
      dispatch(actions.setErrorMessage(error));
   })
};


export function loadOrganizers(): any {
   return (dispatch: Dispatch<any>) => {
      reloadOrganizers(dispatch);
   }
}

export function saveEditOrganizer(): any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      let organizer = getState().editOrganizer!;
      Api.saveOrganizer(organizer).then(organizer => {
         // Reload the list of comp classes:
         dispatch(actions.cancelEditOrganizer());
         reloadOrganizers(dispatch);
      }).catch(error => {
         dispatch(actions.setErrorMessage(error));
      });
   }
}

export function deleteOrganizer(organizer:Organizer): any {
   return (dispatch: Dispatch<any>) => {
      Api.deleteOrganizer(organizer)
         .then(() => {
            dispatch(actions.cancelEditOrganizer());
            reloadColors(dispatch);
         })
         .catch(error => {dispatch(actions.setErrorMessage(error))});
   }
}

// ************

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

let reloadContendersForContest = (dispatch: Dispatch<any>, contestId: number) => {
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
         reloadContendersForContest(dispatch, contestId);
      }).catch(error => {dispatch(actions.setErrorMessage(error))});
   }
}

export function reloadContenders():any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      let contestId = getState().contest!.id;
      dispatch(actions.receiveContenders([]));
      reloadContendersForContest(dispatch, contestId);
   }
}

export function resetContenders():any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      let contestId = getState().contest!.id;
      Api.resetContenders(contestId).then(() => {
         reloadContendersForContest(dispatch, contestId);
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

export function createPdfFromTemplate(file:Blob):any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      let contestId = getState().contest!.id;
      let reader = new FileReader();
      dispatch(actions.setCreatingPdf(true));
      reader.onload = (evt:any) => {
         let arrayBuffer = evt.currentTarget.result;
         console.log("ArrayBuffer", arrayBuffer);
         Api.createPdfFromTemplate(contestId, arrayBuffer).then(response => {
            console.log(response);
            dispatch(actions.setCreatingPdf(false));
            saveAs(response, "contest.pdf");
         }).catch(error => {
            dispatch(actions.setCreatingPdf(false));
            dispatch(actions.setErrorMessage(error))
         });
      };
      reader.onerror = function (evt) {
         dispatch(actions.setCreatingPdf(false));
         dispatch(actions.setErrorMessage("Failed to load file:" + evt))
      };
      reader.readAsArrayBuffer(file);
   }
}

export function createPdf():any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      let contestId = getState().contest!.id;
      dispatch(actions.setCreatingPdf(true));
      Api.createPdf(contestId).then(response => {
         dispatch(actions.setCreatingPdf(false));
         saveAs(response, "contest.pdf");
      }).catch(error => {
         dispatch(actions.setCreatingPdf(false));
         dispatch(actions.setErrorMessage(error))
      });
   }
}

let reloadTicks = (dispatch: Dispatch<any>, contestId: number) => {
   Api.getTicks(contestId).then(ticks => {
      dispatch(actions.receiveTicks(ticks));
   }).catch(error => {
      dispatch(actions.setErrorMessage(error));
   });
};

let reloadRaffles = (dispatch: Dispatch<any>, contestId: number) => {
   Api.getRaffles(contestId).then(raffles => {
      dispatch(actions.receiveRaffles(raffles));
      for(let raffle of raffles) {
         Api.getRaffleWinners(raffle).then(winners => {
            dispatch(actions.receiveRaffleWinners({raffle: raffle, winners: winners}))
         });
      }
   }).catch(error => {
      dispatch(actions.setErrorMessage(error));
   });
};

export function createRaffle():any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      let contestId = getState().contest!.id;
      let newRaffle: Raffle = {
         id: -1,
         contestId: contestId,
         winners: undefined,
         isActive:false
      };
      Api.saveRaffle(newRaffle).then(() => {
         reloadRaffles(dispatch, contestId);
      }).catch(error => {
         dispatch(actions.setErrorMessage(error));
      });
   }
}

export function activateRaffle(raffle:Raffle):any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      let contestId = getState().contest!.id;
      raffle.isActive = true;
      raffle.winners = undefined;
      dispatch(actions.clearRaffles());
      Api.saveRaffle(raffle).then(() => {
         reloadRaffles(dispatch, contestId);
      }).catch(error => {
         dispatch(actions.setErrorMessage(error));
      });
   }
}

export function deactivateRaffle(raffle:Raffle):any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      let contestId = getState().contest!.id;
      raffle.isActive = false;
      raffle.winners = undefined;
      dispatch(actions.clearRaffles());
      Api.saveRaffle(raffle).then(() => {
         reloadRaffles(dispatch, contestId);
      }).catch(error => {
         dispatch(actions.setErrorMessage(error));
      });
   }
}

export function drawWinner(raffle:Raffle):any {
   return (dispatch: Dispatch<any>) => {
      Api.drawWinner(raffle).then((winner) => {
         dispatch(actions.receiveRaffleWinner(winner))
      }).catch(error => {
         dispatch(actions.setErrorMessage(error));
      });
   }
}

export function deleteRaffle(raffle:Raffle):any {
   return (dispatch: Dispatch<any>, getState: () => StoreState) => {
      let contestId = getState().contest!.id;
      Api.deleteRaffle(raffle).then(() => {
         reloadRaffles(dispatch, contestId);
      }).catch(error => {
         dispatch(actions.setErrorMessage(error));
      });
   }
}

