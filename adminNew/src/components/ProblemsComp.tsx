import * as React from 'react';
import {Problem} from "../model/problem";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {TableCell} from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import CircularProgress from "@material-ui/core/CircularProgress";

interface Props {
   problems:Problem[],
}

type State = {
}

class ProblemsComp extends React.Component<Props, State> {
   public readonly state: State = {
   };

   constructor(props: Props) {
      super(props);
   }

   componentDidMount() {
   }

   render() {
      let problems = this.props.problems;
      if(!problems) {
         return (<CircularProgress/>)
      }
      return (
         <Paper>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell>Number</TableCell>
                     <TableCell>Color</TableCell>
                     <TableCell align="right">Points</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody style={{overflowX: "hidden", overflowY:"auto"}}>
                  {problems.map(problem => (
                     <TableRow key={problem.id}
                               style={{cursor:'pointer'}}
                               hover
                               onClick={() => console.log("click")}>
                        <TableCell component="th" scope="row">{problem.number}</TableCell>
                        <TableCell>{problem.colorId}</TableCell>
                        <TableCell>{problem.points}</TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </Paper>
      );
   }
}

export default ProblemsComp;
