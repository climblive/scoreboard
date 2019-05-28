import * as React from 'react';
import { Contest } from '../model/contest';
import {StyledComponentProps, TableCell, Theme} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import createStyles from "@material-ui/core/styles/createStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {StoreState} from "../model/storeState";
import {connect, Dispatch} from "react-redux";
import * as asyncActions from "../actions/asyncActions";
import * as actions from "../actions/actions";

const styles = ({ spacing }: Theme) => createStyles({
   root: {
      width: '100%',
      marginTop: spacing.unit * 3,
      overflowX: 'auto',
   },
   table: {
      minWidth: 700,
   },
});

interface Props  {
   contests: Contest[],
   loadContests?: () => void,
   setTitle?: (title: string) => void,
}

type State = {
   goBack: boolean
}

class ContestsView extends React.Component<Props & RouteComponentProps & StyledComponentProps, State> {
   public readonly state: State = {
      goBack: false
   };

   constructor(props: Props & RouteComponentProps & StyledComponentProps) {
      super(props);
   }

   componentDidMount() {
      this.props.loadContests!();
      this.props.setTitle!("Contests");
   }

   render() {
      let contests = this.props.contests;
      let classes = this.props.classes!!;
      if(!contests) {
         return (<CircularProgress/>)
      }
      return (
         <div className="mainView">
            <Paper className={classes.root}>
               <Table className={classes.table}>
                  <TableHead>
                     <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Location</TableCell>
                        <TableCell align="right">Organizer</TableCell>
                        <TableCell align="right">Qualifying problems</TableCell>
                        <TableCell>Rules</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {contests.map(contest => (
                        <TableRow key={contest.id}
                                  style={{cursor:'pointer'}}
                                  hover
                                  onClick={() => this.props.history.push("/contests/" + contest.id)}>
                           <TableCell component="th" scope="row">{contest.name}</TableCell>
                           <TableCell>{contest.description}</TableCell>
                           <TableCell align="right">{contest.locationId}</TableCell>
                           <TableCell align="right">{contest.organizerId}</TableCell>
                           <TableCell align="right">{contest.qualifyingProblems}</TableCell>
                           <TableCell>{contest.rules}</TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </Paper>
         </div>
      );
   }
}

function mapStateToProps(state: StoreState, props: any): Props {
   return {
      contests: state.contests,
   };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      loadContests: () => dispatch(asyncActions.loadContests()),
      setTitle: (title:string) => dispatch(actions.setTitle(title)),
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ContestsView)));
