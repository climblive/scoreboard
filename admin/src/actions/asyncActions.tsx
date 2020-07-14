import { Problem } from "../model/problem";
import { Dispatch } from "redux";
import { Api } from "../utils/Api";
import * as actions from "./actions";
import { Contest } from "../model/contest";
import { StoreState } from "../model/storeState";
import { CompClass } from "../model/compClass";
import { Color } from "../model/color";
import { Series } from "../model/series";
import { Organizer } from "../model/organizer";
import { CompLocation } from "../model/compLocation";
import { Raffle } from "../model/raffle";
import { ContenderData } from "src/model/contenderData";
import { RaffleWinner } from "src/model/raffleWinner";

export function login(code: string): any {
  return (dispatch: Dispatch<any>, getState: () => StoreState) => {
    dispatch(actions.setLoggingIn(true));
    Api.setCredentials(code);
    Api.getUser()
      .then((userData) => {
        localStorage.setItem("credentials", code);

        reloadOrganizers()(dispatch).then(() => {
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

// -----------------------------------------------------------------------------
// Contests
// -----------------------------------------------------------------------------

export function reloadContests(): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.getContests()
      .then((contests) => {
        dispatch(actions.replaceContests(contests));
        return Promise.resolve();
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function loadContest(contestId: number): any {
  return (dispatch: Dispatch<any>): Promise<Contest> => {
    return Api.getContest(contestId)
      .then((contest) => {
        dispatch(actions.updateContestSuccess(contest));
        return Promise.resolve(contest);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function saveContest(contest: Contest): any {
  return (dispatch: Dispatch<any>): Promise<void | Contest> => {
    return Api.saveContest(contest)
      .then((contest) => {
        dispatch(actions.updateContestSuccess(contest));
        return Promise.resolve(contest);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function deleteContest(contest: Contest): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.deleteContest(contest)
      .then(() => {
        dispatch(actions.deleteContestSuccess(contest));
        return Promise.resolve();
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

// -----------------------------------------------------------------------------
// Colors
// -----------------------------------------------------------------------------

export function reloadColors(): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.getColors()
      .then((colors) => {
        dispatch(actions.replaceColors(colors));
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

export function reloadSeries(): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.getSeries()
      .then((series) => {
        dispatch(actions.replaceSeries(series));
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

export function reloadLocations(): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.getLocations()
      .then((locations) => {
        dispatch(actions.replaceLocations(locations));
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

export function reloadOrganizers(): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.getOrganizers()
      .then((organizers) => {
        dispatch(actions.replaceOrganizers(organizers));
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

// -----------------------------------------------------------------------------
// Problems
// -----------------------------------------------------------------------------

export function loadProblems(contestId: number): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.getProblems(contestId)
      .then((problems) => {
        dispatch(actions.receiveProblems(problems));
        return Promise.resolve();
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function saveProblem(problem: Problem): any {
  return (dispatch: Dispatch<any>): Promise<Problem> => {
    return Api.saveProblem(problem)
      .then((problem) => {
        dispatch(actions.updateProblemSuccess(problem));
        return Promise.resolve(problem);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function deleteProblem(problem: Problem): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.deleteProblem(problem)
      .then(() => {
        dispatch(actions.deleteProblemSuccess(problem));
        return Promise.resolve();
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

// -----------------------------------------------------------------------------
// Comp Classes
// -----------------------------------------------------------------------------

export function loadCompClasses(contestId: number): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.getCompClasses(contestId)
      .then((compClasses) => {
        dispatch(actions.receiveCompClasses(compClasses));
        return Promise.resolve();
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function saveCompClass(compClass: CompClass): any {
  return (dispatch: Dispatch<any>): Promise<CompClass> => {
    return Api.saveCompClass(compClass)
      .then((compClass) => {
        dispatch(actions.updateCompClassSuccess(compClass));
        return Promise.resolve(compClass);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function deleteCompClass(compClass: CompClass): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.deleteCompClass(compClass)
      .then(() => {
        dispatch(actions.deleteCompClassSuccess(compClass));
        return Promise.resolve();
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

// -----------------------------------------------------------------------------
// Contenders
// -----------------------------------------------------------------------------

export function createContenders(
  contestId: number,
  nNewContenders: number
): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.createContenders(contestId, nNewContenders)
      .then(() => {
        return loadContenders(contestId)(dispatch);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function loadContenders(contestId: number): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.getContenders(contestId)
      .then((contenders) => {
        dispatch(actions.receiveContenders(contenders));
        return Promise.resolve();
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function resetContenders(contestId: number): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.resetContenders(contestId)
      .then(() => {
        return loadContenders(contestId)(dispatch);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function updateContender(contender: ContenderData): any {
  return (dispatch: Dispatch<any>): Promise<ContenderData> => {
    return Api.saveContender(contender)
      .then(() => {
        dispatch(actions.updateContenderSuccess(contender));
        return Promise.resolve(contender);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

// -----------------------------------------------------------------------------
// Ticks
// -----------------------------------------------------------------------------

export function loadTicks(contestId: number): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.getTicks(contestId)
      .then((ticks) => {
        dispatch(actions.receiveTicks(ticks));
        return Promise.resolve();
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

// -----------------------------------------------------------------------------
// Raffles
// -----------------------------------------------------------------------------

export function loadRaffles(contestId: number): any {
  return (dispatch: Dispatch<any>): Promise<void> => {
    return Api.getRaffles(contestId)
      .then((raffles) => {
        dispatch(actions.receiveRaffles(raffles));
        for (let raffle of raffles) {
          Api.getRaffleWinners(raffle).then((winners) => {
            dispatch(
              actions.receiveRaffleWinners({ raffle: raffle, winners: winners })
            );
          });
        }
        return Promise.resolve();
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function saveRaffle(raffle: Raffle): any {
  return (dispatch: Dispatch<any>): Promise<Raffle> => {
    return Api.saveRaffle(raffle)
      .then((raffle) => {
        dispatch(actions.saveRaffleSuccess(raffle));
        return Promise.resolve(raffle);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function drawWinner(raffle: Raffle): any {
  return (dispatch: Dispatch<any>): Promise<RaffleWinner> => {
    return Api.drawWinner(raffle)
      .then((winner) => {
        dispatch(actions.receiveRaffleWinner(winner));
        return Promise.resolve(winner);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function deleteRaffle(raffle: Raffle): any {
  return (dispatch: Dispatch<any>): Promise<Raffle> => {
    return Api.deleteRaffle(raffle)
      .then(() => {
        dispatch(actions.deleteRaffleSuccess(raffle));
        return Promise.resolve(raffle);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
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
