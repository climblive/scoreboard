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
import { SortBy } from "../constants/sortBy";
import { Raffle } from "../model/raffle";
import { RaffleWinner } from "../model/raffleWinner";

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
export const setCreatingPdf = createStandardAction("SET_CREATING_PDF")<
  boolean
>();

export const clearContest = createStandardAction("CLEAR_CONTEST")();
export const setNewContest = createStandardAction("SET_NEW_CONTEST")();
export const updateContest = createStandardAction("UPDATE_CONTEST")<{
  propName: string;
  value: any;
}>();
export const receiveContests = createStandardAction("RECEIVE_CONTESTS")<
  Contest[]
>();
export const clearContests = createStandardAction("CLEAR_CONTESTS")();
export const receiveContest = createStandardAction("RECEIVE_CONTEST")<
  Contest
>();
export const deleteContest = createStandardAction("DELETE_CONTEST")<Contest>();

export const receiveLocations = createStandardAction("RECEIVE_LOCATIONS")<
  CompLocation[]
>();
export const saveLocationSuccess = createStandardAction(
  "SAVE_LOCATION_SUCCESS"
)<CompLocation>();
export const deleteLocationSuccess = createStandardAction(
  "DELETE_LOCATION_SUCCESS"
)<CompLocation>();

export const receiveOrganizers = createStandardAction("RECEIVE_ORGANIZERS")<
  Organizer[]
>();
export const saveOrganizerSuccess = createStandardAction(
  "SAVE_ORGANIZER_SUCCESS"
)<Organizer>();
export const deleteOrganizerSuccess = createStandardAction(
  "DELETE_ORGANIZER_SUCCESS"
)<Organizer>();
export const selectOrganizer = createStandardAction("SELECT_ORGANIZER")<
  Organizer
>();

export const receiveColors = createStandardAction("RECEIVE_COLORS")<Color[]>();
export const clearColors = createStandardAction("CLEAR_COLORS")<Color>();
export const startEditColor = createStandardAction("START_EDIT_COLOR")<Color>();
export const cancelEditColor = createStandardAction("CANCEL_EDIT_COLOR")();
export const startAddColor = createStandardAction("START_ADD_COLOR")();
export const updateEditColor = createStandardAction("UPDATE_EDIT_COLOR")<{
  propName: string;
  value: any;
}>();

export const receiveSeries = createStandardAction("RECEIVE_SERIES")<Series[]>();
export const saveSeriesSuccess = createStandardAction("SAVE_SERIES_SUCCESS")<
  Series
>();
export const deleteSeriesSuccess = createStandardAction(
  "DELETE_SERIES_SUCCESS"
)<Series>();

export const receiveCompClasses = createStandardAction("RECEIVE_COMP_CLASSES")<
  CompClass[]
>();
export const clearCompClasses = createStandardAction("CLEAR_COMP_CLASSES")();
export const startEditCompClass = createStandardAction("START_EDIT_COMP_CLASS")<
  CompClass
>();
export const cancelEditCompClass = createStandardAction(
  "CANCEL_EDIT_COMP_CLASS"
)();
export const startAddCompClass = createStandardAction("START_ADD_COMP_CLASS")();
export const updateEditCompClass = createStandardAction(
  "UPDATE_EDIT_COMP_CLASS"
)<{ propName: string; value: any }>();

export const receiveProblems = createStandardAction("RECEIVE_PROBLEMS")<
  Problem[]
>();
export const clearProblems = createStandardAction("CLEAR_PROBLEMS")();
export const startEditProblem = createStandardAction("START_EDIT_PROBLEM")<
  Problem
>();
export const cancelEditProblem = createStandardAction("CANCEL_EDIT_PROBLEM")();
export const startAddProblem = createStandardAction("START_ADD_PROBLEM")<
  Problem
>();
export const updateEditProblem = createStandardAction("UPDATE_EDIT_PROBLEM")<{
  propName: string;
  value: any;
}>();

export const receiveRaffles = createStandardAction("RECEIVE_RAFFLES")<
  Raffle[]
>();
export const clearRaffles = createStandardAction("CLEAR_RAFFLES")();
export const receiveRaffleWinners = createStandardAction(
  "RECEIVE_RAFFLE_WINNERS"
)<{ raffle: Raffle; winners: RaffleWinner[] }>();
export const receiveRaffleWinner = createStandardAction(
  "RECEIVE_RAFFLE_WINNER"
)<RaffleWinner>();

export const receiveContenders = createStandardAction("RECEIVE_CONTENDERS")<
  ContenderData[]
>();
export const setContenderFilterCompClass = createStandardAction(
  "SET_CONTENDER_FILTER_COMP_CLASS"
)<CompClass>();
export const setContenderSortBy = createStandardAction("SET_CONTENDER_SORT_BY")<
  SortBy
>();
export const updateContender = createStandardAction("UPDATE_CONTENDER")<
  ContenderData
>();

export const receiveTicks = createStandardAction("RECEIVE_TICKS")<Tick[]>();
