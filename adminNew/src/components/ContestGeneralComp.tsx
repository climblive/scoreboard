import * as React from 'react';
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import {Contest} from "../model/contest";
import {TextField} from "@material-ui/core";
import {RouteComponentProps, withRouter} from "react-router";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";

interface Props {
   contest:Contest,
   updateContest?: (propName:string, value:any) => void,
   saveContest?: (onSuccess:(contest:Contest) => void) => void,
   createPdf?: (file:Blob) => void
}

type State = {
   showPopup:boolean
}

class ContestGeneralComp extends React.Component<Props & RouteComponentProps, State> {
   public readonly state: State = {
      showPopup:false
   };

   inputRef:any;

   constructor(props: Props & RouteComponentProps) {
      super(props);
      this.inputRef = React.createRef();
   }

   componentDidMount() {
   }

   onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.updateContest!("name", e.target.value);
   };

   onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.updateContest!("description", e.target.value);
   };

   onQualifyingProblemsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.updateContest!("qualifyingProblems", e.target.value);
   };

   onGracePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.updateContest!("gracePeriod", e.target.value);
   };

   onRulesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.updateContest!("rules", e.target.value);
   };

   createPdf = () => {
      this.closePopup();
      console.log("Create PDF", this.inputRef.current);
      this.inputRef.current.click();
   };

   onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e);
      if(e.target.files != null && e.target.files.length > 0) {
         this.props.createPdf!(e.target.files.item(0) as Blob);
      }
   };

   onSave = () => {
      let isNew = this.props.contest.isNew;
      this.props.saveContest!((contest:Contest) => {
         if(isNew) {
            this.props.history.push("/contests/" + contest.id);
         }
      })
   };

   startPdfCreate = () => {
      this.state.showPopup = true;
      this.setState(this.state);
   };

   closePopup = () => {
      this.state.showPopup = false;
      this.setState(this.state);
   };

   render() {
      let contest = this.props.contest;
      if(!contest) {
         return (<div style={{textAlign: "center", marginTop:10}}><CircularProgress/></div>)
      }
      return (
         <Paper>
            <div style={{padding:10}}>
               {/*<ReferenceInput source="locationId" reference="location">
                  <SelectInput optionText="name"/>
               </ReferenceInput>
               <ReferenceInput source="organizerId" reference="organizer">
                  <SelectInput optionText="name"/>
               </ReferenceInput>*/}
               {!contest.isNew &&
                  <div>
                      <Button variant="outlined" color="primary" onClick={this.startPdfCreate}>Create PDF</Button>
                  </div>
               }
               <div style={{display:"flex", flexDirection:"row"}}>
                  <div style={{display:"flex", flexDirection:"column", flexGrow:1, flexBasis:0}}>
                     <TextField label="Name" value={contest.name} onChange={this.onNameChange}/>
                     <TextField style={{marginTop:10}} label="Description" value={contest.description} onChange={this.onDescriptionChange}/>
                     <TextField style={{marginTop:10}} label="Number of qualifying problems" value={contest.qualifyingProblems} onChange={this.onQualifyingProblemsChange}/>
                     <TextField style={{marginTop:10}} label="Grace period" value={contest.gracePeriod} onChange={this.onGracePeriodChange}/>
                  </div>
                  <div style={{marginLeft:10, display:"flex", flexDirection:"row", flexGrow:1, flexBasis:0}}>
                     <TextField style={{flexGrow:1}} multiline label="Rules" value={contest.rules} onChange={this.onRulesChange}/>
                  </div>
               </div>
               <Button style={{marginTop:10}} variant="outlined" color="primary" onClick={this.onSave}>{contest.isNew ? 'Add' : 'Save'}</Button>
            </div>
            <input style={{display:"none"}} type='file' onChange={this.onChange} ref={this.inputRef}/>
            <Dialog
               open={this.state.showPopup}
               disableBackdropClick
               disableEscapeKeyDown
               maxWidth="xs"
               aria-labelledby="confirmation-dialog-title"
            >
               <DialogTitle id="confirmation-dialog-title">Create contenders</DialogTitle>
               <DialogContent>
                  <DialogContentText>Apa</DialogContentText>
               </DialogContent>
               <DialogActions>
                  <Button onClick={this.closePopup} color="primary">Cancel</Button>
                  <Button onClick={this.createPdf} color="primary">Add</Button>
               </DialogActions>

            </Dialog>

         </Paper>
      );
   }
}

export default withRouter(ContestGeneralComp);
