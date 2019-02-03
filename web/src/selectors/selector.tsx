import { createSelector } from 'reselect'
import { StoreState } from '../model/storeState';
import { ScoreboardListItem } from '../model/scoreboardListItem';

const getScoreboardContenderList = (state: StoreState, props: any) => {
   console.log("getScoreboardContenderList", props);
   if (state.scoreboardData) {
      return state.scoreboardData.find(list => list.compClass == props.compClass);
   } else {
      return undefined;
   }
}

export const makeGetTotalList = () => {
   return createSelector(
      [getScoreboardContenderList],
      (scoreboardContenderList) => {
         if (scoreboardContenderList) {
            return scoreboardContenderList.contenders.sort((a, b) => b.totalScore - a.totalScore).map((sc, index) => {
               let x: ScoreboardListItem = {
                  contenderId: sc.contenderId,
                  position: index + 1,
                  contenderName: sc.contenderName,
                  score: sc.totalScore
               }
               return x;
            })
         } else {
            return undefined;
         }
      }
   )
}

export const makeGetFinalistList = () => {
   return createSelector(
      [getScoreboardContenderList],
      (scoreboardContenderList) => {
         if (scoreboardContenderList) {
            return scoreboardContenderList.contenders.sort((a, b) => b.tenBestScore - a.tenBestScore).map((sc, index) => {
               let x: ScoreboardListItem = {
                  contenderId: sc.contenderId,
                  position: index + 1,
                  contenderName: sc.contenderName,
                  score: sc.tenBestScore
               }
               return x;
            })
         } else {
            return undefined;
         }
      }
   )
}