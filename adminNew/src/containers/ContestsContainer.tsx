import * as asyncActions from '../actions/asyncActions';
import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../model/storeState';
import ContestsView, {Props} from "../views/ContestsView";

export function mapStateToProps(state: StoreState, props: any): Props {
   return {
      contests: state.contests,
   };
}

export function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      loadContests: () => dispatch(asyncActions.loadContests()),
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContestsView);
