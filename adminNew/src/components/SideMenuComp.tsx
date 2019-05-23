import * as React from 'react';
import {Link} from "react-router-dom";

export interface SideMenuCompProps {
}

function SideMenuComp({ }: SideMenuCompProps) {
   return (
       <div style={{background:'yellow', width:150}}>
          <div style={{textAlign:'center'}}>
               <img style={{width:120, marginTop:20}} src="clmb_MainLogo_NoShadow.png"/>
          </div>
          <Link to="/colors">Colors</Link>
          <br/>
          <Link to="/contests">Contests</Link>
      </div>
   );
}

export default SideMenuComp;
