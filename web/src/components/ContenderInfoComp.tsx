import * as React from 'react';
import './ContenderInfoComp.css';
import { ContenderData } from '../model/contenderData';
import { Contest } from '../model/contest';
import {CompClass} from "../model/compClass";

export interface Props {
   activationCode : string,
   contest: Contest,
   compClasses: CompClass[],
   existingUserData: ContenderData,
   showCancelButton?: boolean,
   saveUserData?: (userData: ContenderData) => Promise<ContenderData>,
   onFinished?: () => void
}

type State = {
   id: number
   name?: string,
   compClassId?: number,
   entered?: string
}

export default class ContenderInfoComp extends React.Component<Props, State> {
   public readonly state: State = {
      id: this.props.existingUserData.id,
      entered: this.props.existingUserData.entered,
      name: this.props.existingUserData.name,
      compClassId: this.props.existingUserData.compClassId
   };

   constructor(props: Props) {
      super(props);
   }

   handleNameCodeChange = (event: React.FormEvent<HTMLInputElement>) => {
      this.state.name = event.currentTarget.value;
      this.setState(this.state);
   };

   setCompClass = (compClassId:number) => {
      this.state.compClassId = compClassId;
      this.setState(this.state);
   };

   onSubmit = () => {
      if(this.inputOk()) {
         let contenderData: ContenderData = {
            id: this.state.id,
            entered: this.state.entered,
            registrationCode: this.props.activationCode!,
            name: this.state.name!,
            compClassId: this.state.compClassId!,
            contestId: this.props.contest.id
         };
         this.props.saveUserData!(contenderData).then(this.props.onFinished!)
      }
   };

   inputOk(): boolean {
      return this.state.compClassId !== undefined && this.state.name !== undefined && this.state.name.trim().length > 1;
   }
   
   render() {
      console.log(this.props);
      if (!this.props.contest) {
         return (
            <div>Getting data...</div>
         )
      }
      let submitButtonClass = this.inputOk() ? "" : "disabled";
      let compClasses = this.props.compClasses.map(compClass => (
         <div key={compClass.name}
              className={compClass.id == this.state.compClassId ? "selector compClass selected" : "selector compClass"}
              onClick={() => this.setCompClass(compClass.id)}>
            <div>{compClass.name}</div>
            <div className="compClassDescription">{compClass.description}</div>
         </div>
      ));

      let buttons;
      if(this.props.showCancelButton) {
         buttons = (
             <div className="buttonRow">
                <button className={submitButtonClass} onClick={this.onSubmit}>Ok</button>
                <button onClick={this.props.onFinished}>Cancel</button>
             </div>
         )
      } else {
         buttons = (
             <div>
                <button className={submitButtonClass} onClick={this.onSubmit}>Start</button>
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
