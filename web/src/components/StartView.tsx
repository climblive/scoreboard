import './StartView.css';
import { Redirect } from 'react-router';
import * as React from "react";

export interface Props {
}

type State = {
   activationCode: string,
   redirect: boolean
}

export default class StartView extends React.Component<Props, State> {

   public readonly state: State = {
      activationCode:"",
      redirect: false
   };

   constructor(props: Props) {
      super(props);
   }

   componentDidMount() { 
      document.title = "Välkommen till clbm.live"
   }

   handleActivationCodeChange = (event: React.FormEvent<HTMLInputElement>) => {
      this.state.activationCode = event.currentTarget.value;
      this.setState(this.state);
   };

   inputOk(): boolean {
      return this.state.activationCode != undefined && this.state.activationCode.length > 6;
   }

   onSubmit = () => {
      if(this.inputOk()) {
         this.state.redirect = true;
         this.setState(this.state);
      }
   };
   
   render() {
      if (this.state.redirect) { 
         return <Redirect push to={"/" + this.state.activationCode} />
      }
      let buttonClass = this.inputOk() ? "" : "disabled";

      return (
         <div className="maxWidth">
            <div className="startView view">
               <div className="activationWrapper">
                  <div className="message" style={{marginBottom:10}}>Ange din aktiveringskod</div>
                  <input autoFocus value={this.state.activationCode} onChange={this.handleActivationCodeChange} />
                  <button className={buttonClass} onClick={this.onSubmit}>Fortsätt</button>
               </div>
            </div>
         </div>
      );
   }
}
