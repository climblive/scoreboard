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
import { PhotoshopPicker } from 'react-color';

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
   loadColors?: () => void,
   setTitle?: (title: string) => void,
}

type State = {
   goBack: boolean
}

class ColorsView extends React.Component<Props & RouteComponentProps & StyledComponentProps, State> {
   public readonly state: State = {
      goBack: false
   };

   constructor(props: Props & RouteComponentProps & StyledComponentProps) {
      super(props);
   }

   componentDidMount() {
      this.props.loadColors!();
      this.props.setTitle!("Colors");
   }

   render() {
      let colors = this.props.colors;
      let classes = this.props.classes!!;
      if(!colors) {
         return (<CircularProgress/>)
      }
      return (
         <div className="mainView">
            <Paper className={classes.root}>
               <Table className={classes.table}>
                  <TableHead>
                     <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Location</TableCell>
                        <TableCell align="right">Organizer</TableCell>
                        <TableCell align="right">Qualifying problems</TableCell>
                        <TableCell>Rules</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {colors.map(color => (
                        <TableRow key={color.id}>
                           <TableCell component="th" scope="row">{color.name}</TableCell>
                           <TableCell component="th" scope="row">
                              <PhotoshopPicker
                              />
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </Paper>
         </div>
      );
   }
}

function mapStateToProps(state: StoreState, props: any): Props {
   return {
      colors: state.colors,
   };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
   return {
      loadColors: () => dispatch(asyncActions.loadColors()),
      setTitle: (title:string) => dispatch(actions.setTitle(title)),
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ColorsView)));
