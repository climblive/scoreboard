
import { createStandardAction } from 'typesafe-actions'
import { Problem } from '../model/problem';
import { ContenderData } from '../model/contenderData';
import { ScoreboardContenderList } from '../model/scoreboardContenderList';
import { Contest } from '../model/contest';
import { ScoreboardPushItem } from '../model/scoreboardPushItem';
import {SortBy} from "../constants/constants";
import {ProblemState} from "../model/problemState";
import {CompClass} from "../model/compClass";
import {Tick} from "../model/tick";
import {Color} from "../model/color";

export const startProblemUpdate = createStandardAction('START_PROBLEM_UPDATE')<Problem>();
export const setProblemState = createStandardAction('SET_PROBLEM_STATE')<Problem, ProblemState>();
export const setProblemStateFailed = createStandardAction('SET_PROBLEM_STATE_FAILED')();
export const clearErrorMessage = createStandardAction('CLEAR_ERROR_MESSAGE')();
export const receiveContenderData = createStandardAction('RECEIVE_USER_DATA')<ContenderData>();
export const receiveContenderNotFound = createStandardAction('RECEIVE_CONTENDER_NOT_FOUND')();
export const receiveScoreboardData = createStandardAction('RECEIVE_SCOREBOARD_DATA')<ScoreboardContenderList[]>();
export const receiveScoreboardItem = createStandardAction('RECEIVE_SCOREBOARD_ITEM')<ScoreboardPushItem>();
export const receiveContest = createStandardAction('RECEIVE_CONTEST')<Contest>();
export const receiveColors = createStandardAction('RECEIVE_COLORS')<Color[]>();
export const receiveCompClasses = createStandardAction('RECEIVE_COMP_CLASSES')<CompClass[]>();
export const receiveProblems = createStandardAction('RECEIVE_PROBLEMS')<Problem[]>();
export const receiveTicks = createStandardAction('RECEIVE_TICKS')<Tick[]>();
export const updateScoreboardTimer = createStandardAction('UPDATE_SCOREBOARD_TIMER')();
export const sortProblems = createStandardAction('SORT_PROBLEMS')<SortBy>();
