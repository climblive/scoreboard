import * as React from 'react';
import {Problem} from "../model/problem";
import {ContenderData} from "../model/contenderData";
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
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {CompClass} from "../model/compClass";
import moment from 'moment';

interface Props {
   problems?:Problem[],
   colors?:Color[],
   colorMap:Map<number, Color>
   contenderMap:Map<number, ContenderData>
   compClassMap:Map<number, CompClass>
   editProblem?: Problem

   startEditProblem?:(problem:Problem) => void
   cancelEditProblem?:() => void
   saveEditProblem?:() => void
   startAddProblem?:(problem:Problem) => void
   deleteProblem?:(problem?:Problem) => void
   updateEditProblem?:(propName:string, propValue:any) => void
}

type State = {
   deleteProblem?:Problem,
   ticksProblem?:Problem
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
      return problem.colorId ? this.props.colorMap.get(problem.colorId)?.name : "UNDEFINED";
   };

   getProblemStyle = (problem:Problem) => {
      let color = problem.colorId ? this.props.colorMap.get(problem.colorId) : undefined;
      if(!color) {
         color = {id: undefined, organizerId: 0, name: "None", rgbPrimary: "888", shared:false};
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
      let background = rgbColor;
      if(color.rgbSecondary) {
         let rgbSecondary = color.rgbSecondary;
         if(rgbSecondary.charAt(0) !== '#') {
            rgbSecondary = '#' + rgbSecondary;
         }
         background = "repeating-linear-gradient(-30deg," + rgbColor + "," + rgbSecondary + " 15px," + rgbColor + " 30px)";
      }
      return {
         display:"flex",
         border: borderWidth + "px solid " + borderColor,
         padding: "2px 10px",
         marginBottom: 5,
         color: textColor,
         borderRadius: 5,
         alignItems: "center",
         opacity: (editProblem == undefined || editProblem.id == problem.id) ? 1 : 0.08,
         background: background
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

   onFlashBonusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let flashBonus = parseInt(e.target.value) || 0
      this.props.updateEditProblem!("flashBonus", flashBonus == 0 ? undefined : flashBonus);
   };

   onColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      this.props.updateEditProblem!("colorId", parseInt(e.target.value));
   };

   showTicksDialog = (problem:Problem) => {
      this.state.ticksProblem = problem;
      this.setState(this.state);
   };

   hideTicksDialog = () => {
      this.state.ticksProblem = undefined;
      this.setState(this.state);
   };

   render() {
      const classes = this.props.classes!!;
      let problems = this.props.problems;
      let editProblem = this.props.editProblem;
      if(!problems || !this.props.colorMap) {
         return (<div style={{textAlign: "center", marginTop:10}}><CircularProgress/></div>)
      }
      let allowEdit = problems.every(p => p.ticks!.length == 0);
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
                              {problem.ticks!.length > 0  && <Button style={{color:"inherit"}} onClick={() => this.showTicksDialog(problem)}>{problem.ticks!.length} ticks</Button>}
                              <div style={{display:"flex", flexDirection:"column", marginRight:15}}>
                                 <div style={{fontSize:10, textAlign:"right"}}>Points</div>
                                 <div style={{textAlign: "right", width:60, fontSize:28, height:33.25}}>{problem.points}</div>
                              </div>
                              <div style={{display:"flex", flexDirection:"column", width:60, marginRight:15}}>
                                 {(problem.flashBonus != undefined) && <div style={{fontSize:10, textAlign:"right"}}>Flash bonus</div>}
                                 <div style={{textAlign: "right", fontSize:28, height:33.25}}>{problem.flashBonus}</div>
                              </div>
                              {allowEdit && <IconButton className={classes.menuButton} color="inherit" aria-label="Edit" title="Edit" onClick={() => {this.edit(problem);}}>
                                 <EditIcon />
                              </IconButton>}
                              {allowEdit && <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" title="Add" onClick={() => {this.add(problem);}}>
                                 <AddIcon />
                              </IconButton>}
                              {allowEdit && <IconButton className={classes.menuButton} color="inherit" aria-label="Delete" title="Delete" onClick={() => {this.delete(problem);}}>
                                 <DeleteIcon />
                              </IconButton>}
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
                              <div style={{display:"flex", flexDirection:"column", marginRight:15}}>
                                 <div style={{fontSize:10, textAlign:"right"}}>Points</div>
                                 <TextField className="textfield-inherited"
                                            style={{textAlign: "right", width:60, fontSize:28, paddingTop:0, color:"inherit"}}
                                            value={editProblem.points == undefined ? "" : editProblem.points}
                                            onChange={this.onPointsChange} />
                              </div>
                              <div style={{display:"flex", flexDirection:"column", marginRight:15}}>
                                 <div style={{fontSize:10, textAlign:"right"}}>Flash bonus</div>
                                 <TextField className="textfield-inherited"
                                            style={{textAlign: "right", width:60, fontSize:28, paddingTop:0, color:"inherit"}}
                                            value={editProblem.flashBonus == undefined ? "" : editProblem.flashBonus}
                                            onChange={this.onFlashBonusChange} />
                              </div>
                              <div style={{width:48}}></div>
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
         ,
         <Dialog key={"tickDialog"}
                 open={this.state.ticksProblem != undefined}>
            <DialogTitle id="confirmation-dialog-title">Ticks for problem {this.state.ticksProblem && this.state.ticksProblem!.number}</DialogTitle>
            <div style={{display:"flex", fontWeight: "bold", margin: "0px 24px", borderBottom: "1px solid grey"}}>
               <div style={{width:300}}>Contender</div>
               <div style={{width:150}}>Class</div>
               <div style={{width:150}}>Time</div>
               <div style={{width:100}}>Flash</div>
            </div>
            <DialogContent>
               {this.state.ticksProblem && this.state.ticksProblem!.ticks!.map(tick => {
                  let contender = this.props.contenderMap.get(tick.contenderId);
                  let compClass = this.props.compClassMap.get(contender!.compClassId!);
                  return(
                     <div style={{display:"flex", marginBottom:2}}>
                        <div style={{width:300}}>{contender!.name}</div>
                        <div style={{width:150}}>{compClass!.name}</div>
                        <div style={{width:150}}>{moment(tick.timestamp).format("HH:mm")}</div>
                        <div style={{width:100}}>{tick.flash && "Flash"}</div>
                     </div>
                  );
               }
               )}
            </DialogContent>
            <DialogActions>
               <Button onClick={this.hideTicksDialog} color="primary">Ok</Button>
            </DialogActions>

         </Dialog>
      ];
   }
}

export default withStyles(styles)(ProblemsComp);
