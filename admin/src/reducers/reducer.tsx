import { StoreState } from "../model/storeState";
import * as scoreboardActions from "../actions/actions";
import { ActionType, getType } from "typesafe-actions";
import { Color } from "../model/color";
import { Problem } from "../model/problem";
import { CompLocation } from "../model/compLocation";
import { CompClass } from "../model/compClass";
import { Contest } from "../model/contest";
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

    case getType(scoreboardActions.setCreatingPdf):
      return { ...state, creatingPdf: action.payload };

    case getType(scoreboardActions.receiveContests):
      return { ...state, contests: action.payload };

    case getType(scoreboardActions.clearErrorMessage):
      return { ...state, errorMessage: undefined };

    case getType(scoreboardActions.setErrorMessage):
      return { ...state, errorMessage: action.payload };

    case getType(scoreboardActions.setTitle):
      return { ...state, title: action.payload };

    case getType(scoreboardActions.receiveContest):
      return { ...state, contest: action.payload };

    case getType(scoreboardActions.clearContests):
      return { ...state, contests: undefined };

    case getType(scoreboardActions.clearContest):
      return {
        ...state,
        contest: undefined,
        compClasses: undefined,
        editCompClass: undefined,
        contenders: undefined,
        problems: undefined,
        raffles: undefined,
        editProblem: undefined,
        ticks: undefined,
      };

    case getType(scoreboardActions.setNewContest):
      let contest: Contest = {
        id: undefined,
        name: "",
        protected: false,
        description: "",
        organizerId: state.selectedOrganizer?.id!,
        finalEnabled: false,
        qualifyingProblems: 10,
        finalists: 7,
        gracePeriod: 15,
        rules: "",
      };

      return {
        ...state,
        contest,
        compClasses: undefined,
        editCompClass: undefined,
        contenders: undefined,
        problems: undefined,
        raffles: undefined,
        editProblem: undefined,
        ticks: undefined,
      };

    case getType(scoreboardActions.updateContest):
      let newContest = { ...state.contest! };
      newContest[action.payload.propName] = action.payload.value;
      return { ...state, contest: newContest };

    case getType(scoreboardActions.deleteContest):
      let contests = state.contests?.filter(
        (contest) => contest.id != action.payload.id
      );
      return { ...state, contest: undefined, contests };

    // ********

    case getType(scoreboardActions.receiveCompClasses):
      return {
        ...state,
        compClasses: action.payload.sort((a, b) => (a.id ?? 0) - (b.id ?? 0)),
      };

    case getType(scoreboardActions.clearCompClasses):
      return { ...state, compClasses: undefined, editCompClass: undefined };

    case getType(scoreboardActions.startEditCompClass):
      return { ...state, editCompClass: action.payload };

    case getType(scoreboardActions.cancelEditCompClass):
      const newCompClasses1 = state.compClasses!.filter(
        (p2) => p2.id != undefined
      );
      return {
        ...state,
        editCompClass: undefined,
        compClasses: newCompClasses1,
      };

    case getType(scoreboardActions.startAddCompClass):
      const newCompClasses: CompClass[] = [...state.compClasses!];
      let newCompClass: CompClass = {
        id: undefined,
        contestId: state.contest?.id!,
        name: "",
        description: "",
        timeBegin: new Date().toISOString(),
        timeEnd: new Date().toISOString(),
      };
      newCompClasses.push(newCompClass);
      return {
        ...state,
        editCompClass: newCompClass,
        compClasses: newCompClasses,
      };

    case getType(scoreboardActions.updateEditCompClass):
      let newEditCompClass = { ...state.editCompClass! };
      newEditCompClass[action.payload.propName] = action.payload.value;
      return { ...state, editCompClass: newEditCompClass };

    // ********

    case getType(scoreboardActions.receiveProblems):
      const problems2: Problem[] = action.payload.sort(
        (a, b) => (a.number || 0) - (b.number || 0)
      );
      let editProblem: Problem | undefined = undefined;
      if (problems2.length == 0) {
        editProblem = {
          id: undefined,
          contestId: state.contest?.id!,
          number: 1,
        };
        problems2.push(editProblem);
      }
      return { ...state, problems: problems2, editProblem: editProblem };

    case getType(scoreboardActions.clearProblems):
      return { ...state, problems: undefined, editProblem: undefined };

    case getType(scoreboardActions.startEditProblem):
      return { ...state, editProblem: action.payload };

    case getType(scoreboardActions.cancelEditProblem):
      const newProblems1 = state.problems!.filter((p1) => p1.id != undefined);
      return { ...state, editProblem: undefined, problems: newProblems1 };

    case getType(scoreboardActions.startAddProblem):
      const problem = action.payload;
      const newProblems: Problem[] = [];
      let newProblem: Problem = {
        id: undefined,
        contestId: state.contest?.id!,
        number: undefined,
      };
      for (let p of state.problems!) {
        newProblems.push(p);
        if (p.id == problem.id) {
          newProblem.number = (p.number ?? 0) + 1;
          newProblems.push(newProblem);
        }
      }
      return { ...state, editProblem: newProblem, problems: newProblems };

    case getType(scoreboardActions.updateEditProblem):
      let newEditProblem = { ...state.editProblem! };
      newEditProblem[action.payload.propName] = action.payload.value;
      return { ...state, editProblem: newEditProblem };

    case getType(scoreboardActions.receiveContenders):
      return { ...state, contenders: action.payload };

    // -------------------------------------------------------------------------
    // Colors
    // -------------------------------------------------------------------------

    case getType(scoreboardActions.receiveColors):
      return { ...state, colors: action.payload };

    case getType(scoreboardActions.saveColorSuccess):
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
        colors?.push(action.payload);
      }

      return {
        ...state,
        colors,
      };

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

    case getType(scoreboardActions.saveSeriesSuccess):
      replaced = false;
      let series = state.series?.map((s) => {
        if (s.id == action.payload.id) {
          replaced = true;
          return action.payload;
        } else {
          return s;
        }
      });

      if (!replaced) {
        series?.push(action.payload);
      }

      return {
        ...state,
        series,
      };

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

    case getType(scoreboardActions.saveLocationSuccess):
      replaced = false;
      let locations = state.locations?.map((location) => {
        if (location.id == action.payload.id) {
          replaced = true;
          return action.payload;
        } else {
          return location;
        }
      });

      if (!replaced) {
        locations?.push(action.payload);
      }

      return {
        ...state,
        locations,
      };

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

    case getType(scoreboardActions.saveOrganizerSuccess):
      replaced = false;
      let organizers = state.organizers?.map((organizer) => {
        if (organizer.id == action.payload.id) {
          replaced = true;
          return action.payload;
        } else {
          return organizer;
        }
      });

      if (!replaced) {
        organizers?.push(action.payload);
      }

      return {
        ...state,
        organizers,
      };

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

    // ********

    case getType(scoreboardActions.receiveTicks):
      return { ...state, ticks: action.payload };

    case getType(scoreboardActions.setContenderFilterCompClass):
      return {
        ...state,
        contenderFilterCompClassId: action.payload
          ? action.payload.id
          : undefined,
      };

    case getType(scoreboardActions.setContenderSortBy):
      return { ...state, contenderSortBy: action.payload };

    case getType(scoreboardActions.updateContender):
      return {
        ...state,
        contenders: state.contenders?.map((contender) => {
          if (contender.id == action.payload.id) {
            return action.payload;
          } else {
            return contender;
          }
        }),
      };

    case getType(scoreboardActions.receiveRaffles):
      return { ...state, raffles: action.payload };

    case getType(scoreboardActions.clearRaffles):
      return { ...state, raffles: undefined };

    case getType(scoreboardActions.receiveRaffleWinners):
      const newRaffles = [...state.raffles!];
      const index = newRaffles.findIndex(
        (r) => r.id == action.payload.raffle.id
      );
      if (index != -1) {
        const newRaffle = { ...newRaffles[index] };
        newRaffle.winners = action.payload.winners.reverse();
        newRaffles[index] = newRaffle;
      }
      return { ...state, raffles: newRaffles };

    case getType(scoreboardActions.receiveRaffleWinner):
      const newRaffles2 = [...state.raffles!];
      const index2 = newRaffles2.findIndex(
        (r) => r.id == action.payload.raffleId
      );
      if (index2 != -1) {
        const newRaffle2 = { ...newRaffles2[index2] };
        newRaffle2.winners = [action.payload, ...newRaffle2.winners!];
        newRaffles2[index2] = newRaffle2;
      }
      return { ...state, raffles: newRaffles2 };

    default:
      return state;
  }
};
