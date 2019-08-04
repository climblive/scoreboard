import * as React from 'react';
import {Link} from "react-router-dom";
import {Palette, TableChart} from "@material-ui/icons";
import {Button, StyledComponentProps, Theme} from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import {User} from "../model/user";

export interface Props {
}

const styles = ({ spacing }: Theme) => createStyles({
   test: {
      background:'white',
   }
});

function WelcomeView({ classes }: Props & StyledComponentProps) {
   return (
      <div style={{maxWidth:350, margin: "0 auto"}}>
         <div style={{fontSize: 20, fontWeight: "bold", marginTop: 30}}>
            Welcome to clmb.live - bouldering contests made easy!
         </div>
         <div style={{marginTop:10}}>
            Clmb.live is targeting small boulder contests, where the contenders keep track of their results by themselves.
         </div>
         <div style={{marginTop:5}}>
            Normally this is made with scoreboards on paper, but now you can replace it with a web page instead.
         </div>
         <div style={{marginTop:5}}>
            Easier to get the results right, and you get live results during the competitions. People can even follow the contests remotely!
         </div >
         <div style={{marginTop:10}}>
            To create your own contests - please register above.
         </div>
      </div>
   );
}

export default withStyles(styles)(WelcomeView);
