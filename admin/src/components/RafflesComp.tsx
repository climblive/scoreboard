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
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import {ConfirmationDialog} from "./ConfirmationDialog";
import {Raffle} from "../model/raffle";
import {ContenderData} from "../model/contenderData";

interface Props {
   raffles:Raffle[]
   contenderMap:Map<number, ContenderData>

   createRaffle?: () => void
   drawWinner?: (raffle:Raffle) => void
   deleteRaffle?:(raffle:Raffle) => void
}

type State = {
   deleteRaffle?:Raffle
}

class RafflesComp extends React.Component<Props, State> {
   format = "YYYY-MM-DD HH:mm";

   public readonly state: State = {
   };

   constructor(props: Props) {
      super(props);
   }

   componentDidMount() {
   }

   deleteRaffle = (raffle:Raffle) => {
      this.state.deleteRaffle = raffle;
      this.setState(this.state);
   };

   onDeleteConfirmed = (result: boolean) => {
      if(result) {
         this.props.deleteRaffle!(this.state.deleteRaffle!);
      }
      this.state.deleteRaffle = undefined;
      this.setState(this.state)
   };

   render() {
      let raffles = this.props.raffles;
      if(!raffles) {
         return (<CircularProgress/>)
      }
      return (
         <Paper style={{flexGrow:1, display:"flex", flexDirection:"column"}}>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell style={{minWidth:120}}>Name</TableCell>
                     <TableCell style={{width:"100%"}}>Description</TableCell>
                     <TableCell style={{minWidth:130}}>Start time</TableCell>
                     <TableCell style={{minWidth:130}}>End time</TableCell>
                     <TableCell className={"icon-cell"} style={{minWidth:96}}>
                        <IconButton color="inherit" aria-label="Menu" title="Create raffle" onClick={this.props.createRaffle}>
                           <AddIcon />
                        </IconButton>
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {raffles.map(raffle => {
                     return (
                        <TableRow key={raffle.id}>
                           <TableCell component="th" scope="row">{raffle.id}</TableCell>
                           <TableCell component="th" scope="row">{JSON.stringify(raffle)}</TableCell>
                           <TableCell className={"icon-cell"}>
                              <IconButton color="inherit" aria-label="Menu" title="Edit"
                                          onClick={() => this.props.drawWinner!(raffle)}>
                                 <EditIcon/>
                              </IconButton>
                              <IconButton color="inherit" aria-label="Menu" title="Delete"
                                          onClick={() => this.deleteRaffle(raffle)}>
                                 <DeleteIcon/>
                              </IconButton>
                           </TableCell>
                        </TableRow>
                     )
                  })}
               </TableBody>
            </Table>
            {(raffles != undefined && raffles.length == 0) && <div className={"emptyText"}>
               <div>You have no raffles.</div>
               <div>Please create a raffle by clicking the plus button above.</div>
            </div>}
            <ConfirmationDialog open={this.state.deleteRaffle != undefined}
                                title={"Delete raffle"}
                                message={"Do you wish to delete the selected raffle?"}
                                onClose={this.onDeleteConfirmed} />
         </Paper>
      );
   }
}

export default RafflesComp;
