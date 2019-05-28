import * as React from 'react';
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import {Contest} from "../model/contest";
import {TextField} from "@material-ui/core";

interface Props {
   contest:Contest,
}

type State = {
   numberOfContenders:number
}

class ContestGeneralComp extends React.Component<Props, State> {
   public readonly state: State = {
      numberOfContenders:0,
   };

   constructor(props: Props) {
      super(props);
   }

   componentDidMount() {
   }

   onNumberOfContendersChange = (evt: any) => {
      console.log(evt);
      this.setState({
         numberOfContenders: evt.target.value
      });
   }

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
   }

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
   }

   render() {
      let contest = this.props.contest;
      if(!contest) {
         return (<CircularProgress/>)
      }
      return (
         <Paper>
            <div>
               {/*<ReferenceInput source="locationId" reference="location">
                  <SelectInput optionText="name"/>
               </ReferenceInput>
               <ReferenceInput source="organizerId" reference="organizer">
                  <SelectInput optionText="name"/>
               </ReferenceInput>*/}
               <TextField value={contest.name} />
               <TextField value={contest.description} />
               <TextField value={contest.qualifyingProblems} />
               {/*<TextField value={contest.finalists} />
               <RichTextInput source="rules"/>
               <NumberInput source="gracePeriod"/>*/}
               <div style={{display:'flex', marginTop:16}}>
                  <Paper style={{padding:'16px 24px', flexBasis:0, marginRight:16, flexGrow:1}}>
                     <div style={{marginBottom:16}}>1. Batch create contenders</div>
                     <div>
                        <TextField label="Number of contenders" value={this.state ? this.state.numberOfContenders : '0'} onChange={this.onNumberOfContendersChange}/>
                        <Button variant="outlined" style={{marginTop:10, display:'block'}} onClick={this.batchCreateContenders}>Create</Button>
                     </div>
                  </Paper>
                  <Paper style={{padding:'16px 24px', flexBasis:0, marginRight:16, flexGrow:1}}>
                     <div style={{marginBottom:16}}>2. Create PDF</div>
                     <div>
                        <input type='file' id='multi' onChange={this.onChange} />
                     </div>
                  </Paper>
                  <Paper style={{padding:'16px 24px', flexBasis:0, flexGrow:1}}>
                     <div style={{marginBottom:16}}>3. Export results</div>
                     <div>
                        <Button variant="outlined" onClick={this.exportResults}>Export</Button>
                     </div>
                  </Paper>
               </div>
            </div>
         </Paper>
      );
   }
}

export default ContestGeneralComp;
