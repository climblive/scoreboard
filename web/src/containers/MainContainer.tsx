import MainView, { Props } from '../components/MainView';
import * as asyncActions from '../actions/asyncActions';
import * as actions from '../actions/actions';
import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../model/storeState';
import { Problem } from '../model/problem';
import {ContenderData} from "../model/contenderData";
import {ProblemState} from "../model/problemState";
import {SortBy} from "../constants/constants";
import {Tick} from "../model/tick";

export function mapStateToProps(state: StoreState, props: any): Props {
   console.log("Props: ", props);
   return {
      contenderData: state.contenderData,
      contenderNotFound: state.contenderNotFound,
      contest: state.contest,
      problems: state.problems,
      compClasses: state.compClasses,
      ticks: state.ticks,
      colors: state.colors,
      problemsSortedBy: state.problemsSortedBy,
      problemIdBeingUpdated: state.problemIdBeingUpdated,
      errorMessage: state.errorMessage,
      match: props.match
   };
}

export function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      setProblemStateAndSave: (problem: Problem, problemState: ProblemState, tick?:Tick) => dispatch(asyncActions.setProblemStateAndSave(problem, problemState, tick)),
      loadUserData: (code: string) => dispatch(asyncActions.loadUserData(code)),
      saveUserData: (contenderData: ContenderData) => dispatch(asyncActions.saveUserData(contenderData)),
      sortProblems: (sortBy: SortBy) => dispatch(actions.sortProblems(sortBy)),
      clearErrorMessage: () => dispatch(actions.clearErrorMessage())
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
