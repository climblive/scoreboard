import MainView, { Props } from '../components/MainView';
import * as asyncActions from '../actions/asyncActions';
import * as actions from '../actions/actions';
import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../model/storeState';
import { Problem } from '../model/problem';
import {UserData} from "../model/userData";

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
      toggleProblemAndSave: (problem: Problem) => dispatch(asyncActions.toggleProblemAndSave(problem)),
      loadUserData: (code: string) => dispatch(asyncActions.loadUserData(code)),
      saveUserData: (userData: UserData) => dispatch(asyncActions.saveUserData(userData)),
      loadContest: () => dispatch(asyncActions.loadContest()),
      sortProblems: (sortBy: string) => dispatch(actions.sortProblems(sortBy))
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
