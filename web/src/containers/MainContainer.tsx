import MainView, { Props } from '../components/MainView';
import * as actions from '../actions/actions';
import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../model/storeState';
import { Problem } from '../model/problem';

export function mapStateToProps(state: StoreState, props: any): Props {
   console.log("Props: ", props);
   return {
      userData: state.userData,
      contest: state.contest,
      problemsSortedBy: state.problemsSortedBy,
      match: props.match
   };
}

export function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      toggleProblemAndSave: (problem: Problem) => dispatch(actions.toggleProblemAndSave(problem)),
      loadUserData: (code: string) => dispatch(actions.loadUserData(code)),
      loadContest: () => dispatch(actions.loadContest()),
      sortProblems: (sortBy: string) => dispatch(actions.sortProblems(sortBy))
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
