import * as React from 'react';
import './StartView.css';

export interface Props {
}

function StartView({ }: Props) {

   var name : string = "Jesper Sölver";
   var activationCode :string = "GHRF";

   var handleActivationCodeChange = (event: React.FormEvent<HTMLInputElement>) => {
      activationCode = event.currentTarget.value
      console.log(event.currentTarget.value)
   }

   var handleNameCodeChange = (event: React.FormEvent<HTMLInputElement>) => {
      name = event.currentTarget.value
      console.log(event.currentTarget.value)
   }

   var onSubmit = () => { 
      console.log(name + " " + activationCode);
   }
   
   return (
      <div className="startView">
         Activation code:
         <input value={activationCode} onChange={handleActivationCodeChange} />
         Name:
         <input value={name} onChange={handleNameCodeChange} />
         <div>
            <button onClick={onSubmit}>Start</button>
         </div>
      </div>
   );
}

export default StartView;