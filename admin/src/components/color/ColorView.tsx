import { TableCell } from "@material-ui/core";
import PeopleIcon from "@material-ui/icons/People";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { Color } from "src/model/color";
import { StoreState } from "../../model/storeState";
import { getColorStyle } from "../../utils/color";
import ResponsiveTableRow from "../ResponsiveTableRow";
import ColorEdit from "./ColorEdit";

interface Props {
  color: Color;
  breakpoints?: Map<number, string>;
  onBeginEdit?: () => void;
}

const ColorView = (props: Props & PropsFromRedux) => {
  const editable = !props.color.shared || props.loggedInUser?.admin;

  const cells = [
    <TableCell component="th" scope="row" style={{ overflow: "hidden" }}>
      {props.color.name}
    </TableCell>,
    <TableCell component="th" scope="row">
      <div style={getColorStyle(props.color.rgbPrimary)}>
        {props.color.rgbPrimary.substr(1)}
      </div>
    </TableCell>,
    <TableCell>
      {props.color.rgbSecondary ? (
        <div style={getColorStyle(props.color.rgbSecondary)}>
          {props.color.rgbSecondary.substr(1)}
        </div>
      ) : (
        "None"
      )}
    </TableCell>,
    <TableCell align="right">{props.color.shared && <PeopleIcon />}</TableCell>,
  ];

  return (
    <ResponsiveTableRow cells={cells} breakpoints={props.breakpoints}>
      <ColorEdit color={props.color} removable={editable} editable={editable} />
    </ResponsiveTableRow>
  );
};

const mapStateToProps = (state: StoreState, props: Props) => ({
  loggedInUser: state.loggedInUser,
});

const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ColorView);
