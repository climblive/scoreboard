import { Button } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import SaveIcon from "@material-ui/icons/Save";
import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { deleteLocation, saveLocation } from "../../actions/asyncActions";
import { CompLocation } from "../../model/compLocation";
import { ConfirmationDialog } from "../ConfirmationDialog";
import { ProgressButton } from "../ProgressButton";

interface Props {
  location: CompLocation;
  removable?: boolean;
  cancellable?: boolean;
  onDone?: () => void;
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
  })
);

const LocationEdit = (props: Props & PropsFromRedux) => {
  const [location, setLocation] = useState<CompLocation>({
    ...props.location,
  });
  let [saving, setSaving] = useState<boolean>(false);
  let [deleting, setDeleting] = useState<boolean>(false);
  let [deleteRequested, setDeleteRequested] = useState<boolean>(false);

  const classes = useStyles();

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation({ ...location, name: e.target.value });
  };

  const onLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation({ ...location, latitude: e.target.value });
  };

  const onLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation({ ...location, longitude: e.target.value });
  };

  const onSave = () => {
    setSaving(true);
    props
      .saveLocation(location)
      .then((location) => {
        setSaving(false);
        props.onDone?.();
      })
      .catch((error) => setSaving(false));
  };

  const confirmDelete = (result: boolean) => {
    setDeleteRequested(false);

    if (result) {
      setDeleting(true);
      props.deleteLocation(location).finally(() => setDeleting(false));
    }
  };

  return (
    <>
      <div className={classes.form}>
        <TextField
          label="Name"
          required
          value={location.name}
          onChange={onNameChange}
        />

        <TextField
          label="Latitude"
          required
          value={location.latitude}
          onChange={onLatitudeChange}
        />

        <TextField
          label="Longitude"
          required
          value={location.longitude}
          onChange={onLongitudeChange}
        />

        <div className={classes.buttons}>
          <ProgressButton
            color="secondary"
            variant="contained"
            onClick={onSave}
            disabled={deleting}
            loading={saving}
            startIcon={<SaveIcon />}
          >
            {location.id === undefined ? "Create" : "Save"}
          </ProgressButton>
          {props.removable && (
            <ProgressButton
              color="secondary"
              variant="contained"
              disabled={saving}
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
              disabled={saving || deleting}
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
        title={`Delete location`}
        message={"Do you wish to delete the selected location?"}
        onClose={confirmDelete}
      />
    </>
  );
};

const mapDispatchToProps = {
  saveLocation,
  deleteLocation,
};

const connector = connect(undefined, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(LocationEdit);
