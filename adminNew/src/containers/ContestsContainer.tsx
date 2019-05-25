import * as asyncActions from '../actions/asyncActions';
import * as actions from '../actions/actions';
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
      setTitle: (title:string) => dispatch(actions.setTitle(title)),
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContestsView);
