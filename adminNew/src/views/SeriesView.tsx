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
import {Serie} from "../model/serie";

const styles = ({ spacing }: Theme) => createStyles({
   root: {
      width: '100%',
   },
   table: {
      minWidth: 700,
   },
});

interface Props  {
   series: Serie[],
   editSerie?:Serie,

   loadSeries?: () => void,
   setTitle?: (title: string) => void,
   startEditSerie?:(serie:Serie) => void
   cancelEditSerie?:() => void
   saveEditSerie?:() => void
   startAddSerie?:() => void
   deleteSerie?:(serie:Serie) => void
   updateEditSerie?:(propName:string, propValue?:any) => void
}

type State = {
   deleteSerie?:Serie
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

   deleteSerie = (serie:Serie) => {
      this.state.deleteSerie = serie;
      this.setState(this.state);
   };

   onDeleteConfirmed = (result: boolean) => {
      if(result) {
         this.props.deleteSerie!(this.state.deleteSerie!);
      }
      this.state.deleteSerie = undefined;
      this.setState(this.state)
   };

   onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.updateEditSerie!("name", e.target.value);
   };

   render() {
      let series = this.props.series;
      let classes = this.props.classes!!;
      let editSerie = this.props.editSerie;
      if(!series) {
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
                           <IconButton color="inherit" aria-label="Menu" title="Add serie" onClick={this.props.startAddSerie}>
                              <AddIcon />
                           </IconButton>
                        </TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {series.map(serie => {
                        if(editSerie == undefined || serie.id != editSerie.id) {
                           return (
                              <TableRow key={serie.id}>
                                 <TableCell component="th" scope="row">{serie.name}</TableCell>
                                 <TableCell className={"icon-cell"}>
                                    <IconButton color="inherit" aria-label="Menu" title="Edit"
                                                onClick={() => this.props.startEditSerie!(serie)}>
                                       <EditIcon/>
                                    </IconButton>
                                    <IconButton color="inherit" aria-label="Menu" title="Delete"
                                                onClick={() => this.deleteSerie(serie)}>
                                       <DeleteIcon/>
                                    </IconButton>
                                 </TableCell>

                              </TableRow>
                           )
                        } else {
                           return (
                              <TableRow key={serie.id}>
                                 <TableCell component="th" scope="row">
                                    <TextField style={{}} value={editSerie.name} onChange={this.onNameChange} />
                                 </TableCell>
                                 <TableCell>
                                    <IconButton color="inherit" aria-label="Menu" title="Save"
                                       onClick={this.props.saveEditSerie!}>
                                       <CheckIcon/>
                                    </IconButton>
                                    <IconButton color="inherit" aria-label="Menu" title="Cancel"
                                       onClick={this.props.cancelEditSerie!}>
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
            <ConfirmationDialog open={this.state.deleteSerie != undefined}
                                title={"Delete serie"}
                                message={"Do you wish to delete the selected serie?"}
                                onClose={this.onDeleteConfirmed} />
         </Paper>
      );
   }
}

function mapStateToProps(state: StoreState, props: any): Props {
   return {
      series: state.series,
      editSerie: state.editSerie,
   };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      loadSeries: () => dispatch(asyncActions.loadSeries()),
      setTitle: (title:string) => dispatch(actions.setTitle(title)),

      startEditSerie: (serie: Serie) => dispatch(actions.startEditSerie(serie)),
      cancelEditSerie: () => dispatch(actions.cancelEditSerie()),
      saveEditSerie: () => dispatch(asyncActions.saveEditSerie()),
      startAddSerie: () => dispatch(actions.startAddSerie()),
      deleteSerie: (serie: Serie) => dispatch(asyncActions.deleteSerie(serie)),
      updateEditSerie: (propName:string, value:any) => dispatch(actions.updateEditSerie({propName: propName, value: value})),
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(SeriesView)));
