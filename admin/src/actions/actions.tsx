import { createStandardAction } from "typesafe-actions";
import { Problem } from "../model/problem";
import { Contest } from "../model/contest";
import { CompClass } from "../model/compClass";
import { Color } from "../model/color";
import { Organizer } from "../model/organizer";
import { CompLocation } from "../model/compLocation";
import { ContenderData } from "../model/contenderData";
import { Series } from "../model/series";
import { User } from "../model/user";
import { Tick } from "../model/tick";
import { Raffle } from "../model/raffle";
import { RaffleWinner } from "../model/raffleWinner";
import { create } from "domain";
import { ContenderScoring } from "src/model/contenderScoring";
import { SharedPoints } from "../model/sharedPoints";

export const setErrorMessage = createStandardAction("SET_ERROR_MESSAGE")<
  string
>();
export const clearErrorMessage = createStandardAction("CLEAR_ERROR_MESSAGE")();
export const setTitle = createStandardAction("SET_TITLE")<string>();
export const setLoggingIn = createStandardAction("SET_LOGGING_IN")<boolean>();
export const setLoggedInUser = createStandardAction("SET_LOGGED_IN_USER")<
  User
>();
export const logout = createStandardAction("LOGOUT")();

// =============================================================================
// Contests
// =============================================================================

export const replaceContests = createStandardAction("REPLACE_CONTESTS")<
  Contest[]
>();
export const updateContestSuccess = createStandardAction(
  "UPDATE_CONTEST_SUCCESS"
)<Contest>();
export const deleteContestSuccess = createStandardAction(
  "DELETE_CONTEST_SUCCESS"
)<Contest>();

// =============================================================================
// Locations
// =============================================================================

export const replaceLocations = createStandardAction("REPLACE_LOCATIONS")<
  CompLocation[]
>();
export const updateLocationSuccess = createStandardAction(
  "UPDATE_LOCATION_SUCCESS"
)<CompLocation>();
export const deleteLocationSuccess = createStandardAction(
  "DELETE_LOCATION_SUCCESS"
)<CompLocation>();

// =============================================================================
// Organizers
// =============================================================================

export const replaceOrganizers = createStandardAction("REPLACE_ORGANIZERS")<
  Organizer[]
>();
export const updateOrganizerSuccess = createStandardAction(
  "UPDATE_ORGANIZER_SUCCESS"
)<Organizer>();
export const deleteOrganizerSuccess = createStandardAction(
  "DELETE_ORGANIZER_SUCCESS"
)<Organizer>();
export const selectOrganizer = createStandardAction("SELECT_ORGANIZER")<
  number
>();

// =============================================================================
// Colors
// =============================================================================

export const replaceColors = createStandardAction("REPLACE_COLORS")<Color[]>();
export const updateColorSuccess = createStandardAction("UPDATE_COLOR_SUCCESS")<
  Color
>();
export const deleteColorSuccess = createStandardAction("DELETE_COLOR_SUCCESS")<
  Color
>();

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

export const receiveCompClasses = createStandardAction("RECEIVE_COMP_CLASSES")<
  CompClass[]
>();
export const updateCompClassSuccess = createStandardAction(
  "UPDATE_COMP_CLASS_SUCCESS"
)<CompClass>();
export const deleteCompClassSuccess = createStandardAction(
  "DELETE_COMP_CLASS_SUCCESS"
)<CompClass>();

// =============================================================================
// Problems
// =============================================================================

export const receiveProblems = createStandardAction("RECEIVE_PROBLEMS")<
  Problem[]
>();
export const updateProblemSuccess = createStandardAction(
  "UPDATE_PROBLEM_SUCCESS"
)<Problem>();
export const deleteProblemSuccess = createStandardAction(
  "DELETE_PROBLEM_SUCCESS"
)<Problem>();
export const loadSharedPoints = createStandardAction("LOAD_SHARED_POINTS")<
  SharedPoints
>();

// =============================================================================
// Raffles
// =============================================================================

export const receiveRaffles = createStandardAction("RECEIVE_RAFFLES")<
  Raffle[]
>();
export const updateRaffleSuccess = createStandardAction(
  "UPDATE_RAFFLE_SUCCESS"
)<Raffle>();
export const deleteRaffleSuccess = createStandardAction(
  "DELETE_RAFFLE_SUCCESS"
)<Raffle>();
export const receiveRaffleWinners = createStandardAction(
  "RECEIVE_RAFFLE_WINNERS"
)<{ raffle: Raffle; winners: RaffleWinner[] }>();
export const receiveRaffleWinner = createStandardAction(
  "RECEIVE_RAFFLE_WINNER"
)<RaffleWinner>();

// =============================================================================
// Contenders
// =============================================================================

export const receiveContenders = createStandardAction("RECEIVE_CONTENDERS")<
  ContenderData[]
>();
export const updateContenderSuccess = createStandardAction(
  "UPDATE_CONTENDER_SUCCESS"
)<ContenderData>();
export const loadContenderScoring = createStandardAction(
  "LOAD_CONTENDER_SCORING"
)<ContenderScoring>();

// =============================================================================
// Ticks
// =============================================================================

export const receiveTicks = createStandardAction("RECEIVE_TICKS")<Tick[]>();
