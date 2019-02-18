import * as React from 'react';
import './StartView.css';
import { Redirect } from 'react-router';

export interface Props {
}

type State = {
   activationCode?: string,
   redirect: boolean
}

export default class StartView extends React.Component<Props, State> {
   public readonly state: State = {
      redirect: false
   }
   constructor(props: Props) {
      super(props);
   }

   componentDidMount() { 
      document.title = "Välkommen till clbm.live"
   }

   handleActivationCodeChange = (event: React.FormEvent<HTMLInputElement>) => {
      this.state.activationCode = event.currentTarget.value;
      this.setState(this.state);
   }

   onSubmit = () => {
      this.state.redirect = true;
      this.setState(this.state);
   }
   
   render() {
      if (this.state.redirect) { 
         return <Redirect to={"/" + this.state.activationCode} />
      }

      return (
         <div className="startView view">
            Activation code:
            <input value={this.state.activationCode} onChange={this.handleActivationCodeChange} />
            <div>
               <button onClick={this.onSubmit}>Start</button>
            </div>
         </div>
      );
   }
}
