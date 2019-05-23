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
   userInfoModalIsOpen: boolean,
   rulesModalIsOpen: boolean,
   goBack: boolean,
}

export default class ContestView extends React.Component<Props, State> {
   public readonly state: State = {
      userInfoModalIsOpen: false,
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

   render() {
      return (
         <div>
            Contest
         </div>
      )
   }
}