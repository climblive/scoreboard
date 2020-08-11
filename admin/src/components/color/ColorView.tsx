import React, { useState } from "react";
import { Color } from "src/model/color";
import { connect } from "react-redux";
import { StoreState } from "../../model/storeState";
import { deleteColor } from "../../actions/asyncActions";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import TableRow from "@material-ui/core/TableRow";
import { TableCell } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { CircularProgress } from "@material-ui/core";
import { User } from "src/model/user";
import PeopleIcon from "@material-ui/icons/People";

import { getColorStyle } from "../../utils/color";

interface Props {
  color?: Color;
  loggedInUser?: User;
  deleteColor?: (color: Color) => Promise<void>;
  onBeginEdit?: () => void;
}

const ColorView = (props: Props) => {
  let [deleting, setDeleting] = useState<boolean>(false);

  const onDelete = () => {
    setDeleting(true);
    props.deleteColor?.(props.color!).catch((error) => setDeleting(false));
  };

  const isEditable = () => {
    return !props.color?.shared || props.loggedInUser?.admin;
  };

  return (
    <TableRow>
      <TableCell style={{ width: 200 }} component="th" scope="row">
        {props.color?.name}
      </TableCell>
      <TableCell component="th" scope="row">
        <div style={getColorStyle(props.color?.rgbPrimary)}>
          {props.color?.rgbPrimary}
        </div>
      </TableCell>
      <TableCell>
        {props.color?.rgbSecondary ? (
          <div style={getColorStyle(props.color?.rgbSecondary)}>
            {props.color?.rgbSecondary}
          </div>
        ) : (
          "None"
        )}
      </TableCell>
      <TableCell align="right">
        {props.color?.shared && <PeopleIcon />}
      </TableCell>

      <TableCell align="right" className={"icon-cell"}>
        <IconButton
          color="inherit"
          aria-label="Menu"
          title="Edit"
          disabled={!isEditable() || deleting}
          onClick={props.onBeginEdit}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="Menu"
          title="Delete"
          onClick={onDelete}
          disabled={!isEditable() || deleting}
        >
          {deleting ? <CircularProgress size={24} /> : <DeleteIcon />}
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    loggedInUser: state.loggedInUser,
  };
}

const mapDispatchToProps = {
  deleteColor,
};

export default connect(mapStateToProps, mapDispatchToProps)(ColorView);
