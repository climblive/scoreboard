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
import {Organizer} from "../model/organizer";

const styles = ({ spacing }: Theme) => createStyles({
   root: {
      width: '100%',
   },
   table: {
      minWidth: 700,
   },
});

interface Props  {
   organizers?: Organizer[],
   editOrganizer?:Organizer,

   setTitle?: (title: string) => void,
   startEditOrganizer?:(organizer:Organizer) => void
   cancelEditOrganizer?:() => void
   saveEditOrganizer?:() => void
   startAddOrganizer?:() => void
   deleteOrganizer?:(organizer:Organizer) => void
   updateEditOrganizer?:(propName:string, propValue?:any) => void
}

type State = {
   deleteOrganizer?:Organizer
}

class OrganizersView extends React.Component<Props & RouteComponentProps & StyledComponentProps, State> {
   public readonly state: State = {
   };

   constructor(props: Props & RouteComponentProps & StyledComponentProps) {
      super(props);
   }

   componentDidMount() {
      this.props.setTitle!("Organizers");
   }

   deleteOrganizer = (organizer:Organizer) => {
      this.state.deleteOrganizer = organizer;
      this.setState(this.state);
   };

   onDeleteConfirmed = (result: boolean) => {
      if(result) {
         this.props.deleteOrganizer!(this.state.deleteOrganizer!);
      }
      this.state.deleteOrganizer = undefined;
      this.setState(this.state)
   };

   onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.updateEditOrganizer!("name", e.target.value);
   };

   render() {
      let organizers = this.props.organizers;
      let classes = this.props.classes!!;
      let editOrganizer = this.props.editOrganizer;
      if(!organizers) {
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
                           <IconButton color="inherit" aria-label="Menu" title="Add serie" onClick={this.props.startAddOrganizer}>
                              <AddIcon />
                           </IconButton>
                        </TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {organizers.map(organizer => {
                        if(editOrganizer == undefined || organizer.id != editOrganizer.id) {
                           return (
                              <TableRow key={organizer.id}>
                                 <TableCell component="th" scope="row">{organizer.name}</TableCell>
                                 <TableCell className={"icon-cell"}>
                                    <IconButton color="inherit" aria-label="Menu" title="Edit"
                                                onClick={() => this.props.startEditOrganizer!(organizer)}>
                                       <EditIcon/>
                                    </IconButton>
                                    <IconButton color="inherit" aria-label="Menu" title="Delete"
                                                onClick={() => this.deleteOrganizer(organizer)}>
                                       <DeleteIcon/>
                                    </IconButton>
                                 </TableCell>

                              </TableRow>
                           )
                        } else {
                           return (
                              <TableRow key={organizer.id}>
                                 <TableCell component="th" scope="row">
                                    <TextField style={{}} value={editOrganizer.name} onChange={this.onNameChange} />
                                 </TableCell>
                                 <TableCell>
                                    <IconButton color="inherit" aria-label="Menu" title="Save"
                                       onClick={this.props.saveEditOrganizer!}>
                                       <CheckIcon/>
                                    </IconButton>
                                    <IconButton color="inherit" aria-label="Menu" title="Cancel"
                                       onClick={this.props.cancelEditOrganizer!}>
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
            <ConfirmationDialog open={this.state.deleteOrganizer != undefined}
                                title={"Delete organizer"}
                                message={"Do you wish to delete the selected organizer?"}
                                onClose={this.onDeleteConfirmed} />
         </Paper>
      );
   }
}

function mapStateToProps(state: StoreState, props: any): Props {
   return {
      organizers: state.organizers,
      editOrganizer: state.editOrganizer,
   };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      setTitle: (title:string) => dispatch(actions.setTitle(title)),

      startEditOrganizer: (organizer: Organizer) => dispatch(actions.startEditOrganizer(organizer)),
      cancelEditOrganizer: () => dispatch(actions.cancelEditOrganizer()),
      saveEditOrganizer: () => dispatch(asyncActions.saveEditOrganizer()),
      startAddOrganizer: () => dispatch(actions.startAddOrganizer()),
      deleteOrganizer: (organizer: Organizer) => dispatch(asyncActions.deleteOrganizer(organizer)),
      updateEditOrganizer: (propName:string, value:any) => dispatch(actions.updateEditOrganizer({propName: propName, value: value})),
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(OrganizersView)));
