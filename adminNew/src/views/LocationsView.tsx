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
import {CompLocation} from "../model/compLocation";

const styles = ({ spacing }: Theme) => createStyles({
   root: {
      width: '100%',
   },
   table: {
      minWidth: 700,
   },
});

interface Props  {
   locations?: CompLocation[],
   editLocation?:CompLocation,

   setTitle?: (title: string) => void,
   startEditLocation?:(location:CompLocation) => void
   cancelEditLocation?:() => void
   saveEditLocation?:() => void
   startAddLocation?:() => void
   deleteLocation?:(location:CompLocation) => void
   updateEditLocation?:(propName:string, propValue?:any) => void
}

type State = {
   deleteLocation?:CompLocation
}

class LocationsView extends React.Component<Props & RouteComponentProps & StyledComponentProps, State> {
   public readonly state: State = {
   };

   constructor(props: Props & RouteComponentProps & StyledComponentProps) {
      super(props);
   }

   componentDidMount() {
      this.props.setTitle!("Locations");
   }

   deleteLocation = (location:CompLocation) => {
      this.state.deleteLocation = location;
      this.setState(this.state);
   };

   onDeleteConfirmed = (result: boolean) => {
      if(result) {
         this.props.deleteLocation!(this.state.deleteLocation!);
      }
      this.state.deleteLocation = undefined;
      this.setState(this.state)
   };

   onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.updateEditLocation!("name", e.target.value);
   };

   render() {
      let locations = this.props.locations;
      let classes = this.props.classes!!;
      let editLocation = this.props.editLocation;
      if(!locations) {
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
                           <IconButton color="inherit" aria-label="Menu" title="Add serie" onClick={this.props.startAddLocation}>
                              <AddIcon />
                           </IconButton>
                        </TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {locations.map(location => {
                        if(editLocation == undefined || location.id != editLocation.id) {
                           return (
                              <TableRow key={location.id}>
                                 <TableCell component="th" scope="row">{location.name}</TableCell>
                                 <TableCell className={"icon-cell"}>
                                    <IconButton color="inherit" aria-label="Menu" title="Edit"
                                                onClick={() => this.props.startEditLocation!(location)}>
                                       <EditIcon/>
                                    </IconButton>
                                    <IconButton color="inherit" aria-label="Menu" title="Delete"
                                                onClick={() => this.deleteLocation(location)}>
                                       <DeleteIcon/>
                                    </IconButton>
                                 </TableCell>

                              </TableRow>
                           )
                        } else {
                           return (
                              <TableRow key={location.id}>
                                 <TableCell component="th" scope="row">
                                    <TextField style={{}} value={editLocation.name} onChange={this.onNameChange} />
                                 </TableCell>
                                 <TableCell>
                                    <IconButton color="inherit" aria-label="Menu" title="Save"
                                       onClick={this.props.saveEditLocation!}>
                                       <CheckIcon/>
                                    </IconButton>
                                    <IconButton color="inherit" aria-label="Menu" title="Cancel"
                                       onClick={this.props.cancelEditLocation!}>
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
            <ConfirmationDialog open={this.state.deleteLocation != undefined}
                                title={"Delete location"}
                                message={"Do you wish to delete the selected location?"}
                                onClose={this.onDeleteConfirmed} />
         </Paper>
      );
   }
}

function mapStateToProps(state: StoreState, props: any): Props {
   return {
      locations: state.locations,
      editLocation: state.editLocation,
   };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      setTitle: (title:string) => dispatch(actions.setTitle(title)),

      startEditLocation: (location: CompLocation) => dispatch(actions.startEditLocation(location)),
      cancelEditLocation: () => dispatch(actions.cancelEditLocation()),
      saveEditLocation: () => dispatch(asyncActions.saveEditLocation()),
      startAddLocation: () => dispatch(actions.startAddLocation()),
      deleteLocation: (location: CompLocation) => dispatch(asyncActions.deleteLocation(location)),
      updateEditLocation: (propName:string, value:any) => dispatch(actions.updateEditLocation({propName: propName, value: value})),
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(LocationsView)));
