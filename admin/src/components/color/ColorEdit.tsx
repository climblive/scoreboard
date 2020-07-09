import React, { useState } from "react";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import TableRow from "@material-ui/core/TableRow";
import { TableCell } from "@material-ui/core";
import { Color } from "../../model/color";
import { connect } from "react-redux";
import { StoreState } from "../../model/storeState";
import { saveColor } from "../../actions/asyncActions";
import { CircularProgress } from "@material-ui/core";
import { getColorStyle } from "../../utils/color";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import { ChromePicker } from "react-color";
import DialogActions from "@material-ui/core/DialogActions";
import Switch from "@material-ui/core/Switch";
import { User } from "src/model/user";

interface Props {
  color?: Color;
  loggedInUser?: User;
  onDone?: () => void;
  saveColor?: (color: Color) => Promise<Color>;
}

enum PopupType {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
}

const ColorEdit = (props: Props) => {
  const [color, setColor] = useState<Color>({
    ...props.color!,
  });
  let [saving, setSaving] = useState<boolean>(false);
  let [popupColor, setPopupColor] = useState<string>("#FFFFFF");
  let [popupType, setPopupType] = useState<PopupType | undefined>(undefined);
  let [popupTitle, setPopupTitle] = useState<string>("");

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor({ ...color, name: e.target.value });
  };

  const onSharedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor({ ...color, shared: e.target.checked });
  };

  const onSave = () => {
    setSaving(true);
    props
      .saveColor?.(color)
      .then((color) => {
        setSaving(false);
        props.onDone?.();
      })
      .catch((error) => setSaving(false));
  };

  const onPopupColorChange = (e: any) => {
    setColor({
      ...color,
      [popupType == PopupType.PRIMARY ? "rgbPrimary" : "rgbSecondary"]: e.hex,
    });
  };

  const showPopupPrimary = () => {
    setPopupType(PopupType.PRIMARY);
    setPopupColor(color?.rgbPrimary!);
    setPopupTitle("Primary color");
  };

  const showPopupSecondary = () => {
    setPopupType(PopupType.SECONDARY);
    setPopupColor(color!.rgbSecondary ?? "#000000");
    setPopupTitle("Secondary color");
  };

  const closePopup = () => {
    setPopupType(undefined);
  };

  const onDeleteSecondaryColor = () => {
    setColor({ ...color, rgbSecondary: undefined });
    setPopupType(undefined);
  };

  return (
    <>
      <TableRow>
        <TableCell component="th" scope="row">
          <TextField style={{}} value={color?.name} onChange={onNameChange} />
        </TableCell>
        <TableCell>
          <div
            style={getColorStyle(color?.rgbPrimary, true)}
            onClick={showPopupPrimary}
          >
            {color?.rgbPrimary}
          </div>
        </TableCell>
        <TableCell>
          <div
            style={getColorStyle(color?.rgbSecondary, true)}
            onClick={showPopupSecondary}
          >
            {color?.rgbSecondary ?? "None"}
          </div>
        </TableCell>
        <TableCell component="th" scope="row">
          <Switch
            disabled={!props.loggedInUser?.admin}
            checked={color.shared}
            onChange={onSharedChange}
          />
        </TableCell>

        <TableCell>
          <IconButton
            color="inherit"
            aria-label="Menu"
            title={color.id == undefined ? "Create" : "Save"}
            onClick={onSave}
            disabled={saving}
          >
            {saving ? <CircularProgress size={24} /> : <SaveIcon />}
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="Menu"
            title="Cancel"
            disabled={saving}
            onClick={() => props.onDone?.()}
          >
            <CancelIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <Dialog
        open={popupType !== undefined}
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        aria-labelledby="confirmation-dialog-title"
      >
        <DialogTitle id="confirmation-dialog-title">{popupTitle}</DialogTitle>
        <DialogContent style={{ padding: 0 }}>
          <ChromePicker
            disableAlpha={true}
            color={popupColor}
            onChange={onPopupColorChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closePopup} color="primary">
            Cancel
          </Button>
          {popupType == PopupType.SECONDARY && (
            <Button onClick={onDeleteSecondaryColor} color="primary">
              Delete
            </Button>
          )}
          <Button onClick={closePopup} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    loggedInUser: state.loggedInUser,
  };
}

const mapDispatchToProps = {
  saveColor,
};

export default connect(mapStateToProps, mapDispatchToProps)(ColorEdit);
