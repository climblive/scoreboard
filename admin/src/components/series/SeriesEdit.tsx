import { Button } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import SaveIcon from "@material-ui/icons/Save";
import React, { useState } from "react";
import { connect } from "react-redux";
import { deleteSeries, saveSeries } from "../../actions/asyncActions";
import { Series } from "../../model/series";
import { StoreState } from "../../model/storeState";
import { ConfirmationDialog } from "../ConfirmationDialog";
import { ProgressButton } from "../ProgressButton";

interface Props {
  series?: Series;
  removable?: boolean;
  cancellable?: boolean;
  onDone?: () => void;
  saveSeries?: (series: Series) => Promise<Series>;
  deleteSeries?: (series: Series) => Promise<void>;
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

const SeriesEdit = (props: Props) => {
  const [series, setSeries] = useState<Series>({
    ...props.series!,
  });
  let [saving, setSaving] = useState<boolean>(false);
  let [deleting, setDeleting] = useState<boolean>(false);
  let [deleteRequested, setDeleteRequested] = useState<boolean>(false);

  const classes = useStyles();

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeries({ ...series, name: e.target.value });
  };

  const onSave = () => {
    setSaving(true);
    props
      .saveSeries?.(series)
      .then((series) => {
        setSaving(false);
        props.onDone?.();
      })
      .catch((error) => setSaving(false));
  };

  const confirmDelete = (result: boolean) => {
    setDeleteRequested(false);

    if (result) {
      setDeleting(true);
      props.deleteSeries?.(series).finally(() => setDeleting(false));
    }
  };

  return (
    <>
      <div className={classes.form}>
        <TextField
          label="Name"
          required
          value={series.name}
          onChange={onNameChange}
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
            {series.id === undefined ? "Create" : "Save"}
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
        title={`Delete series`}
        message={"Do you wish to delete the selected series?"}
        onClose={confirmDelete}
      />
    </>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {};
}

const mapDispatchToProps = {
  saveSeries,
  deleteSeries,
};

export default connect(mapStateToProps, mapDispatchToProps)(SeriesEdit);
