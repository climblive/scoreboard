import * as actions from '../actions/actions';
import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../model/storeState';
import { Problem } from '../model/problem';
import StartView, { Props } from '../components/StartView';
import { UserData } from '../model/userData';

export function mapStateToProps(state: StoreState, props: any): Props {
   console.log("Props: ", props);
   return {
   };
}

export function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      toggleProblemAndSave: (problem: Problem) => dispatch(actions.toggleProblemAndSave(problem)),
      saveUserData: (userData: UserData) => dispatch(actions.saveUserData(userData))
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(StartView);
