import * as React from 'react';
import './ContestsView.css';
import { ContenderData } from '../model/contenderData';
import { Contest } from '../model/contest';

export interface Props {
   contests: Contest[],
   loadContests?: () => void,
   saveUserData?: (contenderData: ContenderData) => Promise<ContenderData>,
}

type State = {
   goBack: boolean
}

export default class ContestsView extends React.Component<Props, State> {
   public readonly state: State = {
      goBack: false
   };

   constructor(props: Props) {
      super(props);
   }

   componentDidMount() {
      this.props.loadContests!();
   }

   render() {
      return (
         <div>
            contests
         </div>
      );
   }
}