import { createSelector } from 'reselect'
import { StoreState } from '../model/storeState';
import { ScoreboardListItem } from '../model/scoreboardListItem';

const getScoreboardContenders = (state: StoreState, props: any) => {
   if (state.scoreboardData) {
      return state.scoreboardData.find(list => list.compClass.name == props.compClass.name)!.contenders;
   } else {
      return undefined;
   }
}

export const makeGetTotalList = () => {
   return createSelector(
      [getScoreboardContenders],
      (scoreboardContenders) => {
         console.log("makeGetTotalList");
         if (scoreboardContenders) {
            return scoreboardContenders.sort((a, b) => b.totalScore - a.totalScore).map((sc, index) => {
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
      [getScoreboardContenders],
      (getScoreboardContenders) => {
         console.log("makeGetFinalistList");
         if (getScoreboardContenders) {
            let finalists = getScoreboardContenders.sort((a, b) => b.tenBestScore - a.tenBestScore);

            // TODO: Better calculation of finalists:
            finalists = finalists.slice(0, 5);
            return finalists.map((sc, index) => {
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