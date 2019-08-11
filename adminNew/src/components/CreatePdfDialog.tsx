import * as React from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import {DialogContentText} from "@material-ui/core";
import {RouteComponentProps} from "react-router";
import CircularProgress from "@material-ui/core/CircularProgress";

export interface CreatePdfDialogProps {
   open: boolean
   creatingPdf: boolean
   onClose: () => void
   createPdf?: (file:Blob) => void
}

export class CreatePdfDialog extends React.Component<CreatePdfDialogProps> {

   inputRef:any;

   constructor(props: CreatePdfDialogProps) {
      super(props);
      this.inputRef = React.createRef();
   }

   createPdf = () => {
      console.log("Create PDF", this.inputRef.current);
      this.inputRef.current.click();
   };

   onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files != null && e.target.files.length > 0) {
         this.props.createPdf!(e.target.files.item(0) as Blob);
         this.props.onClose();
      }
   };

   render() {
      return (
         <Dialog
            open={this.props.open || this.props.creatingPdf}
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            aria-labelledby="confirmation-dialog-title"
         >
            <input style={{display: "none"}} type='file' onChange={this.onChange} ref={this.inputRef}/>
            <DialogTitle id="confirmation-dialog-title">Create PDF</DialogTitle>
            <DialogContent>
               <DialogContentText>
                  You can create a pdf with scoreboard and a registration code for all contenders.
               </DialogContentText>
               <DialogContentText>
                  Select a single page template pdf, and you will get a pdf with one page per contender, with the
                  registration code added on the top of each page.
               </DialogContentText>
               {this.props.creatingPdf && <div>
                   <div style={{textAlign: "center", marginTop: 10}}><CircularProgress/></div>
               </div>}
            </DialogContent>
            <DialogActions>
               <Button onClick={this.props.onClose} color="primary">Cancel</Button>
               <Button onClick={this.createPdf} color="primary">Select template PDF</Button>
            </DialogActions>
         </Dialog>
      );
   }
}