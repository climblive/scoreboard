import { StoreState } from "../model/storeState";
import * as scoreboardActions from "../actions/actions";
import { ActionType, getType } from "typesafe-actions";
import { Problem } from "../model/problem";
import { SortBy } from "../constants/sortBy";

export type ScoreboardActions = ActionType<typeof scoreboardActions>;

export const reducer = (state: StoreState, action: ScoreboardActions) => {
  switch (action.type) {
    case getType(scoreboardActions.setLoggingIn):
      return { ...state, loggingIn: action.payload };

    case getType(scoreboardActions.setLoggedInUser):
      return { ...state, loggedInUser: action.payload };

    case getType(scoreboardActions.logout):
      return {
        title: "",
        loggingIn: false,
        creatingPdf: false,
        contenderSortBy: SortBy.BY_NAME,
      };

    case getType(scoreboardActions.clearErrorMessage):
      return { ...state, errorMessage: undefined };

    case getType(scoreboardActions.setErrorMessage):
      return { ...state, errorMessage: action.payload };

    case getType(scoreboardActions.setTitle):
      return { ...state, title: action.payload };

    // -------------------------------------------------------------------------
    // Contests
    // -------------------------------------------------------------------------

    case getType(scoreboardActions.receiveContests):
      return { ...state, contests: action.payload };

    case getType(scoreboardActions.updateContestSuccess): {
      let replaced = false;
      let contests = state.contests?.map((contest) => {
        if (contest.id == action.payload.id) {
          replaced = true;
          return action.payload;
        } else {
          return contest;
        }
      });

      if (!replaced) {
        contests = contests?.concat(action.payload);
      }

      if (contests == undefined) {
        contests = [action.payload];
      }

      return {
        ...state,
        contests,
      };
    }

    case getType(scoreboardActions.deleteContestSuccess):
      return {
        ...state,
        contests: state.contests?.filter(
          (contests) => contests.id != action.payload.id
        ),
      };

    // -------------------------------------------------------------------------
    // Comp Classes
    // -------------------------------------------------------------------------

    case getType(scoreboardActions.receiveCompClasses):
      return {
        ...state,
        compClasses: dedupeMerge(state.compClasses, action.payload),
      };

    case getType(scoreboardActions.updateCompClassSuccess): {
      let replaced = false;
      let compClasses = state.compClasses?.map((compClass) => {
        if (compClass.id == action.payload.id) {
          replaced = true;
          return action.payload;
        } else {
          return compClass;
        }
      });

      if (!replaced) {
        compClasses = compClasses?.concat(action.payload);
      }

      if (compClasses == undefined) {
        compClasses = [action.payload];
      }

      return { ...state, compClasses };
    }

    case getType(scoreboardActions.deleteCompClassSuccess):
      return {
        ...state,
        compClasses: state.compClasses?.filter(
          (compClass) => compClass.id != action.payload.id
        ),
      };

    // -------------------------------------------------------------------------
    // Problems
    // -------------------------------------------------------------------------

    case getType(scoreboardActions.receiveProblems):
      return {
        ...state,
        problems: dedupeMerge(state.problems, action.payload),
      };

    case getType(scoreboardActions.updateProblemSuccess): {
      let replaced = false;
      let problems = state.problems?.map((problem) => {
        if (problem.id == action.payload.id) {
          replaced = true;
          return action.payload;
        } else {
          return problem;
        }
      });

      if (!replaced) {
        problems = insertProblemAndRenumber(action.payload, problems);
      }

      if (problems == undefined) {
        problems = [action.payload];
      }

      return { ...state, problems };
    }

    case getType(scoreboardActions.deleteProblemSuccess):
      return {
        ...state,
        problems: deleteProblemAndRenumber(action.payload, state.problems),
      };

    // -------------------------------------------------------------------------
    // Contenders
    // -------------------------------------------------------------------------

    case getType(scoreboardActions.receiveContenders):
      return { ...state, contenders: action.payload };

    // -------------------------------------------------------------------------
    // Colors
    // -------------------------------------------------------------------------

    case getType(scoreboardActions.receiveColors):
      return { ...state, colors: action.payload };

    case getType(scoreboardActions.saveColorSuccess): {
      let replaced = false;
      let colors = state.colors?.map((color) => {
        if (color.id == action.payload.id) {
          replaced = true;
          return action.payload;
        } else {
          return color;
        }
      });

      if (!replaced) {
        colors = colors?.concat(action.payload);
      }

      return {
        ...state,
        colors,
      };
    }

    case getType(scoreboardActions.deleteColorSuccess):
      return {
        ...state,
        colors: state.colors?.filter(
          (colors) => colors.id != action.payload.id
        ),
      };

    // -------------------------------------------------------------------------
    // Series
    // -------------------------------------------------------------------------

    case getType(scoreboardActions.receiveSeries):
      return { ...state, series: action.payload };

    case getType(scoreboardActions.saveSeriesSuccess): {
      let replaced = false;
      let series = state.series?.map((s) => {
        if (s.id == action.payload.id) {
          replaced = true;
          return action.payload;
        } else {
          return s;
        }
      });

      if (!replaced) {
        series = series?.concat(action.payload);
      }

      return {
        ...state,
        series,
      };
    }

    case getType(scoreboardActions.deleteSeriesSuccess):
      return {
        ...state,
        series: state.series?.filter((s) => s.id != action.payload.id),
      };

    // -------------------------------------------------------------------------
    // Locations
    // -------------------------------------------------------------------------

    case getType(scoreboardActions.receiveLocations):
      return { ...state, locations: action.payload };

    case getType(scoreboardActions.saveLocationSuccess): {
      let replaced = false;
      let locations = state.locations?.map((location) => {
        if (location.id == action.payload.id) {
          replaced = true;
          return action.payload;
        } else {
          return location;
        }
      });

      if (!replaced) {
        locations = locations?.concat(action.payload);
      }

      return {
        ...state,
        locations,
      };
    }

    case getType(scoreboardActions.deleteLocationSuccess):
      return {
        ...state,
        locations: state.locations?.filter(
          (locations) => locations.id != action.payload.id
        ),
      };

    // -------------------------------------------------------------------------
    // Organizers
    // -------------------------------------------------------------------------

    case getType(scoreboardActions.receiveOrganizers):
      return { ...state, organizers: action.payload };

    case getType(scoreboardActions.saveOrganizerSuccess): {
      let replaced = false;
      let organizers = state.organizers?.map((organizer) => {
        if (organizer.id == action.payload.id) {
          replaced = true;
          return action.payload;
        } else {
          return organizer;
        }
      });

      if (!replaced) {
        organizers = organizers?.concat(action.payload);
      }

      return {
        ...state,
        organizers,
      };
    }

    case getType(scoreboardActions.deleteOrganizerSuccess):
      return {
        ...state,
        organizers: state.organizers?.filter(
          (organizer) => organizer.id != action.payload.id
        ),
      };

    case getType(scoreboardActions.selectOrganizer):
      return {
        ...state,
        selectedOrganizer: action.payload,
        contests: undefined,
        problems: undefined,
        compClasses: undefined,
        contenders: undefined,
        raffles: undefined,
        colors: undefined,
        locations: undefined,
        series: undefined,
        ticks: undefined,
      };

    // -------------------------------------------------------------------------
    // Ticks
    // -------------------------------------------------------------------------

    case getType(scoreboardActions.receiveTicks):
      return { ...state, ticks: dedupeMerge(state.ticks, action.payload) };

    // -------------------------------------------------------------------------
    // Contenders
    // -------------------------------------------------------------------------

    case getType(scoreboardActions.receiveContenders):
      return {
        ...state,
        contenders: dedupeMerge(state.contenders, action.payload),
      };

    case getType(scoreboardActions.updateContenderSuccess): {
      let replaced = false;
      let contenders = state.contenders?.map((contender) => {
        if (contender.id == action.payload.id) {
          replaced = true;
          return action.payload;
        } else {
          return contender;
        }
      });

      if (!replaced) {
        contenders = contenders?.concat(action.payload);
      }

      if (contenders == undefined) {
        contenders = [action.payload];
      }

      return { ...state, contenders };
    }

    // -------------------------------------------------------------------------
    // Raffles
    // -------------------------------------------------------------------------

    case getType(scoreboardActions.receiveRaffles):
      return { ...state, raffles: dedupeMerge(state.raffles, action.payload) };

    case getType(scoreboardActions.saveRaffleSuccess): {
      let replaced = false;
      let raffles = state.raffles?.map((raffle) => {
        if (raffle.id == action.payload.id) {
          replaced = true;
          return action.payload;
        } else {
          return raffle;
        }
      });

      if (!replaced) {
        raffles = raffles?.concat(action.payload);
      }

      if (raffles == undefined) {
        raffles = [action.payload];
      }

      return { ...state, raffles };
    }

    case getType(scoreboardActions.deleteRaffleSuccess):
      return {
        ...state,
        raffles: state.raffles?.filter(
          (raffle) => raffle.id != action.payload.id
        ),
      };

    case getType(scoreboardActions.receiveRaffleWinners): {
      let raffles = state.raffles?.map((raffle) => {
        if ((raffle.id = action.payload.raffle.id)) {
          let winners = dedupeMerge(
            raffle.winners ?? [],
            action.payload.winners
          );
          return { ...raffle, winners };
        } else {
          return raffle;
        }
      });

      return { ...state, raffles };
    }

    case getType(scoreboardActions.receiveRaffleWinner): {
      let raffles = state.raffles?.map((raffle) => {
        if ((raffle.id = action.payload.raffleId)) {
          let winners = dedupeMerge(raffle.winners ?? [], [action.payload]);
          return { ...raffle, winners };
        } else {
          return raffle;
        }
      });

      return { ...state, raffles };
    }

    default:
      return state;
  }
};

