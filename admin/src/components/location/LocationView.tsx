import React, { useState } from "react";
import { CompLocation } from "src/model/compLocation";
import { connect } from "react-redux";
import { StoreState } from "../../model/storeState";
import { deleteLocation } from "../../actions/asyncActions";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import TableRow from "@material-ui/core/TableRow";
import { TableCell } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { CircularProgress } from "@material-ui/core";

interface Props {
  location?: CompLocation;
  deleteLocation?: (location: CompLocation) => Promise<void>;
  onBeginEdit?: () => void;
}

const LocationView = (props: Props) => {
  let [deleting, setDeleting] = useState<boolean>(false);

  const onDelete = () => {
    setDeleting(true);
    props
      .deleteLocation?.(props.location!)
      .catch((error) => setDeleting(false));
  };

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {props.location?.name}
      </TableCell>
      <TableCell>{props.location?.longitude}</TableCell>
      <TableCell>{props.location?.latitude}</TableCell>
      <TableCell align="right" className={"icon-cell"}>
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
  deleteLocation,
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationView);
