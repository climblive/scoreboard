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
   gridLine: {
      display:"flex"
   },
   gridImg: {
      flexBasis:0,
      flexGrow:1,
      flexShrink:1,
      width:"50%"
   },
   gridText: {
      padding:10,
      flexBasis:0,
      flexGrow:1,
      flexShrink:1
   },
   paragraph: {
      marginBottom: 10,
   }
});

function WelcomeView({ classes }: Props & StyledComponentProps) {
   return (
      <div style={{flexBasis:0, flexGrow:1, overflowY:"auto"}}>
         <div style={{maxWidth:600, margin: "20px auto"}}>
            <div style={{fontSize: 20, fontWeight: "bold", marginTop: 10, marginBottom:20}}>
               Welcome to clmb.live - bouldering contests made easy!
            </div>
            <div className={classes!.gridLine}>
               <div className={classes!.gridText}>
                  <div className={classes!.paragraph}>Clmb.live is targeting small boulder contests, where the contenders keep track of their results by themselves.</div>
                  <div className={classes!.paragraph}>Normally this is made with scoreboards on paper, but now you can replace or combine it with a web page.</div>
               </div>
               <img className={classes!.gridImg} src="/images/contender.jpg"/>
            </div>
            <div className={classes!.gridLine}>
               <img className={classes!.gridImg} src="/images/scoreboard.jpg"/>
               <div className={classes!.gridText}>
                  <div className={classes!.paragraph}>You get live results during the contests, with instant updates when contenders reports progress.</div>
                  <div className={classes!.paragraph}>Easier to follow for spectators, and more exciting for the contenders.</div>
               </div>
            </div>
            <div className={classes!.gridLine}>
               <div className={classes!.gridText}>
                  <div className={classes!.paragraph}>No calculations required by the contenders, and the results are available directly when the contest ends.</div>
                  <div className={classes!.paragraph}>People can even follow contests remotely!</div>
               </div >
               <img className={classes!.gridImg} src="/images/remote.jpg"/>
            </div >
            <div className={classes!.gridLine}>
               <img className={classes!.gridImg} src="/images/admin.jpg"/>
               <div className={classes!.gridText}>
                  <div className={classes!.paragraph}>Create your own contests easily in a web frontend.</div>
                  <div className={classes!.paragraph}>Please sign up above to try it out. It's completely free, and we have no plans to change it.</div>
               </div>
            </div >
         </div>
      </div>
   );
}

export default withStyles(styles)(WelcomeView);
