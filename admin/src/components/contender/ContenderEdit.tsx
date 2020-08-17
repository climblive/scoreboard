import React, { useState } from "react";
import { ContenderData } from "src/model/contenderData";
import { connect } from "react-redux";
import { StoreState } from "../../model/storeState";
import { TextField, FormControl, InputLabel } from "@material-ui/core";
import { CompClass } from "../../model/compClass";
import { updateContender } from "../../actions/asyncActions";
import { OrderedMap } from "immutable";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { ProgressButton } from "../ProgressButton";
import SaveIcon from "@material-ui/icons/Save";

interface Props {
  contender?: ContenderData;
  compClasses?: OrderedMap<number, CompClass>;
  updateContender?: (contender: ContenderData) => Promise<ContenderData>;
}

const ContenderEdit = (props: Props) => {
  const [saving, setSaving] = useState<boolean>(false);
  const [contender, setContender] = useState<ContenderData>(props.contender!);

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContender({ ...contender, name: e.target.value });
  };

  const onCompClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setContender({ ...contender, compClassId: parseInt(e.target.value) });
  };

  const onSave = () => {
    setSaving(true);
    props.updateContender?.(contender).finally(() => setSaving(false));
  };

  return (
    <>
      <TextField label="Name" value={contender.name} onChange={onNameChange} />
      <FormControl>
        <InputLabel shrink htmlFor="compClass-select">
          Comp class
        </InputLabel>
        <Select
          id="compClass-select"
          value={contender.compClassId}
          onChange={onCompClassChange}
        >
          {props.compClasses?.toArray()?.map((compClass: CompClass) => (
            <MenuItem key={compClass.id} value={compClass.id}>
              {compClass.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <ProgressButton
        variant="contained"
        color="secondary"
        onClick={onSave}
        loading={saving}
        startIcon={<SaveIcon />}
      >
        Save
      </ProgressButton>
    </>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {};
}

const mapDispatchToProps = {
  updateContender,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContenderEdit);
