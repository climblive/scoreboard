import * as React from 'react';
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import {Contest} from "../model/contest";
import {InputLabel, TextField} from "@material-ui/core";
import {RouteComponentProps, withRouter} from "react-router";
import RichTextEditor from "./RichTextEditor";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import WarningIcon from '@material-ui/icons/Warning';
import MenuItem from "@material-ui/core/MenuItem";
import {Series} from "../model/series";
import {CompLocation} from "../model/compLocation";
import {CreatePdfDialog} from "./CreatePdfDialog";

interface Props {
   contest:Contest,
   series?:Series[],
   creatingPdf:boolean,
   locations?:CompLocation[],
   contestIssues:string[],
   updateContest?: (propName:string, value:any) => void,
   saveContest?: (onSuccess:(contest:Contest) => void) => void,
   createPdf?: () => void
   createPdfFromTemplate?: (file:Blob) => void
}

type State = {
   showPopup:boolean
}

class ContestGeneralComp extends React.Component<Props & RouteComponentProps, State> {
   public readonly state: State = {
      showPopup:false,
   };

   constructor(props: Props & RouteComponentProps) {
      super(props);
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

   onFinalistsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.updateContest!("finalists", e.target.value);
   };

   onGracePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.updateContest!("gracePeriod", e.target.value);
   };

   onRulesChange = (rules: string) => {
      this.props.updateContest!("rules", rules);
   };

   onLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const locationId = e.target.value == "None" ? undefined : parseInt(e.target.value);
      this.props.updateContest!("locationId", locationId);
   };

   onSeriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const seriesId = e.target.value == "None" ? undefined : parseInt(e.target.value);
      this.props.updateContest!("seriesId", seriesId);
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
      let seriesList = this.props.series;
      let locations = this.props.locations;
      if(!(contest && seriesList && locations)) {
         return (<div style={{textAlign: "center", marginTop:10}}><CircularProgress/></div>)
      }
      let scoreboardUrl = "https://clmb.live/scoreboard/" + contest.id;
      return (
         <Paper>
            {this.props.contestIssues.map(issue => <div style={{padding:10, display:"flex", alignItems:"center", fontWeight:"bold", color:"#e49c3b"}} key={issue}><WarningIcon style={{marginRight:10}}/>{issue}</div>)}
            <div style={{padding:10}}>
               {((!contest.isNew) && this.props.contestIssues.length == 0) &&
                  <div style={{marginBottom:10}}>
                      <Button style={{marginRight:10}} variant="outlined" color="primary" onClick={this.startPdfCreate}>Create PDF</Button>
                      <Button href={scoreboardUrl} target="_blank" variant="outlined" color="primary">Open scoreboard</Button>
                  </div>
               }
               <div style={{display:"flex", flexDirection:"row"}}>
                  <div style={{display:"flex", flexDirection:"column", flexGrow:1, flexBasis:0}}>
                     <TextField label="Name" value={contest.name} onChange={this.onNameChange}/>
                     <TextField style={{marginTop:10}} label="Description" value={contest.description} onChange={this.onDescriptionChange}/>
                     <FormControl style={{marginTop:10}} >
                        <InputLabel shrink htmlFor="location-select">Location</InputLabel>
                        <Select
                           id="location-select"
                           value={(contest.locationId == undefined || contest.locationId == null) ? "None" : contest.locationId}
                           onChange={this.onLocationChange}
                        >
                           <MenuItem value="None"><em>None</em></MenuItem>
                           {locations!.map(location =>
                              <MenuItem key={location.id} value={location.id}>{location.name}</MenuItem>
                           )}
                        </Select>
                     </FormControl>
                     <FormControl style={{marginTop:10}} >
                        <InputLabel shrink htmlFor="series-select">Series</InputLabel>
                        <Select
                           id="series-select"
                           value={(contest.seriesId == undefined || contest.seriesId == null) ? "None" : contest.seriesId}
                           onChange={this.onSeriesChange}
                        >
                           <MenuItem value="None"><em>None</em></MenuItem>
                           {seriesList!.map(series =>
                              <MenuItem key={series.id} value={series.id}>{series.name}</MenuItem>
                           )}
                        </Select>
                     </FormControl>
                     <TextField style={{marginTop:10}} label="Number of qualifying problems" value={contest.qualifyingProblems} onChange={this.onQualifyingProblemsChange}/>
                     <TextField style={{marginTop:10}} label="Number of finalists" value={contest.finalists} onChange={this.onFinalistsChange}/>
                     <TextField style={{marginTop:10}} label="Grace period (minutes)" value={contest.gracePeriod} onChange={this.onGracePeriodChange}/>
                  </div>
                  <div style={{marginLeft:10, display:"flex", flexDirection:"column", flexGrow:1, flexBasis:0}}>
                     <RichTextEditor title="Rules:" value={contest.rules} onChange={this.onRulesChange}/>
                  </div>
               </div>
               <Button style={{marginTop:10}} variant="outlined" color="primary" onClick={this.onSave}>{contest.isNew ? 'Add' : 'Save'}</Button>
            </div>
            <CreatePdfDialog
               open={this.state.showPopup}
               creatingPdf={this.props.creatingPdf}
               createPdf={this.props.createPdf}
               createPdfFromTemplate={this.props.createPdfFromTemplate}
               onClose={this.closePopup}
            />
         </Paper>
      );
   }
}

export default withRouter(ContestGeneralComp);
