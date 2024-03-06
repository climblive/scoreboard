import { createStandardAction } from "typesafe-actions";
import { CompClass } from "../model/compClass";
import { ContenderData } from "../model/contenderData";
import { Contest } from "../model/contest";
import { Organizer } from "../model/organizer";
import { Problem } from "../model/problem";
import { Raffle } from "../model/raffle";
import { RaffleWinner } from "../model/raffleWinner";
import { Series } from "../model/series";
import { Tick } from "../model/tick";
import { User } from "../model/user";

export const setErrorMessage =
  createStandardAction("SET_ERROR_MESSAGE")<Object>();
export const clearErrorMessage = createStandardAction("CLEAR_ERROR_MESSAGE")();
export const setTitle = createStandardAction("SET_TITLE")<string>();
export const setLoggingIn = createStandardAction("SET_LOGGING_IN")<boolean>();
export const setLoggedInUser =
  createStandardAction("SET_LOGGED_IN_USER")<User>();
export const logout = createStandardAction("LOGOUT")();

// =============================================================================
// Contests
// =============================================================================

export const replaceContests =
  createStandardAction("REPLACE_CONTESTS")<Contest[]>();
export const updateContestSuccess = createStandardAction(
  "UPDATE_CONTEST_SUCCESS"
)<Contest>();
export const deleteContestSuccess = createStandardAction(
  "DELETE_CONTEST_SUCCESS"
)<Contest>();

// =============================================================================
// Organizers
// =============================================================================

export const replaceOrganizers =
  createStandardAction("REPLACE_ORGANIZERS")<Organizer[]>();
export const updateOrganizerSuccess = createStandardAction(
  "UPDATE_ORGANIZER_SUCCESS"
)<Organizer>();
export const deleteOrganizerSuccess = createStandardAction(
  "DELETE_ORGANIZER_SUCCESS"
)<Organizer>();
export const selectOrganizer =
  createStandardAction("SELECT_ORGANIZER")<number>();

// =============================================================================
// Series
// =============================================================================

export const replaceSeries = createStandardAction("REPLACE_SERIES")<Series[]>();
export const updateSeriesSuccess = createStandardAction(
  "UPDATE_SERIES_SUCCESS"
)<Series>();
export const deleteSeriesSuccess = createStandardAction(
  "DELETE_SERIES_SUCCESS"
)<Series>();

// =============================================================================
// Comp Classes
// =============================================================================

export const receiveCompClassesForContest = createStandardAction(
  "RECEIVE_COMP_CLASSES_FOR_CONTEST"
)<{ contestId: number; compClasses: CompClass[] }>();
export const updateCompClassSuccess = createStandardAction(
  "UPDATE_COMP_CLASS_SUCCESS"
)<CompClass>();
export const deleteCompClassSuccess = createStandardAction(
  "DELETE_COMP_CLASS_SUCCESS"
)<CompClass>();

// =============================================================================
// Problems
// =============================================================================

export const receiveProblemsForContest = createStandardAction(
  "RECEIVE_PROBLEMS_FOR_CONTEST"
)<{ contestId: number; problems: Problem[] }>();
export const updateProblemSuccess = createStandardAction(
  "UPDATE_PROBLEM_SUCCESS"
)<Problem>();
export const deleteProblemSuccess = createStandardAction(
  "DELETE_PROBLEM_SUCCESS"
)<Problem>();

// =============================================================================
// Raffles
// =============================================================================

export const receiveRafflesForContest = createStandardAction(
  "RECEIVE_RAFFLES_FOR_CONTEST"
)<{ contestId: number; raffles: Raffle[] }>();
export const updateRaffleSuccess = createStandardAction(
  "UPDATE_RAFFLE_SUCCESS"
)<Raffle>();
export const deleteRaffleSuccess = createStandardAction(
  "DELETE_RAFFLE_SUCCESS"
)<Raffle>();
export const receiveRaffleWinnersForRaffle = createStandardAction(
  "RECEIVE_RAFFLE_WINNERS_FOR_RAFFLE"
)<{ raffleId: number; raffleWinners: RaffleWinner[] }>();
export const receiveRaffleWinner = createStandardAction(
  "RECEIVE_RAFFLE_WINNER"
)<RaffleWinner>();

// =============================================================================
// Contenders
// =============================================================================

export const receiveContendersForContest = createStandardAction(
  "RECEIVE_CONTENDERS_FOR_CONTEST"
)<{ contestId: number; contenders: ContenderData[] }>();
export const updateContenderSuccess = createStandardAction(
  "UPDATE_CONTENDER_SUCCESS"
)<ContenderData>();

// =============================================================================
// Ticks
// =============================================================================

export const receiveTicksForContest = createStandardAction(
  "RECEIVE_TICKS_FOR_CONTEST"
)<{
  contestId: number;
  ticks: Tick[];
}>();
