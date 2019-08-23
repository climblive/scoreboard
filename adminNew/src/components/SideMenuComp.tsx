import * as React from 'react';
import {Link} from "react-router-dom";
import {Palette, TableChart} from "@material-ui/icons";
import {Button, StyledComponentProps, Theme} from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import {User} from "../model/user";

export interface SideMenuCompProps {
   loggedInUser?: User
}

const styles = ({ spacing }: Theme) => createStyles({
   sideMenu: {
      background:'white',
      width:150,
      boxShadow: "2px 0px 3px rgba(0,0,0,0.14)",
      zIndex:2,
      backgroundImage:"url('/sideMenuBackground.jpg')",
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "bottom"
   },
   menuItem: {
      width:"100%",
      display:"flex"
   },
   menuText: {
      flexGrow: 1,
      textAlign: "left",
      marginLeft: spacing(1),
      textDecoration:"none"
   }
});

function SideMenuComp({ classes, loggedInUser }: SideMenuCompProps & StyledComponentProps) {
   return (
       <div className={classes!!.sideMenu}>
          <div style={{textAlign:'center'}}>
               <img style={{width:120, marginTop:20}} src="/clmb_MainLogo_NoShadow.png"/>
          </div>
          {loggedInUser && <div>
              <Link to="/"><Button className={classes!!.menuItem}><TableChart /><span className={classes!!.menuText}>Start</span></Button></Link>
              <Link to="/contests"><Button className={classes!!.menuItem}><TableChart /><span className={classes!!.menuText}>Contests</span></Button></Link>
              <Link to="/colors"><Button className={classes!!.menuItem}><Palette /><span className={classes!!.menuText}>Colors</span></Button></Link>
              {loggedInUser.admin && <Link to="/locations"><Button className={classes!!.menuItem}><Palette /><span className={classes!!.menuText}>Locations</span></Button></Link>}
              {loggedInUser.admin && <Link to="/organizers"><Button className={classes!!.menuItem}><Palette /><span className={classes!!.menuText}>Organizers</span></Button></Link>}
              {loggedInUser.admin && <Link to="/series"><Button className={classes!!.menuItem}><Palette /><span className={classes!!.menuText}>Series</span></Button></Link>}
          </div>}
      </div>
   );
}

export default withStyles(styles)(SideMenuComp);
