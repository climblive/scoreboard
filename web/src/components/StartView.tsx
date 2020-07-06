import './StartView.css';
import { Redirect } from 'react-router';
import * as React from "react";
import {StoreState} from "../model/storeState";
import {connect, Dispatch} from "react-redux";
import {ContenderData} from "../model/contenderData";
import * as asyncActions from "../actions/asyncActions";
import {Environment} from "../environment";

export interface Props {
}

type State = {
   activationCode: string,
   redirect: boolean
}

class StartView extends React.Component<Props, State> {

   public readonly state: State = {
      activationCode:"",
      redirect: false
   };

   constructor(props: Props) {
      super(props);
   }

   componentDidMount() { 
      document.title = "Välkommen till ClimbLive"
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
                  <input autoFocus style={{textTransform: 'uppercase'}} value={this.state.activationCode} onChange={this.handleActivationCodeChange} onKeyUp={this.handleActivationCodeKeyUp}/>
                  <button className={buttonClass} onClick={this.onSubmit}>Fortsätt</button>
               </div>
               <div style={{background:"rgba(0, 0, 0, 0.6)", textAlign: "center", padding:10, color:"white", borderRadius:7, marginTop:"auto", marginBottom:20, marginLeft:20, marginRight:20}}>
                  <div>Vill du använda ClimbLive till din egna bouldertävling?</div>
                  <div style={{marginTop:10}}><a href={"https://admin." + Environment.siteDomain}>Klicka här</a> eller besök oss på <a href={"https://www.facebook.com/CLMB.live"}>Facebook</a>!</div>
               </div>
            </div>
         </div>
      );
   }
}

function mapStateToProps(state: StoreState, props: any): Props {
   return {
      contest: state.contest
   };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      saveUserData: (contenderData: ContenderData) => dispatch(asyncActions.saveUserData(contenderData))
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(StartView);
