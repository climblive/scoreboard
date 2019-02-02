import * as actions from '../actions/actions';
import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../model/storeState';
import { ScoreboardPushItem } from '../model/scoreboardPushItem';
import { ScoreboardListComp, ScoreboardListCompProps } from '../components/ScoreboardListComp';
import makeGetTotalList from '../selectors/selector';

const makeMapStateToProps = () => {
   const getTotalList = makeGetTotalList()
   const mapStateToProps = (state: StoreState, props: any): ScoreboardListCompProps => {
      return {
         totalList: getTotalList(state, props)
      };
   }
   return mapStateToProps;
}

export function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      loadScoreboardData: () => dispatch(actions.loadScoreboardData()),
      receiveScoreboardItem: (scoreboardPushItem: ScoreboardPushItem) => dispatch(actions.receiveScoreboardItem(scoreboardPushItem))
   };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(ScoreboardListComp);
