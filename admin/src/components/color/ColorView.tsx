import { TableCell } from "@material-ui/core";
import PeopleIcon from "@material-ui/icons/People";
import React from "react";
import { connect } from "react-redux";
import { Color } from "src/model/color";
import { User } from "src/model/user";
import { StoreState } from "../../model/storeState";
import { getColorStyle } from "../../utils/color";
import ResponsiveTableRow from "../ResponsiveTableRow";
import ColorEdit from "./ColorEdit";

interface Props {
  color?: Color;
  loggedInUser?: User;
  breakpoints?: Map<number, string>;
  onBeginEdit?: () => void;
}

const ColorView = (props: Props) => {
  const editable = !props.color?.shared || props.loggedInUser?.admin;

  const cells = [
    <TableCell component="th" scope="row" style={{ overflow: "hidden" }}>
      {props.color?.name}
    </TableCell>,
    <TableCell component="th" scope="row">
      <div style={getColorStyle(props.color?.rgbPrimary)}>
        {props.color?.rgbPrimary}
      </div>
    </TableCell>,
    <TableCell>
      {props.color?.rgbSecondary ? (
        <div style={getColorStyle(props.color?.rgbSecondary)}>
          {props.color?.rgbSecondary}
        </div>
      ) : (
        "None"
      )}
    </TableCell>,
    <TableCell align="right">
      {props.color?.shared && <PeopleIcon />}
    </TableCell>,
  ];

  return (
    <ResponsiveTableRow cells={cells} breakpoints={props.breakpoints}>
      <ColorEdit color={props.color} removable={editable} editable={editable} />
    </ResponsiveTableRow>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    loggedInUser: state.loggedInUser,
  };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ColorView);
