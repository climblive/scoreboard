import * as React from 'react';
import {Problem} from "../model/problem";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {TableCell} from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import CircularProgress from "@material-ui/core/CircularProgress";
import {CompClass} from "../model/compClass";

interface Props {
   compClasses:CompClass[],
}

type State = {
}

class CompClassesComp extends React.Component<Props, State> {
   public readonly state: State = {
   };

   constructor(props: Props) {
      super(props);
   }

   componentDidMount() {
   }

   render() {
      let compClasses = this.props.compClasses;
      if(!compClasses) {
         return (<CircularProgress/>)
      }
      return (
         <Paper>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell>Name</TableCell>
                     <TableCell>Description</TableCell>
                     <TableCell align="right">Start time</TableCell>
                     <TableCell align="right">End time</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {compClasses.map(compClass => (
                     <TableRow key={compClass.id}
                               style={{cursor:'pointer'}}
                               hover
                               onClick={() => console.log("click")}>
                        <TableCell component="th" scope="row">{compClass.name}</TableCell>
                        <TableCell>{compClass.description}</TableCell>
                        <TableCell>{compClass.timeBegin}</TableCell>
                        <TableCell>{compClass.timeEnd}</TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </Paper>
      );
   }
}

export default CompClassesComp;
