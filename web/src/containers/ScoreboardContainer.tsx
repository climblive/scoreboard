import * as actions from '../actions/actions';
import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../model/storeState';
import ScoreboardView, { Props } from '../components/ScoreboardView';

export function mapStateToProps(state: StoreState, props: any): Props {
   return {
      scoreboardData: state.scoreboardData
   };
}

export function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      loadScoreboardData: () => dispatch(actions.loadScoreboardData()),
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(ScoreboardView);
