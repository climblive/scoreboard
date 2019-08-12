import * as React from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import {DialogContentText} from "@material-ui/core";
import {RouteComponentProps} from "react-router";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

export interface CreatePdfDialogProps {
   open: boolean
   creatingPdf: boolean
   onClose: () => void
   createPdf?: () => void
   createPdfFromTemplate?: (file:Blob) => void
}

type State = {
   selectedTab: number,
}

export class CreatePdfDialog extends React.Component<CreatePdfDialogProps, State> {

   public readonly state: State = {
      selectedTab: 0,
   };

   inputRef:any;

   constructor(props: CreatePdfDialogProps) {
      super(props);
      this.inputRef = React.createRef();
   }

   selectTab = (event: any, newValue: number) => {
      this.state.selectedTab = newValue;
      this.setState(this.state)
   };

   createPdfFromTemplate = () => {
      console.log("Create PDF", this.inputRef.current);
      this.inputRef.current.click();
   };

   onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files != null && e.target.files.length > 0) {
         this.props.createPdfFromTemplate!(e.target.files.item(0) as Blob);
         this.props.onClose();
      }
   };

   render() {
      let selectedTab = this.state.selectedTab;
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
               <Tabs value={selectedTab} onChange={this.selectTab}>
                  <Tab label="PDF with codes" />
                  <Tab label="Scoreboard from template" />
               </Tabs>
               {selectedTab == 0 && <DialogContentText>
                   You can create a pdf with scoreboard and a registration code for all contenders.

                   Select a single page template pdf, and you will get a pdf with one page per contender, with the
                   registration code added on the top of each page.
               </DialogContentText>}
               {selectedTab == 0 && <DialogContentText>
                   You can create a pdf with scoreboard and a registration code for all contenders.

                   Select a single page template pdf, and you will get a pdf with one page per contender, with the
                   registration code added on the top of each page.
               </DialogContentText>}
               {this.props.creatingPdf && <div>
                   <div style={{textAlign: "center", marginTop: 10}}><CircularProgress/></div>
               </div>}
            </DialogContent>
            <DialogActions>
               <Button onClick={this.props.onClose} color="primary">Cancel</Button>
               {selectedTab == 0 && <Button onClick={this.props.createPdf} color="primary">Create PDF</Button>}
               {selectedTab == 1 && <Button onClick={this.createPdfFromTemplate} color="primary">Select template PDF</Button>}
            </DialogActions>
         </Dialog>
      );
   }
}