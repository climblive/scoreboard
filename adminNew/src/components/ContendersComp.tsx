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
import {ContenderData} from "../model/contenderData";

interface Props {
   contenders:ContenderData[],
   /*editCompClass?:CompClass,

   startEditCompClass?:(compClass:CompClass) => void
   cancelEditCompClass?:() => void
   saveEditCompClass?:() => void
   startAddCompClass?:() => void
   deleteCompClass?:(compClass:CompClass) => void
   updateEditCompClass?:(propName:string, propValue:any) => void*/
}

type State = {
   //deleteCompClass?:CompClass
}

class ContendersComp extends React.Component<Props, State> {
   public readonly state: State = {
   };

   constructor(props: Props) {
      super(props);
   }

   componentDidMount() {
   }

   startAddContenders = () => {
      console.log("startAddContenders");
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
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell>Name</TableCell>
                     <TableCell style={{minWidth:110}}>Competition class</TableCell>
                     <TableCell style={{minWidth:110}}>Registration code</TableCell>
                     <TableCell style={{minWidth:96}}>
                        <IconButton color="inherit" aria-label="Menu" title="Add contenders" onClick={this.startAddContenders}>
                           <AddIcon />
                        </IconButton>
                     </TableCell>
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
         </Paper>
      );
   }
}

export default ContendersComp;
