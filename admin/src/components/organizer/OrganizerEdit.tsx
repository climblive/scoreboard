import { Button } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import SaveIcon from "@material-ui/icons/Save";
import React, { useState } from "react";
import { connect } from "react-redux";
import { deleteOrganizer, saveOrganizer } from "../../actions/asyncActions";
import { Organizer } from "../../model/organizer";
import { StoreState } from "../../model/storeState";
import { ConfirmationDialog } from "../ConfirmationDialog";
import { ProgressButton } from "../ProgressButton";

interface Props {
  organizer?: Organizer;
  removable?: boolean;
  cancellable?: boolean;
  onDone?: () => void;
  saveOrganizer?: (organizer: Organizer) => Promise<Organizer>;
  deleteOrganizer?: (organizer: Organizer) => Promise<void>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      "& > *": {
        margin: theme.spacing(1, 0),
      },
      minWidth: 304,
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

const OrganizerEdit = (props: Props) => {
  const [organizer, setOrganizer] = useState<Organizer>({
    ...props.organizer!,
  });
  let [saving, setSaving] = useState<boolean>(false);
  let [deleting, setDeleting] = useState<boolean>(false);
  let [deleteRequested, setDeleteRequested] = useState<boolean>(false);

  const classes = useStyles();

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrganizer({ ...organizer, name: e.target.value });
  };

  const onHomepageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrganizer({ ...organizer, homepage: e.target.value });
  };

  const onSave = () => {
    setSaving(true);
    props
      .saveOrganizer?.(organizer)
      .then((organizer) => {
        setSaving(false);
        props.onDone?.();
      })
      .catch((error) => setSaving(false));
  };

  const confirmDelete = (result: boolean) => {
    setDeleteRequested(false);

    if (result) {
      setDeleting(true);
      props.deleteOrganizer?.(organizer).finally(() => setDeleting(false));
    }
  };

  return (
    <>
      <div className={classes.form}>
        <TextField
          label="Name"
          required
          value={organizer.name}
          onChange={onNameChange}
        />

        <TextField
          label="Homepage"
          value={organizer.homepage}
          onChange={onHomepageChange}
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
            {organizer.id == undefined ? "Create" : "Save"}
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
        title={`Delete organizer`}
        message={"Do you wish to delete the selected organizer?"}
        onClose={confirmDelete}
      />
    </>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {};
}

const mapDispatchToProps = {
  saveOrganizer,
  deleteOrganizer,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganizerEdit);
