import * as React from 'react';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {TableCell} from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/AddCircleOutline';
import SaveIcon from '@material-ui/icons/SaveAlt';
import ClearIcon from '@material-ui/icons/Clear';
import {ContenderData} from "../model/contenderData";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {ConfirmationDialog} from "./ConfirmationDialog";

interface Props {
   contenders:ContenderData[],
   createContenders?: (nContenders:number) => void,
   exportResults?: () => void
   resetContenders?: () => void
   /*editCompClass?:CompClass,
   startEditCompClass?:(compClass:CompClass) => void
   cancelEditCompClass?:() => void
   saveEditCompClass?:() => void
   startAddCompClass?:() => void
   deleteCompClass?:(compClass:CompClass) => void
   updateEditCompClass?:(propName:string, propValue:any) => void*/
}

type State = {
   showAddContendersPopup:boolean
   showResetConfirmationPopup:boolean
   nNewContenders:number
   //deleteCompClass?:CompClass
}

class ContendersComp extends React.Component<Props, State> {
   public readonly state: State = {
      showAddContendersPopup: false,
      showResetConfirmationPopup: false,
      nNewContenders: 0
   };

   constructor(props: Props) {
      super(props);
   }

   componentDidMount() {
   }

   startAddContenders = () => {
      this.state.showAddContendersPopup = true;
      this.setState(this.state);
   };

   closePopups = () => {
      this.state.showAddContendersPopup = false;
      this.state.showResetConfirmationPopup = false;
      this.setState(this.state);
   };

   onNNewContendersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.state.nNewContenders = parseInt(e.target.value) || 0;
      this.setState(this.state);
   };

   addContendersConfirmed = () => {
      this.props.createContenders!(this.state.nNewContenders);
      this.state.showAddContendersPopup = false;
      this.state.nNewContenders = 0;
      this.setState(this.state);
   };

   resetAllContenders = () => {
      this.state.showResetConfirmationPopup = true;
      this.setState(this.state);
   };

   resetContendersConfirmed = (confirmed:boolean) => {
      this.state.showResetConfirmationPopup = false;
      this.setState(this.state);
      if(confirmed) {
         this.props.resetContenders!();
      }
   };

   /*deleteCompClass = (compClass:CompClass) => {
      this.state.deleteCompClass = compClass;
      this.setState(this.state);
   };

   onDeleteConfirmed = () => {
      this.props.deleteCompClass!(this.state.deleteCompClass!);
      this.state.deleteCompClass = undefined;
      this.setState(this.state)
   };

   onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.updateEditCompClass!("name", e.target.value);
   };

   onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.updateEditCompClass!("description", e.target.value);
   };

   onTimeBeginChange = (e: any) => {
      console.log(e);
   };

   onTimeEndChange = (e: any) => {
      console.log(e);
   };*/

   render() {
      let contenders = this.props.contenders;
      //let editCompClass = this.props.editCompClass;
      if(!contenders) {
         return (<CircularProgress/>)
      }
      return (
         <Paper>
            <div style={{display:"flex", marginTop:14, alignItems:"center"}}>
               <div style={{marginLeft:16, marginRight:"auto"}}>{contenders.length} contenders:</div>
               <IconButton color="inherit" aria-label="Menu" title="Add contenders" onClick={this.startAddContenders}>
                  <AddIcon />
               </IconButton>
               <IconButton color="inherit" aria-label="Menu" title="Export results" onClick={this.props.exportResults}>
                  <SaveIcon />
               </IconButton>
               <IconButton color="inherit" aria-label="Menu" title="Reset all contenders" onClick={this.resetAllContenders}>
                  <ClearIcon />
               </IconButton>
            </div>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell style={{width:"100%"}}>Name</TableCell>
                     <TableCell style={{minWidth:110}}>Competition class</TableCell>
                     <TableCell style={{minWidth:110}}>Registration code</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {contenders.map(contender => {
                     //if(editCompClass == undefined || editCompClass.id != compClass.id) {
                        return (
                           <TableRow key={contender.id}
                                     style={{cursor: 'pointer'}}
                                     hover
                                     onClick={() => console.log("click")}>
                              <TableCell component="th" scope="row">{contender.name}</TableCell>
                              <TableCell component="th" scope="row">{contender.compClassId}</TableCell>
                              <TableCell component="th" scope="row">{contender.registrationCode}</TableCell>
                           </TableRow>
                        )
                     /*} else {
                        return (
                           <TableRow key={compClass.id}
                                     style={{cursor: 'pointer'}}
                                     hover
                                     onClick={() => console.log("click")}>
                              <TableCell component="th" scope="row">
                                 <input style={{}} value={editCompClass.name} placeholder="Name" onChange={this.onNameChange} />
                              </TableCell>
                              <TableCell>
                                 <input style={{}} value={editCompClass.description} onChange={this.onDescriptionChange} />
                              </TableCell>
                              <TableCell>
                                 <DateTimePicker ampm={false} value={timeBegin} onChange={this.onTimeBeginChange} />
                              </TableCell>
                              <TableCell>
                                 <DateTimePicker ampm={false} value={timeEnd} onChange={this.onTimeEndChange} />
                              </TableCell>
                              <TableCell>
                                 <IconButton color="inherit" aria-label="Menu" title="Save"
                                             onClick={this.props.saveEditCompClass!}>
                                    <CheckIcon/>
                                 </IconButton>
                                 <IconButton color="inherit" aria-label="Menu" title="Cancel"
                                             onClick={this.props.cancelEditCompClass!}>
                                    <CancelIcon/>
                                 </IconButton>
                              </TableCell>
                           </TableRow>
                        )
                     }*/
                  })}
               </TableBody>
            </Table>
            {/*<ConfirmationDialog open={this.state.deleteCompClass != undefined}
                                title={"Delete class"}
                                message={"Do you wish to delete the selected class?"}
                                onClose={this.onDeleteConfirmed} />*/}
            <Dialog
               open={this.state.showAddContendersPopup}
               disableBackdropClick
               disableEscapeKeyDown
               maxWidth="xs"
               aria-labelledby="confirmation-dialog-title"
               >
               <DialogTitle id="confirmation-dialog-title">Create contenders</DialogTitle>
               <DialogContent>
                  <TextField label="Number of contenders" value={this.state.nNewContenders} onChange={this.onNNewContendersChange}/>
               </DialogContent>
               <DialogActions>
                  <Button onClick={this.closePopups} color="primary">Cancel</Button>
                  <Button onClick={this.addContendersConfirmed} color="primary">Add</Button>
               </DialogActions>

            </Dialog>
            <ConfirmationDialog
               open={this.state.showResetConfirmationPopup}
               title="Reset all contenders"
               message="Do you really want to reset all contenders? All ticks and data will be lost."
               onClose={this.resetContendersConfirmed}/>
         </Paper>
      );
   }
}

export default ContendersComp;
