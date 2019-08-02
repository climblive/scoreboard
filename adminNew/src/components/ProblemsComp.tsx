import * as React from 'react';
import {Problem} from "../model/problem";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Color} from "../model/color";
import * as Chroma from 'chroma-js';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from "@material-ui/icons/Cancel";
import {StyledComponentProps} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import {ConfirmationDialog} from "./ConfirmationDialog";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

interface Props {
   problems?:Problem[],
   colors?:Color[],
   colorMap:Map<number, Color>
   editProblem?: Problem

   startEditProblem?:(problem:Problem) => void
   cancelEditProblem?:() => void
   saveEditProblem?:() => void
   startAddProblem?:(problem:Problem) => void
   deleteProblem?:(problem?:Problem) => void
   updateEditProblem?:(propName:string, propValue:any) => void
}

type State = {
   deleteProblem?:Problem
}

const styles = {
   menuButton: {
      marginLeft: 0,
      marginRight: 0,
   },
};

class ProblemsComp extends React.Component<Props & StyledComponentProps, State> {
   public readonly state: State = {
   };

   constructor(props: Props) {
      super(props);
   }

   componentDidMount() {
   }

   getColorName = (problem:Problem) => {
      let color = this.props.colorMap.get(problem.colorId ? problem.colorId : -1);
      return color ? color.name : "UNDEFINED";
   };

   getProblemStyle = (problem:Problem) => {
      let color = this.props.colorMap.get(problem.colorId ? problem.colorId : -1)!;
      if(!color) {
         color = {id: -1, organizerId: -1, name: "None", rgbPrimary: "888"};
      }
      let rgbColor = color.rgbPrimary;
      if(rgbColor.charAt(0) !== '#') {
         rgbColor = '#' + rgbColor;
      }
      const chromaInst = Chroma(rgbColor);
      const luminance = chromaInst.luminance();
      let borderColor = chromaInst.darken(1).hex();
      let textColor = luminance < 0.5 ? "#FFF" : "#333";
      let borderWidth = luminance < 0.5 ? 0 : 1;
      const editProblem = this.props.editProblem;
      return {
         display:"flex",
         border: borderWidth + "px solid " + borderColor,
         padding: "2px 10px",
         background: rgbColor,
         marginBottom: 5,
         color: textColor,
         borderRadius: 5,
         alignItems: "center",
         opacity: (editProblem == undefined || editProblem.id == problem.id) ? 1 : 0.08
      }
   };

   edit = (problem:Problem) => {
      this.props.startEditProblem!(problem);
   };

   editOk = () => {
      this.props.saveEditProblem!()
   };

   editCancel = () => {
      this.props.cancelEditProblem!()
   };

   add = (problem:Problem) => {
      this.props.startAddProblem!(problem)
   };

   delete = (problem:Problem) => {
      this.state.deleteProblem = problem;
      this.setState(this.state);
   };

   onDeleteConfirmed = (result: boolean) => {
      if(result && this.state.deleteProblem) {
         this.props.deleteProblem!(this.state.deleteProblem);
      }
      this.state.deleteProblem = undefined;
      this.setState(this.state);
   };

   onPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.updateEditProblem!("points", parseInt(e.target.value) || 0);
   };

   onColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      this.props.updateEditProblem!("colorId", parseInt(e.target.value));
   };

   render() {
      const classes = this.props.classes!!;
      let problems = this.props.problems;
      let editProblem = this.props.editProblem;
      if(!problems || !this.props.colorMap) {
         return (<div style={{textAlign: "center", marginTop:10}}><CircularProgress/></div>)
      }
      console.log("COLORS: " + this.props.colors);
      return [
         <Paper key={"content"} style={{flexGrow:1, display:"flex", flexDirection:"column"}}>
            <div style={{flexBasis:0, overflowY:"auto", flexGrow:1}}>
               <ul style={{padding: 10, margin:0}}>
                  {problems.map(problem => {
                     if(editProblem == undefined || editProblem.id != problem.id) {
                        return (
                           <li key={problem.id} style={this.getProblemStyle(problem)}>
                              <div style={{width: 20, fontSize:16}}>{problem.number}</div>
                              <div style={{width:100, textAlign: "left", marginLeft:15, marginRight:"auto", fontSize:16}}>{this.getColorName(problem)}</div>
                              <div style={{textAlign: "right", width:60, fontSize:28, marginRight:10}}>{problem.points}</div>
                              <IconButton className={classes.menuButton} color="inherit" aria-label="Edit" title="Edit" onClick={() => {this.edit(problem);}}>
                                 <EditIcon />
                              </IconButton>
                              <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" title="Add" onClick={() => {this.add(problem);}}>
                                 <AddIcon />
                              </IconButton>
                              <IconButton className={classes.menuButton} color="inherit" aria-label="Delete" title="Delete" onClick={() => {this.delete(problem);}}>
                                 <DeleteIcon />
                              </IconButton>
                           </li>
                        )
                     } else {
                        return (
                           <li key={problem.id} style={this.getProblemStyle(editProblem)}>
                              <div style={{width: 20, fontSize:16}}>{problem.number}</div>
                              <FormControl style={{width:100, textAlign: "left", marginLeft:15, marginRight:"auto", fontSize:16}}>
                                 <Select
                                    style={{color: "inherit"}}
                                    value={editProblem.colorId == undefined ? "Select color" : editProblem.colorId}
                                    onChange={this.onColorChange}
                                 >
                                    {this.props.colors!.map(color =>
                                       <MenuItem key={color.id} value={color.id}>{color.name}</MenuItem>
                                    )}
                                 </Select>
                              </FormControl>
                              <TextField className="textfield-inherited" style={{textAlign: "right", width:60, fontSize:28, marginRight:10, color:"inherit"}} value={editProblem.points == undefined ? "" : editProblem.points} onChange={this.onPointsChange} />
                              <IconButton className={classes.menuButton} color="inherit" aria-label="Ok" title="Ok" onClick={this.editOk}>
                                 <CheckIcon />
                              </IconButton>
                              <IconButton className={classes.menuButton} color="inherit" aria-label="Cancel" title="Cancel" onClick={this.editCancel}>
                                 <CancelIcon />
                              </IconButton>
                           </li>
                        )
                     }
                  })}
               </ul>
            </div>
         </Paper>
         ,
         <ConfirmationDialog key={"conf"}
                             open={this.state.deleteProblem != undefined}
                             title={"Delete problem"}
                             message={"Do you wish to delete the selected problem?"}
                             onClose={this.onDeleteConfirmed} />
      ];
   }
}

export default withStyles(styles)(ProblemsComp);
