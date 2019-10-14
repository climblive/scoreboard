import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../model/storeState';
import { ScoreboardListComp, ScoreboardListCompProps } from '../components/ScoreboardListComp';
import { makeGetTotalList } from '../selectors/selector';

const makeMapStateToProps = () => {
   const getTotalList = makeGetTotalList();
   const mapStateToProps = (state: StoreState, props: any): ScoreboardListCompProps => {
      return {
         compClass: props.compClass,
         totalList: getTotalList(state, props),
         isPaging: props.isPaging,
         pagingCounter: state.pagingCounter,
         animationClassName: "totalAnimationClass"
      };
   };
   return mapStateToProps;
};

export function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
   };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(ScoreboardListComp);
