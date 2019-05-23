import * as asyncActions from '../actions/asyncActions';
import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../model/storeState';
import StartView, { Props } from '../components/StartView';
import { ContenderData } from '../model/contenderData';

export function mapStateToProps(state: StoreState, props: any): Props {
   console.log("Props: ", props);
   return {
      contest: state.contest
   };
}

export function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      saveUserData: (contenderData: ContenderData) => dispatch(asyncActions.saveUserData(contenderData))
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(StartView);
