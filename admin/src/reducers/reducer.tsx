import { Map, OrderedMap } from "immutable";
import { Reducer } from "redux";
import { CompClass } from "src/model/compClass";
import { ContenderData } from "src/model/contenderData";
import { Raffle } from "src/model/raffle";
import { Tick } from "src/model/tick";
import { ActionType, getType } from "typesafe-actions";
import * as scoreboardActions from "../actions/actions";
import initialStore from "../initialState";
import initialState from "../initialState";
import { Color } from "../model/color";
import { Contest } from "../model/contest";
import { Organizer } from "../model/organizer";
import { Problem } from "../model/problem";
import { Series } from "../model/series";
import { StoreState } from "../model/storeState";
import { RaffleWinner } from "../model/raffleWinner";

export type ScoreboardActions = ActionType<typeof scoreboardActions>;

export const reducer: Reducer<StoreState | undefined, ScoreboardActions> = (
  state: StoreState | undefined = initialStore,
  action: ScoreboardActions
): StoreState => {
  switch (action.type) {
    case getType(scoreboardActions.setLoggingIn):
      return { ...state, loggingIn: action.payload };

    case getType(scoreboardActions.setLoggedInUser):
      return { ...state, loggedInUser: action.payload };

    case getType(scoreboardActions.logout):
      return initialState;

    case getType(scoreboardActions.clearErrorMessage):
      return { ...state, errorMessage: undefined };

    case getType(scoreboardActions.setErrorMessage):
      return { ...state, errorMessage: action.payload.toString() };

    case getType(scoreboardActions.setTitle):
      return { ...state, title: action.payload };

    // -------------------------------------------------------------------------
    // Contests
    // -------------------------------------------------------------------------

    case getType(scoreboardActions.replaceContests):
      return {
        ...state,
        contests: OrderedMap<number, Contest>(
          action.payload.map((contest) => [contest.id, contest])
        ),
      };

    case getType(scoreboardActions.updateContestSuccess): {
      let contests = state.contests;

      if (contests === undefined) {
        contests = OrderedMap<number, Contest>();
      }

      return {
        ...state,
        contests: contests.set(action.payload.id!, action.payload),
      };
    }

    case getType(scoreboardActions.deleteContestSuccess):
      return {
        ...state,
        contests: state.contests?.delete(action.payload.id!),
      };

    // -------------------------------------------------------------------------
    // Comp Classes
    // -------------------------------------------------------------------------

    case getType(scoreboardActions.receiveCompClassesForContest):
      return {
        ...state,
        compClassesByContest: state.compClassesByContest.setIn(
          [action.payload.contestId],
          OrderedMap(
            action.payload.compClasses.map((compClass) => [
              compClass.id!,
              compClass,
            ])
          )
        ),
      };

    case getType(scoreboardActions.updateCompClassSuccess):
      return {
        ...state,
        compClassesByContest: state.compClassesByContest.setIn(
          [action.payload.contestId, action.payload.id],
          action.payload
        ),
      };

    case getType(scoreboardActions.deleteCompClassSuccess):
      return {
        ...state,
        compClassesByContest: state.compClassesByContest.deleteIn([
          action.payload.contestId,
          action.payload.id,
        ]),
      };

    // -------------------------------------------------------------------------
    // Problems
    // -------------------------------------------------------------------------

    case getType(scoreboardActions.receiveProblemsForContest):
      return {
        ...state,
        problemsByContest: state.problemsByContest.setIn(
          [action.payload.contestId],
          OrderedMap(
            action.payload.problems.map((problem) => [problem.id!, problem])
          )
        ),
      };

    case getType(scoreboardActions.updateProblemSuccess):
      return {
        ...state,
        problemsByContest: state.problemsByContest.setIn(
          [action.payload.contestId, action.payload.id],
          action.payload
        ),
      };

    case getType(scoreboardActions.deleteProblemSuccess):
      return {
        ...state,
        problemsByContest: state.problemsByContest.deleteIn([
          action.payload.contestId,
          action.payload.id,
        ]),
      };

    // -------------------------------------------------------------------------
    // Colors
    // -------------------------------------------------------------------------

    case getType(scoreboardActions.replaceColors):
      return {
        ...state,
        colors: OrderedMap<number, Color>(
          action.payload.map((color) => [color.id, color])
        ),
      };

    case getType(scoreboardActions.updateColorSuccess): {
      let colors = state.colors;

      if (colors === undefined) {
        colors = OrderedMap<number, Color>();
      }

      return {
        ...state,
        colors: state.colors?.set(action.payload.id!, action.payload),
      };
    }

    case getType(scoreboardActions.deleteColorSuccess):
      return {
        ...state,
        colors: state.colors?.delete(action.payload.id!),
      };

    // -------------------------------------------------------------------------
    // Series
    // -------------------------------------------------------------------------

    case getType(scoreboardActions.replaceSeries):
      return {
        ...state,
        series: OrderedMap<number, Series>(
          action.payload.map((series) => [series.id, series])
        ),
      };

    case getType(scoreboardActions.updateSeriesSuccess): {
      let series = state.series;

      if (series === undefined) {
        series = OrderedMap<number, Series>();
      }

      return {
        ...state,
        series: series.set(action.payload.id!, action.payload),
      };
    }

    case getType(scoreboardActions.deleteSeriesSuccess):
      return {
        ...state,
        series: state.series?.delete(action.payload.id!),
      };

    // -------------------------------------------------------------------------
    // Organizers
    // -------------------------------------------------------------------------

    case getType(scoreboardActions.replaceOrganizers):
      return {
        ...state,
        organizers: OrderedMap<number, Organizer>(
          action.payload.map((organizer) => [organizer.id, organizer])
        ),
      };

    case getType(scoreboardActions.updateOrganizerSuccess): {
      let organizers = state.organizers;

      if (organizers === undefined) {
        organizers = OrderedMap<number, Organizer>();
      }

      return {
        ...state,
        organizers: organizers.set(action.payload.id!, action.payload),
      };
    }

    case getType(scoreboardActions.deleteOrganizerSuccess):
      return {
        ...state,
        organizers: state.organizers?.delete(action.payload.id!),
      };

    case getType(scoreboardActions.selectOrganizer):
      return {
        ...state,
        selectedOrganizerId: action.payload,
        contests: undefined,
        colors: undefined,
        series: undefined,
        compClassesByContest: Map<number, OrderedMap<number, CompClass>>(),
        rafflesByContest: Map<number, OrderedMap<number, Raffle>>(),
        contendersByContest: Map<number, OrderedMap<number, ContenderData>>(),
        problemsByContest: Map<number, OrderedMap<number, Problem>>(),
        ticksByContest: Map<number, OrderedMap<number, Tick>>(),
        raffleWinnersByRaffle: Map<number, OrderedMap<number, RaffleWinner>>(),
      };

    // -------------------------------------------------------------------------
    // Ticks
    // -------------------------------------------------------------------------

    case getType(scoreboardActions.receiveTicksForContest):
      return {
        ...state,
        ticksByContest: state.ticksByContest.setIn(
          [action.payload.contestId],
          OrderedMap(action.payload.ticks.map((tick) => [tick.id!, tick]))
        ),
      };

    // -------------------------------------------------------------------------
    // Contenders
    // -------------------------------------------------------------------------

    case getType(scoreboardActions.receiveContendersForContest):
      return {
        ...state,
        contendersByContest: state.contendersByContest.setIn(
          [action.payload.contestId],
          OrderedMap(
            action.payload.contenders.map((contender) => [
              contender.id!,
              contender,
            ])
          )
        ),
      };

    case getType(scoreboardActions.updateContenderSuccess):
      return {
        ...state,
        contendersByContest: state.contendersByContest.setIn(
          [action.payload.contestId, action.payload.id],
          action.payload
        ),
      };

    // -------------------------------------------------------------------------
    // Raffles
    // -------------------------------------------------------------------------

    case getType(scoreboardActions.receiveRafflesForContest):
      return {
        ...state,
        rafflesByContest: state.rafflesByContest.setIn(
          [action.payload.contestId],
          OrderedMap(
            action.payload.raffles.map((raffle) => [raffle.id!, raffle])
          )
        ),
      };

    case getType(scoreboardActions.updateRaffleSuccess):
      return {
        ...state,
        rafflesByContest: state.rafflesByContest.setIn(
          [action.payload.contestId, action.payload.id],
          action.payload
        ),
      };

    case getType(scoreboardActions.deleteRaffleSuccess):
      return {
        ...state,
        rafflesByContest: state.rafflesByContest.deleteIn([
          action.payload.contestId,
          action.payload.id,
        ]),
      };

    case getType(scoreboardActions.receiveRaffleWinnersForRaffle):
      return {
        ...state,
        raffleWinnersByRaffle: state.raffleWinnersByRaffle.setIn(
          [action.payload.raffleId],
          OrderedMap(
            action.payload.raffleWinners.map((winner) => [winner.id!, winner])
          )
        ),
      };

    case getType(scoreboardActions.receiveRaffleWinner):
      return {
        ...state,
        raffleWinnersByRaffle: state.raffleWinnersByRaffle.setIn(
          [action.payload.raffleId, action.payload.id],
          action.payload
        ),
      };

    default:
      return state;
  }
};
