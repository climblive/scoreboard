import * as React from 'react';
import {StyledComponentProps, TableCell, Theme} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import createStyles from "@material-ui/core/styles/createStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {StoreState} from "../model/storeState";
import {connect, Dispatch} from "react-redux";
import * as asyncActions from "../actions/asyncActions";
import * as actions from "../actions/actions";
import {Color} from "../model/color";
import * as Chroma from 'chroma-js';
import {ChromePicker} from 'react-color';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {ConfirmationDialog} from "../components/ConfirmationDialog";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from "@material-ui/icons/Cancel";
import AddIcon from '@material-ui/icons/AddCircleOutline';

const styles = ({ spacing }: Theme) => createStyles({
   root: {
      width: '100%',
      marginTop: spacing(3),
      overflowX: 'auto',
   },
   table: {
      minWidth: 700,
   },
});

interface Props  {
   colors: Color[],
   editColor?:Color,

   loadColors?: () => void,
   setTitle?: (title: string) => void,
   startEditColor?:(color:Color) => void
   cancelEditColor?:() => void
   saveEditColor?:() => void
   startAddColor?:() => void
   deleteColor?:(color:Color) => void
   updateEditColor?:(propName:string, propValue?:any) => void
}

enum PopupType {
   PRIMARY = 'PRIMARY',
   SECONDARY = 'SECONDARY'
}

type State = {
   deleteColor?:Color
   popupType?:PopupType
   popupTitle?:string
   popupColor?:string
}

class ColorsView extends React.Component<Props & RouteComponentProps & StyledComponentProps, State> {
   public readonly state: State = {
   };

   constructor(props: Props & RouteComponentProps & StyledComponentProps) {
      super(props);
   }

   componentDidMount() {
      this.props.loadColors!();
      this.props.setTitle!("Colors");
   }

   deleteColor = (color:Color) => {
      this.state.deleteColor = color;
      this.setState(this.state);
   };

   onDeleteConfirmed = () => {
      this.props.deleteColor!(this.state.deleteColor!);
      this.state.deleteColor = undefined;
      this.setState(this.state)
   };

   onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.updateEditColor!("name", e.target.value);
   };

   onPopupColorChange = (e:any) => {
      this.state.popupColor = e.hex;
      this.setState(this.state);
   };

   showPopupPrimary = () => {
      this.state.popupType = PopupType.PRIMARY;
      this.state.popupColor = this.props.editColor!.rgbPrimary;
      this.state.popupTitle = "Primary color";
      this.setState(this.state);
   };

   showPopupSecondary = () => {
      this.state.popupType = PopupType.SECONDARY;
      this.state.popupColor = this.props.editColor!.rgbSecondary || "#000000";
      this.state.popupTitle = "Secondary color";
      this.setState(this.state);
   };

   closePopup = () => {
      this.state.popupType = undefined;
      this.setState(this.state);
   };

   setPopupColor = () => {
      this.props.updateEditColor!(this.state.popupType == PopupType.PRIMARY ? "rgbPrimary" : "rgbSecondary", this.state.popupColor!);
      this.state.popupType = undefined;
      this.setState(this.state);
   };

   deletePopupColor = () => {
      this.props.updateEditColor!("rgbSecondary", undefined);
      this.state.popupType = undefined;
      this.setState(this.state);
   };

   private getColorStyle(color?: string, editable?: boolean) {
      let borderColor = "transparent";
      let textColor = "inherit";
      if(color) {
         if(color.charAt(0) !== '#') {
            color = '#' + color;
         }
         const chromaInst = Chroma(color);
         const luminance = chromaInst.luminance();
         borderColor = chromaInst.darken(1).hex();
         textColor = luminance < 0.5 ? "#FFF" : "#333";
      }
      return {
         width:100,
         border: "1px solid " + borderColor,
         background:color,
         color: textColor,
         padding: 5,
         textAlign: 'center' as 'center',
         cursor: editable ? 'pointer' : 'inherit'
      };
   }

   render() {
      let colors = this.props.colors;
      let classes = this.props.classes!!;
      let editColor = this.props.editColor;
      if(!colors) {
         return (<CircularProgress/>)
      }
      return (
         <div className="mainView">
            <Paper className={classes.root}>
               <Table className={classes.table}>
                  <TableHead>
                     <TableRow>
                        <TableCell style={{width:"100%"}}>Name</TableCell>
                        <TableCell style={{minWidth:110}}>Primary color</TableCell>
                        <TableCell style={{minWidth:110}}>Secondary color</TableCell>
                        <TableCell style={{minWidth:96}}>
                           <IconButton color="inherit" aria-label="Menu" title="Add color" onClick={this.props.startAddColor}>
                              <AddIcon />
                           </IconButton>
                        </TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {colors.map(color => {
                        if(editColor == undefined || color.id != editColor.id) {
                           return (
                              <TableRow key={color.id}>
                                 <TableCell component="th" scope="row">{color.name}</TableCell>
                                 <TableCell component="th" scope="row">
                                    <div style={this.getColorStyle(color.rgbPrimary)}>{color.rgbPrimary}</div>
                                 </TableCell>
                                 <TableCell component="th" scope="row">
                                    <div style={this.getColorStyle(color.rgbSecondary)}>{color.rgbSecondary || "None"}</div>
                                 </TableCell>
                                 <TableCell>
                                    <IconButton color="inherit" aria-label="Menu" title="Edit"
                                                onClick={() => this.props.startEditColor!(color)}>
                                       <EditIcon/>
                                    </IconButton>
                                    <IconButton color="inherit" aria-label="Menu" title="Delete"
                                                onClick={() => this.deleteColor(color)}>
                                       <DeleteIcon/>
                                    </IconButton>
                                 </TableCell>

                              </TableRow>
                           )
                        } else {
                           return (
                              <TableRow key={color.id}>
                                 <TableCell component="th" scope="row">
                                    <TextField style={{}} value={editColor.name} onChange={this.onNameChange} />
                                 </TableCell>
                                 <TableCell>
                                    <div style={this.getColorStyle(editColor.rgbPrimary, true)} onClick={this.showPopupPrimary}>{editColor.rgbPrimary}</div>
                                 </TableCell>
                                 <TableCell>
                                    <div style={this.getColorStyle(editColor.rgbSecondary,true )} onClick={this.showPopupSecondary}>{editColor.rgbSecondary || "None"}</div>
                                 </TableCell>
                                 <TableCell>
                                    <IconButton color="inherit" aria-label="Menu" title="Save"
                                       onClick={this.props.saveEditColor!}>
                                       <CheckIcon/>
                                    </IconButton>
                                    <IconButton color="inherit" aria-label="Menu" title="Cancel"
                                       onClick={this.props.cancelEditColor!}>
                                       <CancelIcon/>
                                    </IconButton>
                                 </TableCell>
                              </TableRow>
                           )
                        }
                     })}
                  </TableBody>
               </Table>
            </Paper>
            <Dialog
               open={this.state.popupType !== undefined}
               disableBackdropClick
               disableEscapeKeyDown
               maxWidth="xs"
               aria-labelledby="confirmation-dialog-title"
            >
               <DialogTitle id="confirmation-dialog-title">{this.state.popupTitle}</DialogTitle>
               <DialogContent style={{padding:0}}>
                  <ChromePicker disableAlpha={true} color={this.state.popupColor} onChange={this.onPopupColorChange}/>
               </DialogContent>
               <DialogActions>
                  <Button onClick={this.closePopup} color="primary">Cancel</Button>
                  {this.state.popupType == PopupType.SECONDARY && <Button onClick={this.deletePopupColor} color="primary">Delete</Button>}
                  <Button onClick={this.setPopupColor} color="primary">Save</Button>
               </DialogActions>
            </Dialog>
            <ConfirmationDialog open={this.state.deleteColor != undefined}
                                title={"Delete color"}
                                message={"Do you wish to delete the selected color?"}
                                onClose={this.onDeleteConfirmed} />
         </div>
      );
   }
}

function mapStateToProps(state: StoreState, props: any): Props {
   return {
      colors: state.colors,
      editColor: state.editColor,
   };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      loadColors: () => dispatch(asyncActions.loadColors()),
      setTitle: (title:string) => dispatch(actions.setTitle(title)),

      startEditColor: (color: Color) => dispatch(actions.startEditColor(color)),
      cancelEditColor: () => dispatch(actions.cancelEditColor()),
      saveEditColor: () => dispatch(asyncActions.saveEditColor()),
      startAddColor: () => dispatch(actions.startAddColor()),
      deleteColor: (color: Color) => dispatch(asyncActions.deleteColor(color)),
      updateEditColor: (propName:string, value:any) => dispatch(actions.updateEditColor({propName: propName, value: value})),
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ColorsView)));
