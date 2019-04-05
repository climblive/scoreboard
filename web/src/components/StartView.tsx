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

   handleActivationCodeKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if(event.keyCode == 13) {
         this.onSubmit();
      }
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
      let buttonClass = this.inputOk() ? "large " : "large disabled";

      return (
         <div className="maxWidth">
            <div className="startView view">
               <img style={{width:200, position:'absolute', top:70, right: 0, marginRight: 'auto',left: 0, marginLeft: 'auto'}} src="clmb_MainLogo_NoShadow.png"/>
               <div className="activationWrapper">
                  <div className="message" style={{marginBottom:10}}>Ange din aktiveringskod</div>
                  <input autoFocus value={this.state.activationCode} onChange={this.handleActivationCodeChange} onKeyUp={this.handleActivationCodeKeyUp}/>
                  <button className={buttonClass} onClick={this.onSubmit}>Fortsätt</button>
               </div>
            </div>
         </div>
      );
   }
}
