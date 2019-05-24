import * as React from 'react';
import {Button} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import withStyles from "@material-ui/core/styles/withStyles";
import MenuIcon from '@material-ui/icons/Menu';

export interface TopMenuCompProps {
   classes: any
}

const styles = {
   root: {
      flexGrow: 1,
   },
   grow: {
      flexGrow: 1,
   },
   menuButton: {
      marginLeft: -12,
      marginRight: 20,
   },
};

function TopMenuComp({classes }: TopMenuCompProps) {
   return (
      <div>
         <AppBar position="static">
            <Toolbar>
               <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                  <MenuIcon />
               </IconButton>
               <Typography variant="h6" color="inherit" className={classes.grow}>
                  News
               </Typography>
               <Button color="inherit">Login</Button>
            </Toolbar>
         </AppBar>

      </div>
   );
}

export default withStyles(styles)(TopMenuComp);
