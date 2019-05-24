import * as React from 'react';
import './ContestView.css';
import { Problem } from '../model/problem';
import { ContenderData } from '../model/contenderData';
import * as ReactModal from 'react-modal';
import { Contest } from '../model/contest';
import {SortBy} from "../constants/constants";
import {ProblemState} from "../model/problemState";
import {Tick} from "../model/tick";
import {CompClass} from "../model/compClass";
import {Color} from "../model/color";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

export interface Props {
   contenderData?: ContenderData,
   contenderNotFound: boolean,
   match: {
      params: {
         code: string
      }
   }
   contest: Contest,
   problems: Problem[],
   compClasses: CompClass[],
   ticks: Tick[],
   colors: Map<number, Color>,
   problemsSortedBy: string,
   problemIdBeingUpdated?: number,
   errorMessage?: string,
   loadUserData?: (code: string) => void,
   saveUserData?: (contenderData: ContenderData) => Promise<ContenderData>,
   setProblemStateAndSave?: (problem: Problem, problemState: ProblemState, tick?: Tick) => void,
   sortProblems?: (sortBy: SortBy) => void,
   clearErrorMessage?: () => void
}

type State = {
   selectedTab: number,
   rulesModalIsOpen: boolean,
   goBack: boolean,
}

export default class ContestView extends React.Component<Props, State> {
   public readonly state: State = {
      selectedTab: 0,
      rulesModalIsOpen: false,
      goBack: false
   };

   constructor(props: Props) {
      super(props);
   }

   componentDidMount() {
      ReactModal.setAppElement("body");

      let code : string = this.props.match.params.code;
      this.props.loadUserData!(code);
   }

   selectTab = (event: any, newValue: number) => {
      this.state.selectedTab = newValue;
      this.setState(this.state)
   };

   render() {
      let selectedTab = this.state.selectedTab;
      return (
         <div>
               <Tabs value={selectedTab} onChange={this.selectTab}>
                  <Tab label="General information" />
                  <Tab label="Classes" />
                  <Tab label="Problems" />
                  <Tab label="Contenders" />
               </Tabs>
            {selectedTab === 0 && <div>Item One</div>}
            {selectedTab === 1 && <div>Item Two</div>}
            {selectedTab === 2 && <div>Item Three</div>}
            {selectedTab === 3 && <div>Item Three</div>}
         </div>
      )
   }
}