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

export const getTotalList = createSelector(
   [getScoreboardContenderList],
   (scoreboardContenderList) => {
      console.log("Selector on ", scoreboardContenderList);
      if(scoreboardContenderList) {
         return scoreboardContenderList.contenders.map((sc, index) => {
            let x: ScoreboardListItem = {
               position: index,
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

export default getTotalList