
import { createStandardAction } from 'typesafe-actions'
import { Problem } from '../model/problem';
import { ContenderData } from '../model/contenderData';
import { ScoreboardContenderList } from '../model/scoreboardContenderList';
import { Contest } from '../model/contest';
import { ScoreboardPushItem } from '../model/scoreboardPushItem';


export const toggleProblem = createStandardAction('TOGGLE_PROBLEM')<Problem>();
export const receiveContenderData = createStandardAction('RECEIVE_USER_DATA')<ContenderData>();
export const receiveContenderNotFound = createStandardAction('RECEIVE_CONTENDER_NOT_FOUND')();
export const receiveScoreboardData = createStandardAction('RECEIVE_SCOREBOARD_DATA')<ScoreboardContenderList[]>();
export const receiveScoreboardItem = createStandardAction('RECEIVE_SCOREBOARD_ITEM')<ScoreboardPushItem>();
export const receiveContest = createStandardAction('RECEIVE_CONTEST')<Contest>();
export const updateScoreboardTimer = createStandardAction('UPDATE_SCOREBOARD_TIMER')();
export const sortProblems = createStandardAction('SORT_PROBLEMS')<string>();
