import * as React from 'react';
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import {Contest} from "../model/contest";
import {TextField} from "@material-ui/core";
import {RouteComponentProps, withRouter} from "react-router";

interface Props {
   contest:Contest,
   updateContest?: (propName:string, value:any) => void,
   saveContest?: (onSuccess:(contest:Contest) => void) => void
}

type State = {
   numberOfContenders: number;
}

class ContestGeneralComp extends React.Component<Props & RouteComponentProps, State> {
   public readonly state: State = {
      numberOfContenders:0
   };

   componentDidMount() {
   }

   onNumberOfContendersChange = (evt: any) => {
      console.log(evt);
      this.setState({
         numberOfContenders: evt.target.value
      });
   };

   batchCreateContenders = () => {
      console.log("batchCreateContenders");
      // Send stuff:
      /*etch(API_URL + "/contest/" + this.props.id + "/createContenders",
         {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
               "Authorization": this.getAuthorization()

            },
            body: JSON.stringify({count: parseInt(this.state.numberOfContenders)})
         }).then(response => {
         console.log("Created stuff");
      }).catch(error => {
         console.log(error);
      })*/
   };

   onChange = (evt: any) => {
      console.log(evt);
      /*const files = Array.from(evt.target.files);
      var reader = new FileReader();
      reader.readAsArrayBuffer(files[0]);
      reader.onload = (evt) => {
         var arrayBuffer = evt.currentTarget.result;
         console.log("ArrayBuffer", arrayBuffer);
         // Send stuff:
         fetch(API_URL + "/contest/" + this.props.id + "/pdf",
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/pdf",
                  "Authorization": this.getAuthorization()
               },
               body: arrayBuffer, // body data type must match "Content-Type" header
            }).then(response => {
            response.blob().then(blob => {
               console.log(blob)
               saveAs(blob, "contest.pdf");
            })
         }).catch(error => {
            console.log(error);
         })
      }
      reader.onerror = function (evt) {
         console.log("onerror", evt);
      }*/
   };

   exportResults = () => {
      console.log("exportResults");
      /*fetch(API_URL + "/contest/export/" + this.props.id,
         {
            headers: {
               "Content-Type": "application/pdf",
               "Authorization": this.getAuthorization()
            }
         }).then(response => {
         response.blob().then(blob => {
            console.log(blob)
            saveAs(blob, "contest.xls");
         })
      }).catch(error => {
         console.log(error);
      })*/
   };

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

   onSave = () => {
      let isNew = this.props.contest.isNew;
      this.props.saveContest!((contest:Contest) => {
         if(isNew) {
            this.props.history.push("/contests/" + contest.id);
         }
      })
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
               {!contest.isNew &&
               <div style={{display: 'flex', marginTop: 16}}>
                   <Paper style={{padding: '16px 24px', flexBasis: 0, marginRight: 16, flexGrow: 1}}>
                       <div style={{marginBottom: 16}}>1. Batch create contenders</div>
                       <div>
                           <TextField label="Number of contenders"
                                      value={this.state ? this.state.numberOfContenders : '0'}
                                      onChange={this.onNumberOfContendersChange}/>
                           <Button variant="outlined" style={{marginTop: 10, display: 'block'}}
                                   onClick={this.batchCreateContenders}>Create</Button>
                       </div>
                   </Paper>
                   <Paper style={{padding: '16px 24px', flexBasis: 0, marginRight: 16, flexGrow: 1}}>
                       <div style={{marginBottom: 16}}>2. Create PDF</div>
                       <div>
                           <input type='file' id='multi' onChange={this.onChange}/>
                       </div>
                   </Paper>
                   <Paper style={{padding: '16px 24px', flexBasis: 0, flexGrow: 1}}>
                       <div style={{marginBottom: 16}}>3. Export results</div>
                       <div>
                           <Button variant="outlined" onClick={this.exportResults}>Export</Button>
                       </div>
                   </Paper>
               </div>
               }
            </div>
         </Paper>
      );
   }
}

export default withRouter(ContestGeneralComp);
