import { Problem } from "../model/problem";
import { Dispatch } from "react-redux";
import { Api } from "../utils/Api";
import * as actions from "./actions";
import { Contest } from "../model/contest";
import { StoreState } from "../model/storeState";
import { CompClass } from "../model/compClass";
import { saveAs } from "file-saver";
import { Color } from "../model/color";
import { Series } from "../model/series";
import { Organizer } from "../model/organizer";
import { CompLocation } from "../model/compLocation";
import { Raffle } from "../model/raffle";
import { ContenderData } from "src/model/contenderData";

export function login(code: string): any {
  return (dispatch: Dispatch<any>, getState: () => StoreState) => {
    dispatch(actions.setLoggingIn(true));
    Api.setCredentials(code);
    Api.getUser()
      .then((userData) => {
        localStorage.setItem("credentials", code);

        loadOrganizers()(dispatch).then(() => {
          let organizer: Organizer = pickOrganizer(getState().organizers!);
          Api.setOrganizerId(organizer.id);
          dispatch(actions.selectOrganizer(organizer));

          dispatch(actions.setLoggingIn(false));
          dispatch(actions.setLoggedInUser(userData));
        });
      })
      .catch((error) => {
        Api.setCredentials(undefined);
        dispatch(actions.setLoggingIn(false));
        dispatch(actions.setErrorMessage(error));
      });
  };
}

