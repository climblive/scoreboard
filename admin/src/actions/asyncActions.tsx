import { OrderedMap } from "immutable";
import { Dispatch } from "redux";
import { ContenderData } from "src/model/contenderData";
import { RaffleWinner } from "src/model/raffleWinner";
import { ScoreboardActions } from "src/reducers/reducer";
import { Color } from "../model/color";
import { CompClass } from "../model/compClass";
import { CompLocation } from "../model/compLocation";
import { Contest } from "../model/contest";
import { Organizer } from "../model/organizer";
import { Problem } from "../model/problem";
import { Raffle } from "../model/raffle";
import { Series } from "../model/series";
import { StoreState } from "../model/storeState";
import { Api } from "../utils/Api";
import * as actions from "./actions";

export function login(code: string) {
  return (
    dispatch: Dispatch<ScoreboardActions>,
    getState: () => StoreState
  ) => {
    dispatch(actions.setLoggingIn(true));
    Api.setCredentials(code);
    Api.getUser()
      .then((userData) => {
        localStorage.setItem("credentials", code);

        reloadOrganizers()(dispatch).then(() => {
          let organizer: Organizer = pickOrganizer(getState().organizers!);
          Api.setOrganizerId(organizer.id);
          dispatch(actions.selectOrganizer(organizer.id!));

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

export function reloadContests() {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<void> => {
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

export function loadContest(contestId: number) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<Contest> => {
    return Api.getContest(contestId)
      .then((contest) => {
        dispatch(actions.updateContestSuccess(contest));

        return Promise.all([
          loadCompClasses(contestId)(dispatch),
          loadProblems(contestId)(dispatch),
          loadContenders(contestId)(dispatch),
          loadRaffles(contestId)(dispatch),
          loadTicks(contestId)(dispatch),
        ]).then(() => contest);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function saveContest(contest: Contest) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<Contest> => {
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

export function deleteContest(contest: Contest) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<void> => {
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

export function reloadColors() {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<void> => {
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

export function saveColor(color: Color) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<Color> => {
    return Api.saveColor(color)
      .then((color) => {
        dispatch(actions.updateColorSuccess(color));
        return Promise.resolve(color);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function deleteColor(color: Color) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<void> => {
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

export function reloadSeries() {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<void> => {
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

export function saveSeries(series: Series) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<Series> => {
    return Api.saveSeries(series)
      .then((s) => {
        dispatch(actions.updateSeriesSuccess(s));
        return Promise.resolve(s);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function deleteSeries(series: Series) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<void> => {
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

export function reloadLocations() {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<void> => {
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

export function saveLocation(location: CompLocation) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<CompLocation> => {
    return Api.saveLocation(location)
      .then((location) => {
        dispatch(actions.updateLocationSuccess(location));
        return Promise.resolve(location);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function deleteLocation(location: CompLocation) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<void> => {
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

export function reloadOrganizers() {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<void> => {
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

export function saveOrganizer(organizer: Organizer) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<Organizer> => {
    return Api.saveOrganizer(organizer)
      .then((organizer) => {
        dispatch(actions.updateOrganizerSuccess(organizer));
        return Promise.resolve(organizer);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function deleteOrganizer(organizer: Organizer) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<void> => {
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

export function selectOrganizer(organizerId: number) {
  return (dispatch: Dispatch<ScoreboardActions>) => {
    Api.setOrganizerId(organizerId);
    dispatch(actions.selectOrganizer(organizerId));
    localStorage.setItem("organizerId", organizerId.toString());
  };
}

// -----------------------------------------------------------------------------
// Problems
// -----------------------------------------------------------------------------

export function loadProblems(contestId: number) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<void> => {
    return Api.getProblems(contestId)
      .then((problems) => {
        dispatch(actions.receiveProblemsForContest({ contestId, problems }));
        return Promise.resolve();
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function saveProblem(problem: Problem) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<Problem> => {
    return Api.saveProblem(problem)
      .then((problem) => {
        dispatch(actions.updateProblemSuccess(problem));
        return loadProblems(problem.contestId)(dispatch).then(() => problem);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function deleteProblem(problem: Problem) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<void> => {
    return Api.deleteProblem(problem)
      .then(() => {
        dispatch(actions.deleteProblemSuccess(problem));
        return loadProblems(problem.contestId)(dispatch);
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

export function loadCompClasses(contestId: number) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<void> => {
    return Api.getCompClasses(contestId)
      .then((compClasses) => {
        dispatch(
          actions.receiveCompClassesForContest({ contestId, compClasses })
        );
        return Promise.resolve();
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function saveCompClass(compClass: CompClass) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<CompClass> => {
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

export function deleteCompClass(compClass: CompClass) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<void> => {
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

export function createContenders(contestId: number, nNewContenders: number) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<void> => {
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

export function loadContenders(contestId: number) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<void> => {
    return Api.getContenders(contestId)
      .then((contenders) => {
        dispatch(
          actions.receiveContendersForContest({ contestId, contenders })
        );
        return Promise.resolve();
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function resetContenders(contestId: number) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<void> => {
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

export function updateContender(contender: ContenderData) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<ContenderData> => {
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

export function loadTicks(contestId: number) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<void> => {
    return Api.getTicks(contestId)
      .then((ticks) => {
        dispatch(actions.receiveTicksForContest({ contestId, ticks }));
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

export function loadRaffles(contestId: number) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<void> => {
    return Api.getRaffles(contestId)
      .then((raffles) => {
        dispatch(actions.receiveRafflesForContest({ contestId, raffles }));

        return Promise.all(
          raffles.map((raffle) => Api.getRaffleWinners(raffle))
        );
      })
      .then((w: RaffleWinner[][]) => {
        dispatch(
          actions.receiveRaffleWinners(
            ([] as RaffleWinner[]).concat.apply([], w)
          )
        );
        return Promise.resolve();
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function saveRaffle(raffle: Raffle) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<Raffle> => {
    return Api.saveRaffle(raffle)
      .then((raffle) => {
        dispatch(actions.updateRaffleSuccess(raffle));
        return Promise.resolve(raffle);
      })
      .catch((error) => {
        dispatch(actions.setErrorMessage(error));
        return Promise.reject(error);
      });
  };
}

export function drawWinner(raffle: Raffle) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<RaffleWinner> => {
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

export function deleteRaffle(raffle: Raffle) {
  return (dispatch: Dispatch<ScoreboardActions>): Promise<Raffle> => {
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

function pickOrganizer(organizers: OrderedMap<number, Organizer>): Organizer {
  let organizer: Organizer | undefined;

  let previousOrganizerId = parseInt(
    localStorage.getItem("organizerId") ?? "",
    10
  );

  if (previousOrganizerId != null) {
    organizer = organizers.get(previousOrganizerId);
  }

  if (organizer == null) {
    organizer = organizers.first();
  }

  if (organizer != null) {
    localStorage.setItem("organizerId", organizer.id!.toString());
  }

  return organizer!;
}
