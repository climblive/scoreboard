import MainView, { Props } from '../components/MainView';
import * as actions from '../actions/actions';
import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../model/storeState';
import { Problem } from '../model/problem';
import { UserData } from '../model/userData';

export function mapStateToProps(state: StoreState, props: any): Props {
   console.log("Props: ", props);
   return {
      userData: state.userData,
      match: props.match
   };
}

export function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      onToggle: (problem: Problem) => dispatch(actions.toggleProblem(problem)),
      receiveUserData: (userData: UserData) => dispatch(actions.receiveUserData(userData)),
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
