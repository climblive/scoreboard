import * as React from 'react';
import './StartView.css';
import { Redirect } from 'react-router';
import { UserData } from '../model/userData';

export interface Props {
   saveUserData?: (userData: UserData) => Promise<UserData>
}

type State = {
   name: string,
   activationCode: string,
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

   onSubmit = () => { 
      console.log(this.state.name + " " + this.state.activationCode);
      var userData: UserData = {
         code: this.state.activationCode,
         name: this.state.name, 
         compClass: "Herr",
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
      return (
         <div className="startView">
            Activation code:
            <input value={this.state.activationCode} onChange={this.handleActivationCodeChange} />
            Name:
            <input value={this.state.name} onChange={this.handleNameCodeChange} />
            <div>
               <button onClick={this.onSubmit}>Start</button>
            </div>
         </div>
      );
   }
}
