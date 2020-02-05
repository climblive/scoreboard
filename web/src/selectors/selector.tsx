import { createSelector } from 'reselect'
import { StoreState } from '../model/storeState';
import { ScoreboardListItem } from '../model/scoreboardListItem';
import {ScoreboardContender} from "../model/scoreboardContender";

const getScoreboardContenders = (state: StoreState, props: any) => {
   if (state.scoreboardData) {
      return state.scoreboardData.find(list => list.compClass.name == props.compClass.name)!.contenders;
   } else {
      return undefined;
   }
};

const getContest = (state: StoreState) => state.contest;

const createList = (getScore: (sc: ScoreboardContender) => number, maxCount: number, scoreboardContenders?: ScoreboardContender[]) => {
   if (scoreboardContenders) {
      let position = 0;
      let lastScore = -1;
      let maxFulfilled = false;
      let listItems = scoreboardContenders.sort((a, b) => {
         let scoreDiff = getScore(b) - getScore(a);
         return scoreDiff == 0 ? b.contenderId - a.contenderId : scoreDiff;
      }).map((sc, index) => {
         let score = getScore(sc);
         if(score != lastScore) {
            lastScore = score;
            position = index + 1;
            maxFulfilled = maxCount != 0 && index >= maxCount;
         }
         if(maxFulfilled) {
            return undefined;
         } else {
            let x: ScoreboardListItem = {
               contenderId: sc.contenderId,
               position: position,
               contenderName: sc.contenderName,
               score: score,
               isAnimatingTotal: sc.isAnimatingTotal,
               isAnimatingFinalist: sc.isAnimatingFinalist,
               uiPosition: index
            };
            return x;
         }
      }).filter(sc => sc) as ScoreboardListItem[];

      listItems = listItems.sort((a, b) => b.contenderId - a.contenderId);

      if(maxCount) {
         // Remove contenders without score:
         listItems = listItems.filter(l => l.score);
      }
      return listItems;
   } else {
      return undefined;
   }
};

export const makeGetTotalList = () => {
   return createSelector(
      [getScoreboardContenders],
      (scoreboardContenders) => createList((sc: ScoreboardContender) => sc.totalScore, 0, scoreboardContenders)
   )
};

export const makeGetFinalistList = () => {
   return createSelector(
      [getScoreboardContenders, getContest],
      (scoreboardContenders, contest) => createList((sc: ScoreboardContender) => sc.qualifyingScore, contest.finalists, scoreboardContenders)
   )
};