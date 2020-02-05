
import { createStandardAction } from 'typesafe-actions'
import { Problem } from '../model/problem';
import { ContenderData } from '../model/contenderData';
import { Contest } from '../model/contest';
import { ScoreboardPushItem } from '../model/scoreboardPushItem';
import {SortBy} from "../constants/constants";
import {CompClass} from "../model/compClass";
import {Tick} from "../model/tick";
import {Color} from "../model/color";
import {ScoreboardDescription} from "../model/scoreboardDescription";
import {RaffleWinner} from "../model/raffleWinner";

export const startProblemUpdate = createStandardAction('START_PROBLEM_UPDATE')<Problem>();
export const setProblemStateFailed = createStandardAction('SET_PROBLEM_STATE_FAILED')<string>();
export const clearErrorMessage = createStandardAction('CLEAR_ERROR_MESSAGE')();
export const receiveContenderData = createStandardAction('RECEIVE_USER_DATA')<ContenderData>();
export const receiveContenderNotFound = createStandardAction('RECEIVE_CONTENDER_NOT_FOUND')();
export const receiveScoreboardData = createStandardAction('RECEIVE_SCOREBOARD_DATA')<ScoreboardDescription>();
export const setCurrentCompClassId = createStandardAction('SET_CURRENT_COMP_CLASS_ID')<number>();
export const receiveScoreboardItem = createStandardAction('RECEIVE_SCOREBOARD_ITEM')<ScoreboardPushItem>();
export const resetScoreboardItemAnimation = createStandardAction('RESET_SCOREBOARD_ITEM_ANIMATION')<ScoreboardPushItem>();
export const receiveContest = createStandardAction('RECEIVE_CONTEST')<Contest>();
export const receiveColors = createStandardAction('RECEIVE_COLORS')<Color[]>();
export const receiveCompClasses = createStandardAction('RECEIVE_COMP_CLASSES')<CompClass[]>();
export const receiveProblems = createStandardAction('RECEIVE_PROBLEMS')<Problem[]>();
export const receiveTicks = createStandardAction('RECEIVE_TICKS')<Tick[]>();
export const updateScoreboardTimer = createStandardAction('UPDATE_SCOREBOARD_TIMER')();
export const sortProblems = createStandardAction('SORT_PROBLEMS')<SortBy>();
export const createTick = createStandardAction('CREATE_TICK')<Tick>();
export const updateTick = createStandardAction('UPDATE_TICK')<Tick>();
export const deleteTick = createStandardAction('DELETE_TICK')<Tick>();
export const deactivateRaffle = createStandardAction('DEACTIVATE_RAFFLE')();
export const receiveRaffleWinner = createStandardAction('RECEIVE_RAFFLE_WINNER')<RaffleWinner>();
