import * as React from 'react';
import {Button, StyledComponentProps} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import withStyles from "@material-ui/core/styles/withStyles";
import {RouteComponentProps, withRouter} from "react-router";
import * as qs from "qs";
import CircularProgress from "@material-ui/core/CircularProgress";

export interface TopMenuCompProps {
   title:string
   loggingIn: boolean
   loggedInUser?: string
   login?: (code: string) => void
   logout?: () => void
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

class TopMenuComp extends React.Component<TopMenuCompProps & RouteComponentProps & StyledComponentProps> {

   componentDidMount() {
      console.log(this.props);
      /*let query = qs.parse(this.props.location.search, {
         ignoreQueryPrefix: true
      });*/
      let query = qs.parse(this.props.location.hash, {
         ignoreQueryPrefix: true
      });
      const accessToken = query.access_token;
      if(accessToken) {
         console.log("accessToken " + accessToken);
         this.props.login!(accessToken);
         this.props.history.push("/");
      }
   }

   getUrl = (command:string) => {
      console.log(encodeURIComponent(window.location.origin));

      let url = "https://clmb.auth.eu-west-1.amazoncognito.com/";
      url += command;
      // Response type token or code
      url += "?response_type=token&client_id=55s3rmvp8t26lmi0898n9d1lfn&redirect_uri=";
      url += encodeURIComponent(window.location.origin);
      console.log(url);
      return url;
   };

   login = () => {
      window.location.href = this.getUrl("login");
   };

   signup = () => {
      window.location.href = this.getUrl("signup");
   };

   render() {
      const title = this.props.title;
      const loggingIn = this.props.loggingIn;
      const loggedInUser = this.props.loggedInUser;
      const classes = this.props.classes!!;
      return (
         <div>
            <AppBar position="static">
               <Toolbar>
                  <Typography variant="h6" color="inherit" className={classes.grow}>
                     {title}
                  </Typography>
                  {loggingIn && <CircularProgress style={{color:"white", width:20, height:20}}/>}
                  {(!loggingIn && !loggedInUser) && <div>
                      <Button color="inherit" onClick={this.login}>Login</Button>
                      <Button color="inherit" onClick={this.signup}>Sign up</Button>
                  </div>}
                  {loggedInUser && <div>
                     <span>{loggedInUser}</span>
                     <Button color="inherit" onClick={this.props.logout!}>Logout</Button>
                  </div>}
               </Toolbar>
            </AppBar>

         </div>
      );
   }
}

export default withStyles(styles)(withRouter(TopMenuComp));
