import * as actions from '../actions/actions';
import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../model/storeState';
import ScoreboardView, { Props } from '../components/ScoreboardView';
import { ScoreboardPushItem } from '../model/scoreboardPushItem';

export function mapStateToProps(state: StoreState, props: any): Props {
   return {
      scoreboardData: state.scoreboardData,
   };
}

export function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      loadScoreboardData: () => dispatch(actions.loadScoreboardData()),
      receiveScoreboardItem: (scoreboardPushItem: ScoreboardPushItem) => dispatch(actions.receiveScoreboardItem(scoreboardPushItem)),
      updateScoreboardTimer: () => dispatch(actions.updateScoreboardTimer()),
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(ScoreboardView);
