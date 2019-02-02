import * as actions from '../actions/actions';
import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../model/storeState';
import { ScoreboardPushItem } from '../model/scoreboardPushItem';
import getTotalList from '../selectors/selector';
import { ScoreboardListComp, ScoreboardListCompProps } from '../components/ScoreboardListComp';

export function mapStateToProps(state: StoreState, props: any): ScoreboardListCompProps {
   return {
      totalList: getTotalList(state, props)
   };
}

export function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      loadScoreboardData: () => dispatch(actions.loadScoreboardData()),
      receiveScoreboardItem: (scoreboardPushItem: ScoreboardPushItem) => dispatch(actions.receiveScoreboardItem(scoreboardPushItem))
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(ScoreboardListComp);