const dedupeMerge = <T extends unknown>(
  arr1: T[] | undefined,
  arr2: T[],
  property: string = "id"
): T[] => {
  if (arr1 == undefined) {
    return arr2;
  }

  let map = {};

  arr1?.forEach((object) => {
    map[object[property]] = object;
  });

  arr2.forEach((object) => {
    map[object[property]] = object;
  });

  return Object.values(map);
};

const insertProblemAndRenumber = (
  problem: Problem,
  problems: Problem[] | undefined
) => {
  const renumberingCondition = (subject: Problem) =>
    subject.contestId == problem.contestId && subject.number >= problem.number;

  return problems
    ?.map((problem) => {
      if (renumberingCondition(problem)) {
        return { ...problem, number: problem.number + 1 };
      } else {
        return problem;
      }
    })
    .concat(problem);
};

const deleteProblemAndRenumber = (
  problem: Problem,
  problems: Problem[] | undefined
) => {
  const renumberingCondition = (subject: Problem) =>
    subject.contestId == problem.contestId && subject.number > problem.number;

  return problems
    ?.filter((p) => p.id != problem.id)
    ?.map((problem) => {
      if (renumberingCondition(problem)) {
        return { ...problem, number: problem.number - 1 };
      } else {
        return problem;
      }
    });
};
