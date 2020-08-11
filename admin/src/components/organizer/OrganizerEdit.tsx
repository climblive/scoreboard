import React, { useState } from "react";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import TableRow from "@material-ui/core/TableRow";
import { TableCell } from "@material-ui/core";
import { Organizer } from "../../model/organizer";
import { connect } from "react-redux";
import { StoreState } from "../../model/storeState";
import { saveOrganizer } from "../../actions/asyncActions";
import { CircularProgress } from "@material-ui/core";

interface Props {
  organizer?: Organizer;
  onDone?: () => void;
  saveOrganizer?: (organizer: Organizer) => Promise<Organizer>;
}

const OrganizerEdit = (props: Props) => {
  const [organizer, setOrganizer] = useState<Organizer>({
    ...props.organizer!,
  });
  let [saving, setSaving] = useState<boolean>(false);

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

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        <TextField value={organizer.name} onChange={onNameChange} />
      </TableCell>
      <TableCell>
        <TextField value={organizer.homepage} onChange={onHomepageChange} />
      </TableCell>
      <TableCell align="right">
        <IconButton
          color="inherit"
          aria-label="Menu"
          title={organizer.id == undefined ? "Create" : "Save"}
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
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {};
}

const mapDispatchToProps = {
  saveOrganizer,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganizerEdit);
