import { connect } from "react-redux";
import { Dispatch } from "redux";
import { StoreState } from "../model/storeState";
import {
  ScoreboardListComp,
  ScoreboardListCompProps,
} from "../components/ScoreboardListComp";
import { makeGetFinalistList } from "../selectors/selector";

const makeMapStateToProps = () => {
  const getFinalistList = makeGetFinalistList();
  const mapStateToProps = (
    state: StoreState,
    props: any
  ): ScoreboardListCompProps => {
    return {
      compClass: props.compClass,
      totalList: getFinalistList(state, props),
      isPaging: props.isPaging,
      pagingCounter: state.pagingCounter,
      animationPropertyName: "isAnimatingFinalist",
    };
  };
  return mapStateToProps;
};

export function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(ScoreboardListComp);
