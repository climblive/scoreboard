import * as React from 'react';
import './StartView.css';
import { Redirect } from 'react-router';
import { UserData } from '../model/userData';
import { Contest } from '../model/contest';

export interface Props {
   contest: Contest,
   saveUserData?: (userData: UserData) => Promise<UserData>,
   loadContest?: () => void
}

type State = {
   name?: string,
   activationCode?: string,
   compClass?: string,
   redirect: boolean
}

export default class StartView extends React.Component<Props, State> {
   public readonly state: State = {
      name: "Jesper Sölver",
      activationCode: "dalfsdk",
      redirect: false
   }
   constructor(props: Props) {
      super(props);
   }

   componentDidMount() { 
      this.props.loadContest!();
   }

   handleActivationCodeChange = (event: React.FormEvent<HTMLInputElement>) => {
      this.state.activationCode = event.currentTarget.value;
      this.setState(this.state);
      console.log(this.state);
   }

   handleNameCodeChange = (event: React.FormEvent<HTMLInputElement>) => {
      this.state.name = event.currentTarget.value;
      this.setState(this.state);
      console.log(this.state);
   }

   setCompClass = (compClass:string) => {
      this.state.compClass = compClass;
      this.setState(this.state);
      console.log(this.state);
   }

   onSubmit = () => { 
      console.log(this.state.name + " " + this.state.activationCode);
      var userData: UserData = {
         code: this.state.activationCode!,
         name: this.state.name!, 
         compClass: this.state.compClass!,
         problems: []
      };
      this.props.saveUserData!(userData).then(() => { 
         this.state.redirect = true;
         this.setState(this.state);
      })
   }
   
   render() {
      if (this.state.redirect) { 
         return <Redirect to={"/" + this.state.activationCode} />
      }
      if (!this.props.contest) {
         return (
            <div>Getting data...</div>
         )
      } 
      var compClasses = this.props.contest.compClasses.map(compClass => (
         <div key={compClass} className={compClass == this.state.compClass ? "compClass selected" : "compClass"} onClick={() => this.setCompClass(compClass)}>{compClass}</div>
      ));

      return (
         <div className="startView view">
            Activation code:
            <input value={this.state.activationCode} onChange={this.handleActivationCodeChange} />
            Name:
            <input value={this.state.name} onChange={this.handleNameCodeChange} />
            <div className="compClassContainer">{compClasses}</div>
            <div>
               <button onClick={this.onSubmit}>Start</button>
            </div>
         </div>
      );
   }
}
