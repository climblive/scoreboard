import * as React from 'react';
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
import TextField from "@material-ui/core/TextField";
import {ConfirmationDialog} from "../components/ConfirmationDialog";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from "@material-ui/icons/Cancel";
import AddIcon from '@material-ui/icons/AddCircleOutline';
import {Series} from "../model/series";

const styles = ({ spacing }: Theme) => createStyles({
   root: {
      width: '100%',
   },
   table: {
      minWidth: 700,
   },
});

interface Props  {
   series?: Series[],
   editSeries?:Series,

   loadSeries?: () => void,
   setTitle?: (title: string) => void,
   startEditSeries?:(series:Series) => void
   cancelEditSeries?:() => void
   saveEditSeries?:() => void
   startAddSeries?:() => void
   deleteSeries?:(series:Series) => void
   updateEditSeries?:(propName:string, propValue?:any) => void
}

type State = {
   deleteSeries?:Series
}

class SeriesView extends React.Component<Props & RouteComponentProps & StyledComponentProps, State> {
   public readonly state: State = {
   };

   constructor(props: Props & RouteComponentProps & StyledComponentProps) {
      super(props);
   }

   componentDidMount() {
      this.props.loadSeries!();
      this.props.setTitle!("Series");
   }

   deleteSeries = (series:Series) => {
      this.state.deleteSeries = series;
      this.setState(this.state);
   };

   onDeleteConfirmed = (result: boolean) => {
      if(result) {
         this.props.deleteSeries!(this.state.deleteSeries!);
      }
      this.state.deleteSeries = undefined;
      this.setState(this.state)
   };

   onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.updateEditSeries!("name", e.target.value);
   };

   render() {
      let seriesList = this.props.series;
      let classes = this.props.classes!!;
      let editSeries = this.props.editSeries;
      if(!seriesList) {
         return (<div style={{textAlign: "center", marginTop:10}}><CircularProgress/></div>)
      }
      return (
         <Paper className={classes.root} style={{flexGrow:1, display:"flex", flexDirection:"column"}}>
            <div style={{flexBasis:0, flexGrow:1, overflowY:"auto"}}>
               <Table className={classes.table}>
                  <TableHead>
                     <TableRow>
                        <TableCell style={{width:"100%"}}>Name</TableCell>
                        <TableCell className={"icon-cell"} style={{minWidth:96}}>
                           <IconButton color="inherit" aria-label="Menu" title="Add serie" onClick={this.props.startAddSeries}>
                              <AddIcon />
                           </IconButton>
                        </TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {seriesList.map(series => {
                        if(editSeries == undefined || series.id != editSeries.id) {
                           return (
                              <TableRow key={series.id}>
                                 <TableCell component="th" scope="row">{series.name}</TableCell>
                                 <TableCell className={"icon-cell"}>
                                    <IconButton color="inherit" aria-label="Menu" title="Edit"
                                                onClick={() => this.props.startEditSeries!(series)}>
                                       <EditIcon/>
                                    </IconButton>
                                    <IconButton color="inherit" aria-label="Menu" title="Delete"
                                                onClick={() => this.deleteSeries(series)}>
                                       <DeleteIcon/>
                                    </IconButton>
                                 </TableCell>

                              </TableRow>
                           )
                        } else {
                           return (
                              <TableRow key={series.id}>
                                 <TableCell component="th" scope="row">
                                    <TextField style={{}} value={editSeries.name} onChange={this.onNameChange} />
                                 </TableCell>
                                 <TableCell>
                                    <IconButton color="inherit" aria-label="Menu" title="Save"
                                       onClick={this.props.saveEditSeries!}>
                                       <CheckIcon/>
                                    </IconButton>
                                    <IconButton color="inherit" aria-label="Menu" title="Cancel"
                                       onClick={this.props.cancelEditSeries!}>
                                       <CancelIcon/>
                                    </IconButton>
                                 </TableCell>
                              </TableRow>
                           )
                        }
                     })}
                  </TableBody>
               </Table>
            </div>
            <ConfirmationDialog open={this.state.deleteSeries != undefined}
                                title={"Delete series"}
                                message={"Do you wish to delete the selected series?"}
                                onClose={this.onDeleteConfirmed} />
         </Paper>
      );
   }
}

function mapStateToProps(state: StoreState, props: any): Props {
   return {
      series: state.series,
      editSeries: state.editSeries,
   };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      loadSeries: () => dispatch(asyncActions.loadSeries()),
      setTitle: (title:string) => dispatch(actions.setTitle(title)),

      startEditSerie: (serie: Series) => dispatch(actions.startEditSeries(serie)),
      cancelEditSeries: () => dispatch(actions.cancelEditSeries()),
      saveEditSeries: () => dispatch(asyncActions.saveEditSeries()),
      startAddSeries: () => dispatch(actions.startAddSeries()),
      deleteSeries: (series: Series) => dispatch(asyncActions.deleteSeries(series)),
      updateEditSeries: (propName:string, value:any) => dispatch(actions.updateEditSeries({propName: propName, value: value})),
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(SeriesView)));