export function loadContests(): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.getContests()
      .then((contests) => {
        dispatch(actions.receiveContests(contests));
        return Promise.resolve();
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function loadContest(contestId: number): any {
  return (dispatch: Dispatch<any>) => {
    dispatch(actions.clearContest());
    Api.getContest(contestId)
      .then((contest) => {
        dispatch(actions.receiveContest(contest));
        loadProblems(contestId)(dispatch);
        loadCompClasses(contestId)(dispatch);
        loadContendersForContest(contestId)(dispatch);
        loadTicks(contestId)(dispatch);
        loadRaffles(contestId)(dispatch);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
      });
  };
}

export function saveContest(onSuccess: (contest: Contest) => void): any {
  return (dispatch: Dispatch<any>, getState: () => StoreState) => {
    let contest = getState().contest;
    let isNew = contest?.id == undefined;
    Api.saveContest(contest!)
      .then((contest) => {
        dispatch(actions.receiveContest(contest));
        if (isNew) {
          dispatch(actions.receiveProblems([]));
          dispatch(actions.receiveTicks([]));
          dispatch(actions.receiveCompClasses([]));
          dispatch(actions.receiveContenders([]));
          dispatch(actions.receiveRaffles([]));
        }
        onSuccess(contest);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
      });
  };
}

export function deleteContest(contest: Contest): any {
  return (dispatch: Dispatch<any>, getState: () => StoreState) => {
    Api.deleteContest(contest)
      .then(() => {
        dispatch(actions.deleteContest(contest));
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
      });
  };
}

// -----------------------------------------------------------------------------
// Colors
// -----------------------------------------------------------------------------

export function loadColors(): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.getColors()
      .then((colors) => {
        dispatch(actions.receiveColors(colors));
        return Promise.resolve();
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function saveColor(color: Color): any {
  return (dispatch: Dispatch<any>): Promise<void | Color> => {
    return Api.saveColor(color)
      .then((color) => {
        dispatch(actions.saveColorSuccess(color));
        return Promise.resolve(color);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function deleteColor(color: Color): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.deleteColor(color)
      .then(() => {
        dispatch(actions.deleteColorSuccess(color));
        return Promise.resolve();
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

// -----------------------------------------------------------------------------
// Series
// -----------------------------------------------------------------------------

export function loadSeries(): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.getSeries()
      .then((series) => {
        dispatch(actions.receiveSeries(series));
        return Promise.resolve();
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function saveSeries(series: Series): any {
  return (dispatch: Dispatch<any>): Promise<void | Series> => {
    return Api.saveSeries(series)
      .then((s) => {
        dispatch(actions.saveSeriesSuccess(s));
        return Promise.resolve(s);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function deleteSeries(series: Series): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.deleteSeries(series)
      .then(() => {
        dispatch(actions.deleteSeriesSuccess(series));
        return Promise.resolve();
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

// -----------------------------------------------------------------------------
// Locations
// -----------------------------------------------------------------------------

export function loadLocations(): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.getLocations()
      .then((locations) => {
        dispatch(actions.receiveLocations(locations));
        return Promise.resolve();
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function saveLocation(location: CompLocation): any {
  return (dispatch: Dispatch<any>): Promise<void | CompLocation> => {
    return Api.saveLocation(location)
      .then((location) => {
        dispatch(actions.saveLocationSuccess(location));
        return Promise.resolve(location);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function deleteLocation(location: CompLocation): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.deleteLocation(location)
      .then(() => {
        dispatch(actions.deleteLocationSuccess(location));
        return Promise.resolve();
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

// -----------------------------------------------------------------------------
// Organizers
// -----------------------------------------------------------------------------

export function loadOrganizers(): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.getOrganizers()
      .then((organizers) => {
        dispatch(actions.receiveOrganizers(organizers));
        return Promise.resolve();
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function saveOrganizer(organizer: Organizer): any {
  return (dispatch: Dispatch<any>): Promise<void | Organizer> => {
    return Api.saveOrganizer(organizer)
      .then((organizer) => {
        dispatch(actions.saveOrganizerSuccess(organizer));
        return Promise.resolve(organizer);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function deleteOrganizer(organizer: Organizer): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.deleteOrganizer(organizer)
      .then(() => {
        dispatch(actions.deleteOrganizerSuccess(organizer));
        return Promise.resolve();
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function selectOrganizer(organizer: Organizer): any {
  return (dispatch: Dispatch<any>) => {
    Api.setOrganizerId(organizer.id);
    dispatch(actions.selectOrganizer(organizer));
    localStorage.setItem("organizerId", organizer.id!.toString());
  };
}

// ************

export function loadProblems(contestId: number): any {
  return (dispatch: Dispatch<any>) => {
    Api.getProblems(contestId)
      .then((problems) => {
        dispatch(actions.receiveProblems(problems));
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
      });
  };
}

export function saveEditProblem(): any {
  return (dispatch: Dispatch<any>, getState: () => StoreState) => {
    let problem = getState().editProblem!;
    Api.saveProblem(problem)
      .then((problem) => {
        dispatch(actions.cancelEditProblem());
        loadProblems(problem.contestId)(dispatch);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
      });
  };
}

export function deleteProblem(problem: Problem): any {
  return (dispatch: Dispatch<any>) => {
    Api.deleteProblem(problem)
      .then(() => {
        dispatch(actions.cancelEditProblem());
        loadProblems(problem.contestId)(dispatch);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
      });
  };
}

export function loadCompClasses(contestId: number): any {
  return (dispatch: Dispatch<any>) => {
    Api.getCompClasses(contestId)
      .then((compClasses) => {
        dispatch(actions.receiveCompClasses(compClasses));
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
      });
  };
}

export function saveEditCompClass(): any {
  return (dispatch: Dispatch<any>, getState: () => StoreState) => {
    let compClass = getState().editCompClass!;
    Api.saveCompClass(compClass)
      .then((compClass) => {
        dispatch(actions.cancelEditCompClass());
        loadCompClasses(compClass.contestId)(dispatch);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
      });
  };
}

export function deleteCompClass(compClass: CompClass): any {
  return (dispatch: Dispatch<any>) => {
    Api.deleteCompClass(compClass)
      .then(() => {
        dispatch(actions.cancelEditCompClass());
        loadCompClasses(compClass.contestId)(dispatch);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
      });
  };
}

export function loadContendersForContest(contestId: number): any {
  return (dispatch: Dispatch<any>) => {
    Api.getContenders(contestId)
      .then((contenders) => {
        dispatch(actions.receiveContenders(contenders));
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
      });
  };
}

export function createContenders(nNewContenders: number): any {
  return (dispatch: Dispatch<any>, getState: () => StoreState) => {
    let contestId = getState().contest?.id!;
    Api.createContenders(contestId, nNewContenders)
      .then(() => {
        loadContendersForContest(contestId)(dispatch);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
      });
  };
}

export function loadContenders(): any {
  return (dispatch: Dispatch<any>, getState: () => StoreState) => {
    let contestId = getState().contest?.id!;
    dispatch(actions.receiveContenders([]));
    dispatch(actions.receiveTicks([]));
    loadContendersForContest(contestId)(dispatch);
    loadTicks(contestId)(dispatch);
  };
}

export function resetContenders(): any {
  return (dispatch: Dispatch<any>, getState: () => StoreState) => {
    let contestId = getState().contest?.id!;
    Api.resetContenders(contestId)
      .then(() => {
        loadContendersForContest(contestId)(dispatch);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
      });
  };
}

export function updateContender(contender: ContenderData): any {
  return (dispatch: Dispatch<any>, getState: () => StoreState) => {
    Api.saveContender(contender)
      .then(() => {
        dispatch(actions.updateContender(contender));
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
      });
  };
}

export function exportResults(): any {
  return (dispatch: Dispatch<any>, getState: () => StoreState) => {
    let contestId = getState().contest?.id!;
    Api.exportContest(contestId)
      .then((response) => {
        saveAs(response, "contest.xls");
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
      });
  };
}

export function createPdfFromTemplate(file: Blob): any {
  return (dispatch: Dispatch<any>, getState: () => StoreState) => {
    let contestId = getState().contest?.id!;
    let reader = new FileReader();
    dispatch(actions.setCreatingPdf(true));
    reader.onload = (evt: any) => {
      let arrayBuffer = evt.currentTarget.result;
      Api.createPdfFromTemplate(contestId, arrayBuffer)
        .then((response) => {
          dispatch(actions.setCreatingPdf(false));
          saveAs(response, "contest.pdf");
        })
        .catch((error) => {
          dispatch(actions.setCreatingPdf(false));
          dispatch(actions.setErrorMessage(error));
        });
    };
    reader.onerror = function (evt) {
      dispatch(actions.setCreatingPdf(false));
      dispatch(actions.setErrorMessage("Failed to load file:" + evt));
    };
    reader.readAsArrayBuffer(file);
  };
}

export function createPdf(): any {
  return (dispatch: Dispatch<any>, getState: () => StoreState) => {
    let contestId = getState().contest?.id!;
    dispatch(actions.setCreatingPdf(true));
    Api.createPdf(contestId)
      .then((response) => {
        dispatch(actions.setCreatingPdf(false));
        saveAs(response, "contest.pdf");
      })
      .catch((error) => {
        dispatch(actions.setCreatingPdf(false));
        dispatch(actions.setErrorMessage(error));
      });
  };
}

export function loadTicks(contestId: number): any {
  return (dispatch: Dispatch<any>) => {
    Api.getTicks(contestId)
      .then((ticks) => {
        dispatch(actions.receiveTicks(ticks));
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
      });
  };
}

export function loadRaffles(contestId: number): any {
  return (dispatch: Dispatch<any>) => {
    Api.getRaffles(contestId)
      .then((raffles) => {
        dispatch(actions.receiveRaffles(raffles));
        for (let raffle of raffles) {
          Api.getRaffleWinners(raffle).then((winners) => {
            dispatch(
              actions.receiveRaffleWinners({ raffle: raffle, winners: winners })
            );
          });
        }
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
      });
  };
}

export function createRaffle(): any {
  return (dispatch: Dispatch<any>, getState: () => StoreState) => {
    let contestId = getState().contest?.id!;
    let newRaffle: Raffle = {
      id: undefined,
      contestId: contestId,
      winners: undefined,
      active: false,
    };
    Api.saveRaffle(newRaffle)
      .then(() => {
        loadRaffles(contestId)(dispatch);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
      });
  };
}

export function activateRaffle(raffle: Raffle): any {
  return (dispatch: Dispatch<any>, getState: () => StoreState) => {
    let contestId = getState().contest?.id!;
    raffle.active = true;
    raffle.winners = undefined;
    dispatch(actions.clearRaffles());
    Api.saveRaffle(raffle)
      .then(() => {
        loadRaffles(contestId)(dispatch);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
      });
  };
}

export function deactivateRaffle(raffle: Raffle): any {
  return (dispatch: Dispatch<any>, getState: () => StoreState) => {
    let contestId = getState().contest?.id!;
    raffle.active = false;
    raffle.winners = undefined;
    dispatch(actions.clearRaffles());
    Api.saveRaffle(raffle)
      .then(() => {
        loadRaffles(contestId)(dispatch);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
      });
  };
}

export function drawWinner(raffle: Raffle): any {
  return (dispatch: Dispatch<any>) => {
    Api.drawWinner(raffle)
      .then((winner) => {
        dispatch(actions.receiveRaffleWinner(winner));
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
      });
  };
}

export function deleteRaffle(raffle: Raffle): any {
  return (dispatch: Dispatch<any>, getState: () => StoreState) => {
    let contestId = getState().contest?.id!;
    Api.deleteRaffle(raffle)
      .then(() => {
        loadRaffles(contestId)(dispatch);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
      });
  };
}

function pickOrganizer(organizers: Organizer[]): Organizer {
  let organizer: Organizer | undefined;

  let previousOrganizerId = parseInt(
    localStorage.getItem("organizerId") ?? "",
    10
  );

  if (previousOrganizerId != null) {
    organizer = organizers.find((o) => o.id === previousOrganizerId);
  }

  if (organizer == null) {
    organizer = organizers[0];
    localStorage.setItem("organizerId", organizer.id!.toString());
  }

  return organizer;
}
