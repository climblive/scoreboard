import * as asyncActions from '../actions/asyncActions';
import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../model/storeState';
import StartView, { Props } from '../components/StartView';
import { UserData } from '../model/userData';

export function mapStateToProps(state: StoreState, props: any): Props {
   console.log("Props: ", props);
   return {
      contest: state.contest
   };
}

export function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      loadContest: () => dispatch(asyncActions.loadContest()),
      saveUserData: (userData: UserData) => dispatch(asyncActions.saveUserData(userData))
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(StartView);
