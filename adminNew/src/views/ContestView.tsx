import * as React from 'react';
import * as ReactModal from 'react-modal';
import { Contest } from '../model/contest';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {StoreState} from "../model/storeState";
import {connect, Dispatch} from "react-redux";
import * as asyncActions from "../actions/asyncActions";
import * as actions from "../actions/actions";
import ProblemsComp from "../components/ProblemsComp";
import {CompClass} from "../model/compClass";
import {Problem} from "../model/problem";
import CompClassesComp from "../components/CompClassesComp";
import ContestGeneralComp from "../components/ContestGeneralComp";

interface Props {
   match: {
      params: {
         contestId: string
      }
   },
   contest:Contest,
   problems:Problem[],
   compClasses:CompClass[],
   loadContest?: (contestId: number) => void,
   setTitle?: (title: string) => void,
}

type State = {
   selectedTab: number,
}

class ContestView extends React.Component<Props, State> {
   public readonly state: State = {
      selectedTab: 2,
   };

   constructor(props: Props) {
      super(props);
   }

   componentDidMount() {
      ReactModal.setAppElement("body");

      let contestId : string = this.props.match.params.contestId;
      this.props.loadContest!(parseInt(contestId));
   }

   componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
      this.props.setTitle!(this.props.contest ? this.props.contest.name : "");
   }

   selectTab = (event: any, newValue: number) => {
      this.state.selectedTab = newValue;
      this.setState(this.state)
   };

   render() {
      let selectedTab = this.state.selectedTab;
      let tab;
      if(selectedTab == 0) {
         tab = (<ContestGeneralComp key="general" contest={this.props.contest} />);
      } else if(selectedTab == 1) {
         tab = (<CompClassesComp key="compClasses" compClasses={this.props.compClasses} />);
      } else if(selectedTab == 2) {
         tab = (<ProblemsComp key="problems" problems={this.props.problems} />);
      } else if(selectedTab == 3) {
         tab = (<div id="contenders">Item One</div>);
      }
      return [
         (<Tabs key="tabs" value={selectedTab} onChange={this.selectTab}>
            <Tab label="General information" />
            <Tab label="Classes" />
            <Tab label="Problems" />
            <Tab label="Contenders" />
         </Tabs>),
         tab
      ]
   }
}

export function mapStateToProps(state: StoreState, props: any): Props {
   return {
      contest: state.contest,
      problems: state.problems,
      compClasses: state.compClasses,
      match: props.match
   };
}

export function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      loadContest: (contestId: number) => dispatch(asyncActions.loadContest(contestId)),
      setTitle: (title: string) => dispatch(actions.setTitle(title)),
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContestView);
