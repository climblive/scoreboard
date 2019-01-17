import * as actions from '../actions/actions';
import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../model/storeState';
import { Problem } from '../model/problem';
import DashboardView, { Props } from '../components/DashboardView';

export function mapStateToProps(state: StoreState, props: any): Props {
   return {
      userData: state.userData
   };
}

export function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      onToggle: (problem: Problem) => dispatch(actions.toggleProblem(problem)),
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardView);
