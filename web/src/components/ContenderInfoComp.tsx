import * as React from 'react';
import './ContenderInfoComp.css';
import { UserData } from '../model/userData';
import { Contest } from '../model/contest';

export interface Props {
   activationCode : string,
   contest: Contest,
   existingUserData?: UserData,
   showCancelButton?: boolean,
   saveUserData?: (userData: UserData) => Promise<UserData>,
   loadContest?: () => void,
   onFinished?: () => void
}

type State = {
   name?: string,
   compClass?: string,
}

export default class ContenderInfoComp extends React.Component<Props, State> {
   public readonly state: State = {
      name: this.props.existingUserData ? this.props.existingUserData.name : "",
      compClass: this.props.existingUserData ? this.props.existingUserData.compClass : undefined,
   }
   constructor(props: Props) {
      super(props);
   }

   componentDidMount() { 
      this.props.loadContest!();
   }

   handleNameCodeChange = (event: React.FormEvent<HTMLInputElement>) => {
      this.state.name = event.currentTarget.value;
      this.setState(this.state);
   }

   setCompClass = (compClass:string) => {
      this.state.compClass = compClass;
      this.setState(this.state);
   }

   onSubmit = () => { 
      var userData: UserData = {
         code: this.props.activationCode!,
         name: this.state.name!,
         compClass: this.state.compClass!,
         problems: []
      };
      this.props.saveUserData!(userData).then(this.props.onFinished!)
   }
   
   render() {
      if (!this.props.contest) {
         return (
            <div>Getting data...</div>
         )
      } 
      let compClasses = this.props.contest.compClasses.map(compClass => (
         <div key={compClass.name} className={compClass.name == this.state.compClass ? "selector compClass selected" : "selector compClass"} onClick={() => this.setCompClass(compClass.name)}>
            <div>{compClass.name}</div>
            <div className="compClassDescription">{compClass.description}</div>
         </div>
      ));

      var buttons;
      if(this.props.showCancelButton) {
         buttons = (
             <div className="buttonRow">
                <button onClick={this.onSubmit}>Ok</button>
                <button onClick={this.props.onFinished}>Cancel</button>
             </div>
         )
      } else {
         buttons = (
             <div>
                <button onClick={this.onSubmit}>Start</button>
             </div>
         )
      }

      return (
         <div className="startView view">
            Name:
            <input value={this.state.name} onChange={this.handleNameCodeChange} />
            <div className="compClassContainer">{compClasses}</div>
            {buttons}
         </div>
      );
   }
}
