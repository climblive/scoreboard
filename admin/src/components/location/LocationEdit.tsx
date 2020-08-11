import React, { useState } from "react";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import TableRow from "@material-ui/core/TableRow";
import { TableCell } from "@material-ui/core";
import { CompLocation } from "../../model/compLocation";
import { connect } from "react-redux";
import { StoreState } from "../../model/storeState";
import { saveLocation } from "../../actions/asyncActions";
import { CircularProgress } from "@material-ui/core";

interface Props {
  location?: CompLocation;
  onDone?: () => void;
  saveLocation?: (location: CompLocation) => Promise<CompLocation>;
}

const LocationEdit = (props: Props) => {
  const [location, setLocation] = useState<CompLocation>({
    ...props.location!,
  });
  let [saving, setSaving] = useState<boolean>(false);

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation({ ...location, name: e.target.value });
  };

  const onLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation({ ...location, longitude: e.target.value });
  };

  const onLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation({ ...location, latitude: e.target.value });
  };

  const onSave = () => {
    setSaving(true);
    props
      .saveLocation?.(location)
      .then((location) => {
        setSaving(false);
        props.onDone?.();
      })
      .catch((error) => setSaving(false));
  };

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        <TextField value={location.name} onChange={onNameChange} />
      </TableCell>
      <TableCell>
        <TextField value={location.longitude} onChange={onLongitudeChange} />
      </TableCell>
      <TableCell>
        <TextField value={location.latitude} onChange={onLatitudeChange} />
      </TableCell>
      <TableCell align="right">
        <IconButton
          color="inherit"
          aria-label="Menu"
          title={location.id == undefined ? "Create" : "Save"}
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
  saveLocation,
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationEdit);
