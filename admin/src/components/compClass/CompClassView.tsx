import React, { useState } from "react";
import { CompClass } from "src/model/compClass";
import { connect } from "react-redux";
import { StoreState } from "../../model/storeState";
import { deleteCompClass } from "../../actions/asyncActions";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import TableRow from "@material-ui/core/TableRow";
import { TableCell } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { CircularProgress } from "@material-ui/core";
import moment from "moment";

interface Props {
  compClass?: CompClass;
  deleteCompClass?: (compClass: CompClass) => Promise<void>;
  onBeginEdit?: () => void;
}

const CompClassView = (props: Props) => {
  let [deleting, setDeleting] = useState<boolean>(false);

  const format = "YYYY-MM-DD HH:mm";

  const onDelete = () => {
    setDeleting(true);
    props
      .deleteCompClass?.(props.compClass!)
      .catch((error) => setDeleting(false));
  };

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {props.compClass?.name}
      </TableCell>
      <TableCell>{props.compClass?.description}</TableCell>
      <TableCell>{moment(props.compClass?.timeBegin).format(format)}</TableCell>
      <TableCell>{moment(props.compClass?.timeEnd).format(format)}</TableCell>
      <TableCell className={"icon-cell"}>
        <IconButton
          color="inherit"
          aria-label="Menu"
          title="Edit"
          disabled={deleting}
          onClick={props.onBeginEdit}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="Menu"
          title="Delete"
          onClick={onDelete}
          disabled={deleting}
        >
          {deleting ? <CircularProgress size={24} /> : <DeleteIcon />}
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {};
}

const mapDispatchToProps = {
  deleteCompClass,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompClassView);
