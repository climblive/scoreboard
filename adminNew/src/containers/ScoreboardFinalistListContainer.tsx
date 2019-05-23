import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../model/storeState';
import { ScoreboardListComp, ScoreboardListCompProps } from '../components/ScoreboardListComp';
import { makeGetFinalistList } from '../selectors/selector';

const makeMapStateToProps = () => {
   const getFinalistList = makeGetFinalistList()
   const mapStateToProps = (state: StoreState, props: any): ScoreboardListCompProps => {
      return {
         compClass: props.compClass,
         totalList: getFinalistList(state, props),
         isPaging: false,
         pagingCounter: state.pagingCounter
      };
   }
   return mapStateToProps;
}

export function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
   };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(ScoreboardListComp);
