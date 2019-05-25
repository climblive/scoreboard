import * as React from 'react';
import './ContestsView.css';
import { ContenderData } from '../model/contenderData';
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

export interface Props  {
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
                        <TableCell>Dessert (100g serving)</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Fat (g)</TableCell>
                        <TableCell align="right">Carbs (g)</TableCell>
                        <TableCell align="right">Protein (g)</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {contests.map(contest => (
                        <TableRow key={contest.id}
                                  style={{cursor:'pointer'}}
                                  hover
                                  onClick={() => this.props.history.push("/contests/" + contest.id)}>
                           <TableCell component="th" scope="row">
                              {contest.name}
                           </TableCell>
                           <TableCell align="right">{contest.name}</TableCell>
                           <TableCell align="right">{contest.name}</TableCell>
                           <TableCell align="right">{contest.name}</TableCell>
                           <TableCell align="right">{contest.name}</TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </Paper>



         </div>
      );
   }
}

export default withStyles(styles)(withRouter(ContestsView));