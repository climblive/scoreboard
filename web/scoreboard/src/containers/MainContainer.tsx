import MainView, { Props } from '../components/MainView';
import * as actions from '../actions/actions';
import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../model/storeState';
import { Problem } from '../model/problem';

export function mapStateToProps(state: StoreState): Props {
   return {
      problems: state.problems,
      name: state.name,
      compClass: state.compClass
   };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>) {
   return {
      onToggle: (problem: Problem) => dispatch(actions.toggleProblem(problem)),
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
