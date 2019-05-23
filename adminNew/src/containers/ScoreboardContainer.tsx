import * as actions from '../actions/actions';
import * as asyncActions from '../actions/asyncActions';
import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../model/storeState';
import ScoreboardView, { Props } from '../components/ScoreboardView';
import { ScoreboardPushItem } from '../model/scoreboardPushItem';

export function mapStateToProps(state: StoreState, props: any): Props {
   return {
      scoreboardData: state.scoreboardData,
      match: props.match
   };
}

export function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      loadScoreboardData: (id:number) => dispatch(asyncActions.loadScoreboardData(id)),
      receiveScoreboardItem: (scoreboardPushItem: ScoreboardPushItem) => dispatch(actions.receiveScoreboardItem(scoreboardPushItem)),
      updateScoreboardTimer: () => dispatch(actions.updateScoreboardTimer()),
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(ScoreboardView);
