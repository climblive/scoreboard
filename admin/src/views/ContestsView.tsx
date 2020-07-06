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
import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/AddCircleOutline';
import {getLocationMap, getOrganizerContests, getOrganizerMap, getSeriesMap} from "../selectors/selector";
import {Organizer} from "../model/organizer";
import {CompLocation} from "../model/compLocation";
import {Series} from 'src/model/series';

const styles = ({ spacing }: Theme) => createStyles({
   root: {
      margin:10
   },
   table: {
      minWidth: 700,
   },
});

interface Props  {
   contests?: Contest[],
   organizerMap: Map<number, Organizer>
   locationMap: Map<number, CompLocation>
   seriesMap: Map<number, Series>
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

   getOrganizerName = (id: number) => {
      return this.props.organizerMap.get(id)?.name;
   };

   getLocationName = (id?: number) => {
      if (id) {
         return this.props.locationMap.get(id)?.name;
      } else {
         return undefined;
      }
   };

   getSeriesName = (id?: number) => {
      if (id) {
         return this.props.seriesMap.get(id)?.name;
      } else {
         return undefined;
      }
   };

   render() {
      let contests = this.props.contests;
      let classes = this.props.classes!!;
      if(!contests) {
         return (<div style={{textAlign: "center", marginTop:10}}><CircularProgress/></div>)
      }
      return (
         <Paper className={classes.root} style={{flexGrow:1, display:"flex", flexDirection:"column"}}>
            <div style={{flexBasis:0, flexGrow:1, overflowY:"auto"}} >
               <Table className={classes.table}>
                  <TableHead>
                     <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Series</TableCell>
                        <TableCell>Qualifying problems</TableCell>
                        <TableCell className={"icon-cell"}>
                           <IconButton color="inherit" aria-label="Menu" title="Add contest" onClick={() => this.props.history.push("/contests/new")}>
                              <AddIcon />
                           </IconButton>
                        </TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {contests.map(contest => (
                        <TableRow key={contest.id}
                                  style={{cursor:'pointer'}}
                                  hover
                                  onClick={() => this.props.history.push("/contests/" + contest.id)}>
                           <TableCell component="th" scope="row">{contest.name}</TableCell>
                           <TableCell>{this.getLocationName(contest.locationId)}</TableCell>
                           <TableCell>{this.getSeriesName(contest.seriesId)}</TableCell>
                           <TableCell colSpan={2}>{contest.qualifyingProblems}</TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
               {(contests != undefined && contests.length == 0) && <div className={"emptyText"}>
                   <div style={{fontWeight:"bold"}}>Hi, and welcome to ClimbLive!</div>
                   <div>Create your first contest by clicking the plus button above.</div>
               </div>}
            </div>
         </Paper>
      );
   }
}

function mapStateToProps(state: StoreState, props: any): Props {
   return {
      contests: getOrganizerContests(state),
      organizerMap: getOrganizerMap(state),
      locationMap: getLocationMap(state),
      seriesMap: getSeriesMap(state)
   };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      loadContests: () => dispatch(asyncActions.loadContests()),
      setTitle: (title:string) => dispatch(actions.setTitle(title)),
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ContestsView)));
