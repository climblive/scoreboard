
import {action, createAction, createStandardAction} from 'typesafe-actions'
import { Problem } from '../model/problem';
import { Contest } from '../model/contest';
import {CompClass} from "../model/compClass";
import {Color} from "../model/color";
import {Organizer} from "../model/organizer";
import {CompLocation} from "../model/compLocation";
import {ContenderData} from "../model/contenderData";
import {Series} from "../model/series";
import {User} from "../model/user";
import {Tick} from "../model/tick";

export const setErrorMessage = createStandardAction('SET_ERROR_MESSAGE')<string>();
export const clearErrorMessage = createStandardAction('CLEAR_ERROR_MESSAGE')();
export const setTitle = createStandardAction('SET_TITLE')<string>();
export const setLoggingIn = createStandardAction('SET_LOGGING_IN')<boolean>();
export const setLoggedInUser = createStandardAction('SET_LOGGED_IN_USER')<User>();
export const logout = createStandardAction('LOGOUT')();
export const setCreatingPdf = createStandardAction('SET_CREATING_PDF')<boolean>();


export const clearContest = createStandardAction('CLEAR_CONTEST')();
export const setNewContest = createStandardAction('SET_NEW_CONTEST')();
export const updateContest = createStandardAction('UPDATE_CONTEST')<{propName:string, value:any}>();
export const receiveContests = createStandardAction('RECEIVE_CONTESTS')<Contest[]>();
export const clearContests = createStandardAction('CLEAR_CONTESTS')();
export const receiveContest = createStandardAction('RECEIVE_CONTEST')<Contest>();

export const receiveLocations = createStandardAction('RECEIVE_LOCATIONS')<CompLocation[]>();
export const clearLocations = createStandardAction('CLEAR_LOCATIONS')();
export const startEditLocation = createStandardAction('START_EDIT_LOCATION')<CompLocation>();
export const cancelEditLocation = createStandardAction('CANCEL_EDIT_LOCATION')();
export const startAddLocation = createStandardAction('START_ADD_LOCATION')();
export const updateEditLocation = createStandardAction('UPDATE_EDIT_LOCATION')<{propName:string, value:any}>();

export const receiveOrganizers = createStandardAction('RECEIVE_ORGANIZERS')<Organizer[]>();
export const clearOrganizers = createStandardAction('CLEAR_ORGANIZERS')();
export const setOrganizer = createStandardAction('SET_ORGANIZERS')<Organizer>();
export const startEditOrganizer = createStandardAction('START_EDIT_ORGANIZER')<Organizer>();
export const cancelEditOrganizer = createStandardAction('CANCEL_EDIT_ORGANIZER')();
export const startAddOrganizer = createStandardAction('START_ADD_ORGANIZER')();
export const updateEditOrganizer = createStandardAction('UPDATE_EDIT_ORGANIZER')<{propName:string, value:any}>();

export const receiveColors = createStandardAction('RECEIVE_COLORS')<Color[]>();
export const clearColors = createStandardAction('CLEAR_COLORS')<Color>();
export const startEditColor = createStandardAction('START_EDIT_COLOR')<Color>();
export const cancelEditColor = createStandardAction('CANCEL_EDIT_COLOR')();
export const startAddColor = createStandardAction('START_ADD_COLOR')();
export const updateEditColor = createStandardAction('UPDATE_EDIT_COLOR')<{propName:string, value:any}>();

export const receiveSeries = createStandardAction('RECEIVE_SERIE')<Series[]>();
export const clearSeries = createStandardAction('CLEAR_SERIE')();
export const startEditSeries = createStandardAction('START_EDIT_SERIES')<Series>();
export const cancelEditSeries = createStandardAction('CANCEL_EDIT_SERIES')();
export const startAddSeries = createStandardAction('START_ADD_SERIES')();
export const updateEditSeries = createStandardAction('UPDATE_EDIT_SERIES')<{propName:string, value:any}>();

export const receiveCompClasses = createStandardAction('RECEIVE_COMP_CLASSES')<CompClass[]>();
export const clearCompClasses = createStandardAction('CLEAR_COMP_CLASSES')();
export const startEditCompClass = createStandardAction('START_EDIT_COMP_CLASS')<CompClass>();
export const cancelEditCompClass = createStandardAction('CANCEL_EDIT_COMP_CLASS')();
export const startAddCompClass = createStandardAction('START_ADD_COMP_CLASS')();
export const updateEditCompClass = createStandardAction('UPDATE_EDIT_COMP_CLASS')<{propName:string, value:any}>();

export const receiveProblems = createStandardAction('RECEIVE_PROBLEMS')<Problem[]>();
export const clearProblems = createStandardAction('CLEAR_PROBLEMS')();
export const startEditProblem = createStandardAction('START_EDIT_PROBLEM')<Problem>();
export const cancelEditProblem = createStandardAction('CANCEL_EDIT_PROBLEM')();
export const startAddProblem = createStandardAction('START_ADD_PROBLEM')<Problem>();
export const updateEditProblem = createStandardAction('UPDATE_EDIT_PROBLEM')<{propName:string, value:any}>();

export const receiveContenders = createStandardAction('RECEIVE_CONTENDERS')<ContenderData[]>();

export const receiveTicks = createStandardAction('RECEIVE_TICKS')<Tick[]>();
