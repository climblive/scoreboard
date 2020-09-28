import { FormControlLabel } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import CancelIcon from "@material-ui/icons/Cancel";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import SaveIcon from "@material-ui/icons/Save";
import React, { useState } from "react";
import { ChromePicker } from "react-color";
import { connect } from "react-redux";
import { User } from "src/model/user";
import { deleteColor, saveColor } from "../../actions/asyncActions";
import { Color } from "../../model/color";
import { StoreState } from "../../model/storeState";
import ColorSquare from "../ColorSquare";
import { ConfirmationDialog } from "../ConfirmationDialog";
import { ProgressButton } from "../ProgressButton";

interface Props {
  color?: Color;
  loggedInUser?: User;
  editable?: boolean;
  removable?: boolean;
  cancellable?: boolean;
  onDone?: () => void;
  deleteColor?: (color: Color) => Promise<void>;
  saveColor?: (color: Color) => Promise<Color>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      "& > *": {
        margin: theme.spacing(1, 0),
      },
      minWidth: 296,
      maxWidth: 600,
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      flexBasis: 0,
    },
    buttons: {
      margin: theme.spacing(2, 0),
      "& > *": {
        marginRight: theme.spacing(1),
      },
    },
    colorSquare: {
      margin: theme.spacing(1.5, 1, 1.5, 0),
    },
  })
);

enum PopupType {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
}

const ColorEdit = (props: Props) => {
  const [color, setColor] = useState<Color>({
    ...props.color!,
  });
  let [saving, setSaving] = useState<boolean>(false);
  let [deleting, setDeleting] = useState<boolean>(false);
  let [deleteRequested, setDeleteRequested] = useState<boolean>(false);
  let [popupColor, setPopupColor] = useState<string>("#FFFFFF");
  let [popupType, setPopupType] = useState<PopupType | undefined>(undefined);
  let [popupTitle, setPopupTitle] = useState<string>("");

  const classes = useStyles();

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
    setPopupColor(e.hex);
  };

  const showPopupPrimary = () => {
    if (props.editable) {
      setPopupType(PopupType.PRIMARY);
      setPopupColor(color?.rgbPrimary!);
      setPopupTitle("Primary color");
    }
  };

  const showPopupSecondary = () => {
    if (props.editable) {
      setPopupType(PopupType.SECONDARY);
      setPopupColor(color!.rgbSecondary ?? "#000000");
      setPopupTitle("Secondary color");
    }
  };

  const closePopup = () => {
    setPopupType(undefined);
  };

  const deleteSecondaryColor = () => {
    setColor({ ...color, rgbSecondary: undefined });
    setPopupType(undefined);
  };

  const confirmDelete = (result: boolean) => {
    setDeleteRequested(false);

    if (result) {
      setDeleting(true);
      props.deleteColor?.(color).finally(() => setDeleting(false));
    }
  };

  return (
    <>
      <div className={classes.form}>
        <TextField
          label="Name"
          required
          disabled={!props.editable}
          value={color?.name}
          onChange={onNameChange}
        />

        <TextField
          label="Primary color"
          required
          disabled={!props.editable}
          value={color.rgbPrimary ?? ""}
          onClick={showPopupPrimary}
          InputProps={{
            startAdornment: color.rgbPrimary && (
              <ColorSquare
                color={color.rgbPrimary}
                className={classes.colorSquare}
              />
            ),
          }}
        />

        <TextField
          label="Secondary color"
          value={color.rgbSecondary ?? ""}
          disabled={!props.editable}
          onClick={showPopupSecondary}
          InputProps={{
            startAdornment: color.rgbSecondary && (
              <ColorSquare
                color={color.rgbSecondary}
                className={classes.colorSquare}
              />
            ),
            endAdornment: props.editable && color.rgbSecondary && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSecondaryColor();
                }}
              >
                <ClearIcon />
              </IconButton>
            ),
          }}
        />

        <FormControlLabel
          label="Shared"
          control={
            <Switch
              id="shared-switch"
              required
              disabled={!props.editable || !props.loggedInUser?.admin}
              checked={color.shared}
              onChange={onSharedChange}
            />
          }
        />

        <div className={classes.buttons}>
          <ProgressButton
            color="secondary"
            variant="contained"
            onClick={onSave}
            disabled={!props.editable || deleting}
            loading={saving}
            startIcon={<SaveIcon />}
          >
            {color.id == undefined ? "Create" : "Save"}
          </ProgressButton>
          {props.removable && (
            <ProgressButton
              color="secondary"
              variant="contained"
              disabled={!props.editable || saving}
              loading={deleting}
              onClick={() => setDeleteRequested(true)}
              startIcon={<DeleteForeverIcon />}
            >
              Delete
            </ProgressButton>
          )}
          {props.cancellable && (
            <Button
              color="secondary"
              variant="contained"
              disabled={!props.editable || saving || deleting}
              onClick={props.onDone}
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
      <ConfirmationDialog
        open={deleteRequested}
        title={`Delete color`}
        message={"Do you wish to delete the selected color?"}
        onClose={confirmDelete}
      />
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
            <Button onClick={deleteSecondaryColor} color="primary">
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
  deleteColor,
};

export default connect(mapStateToProps, mapDispatchToProps)(ColorEdit);
